---
role: "Delivery lead, building with partners"
timeframe: "Feb 2026 – present"
outcome: "Scoped, architected and reviewed the AI-assisted delivery of a multi-tenant platform for nursing homes, covering resident records, billing and nursing logs, backed by more than 1,600 automated API tests."
---

## The challenge

[MUBA](https://muba.app/) builds software for healthcare organizations in Argentina. Its first product helps nursing homes run day-to-day operations, from residents and beds to billing and nursing care, in one place instead of scattered tools.

The platform had to serve several institutions on one system, keep each one's data fully isolated, and give each role on staff access to only what it needs.

## My role

Scope and functional spec, defined with the partners; then delivery across two repositories, a REST API and a web app. AI agents did much of the typing. The architecture, the reviews, and the call on what counted as done stayed with me.

- **A written playbook for the agents.** Architecture, error handling, data isolation and testing conventions are all set down as rules, and every change is held to them.
- **Review before anything ships.** Agents never commit. Every change is read, the test suite is run by hand, and a plan only closes on a passing result. Separate code reviews and audits fed new work of their own.
- **Judgment calls, made and recorded.** Where the spec left room for interpretation, the decision was made deliberately, checked with the partners when it touched the business, and logged with its reasoning.
- **One thread between back end and front end.** Breaking API changes announced ahead of time, coordinated deploys, and end-to-end test rounds whose findings shaped the next plans.

## How the work ran

- **Small, numbered plans.** Every piece of work is a short plan with an ID, grouped by module. A single table holds the status of every plan, and a log records what changed and why.
- **Four stages per feature.** First, the feature works, with access control and data isolation from day one. Second, tests are written **from the spec, without reading the code**, so they can't just confirm what the code already does. Third, edge cases. Fourth, polish.
- **Traceable to the spec.** Each plan cites the spec test cases it covers. The spec itself is never edited to match the code: every deliberate deviation goes into a decision log.
- **Questions go to the business.** When the spec was silent, the question went to the partners instead of being guessed, and the answer was recorded.

## What was delivered

- **Residents and facilities:** resident records and the facility they live in.
- **Finance:** contracts, billing, payments and work with health insurers.
- **Nursing:** day-to-day clinical logs for the nursing team.
- **Platform:** multi-tenant isolation, role-based permissions, an audit trail, and consistent, user-ready error messages.

The API runs on Node.js with Express 5, Prisma and PostgreSQL, with Zod validation and an OpenAPI contract. The web app runs on React 19, Vite, Zustand and Tailwind. Both run in Docker, with a live demo environment.

## Outcome

- More than **1,600 automated API tests**, all passing.
- **600+ commits** across the two repositories in about eight months.
- A [live demo](https://demo.muba.lat) running on sample data.
