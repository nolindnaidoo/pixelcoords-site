# Instructions

[AGENTS.md](AGENTS.md) is the technical source of truth for this repository:
the engineering standard the code is held to — control flow, error handling,
immutability, structure — plus the architecture, content rules, accessibility
requirements, and verification chain.

**Read it before writing code.** `README.md` carries the page map; `MAINTENANCE.md` is the runbook.

Non-negotiables, restated so they are visible without a second file:

- Guard clauses first. No `else` / `else if`. Two levels of nesting maximum.
- Every content export is frozen; render bodies do no data shaping.
- Copy lives in `src/content/`, never in markup. Version-specific competitor
  claims live in `competitors.ts` ONLY, stamped and dated.
- Accessibility is gated in CI, not reviewed by eye.
- Conventional commits are enforced by hook and by CI.
- Definition of done: `bun run verify`
- Every fact has one home. Before adding a constant, check whether
  `src/content/` already owns it — drift is this codebase's failure mode.

Everything else is in AGENTS.md. Do not grow a second copy of the standard
here — a copy drifts, and then two tools disagree about the same repository.
