# DevFix AI

**Investigate. Fix. Verify.**

DevFix AI is a hackathon-ready developer assistant that coordinates a six-stage, AI-style workflow for diagnosing and fixing software problems. The current project runs in **Demo/Mock mode** with deterministic local agent execution, so it works without external AI keys or repository credentials.

## What it solves

Developers often move from a bug report directly to a code change without a shared investigation trail. DevFix AI makes the reasoning visible: repository context, root cause evidence, a proposed fix, explicit developer approval, a readable diff, and verification results are all captured in one workflow.

## Six-agent workflow

Every investigation follows this sequence:

1. **Repository Explorer** — maps the repository, relevant files, dependencies, code paths, and tests.
2. **Root Cause Investigator** — traces the reported problem, identifies evidence, and assigns confidence.
3. **Fix Planner** — creates an implementation plan, risks, expected result, and tests to run.
4. **Developer Approval** — pauses the workflow until the developer approves the proposed fix.
5. **Fixer Agent** — applies the approved demo fix and generates a readable before/after diff.
6. **Verification Agent** — runs the demo build, unit, regression, and lint checks and produces PASS/FAIL results.

The **Orchestrator** passes typed outputs between the agents and controls the approval boundary. The Investigation page displays all six stages as separate cards with Pending, Running, and Complete states.

## Demo repository and investigations

The app keeps exactly one repository:

- `acme-corp/api-gateway` — TypeScript, 86 files, 24 tests

The seeded Dashboard contains three realistic investigations under that repository:

- **Intermittent 401 Unauthorized after token refresh** — Verified demo. Demonstrates the complete root-cause, approval, diff, verification, and **FIX VERIFIED** report flow.
- **Checkout fails when the cart is empty** — Approved. Demonstrates an approved plan waiting for the Fixer Agent.
- **Slow API response during product search** — Investigating. Demonstrates an active Repository Explorer stage.

## Demo walkthrough

1. Open the Dashboard.
2. Click **Load demo** and open the 401 investigation.
3. Review the six agent cards, root cause evidence, and proposed fix.
4. Open the Fix Plan and click **Approve fix**.
5. The Fixer Agent runs automatically, produces the diff, and hands off to Verification.
6. Verification produces passing build, unit, regression, and lint results.
7. Confirm **100% complete**, **FIX VERIFIED**, and open or export the Final Report.

## Architecture

```text
React UI
  ↓
SessionProvider + localStorage persistence
  ↓
AgentService
  ↓
Orchestrator
  ├── Repository Explorer Agent
  ├── Root Cause Investigator Agent
  ├── Fix Planner Agent
  ├── Developer Approval boundary
  ├── Fixer Agent
  └── Verification Agent
```

Agent modules return structured TypeScript outputs. The service boundary is intentionally ready for a future server/API implementation, while the current demo stays local and deterministic.

## Technology stack

- React 19
- TypeScript
- Vite
- Tailwind CSS 4 plus a scoped custom dark developer-tool design system
- Wouter client-side routing
- Lucide icons
- Vitest
- LocalStorage persistence

## Project structure

- `client/src/agents` — five specialized agent modules and the Orchestrator
- `client/src/components` — layout, six-stage Investigation cards, result cards, diff viewer, and UI primitives
- `client/src/mocks` — one demo repository and three seeded investigations
- `client/src/services` — agent, repository, verification, and storage service facades
- `client/src/store` — workflow session context and persistence
- `client/src/types` — strong interfaces for repositories, investigations, agent outputs, workflow state, and reports
- `tests/agents` — structured agent-chain and approval-to-verification coverage
- `server` — static hosting compatibility entry point from the Vite scaffold

## Local setup

Requirements: Node.js 22+ and npm.

```bash
npm install
npm run dev
```

The dev server runs on the Vite port printed in the terminal. To create a production build:

```bash
npm run check
npm run build
```

To run the automated workflow tests:

```bash
npm test
```

## Demo/Mock mode and configuration

Demo mode is the default and requires no external configuration. No API keys are hardcoded or required. The current mock agents execute locally using controlled data and realistic structured outputs.

The service boundary can later be connected to a real LLM or repository API by adding server-side configuration and replacing the mock service implementation. Secrets must remain in environment configuration and must never be committed to Git.

## Routes

- `/` — Dashboard
- `/repositories` — the single demo repository
- `/new` — New Investigation form
- `/investigation/:id` — six-agent workflow and investigation details
- `/root-cause/:id` — Root Cause detail
- `/fix-plan/:id` — Fix Plan detail and approval
- `/diff/:id` — Fixer diff review
- `/verification/:id` — Verification results
- `/report/:id` — Final Report and JSON export
- `/settings` — Demo mode and persistence status

## Testing coverage

The workflow test suite verifies:

- All five executable agent modules return structured outputs.
- Fixer execution produces a three-file demo diff.
- Verification produces passing results.
- Approval-to-fixer-to-verification status transitions complete in order.
- The final report is generated with the verified summary.

## Future improvements

- Replace local mock execution with server-side LLM and repository integrations.
- Stream agent events to the Investigation page.
- Run real repository builds and tests in a sandbox.
- Add pull-request creation behind a separate explicit approval boundary.
