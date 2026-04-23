# Remove IP Address (Infra & IP) Module

The user wants to remove the IP address related functionality from the OSINT dashboard. This module is referred to as "Infra & IP" in the codebase.

## Proposed Changes

### UI Changes

#### [MODIFY] [index.html](file:///c:/Users/loren/Desktop/OSINT/Site%20OSINT%20SO/index.html)
- Remove the "Infra & IP" navigation link from the desktop sidebar.
- Remove the "Infra & IP" navigation link from the mobile menu.
- Remove the "Infra & IP" quick-access card from the main dashboard.
- Delete the entire `<section id="infra">` module container.

### Logic Changes

#### [MODIFY] [app.js](file:///c:/Users/loren/Desktop/OSINT/Site%20OSINT%20SO/app.js)
- Remove the `infra` case from `HistoryManager.getHashFromType`.
- Remove IP/Domain detection logic from the global search (both real-time suggestion and submission).
- Remove the `infra` handler from `fillAndTriggerSearch`.
- Delete the `initInfraLookup` function.
- Remove the initialization call `initInfraLookup()` from the `DOMContentLoaded` event listener.

## Verification Plan

### Manual Verification
- Open `index.html` in a browser.
- Verify that "Infra & IP" no longer appears in the sidebar, mobile menu, or dashboard grid.
- Verify that searching for an IP address in the global search does not trigger a suggestion or redirect to a non-existent module.
- Check the browser console to ensure there are no errors related to missing elements or undefined functions.
