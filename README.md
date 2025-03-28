# PZL-EXK1

A collaborative cadavre exquis publishing platform built with React, Firebase, and Tailwind CSS.

## Features

- **Public Display:** View collaborative audio-text pieces with dynamic, randomized background patterns.
- **Audio Playback:** HTML5 audio player streaming files from Firebase Storage.
- **Dark Mode:** Manual toggle with preference saved in localStorage.

### Admin Interface (v0.4.0)

- **Admin Panel:** Accessible upon Google sign-in by authorized users.
  - **New Entry:** 
    - Auto‑incremented entry numbering (placeholder for live DB integration).
    - Create new entries with multiple themes, each with vote counts, deletion options, and runner‑up selection.
    - Add multiple paragraphs with individual player associations.
    - Attach a sound file for the entry.
  - **Player Management:**
    - Manage player profiles with name, email, and avatar upload (drag‑and‑drop integrated with click‑to‑select).
    - Select a color with live preview and input a pattern seed.
    - Dropdown of existing players (placeholder for live DB integration).
  - **Test Dashboard:**
    - Live tests for authentication, Firestore, Storage, collection retrieval, realtime listeners, and new UI interactions (admin panel tab switching, entry form, and player management interactions).
- **Admin Log Overlay:** Floating log console that displays timestamped log messages in a semi‑transparent, scrollable chat-bubble style. Includes a copy-log button.

## Tech Stack

- **Front-End:** React (Vite)
- **Styling:** Tailwind CSS
- **Backend:** Firebase (Firestore, Storage, Authentication)