# SkillTrack API

Express and MongoDB API for authentication, curriculum, problems, code submissions, progress, and leaderboards.

## Local development

From the repository root, install dependencies and copy `server/.env.example` to `server/.env`. Start MongoDB and the execution engine, then run the API and judge worker in separate terminals:

```bash
npm run dev:server
npm run dev:worker
```

The engine URL and internal secret are required. `INTERNAL_SECRET` must match the value in `execution-engine/.env`; `JWT_SECRET` must be a random value of at least 32 characters. Password registrations require SMTP settings so SkillTrack can verify email ownership before login. Google and GitHub sign-ins require the provider to report a verified email address.

## Scripts

- `npm run dev` starts the API with automatic reload.
- `npm run dev:worker` starts a MongoDB-backed judge worker with automatic reload.
- `npm run build` compiles TypeScript into the ignored `dist/` directory.
- `npm start` runs the compiled API.
- `npm run start:worker` runs the compiled judge worker.
- `npm run seed` loads the curated problem set.
- `npm test` runs the existing Jest suites.

The API returns a submission ID and `202 Accepted` as soon as a job is persisted. Poll `GET /api/submissions/:id` for `jobState` (`queued`, `running`, `completed`, `failed`, or `cancelled`). Clients must send an `Idempotency-Key` header; reusing a key with a different payload returns `409`. `POST /api/submissions/:id/cancel` cancels a queued job immediately and stops a running job before its next test case. Workers atomically claim jobs with expiring leases, so another worker can recover work after a process stops unexpectedly.

New password accounts remain inactive until a single-use email verification link is confirmed. Configure `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`, and `EMAIL_FROM` in the API environment; links use `CLIENT_URL` and expire after 30 minutes. Resend requests are rate limited and return the same response regardless of whether an address has an account. Password sign-in attempts are limited by client IP. Existing password accounts without an `emailVerified` value are treated as unverified and must use the resend flow once before signing in; arrange SMTP delivery before enabling this release for existing users.
