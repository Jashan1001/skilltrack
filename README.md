# SkillTrack

SkillTrack is a pattern based DSA practice platform. It combines a guided curriculum, problem authoring, submissions, progress tracking, leaderboards, and an isolated code execution service.

## Services

| Service | Directory | Local port | Purpose |
| --- | --- | ---: | --- |
| Web client | `client/` | 5173 | React, TypeScript, Vite |
| API | `server/` | 5000 | Express, TypeScript, MongoDB |
| Judge worker | `server/` | — | Claims durable submissions and evaluates private test cases |
| Execution engine | `execution-engine/` | 5001 | Authenticated Docker execution for JavaScript, Python, and C++ |

The API stores each submission before returning `202 Accepted`. A separate worker claims jobs from MongoDB using expiring leases, evaluates test cases one at a time, and retries temporary judge failures. Idempotency keys prevent duplicate jobs on request retries; learners can cancel queued submissions or stop a running submission before its next test case. The API health response includes worker heartbeat and queue depth. Each execution uses a bounded queue and a short lived container with no network, a read only source mount, a non-root user, and resource limits.

## Requirements

- Node.js 22.13 or newer
- npm
- MongoDB
- Docker Engine or Docker Desktop running, with permission for the execution engine to start containers

## Local setup

Install each service's locked dependencies once:

```bash
cd client && npm ci
cd ../server && npm ci
cd ../execution-engine && npm ci
```

Copy each `.env.example` to `.env` and fill in the values. Use the same long random `INTERNAL_SECRET` in the API and execution engine. OAuth providers are optional. Configure SMTP in the API to deliver password account verification and password reset messages; without SMTP, password registrations cannot sign in.

Pull the execution images before the first run so the first submission does not wait for a registry download:

```bash
docker pull node:20-alpine
docker pull python:3.11-alpine
docker pull gcc:13-bookworm
```

Start MongoDB, then run each command in its own terminal from the repository root:

```bash
npm run dev:engine
npm run dev:server
npm run dev:worker
npm run dev:client
```

The frontend expects `VITE_API_URL=http://localhost:5000/api`. The API calls the engine at `http://localhost:5001` by default. OAuth provider callback URLs should point to `http://localhost:5000/api/auth/google/callback` and `http://localhost:5000/api/auth/github/callback`.

Seed the curated problem set after MongoDB is available:

```bash
npm run seed
```

## Build and lint

```bash
npm run build
npm run lint
```

`npm run build` builds the client, API and worker, and execution engine. `npm run lint` runs the client ESLint configuration.

## Security notes

- Never commit `.env` files, OAuth secrets, SMTP credentials, JWT secrets, or the internal execution secret.
- The execution engine is a privileged service because it controls Docker. Keep it on a private network and do not expose it directly to the public internet.
- OAuth uses a short lived, single use exchange code; the API JWT is returned only from the authenticated exchange endpoint.
- API authorization checks are enforced server side. Hiding a page in the client is not an access control boundary.

## Current product areas

- Twelve DSA patterns and a sequenced official roadmap
- Problem statements, examples, hints, editorials, public and private test cases
- Code runs and scored submissions in three languages
- Durable queued submissions with automatic status updates and infrastructure retries
- User dashboard, streaks, activity heatmap, bookmarks, profiles, and leaderboards
- Single-use email verification for password accounts; verified provider emails for OAuth sign-in
- Admin problem management and analytics
- Password reset and Google/GitHub sign in
