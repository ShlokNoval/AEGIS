# AEGIS — Autonomous Multi-Agent Intelligence War Room

> **AI-driven Early Warning Intelligence & Strategic Decision Support System**  
> *Final Year B.Tech Computer Science Project*  
> **Authors:** Shlok Noval (Lead AI Architect) & Aditya (Lead Platform Engineer)

---

## 1. Executive System Overview

**AEGIS** is an orchestrator-led multi-agent intelligence platform engineered to produce transparent, evidence-grounded strategic briefs with **multi-horizon predictive outcome forecasting**. Unlike single-LLM chatbots that output opaque, unverified text, AEGIS deploys a coordinated swarm of specialized AI operatives that independently gather open-source intelligence (OSINT), financial capital market dynamics, and geopolitical directives, self-challenge conclusions through multi-round adversarial debate, and quantify per-claim confidence.

### Core Architecture Pillars
1. **Multi-Agent Specialization:** Specialized agents (**Recon**, **Financial**, and **Geopolitical**) with domain-tailored tools (DuckDuckGo, SEC Edgar, yfinance live market quotes, GDELT, RSS).
2. **Adversarial Self-Validation:** A dedicated **Devil's Advocate** agent that decomposes claims, searches for contradicting empirical evidence (stockpiles, recycling, alternative routing, diplomatic waivers), and enforces revisions.
3. **Multi-Horizon Predictive Forecasting:** A specialized **Synthesis Engine** that generates 3 probability-weighted scenarios (*Baseline*, *Escalation*, *Mitigation*), a 30/90/180-day timeline horizon impact progression, and actionable strategic countermeasures.
4. **Dual-Mode LLM Engine:** Native integration with Google Gemini 1.5 Pro (reasoning & synthesis) and Gemini 1.5 Flash (high-throughput agents) via Vertex AI / `GEMINI_API_KEY`, backed by an intelligent local semantic intelligence fallback for 100% offline demo resilience.
5. **Hybrid GraphRAG:** Fused retrieval combining vector semantic similarity (**ChromaDB**) with multi-hop relational knowledge graph traversal (**Neo4j**).
6. **Confidence Quantification Engine:** Algorithmic trust scoring based on supporting evidence, source credibility tiers (Tiers 1–3), and challenge survival rates.
7. **Defense-Grade War Room UI:** Tactical command center dashboard with live execution telemetry, interactive Knowledge Graph visualizer, evidence citation drawer, and one-click dossier exports.

---

## 2. Complete Tech Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                     USER'S BROWSER                              │
│   React 19 + TypeScript + Vite + Tailwind CSS + Lucide Icons    │
│   ┌──────────┐ ┌──────────────┐ ┌───────────────────────────┐  │
│   │ Command  │ │ LangGraph    │ │ Strategic Dossier +       │  │
│   │ Deck UI  │ │ Telemetry    │ │ Predictive Scenario Matrix│  │
│   └────┬─────┘ └──────▲───────┘ └────────────▲──────────────┘  │
│        │ REST          │ WebSocket            │ REST             │
└────────┼───────────────┼─────────────────────┼──────────────────┘
         │               │                      │
┌────────▼───────────────┼──────────────────────┼──────────────────┐
│              FASTAPI BACKEND (Python 3.10+)                      │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  LangGraph Multi-Agent Orchestrator                        │  │
│  │  ┌─────────┐ ┌──────────┐ ┌─────────────┐                │  │
│  │  │  Recon  │ │Financial │ │Geopolitical │  ← Parallel     │  │
│  │  │ (Flash) │ │ (Flash)  │ │  (Flash)    │    Dispatch     │  │
│  │  └────┬────┘ └────┬─────┘ └──────┬──────┘                │  │
│  │       └───────────┬───────────────┘                        │  │
│  │          ┌────────▼─────────┐                              │  │
│  │          │Devil's Advocate  │ ← Gemini 1.5 Pro            │  │
│  │          │(Adversarial Loop)│   (Counter-evidence audit)   │  │
│  │          └────────┬─────────┘                              │  │
│  │          ┌────────▼─────────┐                              │  │
│  │          │Synthesis Engine  │ ← Gemini 1.5 Pro            │  │
│  │          │& Outcome Predictor                              │  │
│  │          └────────┬─────────┘                              │  │
│  │          ┌────────▼─────────┐                              │  │
│  │          │Confidence Engine │                              │  │
│  │          └──────────────────┘                              │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐  ┌───────────────┐  │
│  │ ChromaDB │  │  Neo4j   │  │ Supabase  │  │ Live Feeds:   │  │
│  │(embedded)│  │ (Docker) │  │(PostgreSQL│  │DuckDuckGo     │  │
│  │Vector DB │  │ Graph DB │  │  + Auth)  │  │yfinance live  │  │
│  └──────────┘  └──────────┘  └───────────┘  │GDELT, BIS     │  │
│                                              └───────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, Radix UI.
- **Backend API:** FastAPI, Uvicorn, WebSockets, Python 3.10+.
- **Multi-Agent Orchestration:** LangGraph state machine, asyncio concurrent dispatch.
- **AI Models:** Google Gemini 1.5 Flash (operatives) & Gemini 1.5 Pro (synthesis & DA) via Vertex AI / Google Generative AI.
- **Vector Database:** ChromaDB (embedded persistent vector storage).
- **Knowledge Graph:** Neo4j Community Edition (Dockerized) + spaCy NER.
- **Application DB & Auth:** Supabase (PostgreSQL with Row-Level Security).

