# Walkthrough - Person Search Module

I have successfully replaced the "Social Analyzer" with the new **Person Search** functionality. This module is specifically designed to help you find an individual's personal details through advanced OSINT search techniques.

## Changes Made

### UI & Aesthetics
- **Renamed** all instances of "Social Analyzer" to "Person Search".
- **Updated Icons**: Switched generic user icons to the `user-search` magnifying glass icon.
- **Refined Layout**: The module now presents results in a structured grid of cards, each representing a specific investigation target (Age, Instagram, TikTok, Email).

### Core Logic (`app.js`)
- **Search Strategies**: Implemented a set of advanced Google Dork templates that are automatically filled with the target's name.
- **Global Search**: Updated the dashboard search bar to detect full names (strings with spaces) and automatically redirect them to the Person Search module.
- **Deep Search Links**: Each result card generates a "Execute Search" button that opens a pre-filtered Google search, bypassing CORS restrictions while providing the most accurate public data available.

## How to Use
1. Go to the **Person Search** module.
2. Enter a **Full Name** (e.g., "Elon Musk").
3. Click **Investigar**.
4. Use the generated cards to jump directly to filtered results for:
    - **Age & Birth Date**
    - **Instagram Profiles**
    - **TikTok Profiles**
    - **Potential Email Addresses**

## Verification
- Verified that "Email Leaks" (the previous request to keep it) is still fully functional.
- Verified that navigation and routing work correctly with the new IDs.
- Tested global search inference for names.
