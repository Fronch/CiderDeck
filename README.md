
# CiderDeck

CiderDeck is a plugin for the Elgato Stream Deck that allows you to control your music and show what your currently listening to at a click of a button.

## Description

Using CiderDeck you can do the following

- Show currently playing song's album art.
- Show currently playing song's name.
- Skip/Rewind
- Play/Pause
- Shuffle
- Repeat
- Change Volume
- Like/Dislike
- Add to Library
- and much more to come.

Additional functions added to album art:
- Clicking can:
  - Play playlist/album (Link needs to be input in settings)
  - Pause/unpause
  - Set volume to given value
- A pause icon will be superimposed on the art when paused.
- Album Art button now has an inspector, to control these options
<img width="140" height="140" alt="511574877-51d45beb-9a10-4b75-b121-c422246b9bf3" src="https://github.com/user-attachments/assets/c624eadf-e017-4ac4-9d95-42b72431ee73" />


Other changes:
- Stopping playback (not pausing) resets info buttons to their default state, rather than showing the last availiable info.
- Debounce function alleviates the 'flashing' issue, caused by cider toggling pause/unpause multiple times when skipping songs.

## Features
- Written in JavaScript
- Cross-Platform (macOS, Windows)

## Requirements
- [Cider 3.0.0+](https://cider.sh)
- Stream Deck (MK.1, MK.2, SD+, XL)
- Computer running Windows or macOS

## Installation Guide

Go into the [Releases](https://github.com/Fronch/CiderDeck/releases/tag/v3.2.0-Fronch-1) and download the latest compiled plugin file, double click to open it in the Stream Deck software for installation.

Done!
