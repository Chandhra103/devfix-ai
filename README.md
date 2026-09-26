# DevFix AI

**Investigate. Fix. Verify.**

DevFix AI is a polished hackathon prototype for an AI-assisted developer workflow. It coordinates five specialized agents — Repository Explorer, Root Cause Investigator, Fix Planner, Fixer, and Verification — through an Orchestrator that persists investigation state locally.

## Overview

The controlled demo repository is `acme-corp/api-gateway` and the seeded issue is **Intermittent 401 Unauthorized after token refresh**. The workflow is fully executable without API keys:

1. Repository context is analyzed.
2. A likely token refresh race condition is identified with evidence.
3. A structured fix plan is proposed.
4. The developer must explicitly approve the plan.
5. The Fixer produces a multi-file readable diff.
6. Verification simulates build, unit, regression, and lint checks.
7. A final JSON report can be downloaded.

## Technology

- React 19 + TypeScript + Vite
- Tailwind CSS 4 with a custom dark developer-tool design system
- Wouter client-side routing
- Lucide icons
- LocalStorage persistence
- Vitest-ready agent modules and workflow service boundaries

## Project structure

- `client/src/agents` — isolated agent functions and the Orchestrator
- `client/src/components` — layout, timeline, cards, diff viewer, and UI primitives
- `client/src/mocks` — realistic repository and investigation seed data
- `client/src/services` — service facades designed for a future API-backed implementation
- `client/src/store` — localStorage-backed workflow session context
- `client/src/types` — strong domain interfaces

## Local setup

```bash
npm install
npm run dev
npm run build
```

The default app uses demo mode and requires no external configuration. Future AI configuration belongs in environment variables and should never be committed.

## Demo walkthrough

Open the Dashboard, choose **Load demo**, open the seeded 401 investigation, and use the investigation detail links to review root cause, approve the plan, review/apply the diff, run verification, and export the final report.

## Future improvements

- Replace the mock agent service with server-side LLM calls.
- Connect repository indexing and real test execution.
- Add streaming agent events and persistent server storage.
- Add pull request creation behind an explicit approval boundary.
