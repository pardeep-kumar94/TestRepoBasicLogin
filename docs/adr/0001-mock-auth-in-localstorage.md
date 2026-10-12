# Auth is mocked in localStorage behind a swappable module

The project's goal is the UI, so there is no backend: Accounts, the Session, and the email to pre-fill on Log in live in the browser's `localStorage`, and passwords are stored as SHA-256 hashes (Web Crypto) so plain text never sits in storage. This is not real security — anyone with access to the browser can read or forge it. All of it goes through a single auth module with async functions, so a real backend or hosted provider can replace it later without touching the pages.

Only Sign up and Log in simulate ~700 ms of network latency. Reading the Session, Log out, and the one-shot Sign-up success and pre-fill reads are instant: every page's guard reads the Session before showing anything, and delaying those reads would delay every page load.
