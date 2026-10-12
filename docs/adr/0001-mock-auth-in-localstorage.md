# Auth is mocked in localStorage behind a swappable module

The project's goal is the UI, so there is no backend: Accounts and the Session live in the browser's `localStorage`, and passwords are stored as SHA-256 hashes (Web Crypto) so plain text never sits in storage. This is not real security — anyone with access to the browser can read or forge it. All storage and checking goes through a single auth module with async functions (simulating ~700 ms network latency), so a real backend or hosted provider can replace it later without touching the pages.