---

## 3. Step-by-Step Execution Guide (All Components)

### Prerequisites
- **Python 3.10** or higher
- **Node.js 20** or higher
- **Docker Desktop** (optional, for live Neo4j)

---

### Step 1: Clone & Configure Environment Variables
```bash
git clone https://github.com/ShlokNoval/AEGIS.git
cd AEGIS
```

Configure your environment in `backend/.env` (or copy `.env.example`):
```env
# Google Cloud (Vertex AI & Gemini API)
# Paste your Gemini API key or Vertex AI Key below:
GEMINI_API_KEY=your_gemini_api_key_here
GOOGLE_CLOUD_PROJECT=annadaauth1
GOOGLE_APPLICATION_CREDENTIALS=./gcp-key.json

# Neo4j Graph Database
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=AEGIS-FINALYEAR2027

# Supabase PostgreSQL (Persistence)
SUPABASE_URL=https://jujtzfezchuiewebfjme.supabase.co
SUPABASE_SERVICE_KEY=your_supabase_service_key
SUPABASE_ANON_KEY=your_supabase_anon_key
```

> **Note:** If `GEMINI_API_KEY` is not provided, AEGIS automatically activates its internal analytical semantic intelligence engine, allowing the entire system to run 100% offline with zero errors.

---

### Step 2: (Optional) Launch Neo4j Graph Database
If you have Docker Desktop installed and want live Cypher query support:
```bash
docker-compose up -d neo4j
```
*If Docker is not running, AEGIS automatically serves the embedded 164-entity corpus graph without throwing any errors.*

---

### Step 3: Launch the FastAPI Backend
Open **Terminal 1**:
```bash
cd backend
# Windows:
python -m venv .venv
.venv\Scripts\activate
# Linux/macOS:
# source .venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
- **Backend Health Check:** `http://localhost:8000/health`
- **Interactive Swagger Docs:** `http://localhost:8000/docs`

---

### Step 4: Launch the React War Room UI
Open **Terminal 2**:
```bash
cd frontend
npm install
npm run dev
```
- Open your browser to `http://localhost:5173` to access the War Room command center.

---

## 4. Automated Testing & Verification

Run the comprehensive automated test suites to verify system integrity before demonstrations:

### Run Pytest Engine Test Suite
```bash
python -m pytest backend/tests/ -v
```
**Expected Output:**
```
backend/tests/test_engine.py::test_confidence_engine_scoring PASSED      [ 33%]
backend/tests/test_engine.py::test_global_confidence_metrics PASSED      [ 66%]
backend/tests/test_engine.py::test_workflow_execution PASSED             [100%]
======================== 3 passed in 7.86s ========================
```

### Run End-to-End Multi-Scenario Validation
```bash
python backend/test_scenarios.py
```
Validates all 4 primary intelligence scenarios, printing 3 predictive outcome scenarios for each.

### Run Frontend Production Build & Linting
```bash
cd frontend
npm run build
npm run lint
```
Verifies zero TypeScript, CSS, or bundle errors.

---

## 5. Operational Demo Scenarios

The AEGIS Operation Center includes 4 preset high-value intelligence scenarios ready for one-click deployment:
- **Scenario 1: Multilateral Lithography & Packaging Chokepoints** — ASML immersion DUV restrictions, Chinese sub-7nm foundry limits, and NVIDIA H20 accelerator substitution.
- **Scenario 2: EU AI Act High-Risk Governance** — Compliance exposure for cloud hyperscalers under Regulation 2024/1689 Annex III.
- **Scenario 3: Gallium & Germanium Dual-Use Export Bans** — Defense radar avionics supply chain impacts and secondary scrap mitigation.
- **Scenario 4: Taiwan Strait Maritime Trade Disruption** — Container routing diversions and Lloyd's war-risk insurance premium spikes.
- **Arbitrary Queries:** Users can also type any custom question into the input bar (e.g. *"What will happen if oil shipping through the Strait of Hormuz is disrupted?"*).

