# SkillTrack project roadmap

## Product direction

Make SkillTrack a guided pattern mastery platform: learners know what to study next, practice in a dependable judge, receive useful feedback, and revisit weak areas until they retain the skill.

## Phase 1: Secure and reproducible foundation

- Close submission and private-problem access paths.
- Exchange OAuth codes for short lived, single-use tickets and validate OAuth state.
- Isolate code execution with bounded queueing, resource limits, and output caps.
- Remove generated dependencies and build output from version control.
- Document local configuration and build all three services from the repository root.

**Acceptance:** a clean clone installs from lockfiles, all service builds pass, private data is owner/admin scoped, and execution overload fails with a retryable response.

## Phase 2: Reliable judging

- Move judging from long synchronous requests to persisted, idempotent jobs.
- Run a test suite in one isolated job with explicit per-case limits and deterministic timing.
- Separate judge workers from the user API and use a shared queue with bounded capacity.
- Pin execution images, record judge versions, and keep private test data out of learner responses and logs.
- Add per-user quotas, cancellation, retries for infrastructure failures, and queue/worker health metrics.

**Implemented in the current slice:** submissions are stored before acknowledgment, deduplicated by an idempotency key, claimed by a separate MongoDB-backed worker with expiring leases, retried after judge infrastructure failures, cancellable between test cases, and polled by the client. The API health response reports worker heartbeat and queue depth.

**Acceptance:** submissions survive API restarts, duplicate requests do not create duplicate results, one user's workload cannot starve the queue, and infrastructure failures are distinguishable from wrong answers.

## Phase 3: Learning loop

- Add learner goals and a placement check that chooses an appropriate starting point.
- Turn the twelve-pattern roadmap into short concept lessons, guided practice, and progressive hints.
- Track mastery from attempts and review outcomes rather than treating one accepted answer as mastery.
- Generate a daily plan with spaced review for weak or stale patterns.
- Explain failed submissions with useful, private feedback while preserving hidden test cases.

**Acceptance:** a learner can start from a goal, follow a generated weekly plan, see why a topic was selected, and measure retained mastery over time.

## Phase 4: Community, collaboration and proof of skill

- Add time-boxed contests and cohort/classroom assignments.
- Give mentors and admins cohort progress and problem-quality analytics.
- Create privacy controls for shareable profiles, verified achievements, and solution visibility.
- Support curated company or interview tracks without fragmenting the core pattern curriculum.

**Acceptance:** a mentor can assign a track, learners can compete or collaborate safely, and a learner can share a profile with clear evidence of skills and privacy choices.

## Phase 5: Launch quality

- Add automated API, UI, and judge coverage for security and core learning flows.
- Add CI for lint, type checking, builds, dependency review, and deployment artifacts.
- Instrument errors, latency, queue depth, and judge resource use without logging code or secrets.
- Improve keyboard navigation, mobile layouts, loading/error states, and editor accessibility.
- Document production architecture, secrets, backups, migrations, and incident recovery.

**Acceptance:** a clean deployment is repeatable, critical flows are covered in CI, accessibility and performance have explicit targets, and operations can diagnose failures without exposing learner code.

## Current implementation limits

Submission jobs now persist in MongoDB and are processed by separate workers. The queue uses MongoDB polling and leases rather than a dedicated broker, cancellation stops further test cases but does not interrupt a currently running container, and the per-user and global admission checks are application-level counts that can race under concurrent requests. Sample and custom runs still use synchronous API requests. JWTs remain in browser local storage, and judge images are version-tagged rather than pinned by digest. These limits should be addressed before public scale.
