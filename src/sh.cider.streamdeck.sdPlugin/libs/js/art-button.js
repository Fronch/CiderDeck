// Create module-specific loggers
const artlogger = window.CiderDeckLogger?.createLogger('ArtDisplay') || {
    info: console.log,
    debug: console.debug,
    warn: console.warn,
    error: console.error,
    category: () => ({
        info: console.log,
        debug: console.debug,
        warn: console.warn,
        error: console.error
    })
};

const RPC_BASE = "http://localhost:10767/api/v1/playback";

function rpcJSON(path, body) {
	return fetch(`${RPC_BASE}/${path}`, {
		method: "POST",
		headers: {
			'Content-Type': 'application/json',
			'apptoken': window.token // only if Require token is ON
		},
		body: JSON.stringify(body ?? {})
	}).then(async r => {
		const text = await r.text();
		if (!r.ok && r.status !== 204) {
			throw new Error(`${path} -> ${r.status} ${text}`);
		}
		try { return text ? JSON.parse(text) : null; } catch { return text; }
	});
}

async function artClicked() {
	const artSettings = window.ciderDeckSettings.artDisplay;
	const desiredShuffle = artSettings.shuffleToggle;
	const nowPlaying = await CiderDeckUtils.comRPC("GET", "now-playing");
	if (artSettings.artAction == "start-pause") {
		if (typeof nowPlaying.info.albumName === 'undefined') {
			startPlayback(artSettings, desiredShuffle);
		}
		else {
			CiderDeckUtils.comRPC("POST", "playpause");
			setTimeout(() => {
				CiderDeckUtils.comRPC("GET", "now-playing").then(data => {
					if (data && data.status === "ok") {
						CiderDeckPlayback.setManualData(data.info);
					}
				});
			}, 1000);
		}
	}
	if (artSettings.artAction == "start") {
		startPlayback(artSettings, desiredShuffle);
	}
	if (artSettings.artAction == "pause") {
		CiderDeckUtils.comRPC("POST", "playpause");
		rpcJSON("volume", { volume: artSettings.artVolumeVal });
	}
	if (artSettings.artAction == "nothing") {
		rpcJSON("volume", { volume: artSettings.artVolumeVal });
	}
}
async function startPlayback(artSettings, desiredShuffle) {
	if (artSettings.setVolumeArt) {
	rpcJSON("volume", { volume: artSettings.artVolumeVal });
	}
	if ((currentShuffleMode == 0 && desiredShuffle) || (currentShuffleMode != 0 && !desiredShuffle)) {
		console.log("Current shuffle differs from desired shuffle. Toggling shuffle...");
		await CiderDeckUtils.comRPC("POST", "toggle-shuffle");
		await rpcJSON("play-item", { type: "playlists", id: artSettings.albumUrl });
		const playbackStarted = await waitForPlayback();
		if (playbackStarted) {
			await CiderDeckUtils.comRPC("POST", "toggle-shuffle");
			console.log("Shuffle off");
		}
	}
	else {
		rpcJSON("play-item", { type: "playlists", id: artSettings.albumUrl });
	}
}

// Helper function to wait for playback to start
async function waitForPlayback() {
    const maxAttempts = 20; 
    const checkInterval = 250;
    
    for (let i = 0; i < maxAttempts; i++) {
        try {
            const isPlaying = await CiderDeckUtils.comRPC("GET", "is-playing");
            if (isPlaying && isPlaying.is_playing === true) {
                console.log("Playback confirmed.");
                return true;
            }
        } catch (error) {
            console.warn("Polling error:", error);
        }
        // Wait before the next check
        await new Promise(resolve => setTimeout(resolve, checkInterval));
    }
    console.warn("Timed out waiting for playback to start.");
    return false;
}

window.CiderDeckArtButton = {
    artClicked
};