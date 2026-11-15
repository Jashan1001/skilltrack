# SkillTrack API

Express and MongoDB API for authentication, curriculum, problems, code submissions, progress, and leaderboards.

## Local development

From the repository root, install dependencies and copy `server/.env.example` to `server/.env`. Start MongoDB and the execution engine, then run:

```bash
npm run dev:server
```

The engine URL and internal secret are required. `INTERNAL_SECRET` must match the value in `execution-engine/.env`; `JWT_SECRET` must be a random value of at least 32 characters. Google/GitHub OAuth and SMTP variables are optional until those features are used.

## Scripts

- `npm run dev` starts the API with automatic reload.
- `npm run build` compiles TypeScript into the ignored `dist/` directory.
- `npm start` runs the compiled API.
- `npm run seed` loads the curated problem set.
- `npm test` runs the existing Jest suites.
