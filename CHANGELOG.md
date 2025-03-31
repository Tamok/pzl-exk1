# Changelog

All notable changes to this project will be documented in this file.

# Changelog

## [0.5.9] (TODO)
- **Added:** Finalized live integration for both PlayerManagement and CadavreExquisDisplay—components now operate directly with Firestore live data.
- **Added:** Fully UUID‑based selectors to ensure accurate mapping between entries and player profiles.
- **Added:** Integrated detailed paragraph-level statistics and emoji reactions linked via paragraph UUIDs.
- **Changed:** Refined data service modularity for smooth, real‑time CRUD operations.
- **Fixed:** Resolved synchronization issues between in-place editing and Firestore updates.

## [0.5.8] - 2025-03-28 - Phase 5: In-Place Editing & Bidirectional Slate Sync
- **Added:** Enabled in-place editing of paragraphs within CadavreExquisDisplay via the new EditableParagraph component.
- **Added:** Integrated full bidirectional synchronization between the Slate editor state and Firestore: updates on blur trigger Firestore updates, and external Firestore changes update the editor.

## [0.5.7] - 2025-03-28 - Phase 5: Player Management Revamp & Emoji Reaction Integration
- **Added:** Revamped PlayerManagement by splitting it into subtabs:
  - **List:** A searchable player list displaying profiles with unique keys, including main vs. linked profile indicators and placeholders for linked entries/visual maps.
  - **Add:** A form to create new players with mandatory fields (name, pattern seed) and an optional email (with a warning if empty).
  - **Statistics:** A placeholder for future aggregated statistics and backend analytics.
- **Added:** Integrated Firestore-based CRUD operations with full UUID integration for persistent player profiles.
- **Added:** A "Select All" button in the player management view for mass selection and deletion.
- **Added:** Support for emoji reactions on paragraphs, linked via UUIDs to enable future paragraph-level statistics.


## [0.5.6] - 2025-03-28 - Phase 5: Emoji Reactions, Custom Emoji Management & Statistics Groundwork
- **Added:** Comprehensive emoji manager with drag‑and‑drop file selection and multi‑file upload.
- **Added:** Custom name input for each queued file (defaults to filename if left blank).
- **Added:** Dynamic processing status indicators (⌛ pending, ⏳ processing, ✅ success, ❌ error) for each file.
- **Added:** MP4 to animated GIF conversion and animated GIF resizing via ffmpeg.wasm (v0.12+), with converted file size displayed.
- **Added:** Persistence of emoji records in Firestore (using UUID, name, URL, size, and type) and support for multi‑selection (including a “Select All” button) for mass deletion.
- **Changed:** Emoji previews are rendered as fixed 64×64 squares with object‑cover styling.

## [0.5.5] - 2025-03-28 - Phase 5: In‑Place Editing & Slate Synchronization
- **Added:** Initiated in‑place editing of paragraphs within CadavreExquisDisplay via a dedicated EditableParagraph component.
- **Added:** Integrated bidirectional synchronization between Slate editor state and parent component state for real‑time updates.

## [0.5.4] - 2025-03-28 - Phase 5: Live Form State Modeling & Reset Behavior Improvements
- **Added:** Improved reset behavior to prevent unwanted state loss upon submission.
- **Added:** Introduced live form state modeling via the useLiveFormState hook, synchronizing form fields (title, themes, paragraphs) with localStorage for real‑time persistence.

## [0.5.3] - 2025-03-28 - Phase 5: Slate Integration & Enhanced Paragraph Support
- **Added:** Switched ParagraphsTab to use Slate with proper use of the `initialValue` prop and safe validation fallback.
- **Added:** Enhanced paragraph objects to include a unique `id`, rich `text` content, and an associated `player` reference.
- **Changed:** Introduced `defaultSlateText()` and `validateSlateText()` utilities to guarantee valid initial editor content.

## [0.5.2] - 2025-03-28 - Phase 5: Schema Normalization & Migration Support
- **Added:** Normalized paragraph `text` to a Slate‑friendly format.
- **Added:** Integrated `zod`‑based schema validation for imports.
- **Added:** Introduced a Migration tab to detect and run Firestore upgrades, automatically updating the `dbVersion` post-migration.

