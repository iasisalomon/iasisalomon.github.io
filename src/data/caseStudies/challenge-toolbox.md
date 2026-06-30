---
role: "Full-Stack Engineer"
timeframe: "2022"
outcome: "A containerized full-stack app that ingests CSV data from an external API, processes it server-side, and presents it in a React interface — built end to end."
---

## The challenge

Build a full-stack application that consumes CSV files from an external API, transforms the data, and makes it usable through a clean web interface — packaged so it runs the same way on any machine.

It's a deceptively complete brief: it touches data ingestion, a back-end processing layer, front-end state management, and a reproducible deployment story.

## My role

Sole engineer, responsible for the whole stack — API integration, processing logic, UI, and the Docker setup that ties it together.

## Approach

- **Back end (Node.js)** — fetched and parsed CSV payloads from the external API, with the transformation logic isolated so it could be reasoned about and tested independently of the transport.
- **Front end (React + Redux)** — modeled the processed data in a predictable state store so the UI stayed in sync as data flowed in.
- **DevOps (Docker)** — containerized the app so the environment is reproducible and onboarding is a single command rather than a setup checklist.

## What it demonstrates

- Comfort across the full stack — data layer, API, state management, and UI — rather than a single tier.
- A bias toward **reproducibility**: containerizing from the start instead of bolting it on later.
- Separating concerns (transport vs. transformation vs. presentation) so each part stays simple.

<!-- TODO (Iasi): if you can share specifics — dataset size handled, processing time, or a screenshot/GIF of the UI — drop them in here and add images to the `gallery` frontmatter field. -->

**Source:** [github.com/iasisalomon/challenge_toolbox](https://github.com/iasisalomon/challenge_toolbox)
