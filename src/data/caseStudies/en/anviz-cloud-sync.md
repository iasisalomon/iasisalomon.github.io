---
role: "Developer (end to end)"
timeframe: "2026"
outcome: "An access-control clock that only spoke over the local network now syncs to the cloud at zero monthly cost. Records can be checked from anywhere, hours are worked out per person, and every correction is kept in an auditable history."
heroImageAlt: "Dashboard records table with the edit history of one record open below its row"
gallery:
  - src: "/images/gallery/anviz-cloud-sync/records-history.webp"
    alt: "Records screen with the edit history of one record open below its row"
    caption: "Records: the history opens below the row and ends at the device's original time"
  - src: "/images/gallery/anviz-cloud-sync/shifts.webp"
    alt: "Shifts screen with hours per person and one person's shifts expanded"
    caption: "Shifts: hours per person, with each shift's entry, exit and status one click away"
  - src: "/images/gallery/anviz-cloud-sync/people.webp"
    alt: "People screen listing everyone enrolled on the clock"
    caption: "People: what's on the clock, with fingerprints, PIN, card and group"
  - src: "/images/gallery/anviz-cloud-sync/changes.webp"
    alt: "Changes screen with the unified log of modifications"
    caption: "Changes: records and people in one log, with reason, status and author"
---

*Names, ID numbers, emails, the device serial and file paths in the screenshots have been replaced with fictitious ones. The dashboard itself is in Spanish, so its screenshots are too.*

## The problem

The clock's data could only be seen from a PC on the same network. An Anviz GC150 device kept the punches in its own memory, and the only way to read them was CrossChex Standard, a desktop program on that same network.

- **No remote access:** nobody could check the records off-site.
- **No traceability:** there was no way to correct a record while noting who changed it and why.
- **No backup:** the data depended on a single device and a local database.
- **Cost ruled out:** the vendor's cloud option (CrossChex Cloud) is a paid subscription, and the goal was to add no fixed costs.

## The solution

A Python agent bridges the local network and the cloud without opening any inbound port. The clock listens on the LAN, the agent connects to it and pushes the data over HTTPS to Supabase. The web dashboard only talks to Supabase, never to the clock.

![Architecture: the clock and the agent on the local network, Supabase in the cloud and the dashboard in the browser](/images/work/anviz-cloud-sync-architecture-en.webp)

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

The dashboard has four screens, dark theme by default and light theme one click away. All of them share a status bar: when the last sync ran, how far the clock's time drifts (in seconds), how many people and records are on the device out of its 102,400 capacity, how many records were entered manually, how many are still waiting to upload, and the command to refresh from the clock, ready to copy.

### Records

The clock's punches, filtered and summarized.

- **Ranges and filters:** quick ranges (today, 7 days, this month, last month) or a month or custom dates, plus per-column filters for person, type (entry or exit) and verification (fingerprint or manual).
- **Summary tiles:** days with records, records, people, entries, exits, and how many records are manual or edited, as a count and a share of the total. It shows at a glance how much of the data was touched by hand.
- **Corrections:** add a record, edit it, delete it or restore it, each with a required reason. Deleted records stay hidden unless asked for.
- **History:** clicking a row opens its timeline, newest first: who changed it, why, and the before and after, ending at the device's original record.
- **Export:** CSV that matches what's on screen.

![The new record form open over the records table: person, date, time, type and a required reason](/images/gallery/anviz-cloud-sync/new-record.webp)

Adding a record by hand. The form says it only saves to the dashboard, never to the clock, and records who did it and why.

### Shifts

Punches paired into worked hours, so nobody has to add them up by hand.

- **Totals per person:** hours, completed shifts, average length, and how many shifts were under 6 hours, between 6 and 8, and over 8. Tiles on top add up hours, completed shifts, shifts in progress and shifts that need review.
- **Detail on demand:** expanding a person lists each shift with its entry, exit, hours and status (complete or in progress). A shift that ends after midnight is marked "+1 day".
- **Review list:** shifts that need attention are listed below the table, so a missing punch doesn't quietly distort the hours.
- **Same controls as Records:** quick ranges, month or custom dates, a person filter and CSV export.

### People

The people enrolled on the clock, managed from the web.

- **Add, edit and remove** people on the device. Fingerprints are enrolled on the clock itself.
- **PIN:** set from the web, encrypted in the browser before it leaves.
- **What the device holds:** the clock keeps names to 10 characters, so the screen shows the full name next to the one on the device, along with fingerprint count, PIN, card and group.
- **Search** by name or ID, with an admin badge, and anyone no longer on the clock kept in a separate collapsed list.

### Changes

One board with everything that was modified.

- **Counters:** pending, failed, today and total.
- **Filters:** people only, records only or both; by status (pending, applied, failed, cancelled); by author; plus free-text search over name, reason and detail.
- **Each row:** when, what it was about (record or person), the action, the detail (before and after, and the reason), its status and who did it.
- **Pending requests** are the ones the agent hasn't applied to the clock yet.

## Stack and results

The system runs at zero monthly cost, with the clock's whole history in the cloud. Today the agent runs on demand; the next step is to leave it on an always-on machine.

| Layer | Technology |
| --- | --- |
| Agent | Python, TCP sockets, `requests`, `cryptography` |
| Data and access | Supabase: Postgres, Auth, RLS, triggers |
| Dashboard | Vue 3, Vite, Pinia, Vue Router |
| UI | shadcn-vue, Tailwind CSS v4, TanStack Table, Day.js, PapaParse |
| Development | AI-assisted with Claude Code |