## [0.5.1] - 2025-03-28 - Phase 5: UUID Migration & Default Player Fields
- **Added:** Performed migration to add UUIDs to paragraphs.
- **Added:** Introduced default `patternSeed` values and default player `color`.
- **Added:** Ensured entries include a `createdAt` timestamp and a fallback empty `paragraphs` array.
- **Changed:** Split migrations into a versioned, linear path managed by `migrationEngine.js`.

## [0.5.0] - 2025-03-28 - Phase 5: Data Management & Backup System
- **Added:** Modularized Data Management tabs for backup, import, export, migration, and wipe operations.
- **Added:** Implemented cloud backup with versioning and snapshots.
- **Added:** Developed an import system with preview, migration, and robust error handling.
- **Added:** Added export functionality with an optional player data toggle and cloud upload support.
- **Added:** Introduced a wipe tab with per-collection and full wipe options.
- **Changed:** Tracked Firestore version under `system/meta`.

## [0.4.0] - 2025-03-28 - Phase 4: Admin GUI & Live Data Integration
- **Added:** Introduced a new AdminPanel with three tabs:
  - **New Entry:** A form for creating cadavre exquis entries with auto‑incremented numbering, multiple themes (with delete and runner‑up selection), multi‑paragraph support with associated players, and sound file attachment.
  - **Player Management:** A form for managing player profiles (including name, email, avatar upload via drag‑and‑drop and click‑to‑select), a color picker with live preview, a pattern seed input, and an existing players dropdown.
  - **Tests:** Integrated TestDashboard with live tests for admin panel interactions.
- **Added:** Implemented an Admin Log Overlay with live, timestamped logs and custom scrollbars.
- **Changed:** Updated component styling and tooltips across the Admin GUI for enhanced clarity and UX.
- **Fixed:** Addressed minor UI inconsistencies to ensure a consistent design language.

## [0.3.1] - 2025-03-28 - Phase 3: UI Polishing & Global Styling
- **Added:** Replaced the default favicon with a new, centered PZL logo SVG.
- **Added:** Applied `box-sizing: border-box` to prevent layout overflow.
- **Changed:** Adjusted container width from `w-screen` to `w-full` to avoid horizontal overflow.
- **Changed:** Removed leftover centering properties in favor of a more flexible layout.
- **Changed:** Enhanced theme integration to ensure all elements (header, TestDashboard, etc.) adapt seamlessly to light/dark mode.
- **Fixed:** Resolved right‑side truncation issues on specific viewports.

## [0.3.0] - 2025-03-28 - Phase 3: Front-End Development & UI Enhancements
- **Added:** Header Component displaying the logo and site name with click logging.
- **Added:** NavigationBar Component with previous/next buttons and a synchronized dropdown for cadavre exquis entries.
- **Added:** CadavreExquisDisplay Component that renders multiple, styled paragraphs with dynamic background colors and tooltips.
- **Added:** AudioPlayer Component that streams audio from Firebase Storage and logs play/pause events.
- **Added:** DarkModeToggle Component for manual dark mode toggling with persisted user preference in localStorage.
- **Added:** Global CSS adjustments to remove unwanted margins/padding and ensure full-width backgrounds.
- **Changed:** Updated layout in App.jsx to integrate new components responsively.
- **Fixed:** Resolved dark mode toggle issues and dropdown styling inconsistencies.

## [0.2.0] - 2025-03-28 - Phase 2: Firebase Infrastructure & Admin Test Dashboard
- **Added:** Firebase project setup including Authentication, Firestore, and Firebase Storage integration.
- **Added:** Admin authentication logic restricting access to authorized users.
- **Added:** Security rules for Firestore and Storage allowing public reads while restricting writes.
- **Added:** A collapsible Admin Test Dashboard featuring tests for authentication, Firestore CRUD operations, Storage access, collection retrieval, and realtime listeners.
- **Changed:** Streamlined README.md content for clearer setup, testing, and deployment instructions.

## [0.1.0] - 2025-03-28 - Initial Setup
- **Added:** Vite + React base project.
- **Added:** Tailwind CSS integration.
- **Added:** Firebase SDK and configuration.
- **Added:** Jest and testing infrastructure.
- **Added:** Logger utility.
- **Added:** Project folder structure and initial documentation (README and changelog).
