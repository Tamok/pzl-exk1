# Changelog

All notable changes to this project will be documented in this file.

# Changelog

## [0.5.9] (TODO)
- **Added:** Finalized live integration for both PlayerManagement and CadavreExquisDisplay—components now operate directly with Firestore live data.
- **Added:** Fully UUID‑based selectors to ensure accurate mapping between entries and player profiles.
- **Added:** Integrated detailed paragraph-level statistics and emoji reactions linked via paragraph UUIDs.
- **Changed:** Refined data service modularity for smooth, real‑time CRUD operations.
- **Fixed:** Resolved synchronization issues between in-place editing and Firestore updates.

## [0.5.8] (TODO)
- **Added:** Enabled in-place editing of paragraphs within CadavreExquisDisplay with full bidirectional synchronization between Slate and Firestore.
- **Added:** Integrated live data fetching in PlayerManagement so that the player list updates immediately upon changes in Firestore.
- **Changed:** Optimized Slate editor state management to minimize desynchronization issues.
- **Fixed:** Addressed initial data load problems ensuring both editor and player management components reflect live data reliably.

## [0.5.7] (TODO)
- **Added:** Revamped PlayerManagement to directly fetch and update player profiles via Firestore with full UUID integration.
- **Added:** Introduced support for emoji reactions on paragraphs, linked via UUIDs to facilitate future paragraph-level stats.
- **Changed:** Improved modularity and consistency of database service functions to support real‑time updates.
- **Fixed:** Corrected initial data load issues in PlayerManagement to ensure a seamless live update experience.

## [0.5.6] (TODO)
- **Added:** Began implementation of emoji reactions for paragraphs using UUID.
- **Added:** Initiated groundwork for paragraph-level statistics and interaction support.

## [0.5.5] (TODO)
- **Added:** Initiated in-place editing of paragraphs within CadavreExquisDisplay.
- **Added:** Started integration of bidirectional synchronization for Slate editor state.

## [0.5.4] (TODO)
- **Added:** Improved reset behavior to prevent unwanted state loss.
- **Added:** Began live form state modeling to better reflect real‑time user input.

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

## [0.3.1] - 2025-03-28 - Phase 3.1: UI Polishing & Global Styling
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
