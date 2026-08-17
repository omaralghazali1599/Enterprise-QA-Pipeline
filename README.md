# Enterprise QA Pipeline

A Playwright + TypeScript end-to-end test suite built as the foundation for a production-style continuous testing pipeline. The suite targets [qacart-todo](https://todo.qacart.com), a public todo application, and exercises both its REST API and its web UI.

The tests are the starting point, not the goal. This repository is being built out in phases toward containerized, parallelized test execution with automated quality gates — see [Roadmap](#roadmap).

---

## Quick start

```bash
git clone https://github.com/omaralghazali1599/Enterprise-QA-Pipeline.git
cd Enterprise-QA-Pipeline
npm ci
npx playwright install --with-deps
npm test
```

Requires Node.js (LTS) and npm.

---

## Configuration

All environment-specific configuration is injected at runtime. Copy the template and adjust as needed:

```bash
cp .env.example .env
```

| Variable | Required | Default | Purpose |
|---|---|---|---|
| `BASE_URL` | No | `https://todo.qacart.com` | Target environment for both browser navigation and API requests |

`BASE_URL` can also be supplied per-run without a `.env` file:

```bash
BASE_URL=https://staging.example.com npm test
```

The value is resolved once in `config/env.ts`, which validates it is an absolute URL and throws a descriptive error at startup if it is not. Both the Playwright config and the page objects read from that single source.

---

## Commands

| Command | Description |
|---|---|
| `npm test` | Run the full suite |
| `npm run test:smoke` | Run only tests tagged `@smoke` |
| `npm run typecheck` | Type-check without emitting output |
| `npx playwright test --headed` | Run with a visible browser |
| `npx playwright test --debug` | Step through tests in the Playwright Inspector |
| `npx playwright show-report` | Open the HTML report from the last run |

---

## Project structure

```
.
├── .github/workflows/     CI pipeline definition
├── API/                   HTTP clients for the application's REST endpoints
│   ├── TodoAPI.ts
│   └── UserAPI.ts
├── Models/                Test data objects
│   └── User.ts
├── Pages/                 Page objects — selectors and interactions
│   ├── NewTodoPage.ts
│   ├── RegisterPage.ts
│   └── TodoPage.ts
├── config/                Runtime configuration resolution
│   └── env.ts
├── testCases/             Test specifications
│   ├── addTodo.spec.ts
│   ├── deleteTodo.spec.ts
│   └── register.spec.ts
├── .env.example           Template for required environment variables
├── playwright.config.ts
└── tsconfig.json
```

**API layer** wraps HTTP calls so that request construction lives in one place and specs never build payloads inline.

**Page objects** expose selectors and behaviour. Getters that resolve elements return Playwright locators rather than resolved strings, so assertions retain auto-waiting.

**Models** generate test data. `User` produces a collision-proof email per instance, allowing tests to run concurrently against a shared environment.

---

## Test coverage

| Spec | Scenario |
|---|---|
| `register.spec.ts` | New user registration through the UI, verifying the personalised greeting |
| `addTodo.spec.ts` | Creating a todo item, verifying it appears in the list |
| `deleteTodo.spec.ts` | Deleting a todo item, verifying the empty state |

Each test provisions its own user via the API and shares no state with any other test.

---

## CI pipeline

The workflow in `.github/workflows/playwright.yml` runs on every push to `main` and on every pull request targeting `main`.

| Stage | Purpose |
|---|---|
| Install dependencies | `npm ci` — reproducible install from the lockfile |
| Typecheck | Fast static validation before any expensive setup |
| Install browsers | Playwright browser binaries and system dependencies |
| Run tests | Full suite, 4 parallel workers, 2 retries |
| Upload artifacts | HTML report and JUnit XML, retained 30 days |

The `test` job is configured as a required status check on `main`, and `main` requires changes to arrive through a pull request. Failing tests block the merge button rather than merely reporting after the fact.

---

## Design decisions

**API-based test setup.** Registration and todo seeding happen over HTTP rather than through the UI. Only the behaviour under test is exercised through the browser. This keeps tests fast and ensures a failure points at the feature being tested rather than at unrelated setup steps.

**Environment-driven base URL.** `BASE_URL` is resolved once in `config/env.ts` and consumed by both `playwright.config.ts` and the page objects. Nothing imports the Playwright config into test code, so there is exactly one resolution path for the value — a prerequisite for running the same image against different environments.

**Fail fast on invalid configuration.** `config/env.ts` throws immediately if `BASE_URL` is not an absolute URL. Without this, a malformed value surfaces as an opaque `Invalid URL` error several call frames away from its cause — a difficult failure to diagnose inside a container where the environment cannot be inspected interactively.

**Exact Playwright version pin.** `@playwright/test` is pinned to an exact version rather than a caret range, because the library version must match the browser binaries in the Docker image used for execution. A silent minor bump would break the container with no corresponding source change. Dependencies without an external coupling keep their ranges.

**Cheap checks first.** Type-checking runs before the browser install. A type error fails the pipeline in seconds rather than after the slowest stage completes.

**Web-first assertions.** Assertions target locators, not resolved strings, so Playwright retries until the condition holds or the timeout expires. Static comparisons against a value captured at one instant race the application's rendering and produce intermittent failures that vary with machine speed.

**Unique test data by construction.** User emails combine a timestamp with a UUID fragment rather than relying on random generation from a finite pool. Under parallel execution, collisions would surface as HTTP 409 responses that look like application defects.

**Conditional artifact collection.** Traces and video are captured only on failure or retry. Capturing unconditionally adds runtime overhead to passing tests and produces artifact volumes that grow with every added browser and shard.

---

## Roadmap

- [x] **Phase 0** — Portability and stability: environment-driven configuration, committed type configuration, web-first assertions, parallel-safe test data
- [x] **Phase 1a** — Quality gate: pull-request-triggered CI with required status checks
- [ ] **Phase 1b** — Containerization: Docker image with pinned browser binaries, Docker Compose for multi-service topologies
- [ ] **Phase 2** — Pipeline hardening: secrets management, matrix execution, scheduled runs
- [ ] **Phase 3** — Scale: cross-browser parallel execution, report sharding and merging, failure notifications

---

## Notes

The application under test is a publicly hosted third-party service. Tests depend on its availability and create real user accounts on each run.