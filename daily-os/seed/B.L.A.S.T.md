# B.L.A.S.T. Framework — Jira Agent

This project follows the **B.L.A.S.T.** (Blueprint, Link, Architect, Stylize, Trigger) protocol and the **A.N.T. 3-Layer Architecture**.

| Phase | Status | Outcome |
|-------|--------|---------|
| **B** — Blueprint | ✅ Complete | Data schemas defined in `docs/LLM.md`, task plan approved |
| **L** — Link | ✅ Complete | Jira API + GROQ API verified via `tools/handshake.js` |
| **A** — Architect | ✅ Complete | 3-layer architecture built (docs → server/api → tools) |
| **S** — Stylize | ✅ Complete | React SPA with dark/light mode, tables, download + copy |
| **T** — Trigger | 🔄 In Progress | GitHub push + Vercel deployment pending |

---

## A.N.T. 3-Layer Architecture

```
Layer 1 — Architecture (Documentation)
  docs/LLM.md          ← Project Constitution (schemas + rules)
  docs/task_plan.md    ← Phases + checklists
  docs/findings.md     ← Research + discoveries
  docs/progress.md     ← What happened, errors, fixes
  architecture/        ← SOPs for each tool
  Seed/                ← Framework reference documents

Layer 2 — Navigation (Decision Making / Routing)
  server.js            ← Express proxy (local dev, port 8787)
  api/config.js        ← Vercel: GET /api/config
  api/generate-plan.js ← Vercel: POST /api/generate-plan
  api/generate-strategy.js ← Vercel: POST /api/generate-strategy

Layer 3 — Tools (Deterministic Engines)
  tools/jiraClient.js  ← Fetch + normalize Jira issues (ADF support)
  tools/groqClient.js  ← GROQ chat completion (OpenAI-compatible)
  tools/testPlan.js    ← Build prompt + generate + render Test Plan
  tools/testStrategy.js ← Build prompt + generate + render Test Strategy
  tools/handshake.js   ← Verify all API connections
```

---

## Golden Rules

1. **Data Schema first** — `docs/LLM.md` is updated before any tool changes.
2. **LLM produces JSON only** — Markdown rendering is deterministic code, not AI.
3. **No secrets in API responses** — Config endpoint only returns boolean flags.
4. **Self-Annealing** — When a tool fails: Analyze → Patch → Test → Update `docs/findings.md`.
