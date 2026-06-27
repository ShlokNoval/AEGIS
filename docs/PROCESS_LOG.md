# AEGIS — Process Log

> **Purpose:** Living log of all actions, decisions, and analysis performed by the AI assistant.
> **If conversation context is lost, read this file first to resume from the latest state.**

---

## Session 1 — 2026-06-26

### Documents Analyzed

| Document | File | Size | Status |
|----------|------|------|--------|
| AEGIS Technical Architecture | `AEGIS TECHNICAL FLOW UPDATED.pdf` | 165 KB, 517 lines extracted | ✅ Fully Read |
| Team Roles & Responsibilities | `AEGIS_Team_Roles_and_Responsibilities.pdf` | 4.2 KB, 44 lines extracted | ✅ Fully Read |

### Extracted Text Files (for reference)
- `AEGIS_TECHNICAL_FLOW.txt` — full text extraction of the technical architecture PDF
- `AEGIS_TEAM_ROLES.txt` — full text extraction of the team roles PDF

---

### Phase Progression Tracker

| Phase | Description | Status | Document Created |
|-------|-------------|--------|-----------------|
| Phase 0 | Architecture Review | ✅ Complete | `docs/ARCHITECTURE_REVIEW.md` |
| Phase 1 | Repository Design & Git Workflow | ✅ Complete | `docs/GIT_WORKFLOW.md` |
| Phase 2 | Master Implementation Plan | ✅ Complete | `docs/IMPLEMENTATION_PLAN.md` |
| Phase 3 | Ownership Mapping | ✅ Complete | `docs/TEAM_OWNERSHIP.md` |
| Phase 4 | Development Roadmap | ✅ Complete | `docs/ROADMAP.md` |
| Phase 5 | Development Preparation | ✅ Complete | `docs/PROJECT_DECISIONS.md` |
| Coding | Milestone 1 - Foundation | ✅ Complete | Repository, Docker, Schemas, Skeletons |
| Coding | Milestone 2 - RAG Pipeline & Backend | ⏳ Ready to Start | — |

---

### Key Decisions Locked In

| # | Decision | Choice |
|---|----------|--------|
| 1 | Architecture | Monolithic FastAPI |
| 2 | LLM | Gemini 1.5 Flash + Pro (Vertex AI, $1,000 credits) |
| 3 | App DB + Auth | Supabase (free tier) |
| 4 | Vector DB | ChromaDB (embedded) |
| 5 | Graph DB | Neo4j Community (Docker) |
| 6 | Frontend | React + Vite |
| 7 | WebSocket | FastAPI native |
| 8 | Orchestration | LangGraph |
| 9 | Search | DuckDuckGo (free) |
| 10 | Financial Data | yfinance (free) |
| 11 | Geopolitical Data | GDELT + RSS (free) |
| 12 | NER | spaCy (primary) + Gemini (fallback) |
| 13 | Embeddings | Vertex AI text-embedding-005 |
| 14 | Deployment | Docker Compose only |
| 15 | CI/CD | GitHub Actions |
| 16 | DA Max Rounds | 2 rounds + 60s timeout |
| 17 | UI Framework | Shadcn/ui + Tailwind CSS |

### Budget Summary
- **Total budget:** $0 + $1,000 GCP Vertex AI credits
- **Estimated cost per query:** ~$0.011
- **Estimated runway:** ~90,000 queries
- **Credit expiry:** April 12, 2027

### Resolved Questions (Session 2)
- **Q17:** Deadline is **~2 months from now (end of August 2026)**
- **Q22:** Machine specs: **GTX 1650Ti, 16GB RAM, Intel i5 10th gen** — sufficient for Docker + Neo4j + ChromaDB; GPU not needed (LLMs run on Vertex AI cloud)

---

### Documents Created

| File | Description |
|------|-------------|
| `docs/ARCHITECTURE_REVIEW.md` | Full architecture analysis with resolved questions |
| `docs/GIT_WORKFLOW.md` | Branch strategy, PR process, commit conventions, repo structure |
| `docs/IMPLEMENTATION_PLAN.md` | 23-section master blueprint (permanent source of truth) |
| `docs/TEAM_OWNERSHIP.md` | Clear ownership map for Shlok and Aditya |
| `docs/ROADMAP.md` | 6-milestone development roadmap with parallel tracks |
| `docs/PROJECT_DECISIONS.md` | 15 major decisions with full rationale |
| `docs/Project_explanation.md` | Full project workflow, tech stack, and concepts explained in plain language |
| `docs/PROCESS_LOG.md` | This file — living process tracker |

---

### Next Steps
1. User provides prompt for the next session.
2. Begin coding **Milestone 2: RAG Pipeline & Basic Backend**:
   - Vertex AI embedding client
   - ChromaDB integration
   - Document ingestion pipeline
   - Recon Agent (v1)
   - FastAPI `/api/query` endpoint