---

## 6. Viva Presentation & PPT Guide (Role Distribution)

Per `docs/TEAM_OWNERSHIP.md`, use this slide and presentation breakdown:

### Shlok Noval — Lead AI Architect
1. **LangGraph Multi-Agent State Machine:**
   - Parallel agent dispatch via `asyncio.gather`.
   - Typed state dictionary (`OrchestratorState`).
   - Conditional routing (`should_continue`) controlling the debate loop.
2. **Specialist Domain Operatives:**
   - **Recon Agent:** Live DuckDuckGo OSINT + ChromaDB vector search.
   - **Financial Agent:** Dynamic ticker resolution (`NVDA`, `TSM`, `ASML`, `CL=F`, `GC=F`, `LMT`, `ITA`, `SPY`) + live `yfinance` quote telemetry.
   - **Geopolitical Agent:** Dynamic policy searches + statutory RAG.
3. **Devil's Advocate Adversarial Loop:**
   - Evaluates assumptions (stockpiles, scrap recycling, alternative routing, waivers).
   - Generates targeted challenges and triggers agent re-runs (`challenge_review`).
4. **Predictive Outcome Forecasting:**
   - Multi-horizon scenarios: Baseline (65%), Escalation (25%), Mitigation (10%).
   - 30-Day, 90-Day, and 180-Day strategic horizon outlooks.
5. **Confidence Engine Mathematics:**
   - Formula: $\text{Confidence} = \text{Base} + \alpha(\text{support} - \text{contradict}) + \beta(\text{challenge\_survived})$.
   - Global metrics: Evidence richness, consensus score, DA survival rate.

### Aditya — Lead Platform Engineer
1. **Defense War Room React UI:**
   - Threat HUD ticker (`DEFCON 3`), military UTC clock, swarm parameter dials.
   - Live visual DAG pipeline progression and filterable telemetry stream.
   - Interactive Evidence Citation Inspector drawer and one-click Markdown export.
2. **API & Real-Time Streaming Architecture:**
   - FastAPI REST endpoints (`/api/query`, `/api/query/{id}`, `/api/history`, `/api/graph/subgraph`).
   - WebSocket streaming handler (`/ws/{query_id}`).
3. **Database & Infrastructure:**
   - Supabase PostgreSQL schema with Row-Level Security (RLS).
   - Docker containerization (`docker-compose.yml`) for Neo4j and backend.
   - GitHub Actions CI/CD workflows for automated linting and test runs.

---

## 7. Repository Structure

```
AEGIS/
├── backend/
│   ├── app/
│   │   ├── agents/          # Recon, Financial, Geopolitical, Devil's Advocate, Synthesis
│   │   ├── orchestrator/    # LangGraph StateGraph workflow & routing
│   │   ├── retrieval/       # Chunking, Embeddings, ChromaDB, Neo4j Graph, Hybrid Fusion
│   │   ├── confidence/      # Per-claim and global confidence engine
│   │   ├── database/        # Supabase PostgreSQL client & query logging
│   │   ├── shared/          # Pydantic schemas, constants, llm.py, WebSocket manager
│   │   └── main.py          # FastAPI application, REST endpoints & WebSockets
│   ├── scripts/
│   │   └── ingest_corpus.py # Production GraphRAG ingestion pipeline
│   ├── tests/
│   │   └── test_engine.py   # Pytest test suite
│   ├── test_scenarios.py    # Multi-scenario validation script
│   └── test_workflow.py     # End-to-end workflow test
├── data/
│   └── documents/           # Curated intelligence dossiers (.txt)
├── docs/                    # Master implementation plan, decisions log, and architecture
├── frontend/
│   ├── src/
│   │   ├── components/      # Tactical layout, AgentCard, ConfidenceBadge, LoadingSpinner
│   │   ├── pages/           # Dashboard, QueryExecution, Results, KnowledgeGraph, History, AgentConfig
│   │   ├── services/        # Typed API & Supabase clients
│   │   └── hooks/           # WebSocket real-time agent streaming hooks
│   └── package.json
├── docker-compose.yml       # Multi-service container definitions
└── README.md
```

---

## 8. License & Academic Citation
Developed for final-year engineering capstone presentation. All rights reserved.
