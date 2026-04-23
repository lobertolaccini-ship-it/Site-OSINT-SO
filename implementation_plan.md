# Add Clear History Button

The user wants a button to delete the search history from the sidebar.

## Proposed Changes

### UI Changes

#### [MODIFY] [index.html](file:///c:/Users/loren/Desktop/OSINT/Site%20OSINT%20SO/index.html)
- Update the "Histórico Recente" header to include a small button with a trash icon.
- Use a Lucide icon (`trash-2`).
- Ensure the button is styled to fit the OSINT theme (subtle, neon hover effect).

### Logic Changes

#### [MODIFY] [app.js](file:///c:/Users/loren/Desktop/OSINT/Site%20OSINT%20SO/app.js)
- Add a `clear()` method to the `HistoryManager` object to remove the key from `localStorage` and re-render the list.
- In the `DOMContentLoaded` listener, add an event listener to the new clear button to trigger `HistoryManager.clear()`.

## Verification Plan

### Manual Verification
- Open the dashboard.
- Perform some searches to populate the history.
- Click the trash icon in the sidebar.
- Verify that the history list is cleared and shows the "Nenhum histórico recente" message.
- Refresh the page to ensure the history remains cleared.
