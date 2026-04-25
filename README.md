# SICS — Frontend

> **Sistema Integrado de Cumplimiento en Seguridad**

React frontend for the SICS platform — a web application that helps Costa Rican companies evaluate their compliance with information security controls, based on **Law 8968**, **ISO 27001/27002/27005/27701**, and **NIST CSF**.

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + Vite 6 |
| Language | TypeScript |
| Styling | Tailwind CSS v3 |
| Routing | React Router v7 (Data mode) |
| State management | Zustand v5 |
| HTTP client | Axios |

---

## Quickstart

```bash
npm install
npm run dev
# App available at http://localhost:5173
# Proxy /api → http://localhost:8000 (backend must be running)
```

---

## Project structure

```
src/
├── components/
│   ├── ui/          # Button, Input, Select, Textarea, Card, Badge, Avatar
│   └── layout/      # Header, StepBreadcrumb, PageLayout
├── features/
│   ├── auth/
│   ├── company/
│   ├── questionnaire/
│   └── evaluations/
├── lib/api/         # API client and endpoint functions
├── pages/           # LandingPage, RegisterPage, QuestionnairePage, EvaluationsPage
├── router/          # createBrowserRouter config
├── store/           # authStore, evaluationStore (Zustand)
└── types/           # Shared TypeScript types
```

---

## Related repository

- [SICS Backend](https://github.com/JoshuaEA54/SICS-Backend) — FastAPI + PostgreSQL API

---

## License

This project is licensed under the **Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)** license.

You may view and study the source code. **Commercial use of any part of this project requires explicit written authorization from the author.**

See [LICENSE](LICENSE) for full terms.

&copy; 2026 Joshua Elizondo Abarca · [github.com/JoshuaEA54](https://github.com/JoshuaEA54)
