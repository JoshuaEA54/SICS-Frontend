# SICS — Frontend

> **Sistema Integrado de Cumplimiento en Seguridad**

React frontend for the SICS platform — a web application that helps Costa Rican companies evaluate their compliance with information security controls, based on **Law 8968**, **ISO 27001/27002/27005/27701**, and **NIST CSF**.


## Tech stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + Vite 6 |
| Language | TypeScript |
| Styling | Tailwind CSS v3 |
| Routing | React Router v7 (Data mode) |
| State management | Zustand v5 |
| HTTP client | Axios |


## Quickstart

```bash
npm install
npm run dev
# App available at http://localhost:5173
# Proxy /api → http://localhost:8000 (backend must be running)
```


## Routes

| Path | Page | Auth | Role |
|------|------|------|------|
| `/` | LandingPage | No | — |
| `/registro` | RegisterPage (step 1) | Yes | company_rep |
| `/registro/paso-2` | RegisterStep2Page (step 2) | Yes | company_rep |
| `/cuestionario/:evaluationId` | QuestionnairePage | Yes | company_rep |
| `/evaluaciones` | EvaluationsPage (dashboard) | Yes | company_rep / expert |
| `/evaluaciones/:evaluationId` | ExpertEvaluationPage (review) | Yes | expert |

Route guards in `src/router/index.tsx` redirect incomplete registrations and unauthenticated users.

## User flows

### Company representative

1. Sign in with Google → register company (2 steps)
2. Complete the questionnaire (16 control groups, 30 controls)
3. Submit evaluation → wait for expert review
4. View reviewed evaluations, compliance score, and PDF report

**Dashboard (`/evaluaciones`):**
- **DraftCard** — resume an in-progress evaluation
- **SubmittedCard** — evaluation pending expert review
- **ReviewedCard** — completed evaluation with compliance ring and report download
- **New evaluation** button — creates a new evaluation when no draft or submitted evaluation exists

### Expert

1. Sign in → inbox at `/evaluaciones`
2. Filter by status (pending / reviewed) and sector
3. Review each control group, issue verdicts, preview evidence
4. Finalize review → triggers PDF report generation in background
5. View or regenerate report from the inbox

## Project structure

```
src/
├── assets/
├── components/
│   ├── ui/              Button, Input, Select, Textarea, Card, Badge, Avatar,
│   │                    ConfirmDialog, Combobox, Pagination, Toast, InfoBanner, Icons
│   ├── layout/          Header, StepBreadcrumb, StepHeader, PageLayout
│   └── shared/          GroupSidebar, GroupHeader, ControlCardMeta
├── features/
│   ├── auth/            Google login, registration hooks
│   ├── company/         Company registration forms and catalogs
│   ├── questionnaire/   Control cards, evidence upload, group navigation
│   └── evaluations/     Dashboards, expert review, report preview, compliance display
├── hooks/
├── lib/api/             client.ts, auth.ts, companies.ts, controls.ts, evaluations.ts, geography.ts
├── pages/               LandingPage, RegisterPage, RegisterStep2Page, QuestionnairePage,
│                        EvaluationsPage, ExpertEvaluationPage
├── router/              index.tsx (createBrowserRouter)
├── store/               authStore, registerStore, evaluationStore, toastStore
├── styles/              globals.css (Tailwind + CSS vars)
└── types/               auth.ts, company.ts, controls.ts, evaluation.ts, geography.ts
```

### Key evaluation components

| Component | Purpose |
|-----------|---------|
| `CompanyEvaluationsDashboard` | Company inbox: draft, submitted, reviewed cards |
| `ExpertEvaluationsDashboard` | Expert inbox with filters and pagination |
| `DraftCard` | Resume in-progress evaluation |
| `ReviewedCard` | Reviewed evaluation with compliance ring and report button |
| `ExpertEvaluationRow` | Expert inbox row with review/report actions |
| `ExpertReviewHeader/Footer` | Expert review page chrome |
| `ComplianceScore` | SVG ring with color band (red/amber/green) |
| `ReportPreviewModal` | In-app PDF preview and download |
| `VerdictBadge` / `ExpertVerdictSelector` | Colored expert verdict UI |

### Utility modules

- `complianceDisplay.ts` — compliance band colors and labels
- `verdictDisplay.ts` — verdict colors and labels
- `expertReview.ts` — group completion and verdict logic


## Global state (Zustand)

```ts
useAuthStore()       // user, token, refreshToken, flow, isAuthenticated
useRegisterStore()   // companyId, step1Data (cleared after registration)
useEvaluationStore() // activeEvaluationId, currentGroupId, evaluations
useToastStore()      // toastInfo, toastError, toastSuccess
```

Persisted in localStorage: `sics-auth`, `sics-register`.


## Design tokens (Tailwind)

```
primary          #1d4ed8   CTA blue
surface-bg       #faf8f4   page background
surface          #ffffff   cards
surface-alt      #f0ede7   secondary sections
border           #ddd8ce   borders
text-primary     #1a1a2e   main text
text-secondary   #6b6b80   secondary text
text-muted       #9a9aaa   muted text
teal             #0d9488   success / completed steps
amber            #f59e0b   warning / pending review
```

Typography: `font-display` = Fraunces · `font-sans` = DM Sans


## Conventions

- API calls always through `src/lib/api/` — never axios directly in components
- Page components are thin wrappers; business logic lives in `features/` hooks
- Types in `src/types/` are the source of truth; `features/*/types.ts` re-export only
- Reuse existing UI components from `src/components/ui/` before creating new ones


## Related repository

- [SICS Backend](https://github.com/JoshuaEA54/SICS-Backend) — FastAPI + PostgreSQL API

## License

This project is licensed under the **Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)** license.

You may view and study the source code. **Commercial use of any part of this project requires explicit written authorization from the author.**

See [LICENSE](LICENSE) for full terms.

&copy; 2026 Joshua Elizondo Abarca · [github.com/JoshuaEA54](https://github.com/JoshuaEA54)
