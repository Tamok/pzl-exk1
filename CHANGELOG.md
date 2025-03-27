# Changelog

All notable changes to this project will be documented in this file.

## [0.3.1] - 2023-03-27

### Added
- **Custom Favicon:** Replaced the default icon with a new PZL logo SVG, fully centered text.
- **Box-Sizing Reset:** Applied `box-sizing: border-box` to prevent layout overflow.

### Changed
- **Container Width:** Switched from `w-screen` to `w-full` to avoid horizontal overflow when a scrollbar appears.
- **Layout Resets:** Removed leftover centering properties (`place-items: center`) and replaced them with a more flexible layout approach.
- **Theme Integration:** Ensured all elements (header, test dashboard, etc.) correctly adapt to light/dark mode, with consistent transitions.

### Fixed
- **Right-Side Truncation:** Addressed an issue causing the main container to be clipped on the right side in certain viewport configurations.

## [0.3.0] - 2025-03-26 - Phase 3: Front-End Development & UI Enhancements

### Added
- **Header Component**: Displays the logo and site name with click logging.
- **NavigationBar Component**: Implements previous/next buttons and a dropdown for selecting cadavre exquis entries. Now the dropdown remains synchronized with the currently displayed entry.
- **CadavreExquisDisplay Component**: Renders multiple, longer Lorem Ipsum paragraphs per entry. Each paragraph is styled with a random background color and shows the author’s name on hover.
- **AudioPlayer Component**: Provides an HTML5 audio player that streams from Firebase Storage and logs play/pause events.
- **DarkModeToggle Component**: Implements manual dark mode toggling that persists the user’s preference in localStorage.
- **Global CSS Adjustments**: Removed default margins/padding from `html` and `body` to eliminate unwanted white borders, and ensured a full-width background.

### Changed
- Updated layout in `App.jsx` to integrate Phase 3 components and enforce responsive design using Tailwind CSS.
- Modified the NavigationBar to properly reflect the current entry in the dropdown.
- Enhanced dark mode styling by overriding the dark variant to use a custom `.dark` selector, ensuring dark mode utilities apply correctly.

### Fixed
- Resolved issues with the dark mode toggle (ensuring localStorage persistence and correct application of dark styles).
- Adjusted dropdown styling in dark mode to improve readability.
- Eliminated the white border around the main container by removing default browser margin/padding.

## [0.2.0] - 2025-03-25 - Phase 2: Firebase Infrastructure & Admin Test Dashboard

### Added

- Firebase project setup including Authentication (Google Auth), Firestore, and Firebase Storage integration.
- Admin authentication logic: Admin rights restricted to user `nautiluce@gmail.com`.
- Security rules for Firebase Firestore and Storage to permit public reads and restrict writes to the admin user.
- A collapsible Admin Test Dashboard component to validate Firebase integrations:
  - **Auth Test:** Validate currently logged-in admin user.
  - **Firestore CRUD Test:** Verify write, read, and delete operations.
  - **Storage Test:** Confirm upload, retrieval, and deletion of files.
  - **Firestore Collection Retrieval Test:** Ensure collection retrieval works as expected.
  - **Realtime Listener Test:** Validate Firestore's real-time update capabilities.
- Improved documentation in the README file to clearly outline setup, testing, and deployment instructions.

### Changed

- Streamlined README.md content for clarity and improved usability.

## [0.1.0] - 2025-03-21 - Initial Setup

### Added

- Vite + React base project
- Tailwind CSS
- Firebase SDK and config file
- Jest and testing infrastructure
- Logger utility
- Project folder structure
- README and this changelog
