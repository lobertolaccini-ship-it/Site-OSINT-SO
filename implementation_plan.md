# Implementation Plan - Person Search Module

Replace the existing "Social Analyzer" with a more targeted "Person Search" that identifies an individual's age, social profiles (Instagram, TikTok), and email addresses using advanced search techniques.

## User Review Required

> [!IMPORTANT]
> Since real-time scraping of private data (like exact age or private emails) is restricted by CORS and privacy policies on the client-side, the tool will focus on **Deep Search Generation**. It will provide direct, pre-filtered links to Google Dorks and social platforms that are most likely to contain this information.

## Proposed Changes

### UI & UX Updates

#### [MODIFY] [index.html](file:///c:/Users/loren/Desktop/OSINT/Site%20OSINT%20SO/index.html)
- Rename "Social Analyzer" to "Person Search" across the sidebar, dashboard, and module headers.
- Update icons from `users` to `user-search` (Lucide).
- Update the search input placeholder to "Nome Completo (ex: João Silva)".
- Redesign the results section to show four specific categories:
    - **Identidade & Idade**: Links to civil registries or Dorks for birth dates.
    - **Redes Sociais**: Direct search links for Instagram and TikTok.
    - **Comunicação**: Dorks for email discovery.
    - **Deep Web / Breaches**: Links to search the name in leak databases.

#### [MODIFY] [app.js](file:///c:/Users/loren/Desktop/OSINT/Site%20OSINT%20SO/app.js)
- Update `SOCIAL_PLATFORMS` logic to `PERSON_SEARCH_STRATEGIES`.
- Modify `initGlobalSearch` to recognize names (e.g., strings with spaces) and route to the Person Search module.
- Implement `initPersonSearch`:
    - **Instagram**: `site:instagram.com "Nome"`
    - **TikTok**: `site:tiktok.com "Nome"`
    - **Email**: `"Nome" "@gmail.com" OR "@hotmail.com"`
    - **Age**: `"Nome" "nascimento" OR "idade" OR "born"`
- Add "Open All" functionality for a comprehensive scan.

## Verification Plan

### Manual Verification
- Test searching for a common name.
- Verify that generated Google Dork links correctly filter for the requested information.
- Ensure the "Email Leaks" section remains functional as requested.
- Check responsive layout on mobile.
