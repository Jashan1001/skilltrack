# SkillTrack Execution Engine

Private service that runs JavaScript, Python, and C++ submissions in short lived Docker containers.

## Local development

Copy `execution-engine/.env.example` to `.env`. Set `INTERNAL_SECRET` to the same random value used by the API. Docker must be running and available to the service process.

From the repository root:

```bash
npm run dev:engine
```

## Execution controls

- The service requires an internal request token and limits request body size.
- An in-process queue limits active executions and rejects excess backlog with HTTP 503.
- Containers have no network, a read only source mount, a non-root user, no Linux capabilities, no-new-privileges, a read only root filesystem, and memory, CPU, and process limits.
- C++ compilation and execution happen in the same restricted container; execution is time limited.
- Standard output and error are capped. Timed out containers are removed by name.

Keep this Docker-controlling service on a private network. These controls reduce risk but do not replace a dedicated, hardened judge environment for public scale.

## Scripts

- `npm run dev` starts the TypeScript service with reload.
- `npm run build` compiles to the ignored `dist/` directory.
- `npm start` runs the compiled service.
