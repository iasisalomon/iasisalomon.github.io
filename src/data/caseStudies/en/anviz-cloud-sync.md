---
role: "Developer (end to end)"
timeframe: "2026"
outcome: "An access-control clock that only spoke over the local network now syncs to the cloud at zero monthly cost. Records can be checked from anywhere, and every correction is kept in an auditable history."
heroImageAlt: "Dashboard records table with the edit history of one record open below its row"
gallery:
  - src: "/images/gallery/anviz-cloud-sync/records-history.webp"
    alt: "Records screen with the edit history of one record open below its row"
    caption: "Records: the history opens below the row and ends at the device's original time"
  - src: "/images/gallery/anviz-cloud-sync/people.webp"
    alt: "People screen listing everyone enrolled on the clock"
    caption: "People: what's on the clock, with fingerprints, PIN, card and group"
  - src: "/images/gallery/anviz-cloud-sync/changes.webp"
    alt: "Changes screen with the unified log of modifications"
    caption: "Changes: records and people in one log, with reason, status and author"
---

*Names, codes, reasons and device details in the screenshots have been replaced with fictitious ones. The dashboard is in Spanish.*

## The problem

The clock's data could only be seen from a PC on the same network. An Anviz GC150 device kept the punches in its own memory, and the only way to read them was CrossChex Standard, a desktop program on that same network.

- **No remote access:** nobody could check the records off-site.
- **No traceability:** there was no way to correct a record while noting who changed it and why.
- **No backup:** the data depended on a single device and a local database.
- **Cost ruled out:** the vendor's cloud option (CrossChex Cloud) is a paid subscription, and the goal was to add no fixed costs.

## The solution

A Python agent bridges the local network and the cloud without opening any inbound port. The clock listens on the LAN, the agent connects to it and pushes the data over HTTPS to Supabase. The web dashboard only talks to Supabase, never to the clock.

![Architecture: the clock and the agent on the local network, Supabase in the cloud and the dashboard in the browser (diagram labels in Spanish)](/images/work/anviz-cloud-sync-architecture.webp)

Changes going the other way go through a queue: the dashboard writes a request, and the agent applies it to the clock on its next run and records the result.

The key decision is that **the clock is the raw record and Supabase is the official version**. They can differ on purpose, and every difference is explained by the history.

## Technical challenges

Every decision was checked against the real device or the production database, not just on paper.

| Challenge | What was done | How it was verified |
| --- | --- | --- |
| Binary protocol with no SDK | A dependency-free TCP client in Python: frames, CRC16, commands and parsers | 163 of 163 records identical to the CrossChex database; 9 people's records rebuilt byte for byte |
| Never lose data | The clock's "new" flags are cleared only after upload; a unique key prevents duplicates | Record-by-record reconciliation: 0 left un-uploaded |
| Correct without losing the original | The device time never changes and is the key; the official time is editable; deletes are soft | A full re-download neither revives nor overwrites edited or deleted records |
| Security with no server of my own | Row Level Security, column permissions and Postgres triggers | From the browser, the database rejected hard deletes, changes to the original time, a forged author and an empty reason |
| Protected access PINs | 3072-bit RSA-OAEP-SHA256: the browser encrypts, only the agent decrypts | A new PIN written to the clock and used on the device, leading zero intact |
| Clock running at the wrong time | The agent corrects drifts over 30 seconds on every cycle | A one-hour drift was caught by cross-checking punches against schedules, and fixed while keeping the original time |

A trigger writes the history, so it can't be forged from the browser: the author comes from the session, not from what the page sends.

## The product

The dashboard has three screens, dark theme by default and light theme one click away.

- **Records:** quick ranges, per-column filters, a summary row and CSV export that matches what's on screen. Manual entry, editing, deletion and restore, each with a required reason. Clicking a row opens its history.
- **People:** add, edit and remove people on the clock from the web, with the PIN encrypted in the browser.
- **Changes:** one board with everything that was modified, who did it and what is still waiting to be applied on the clock.
- **Device status:** last sync, records not yet uploaded, memory usage and the command ready to copy.

## Stack and results

The system runs at zero monthly cost, with the clock's whole history in the cloud. Today the agent runs on demand; the next step is to leave it on an always-on machine.

| Layer | Technology |
| --- | --- |
| Agent | Python, TCP sockets, `requests`, `cryptography` |
| Data and access | Supabase: Postgres, Auth, RLS, triggers |
| Dashboard | Vue 3, Vite, Pinia, Vue Router |
| UI | shadcn-vue, Tailwind CSS v4, TanStack Table, Day.js, PapaParse |
| Development | AI-assisted with Claude Code |
