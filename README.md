# AEGIS — Autonomous Multi-Agent Intelligence War Room

> **AI-driven Early Warning Intelligence & Strategic Decision Support System**  
> *Final Year B.Tech Computer Science Project*  
> **Authors:** Shlok Noval (Lead AI Architect) & Aditya (Lead Platform Engineer)

---

## 1. System Overview

**AEGIS** is an orchestrator-led multi-agent intelligence platform engineered to produce transparent, evidence-grounded strategic briefs. Unlike single-LLM pipelines that output unverified summaries, AEGIS deploys a coordinated swarm of specialized AI operatives that independently gather open-source intelligence (OSINT), financial data, and geopolitical developments, self-challenge conclusions through multi-round adversarial debate, and quantify per-claim confidence.

### Core Architecture Pillars
1. **Multi-Agent Specialization:** Specialized agents (**Recon**, **Financial**, and **Geopolitical**) with domain-tailored tools (DuckDuckGo, SEC Edgar, yfinance, GDELT, RSS).
2. **Adversarial Self-Validation:** A dedicated **Devil's Advocate** agent that decomposes claims, searches for contradicting evidence across trusted sources, and enforces revisions.
3. **Hybrid GraphRAG:** Fused retrieval combining vector semantic similarity (**ChromaDB**) with multi-hop relational knowledge graph traversal (**Neo4j**).
4. **Confidence Quantification Engine:** Algorithmic trust scoring based on supporting evidence, source credibility tiers (Tiers 1–3), and challenge survival rates.
5. **Defense-Grade War Room UI:** Tactical command center dashboard with live execution telemetry, interactive Knowledge Graph visualizer, evidence inspector, and dossier exports.

---

## 2. Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, shadcn/ui primitives.
- **Backend API:** FastAPI, Uvicorn, WebSockets, Python 3.10+.
- **Multi-Agent Orchestration:** LangGraph state machine, asyncio concurrent dispatch.
- **AI Models:** Google Gemini 1.5 Flash (high-throughput agents) & Gemini 1.5 Pro (reasoning & synthesis) via Vertex AI.
- **Vector Database:** ChromaDB (embedded persistent storage).
- **Knowledge Graph:** Neo4j Community Edition (Dockerized) + spaCy NER.
- **Application DB & Auth:** Supabase (PostgreSQL with Row-Level Security).

---

## 3. Quick Start Guide

### Prerequisites
- Python 3.10 or higher
- Node.js 20 or higher
- Docker & Docker Compose (for Neo4j)

### Step 1: Clone and Configure Environment
```bash
git clone https://github.com/ShlokNoval/AEGIS.git
cd AEGIS
cp .env.example .env
```
Ensure your `.env` contains:
```env
GOOGLE_CLOUD_PROJECT=your-gcp-project
GOOGLE_APPLICATION_CREDENTIALS=backend/gcp-key.json
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-supabase-service-key
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=password
```

### Step 2: Ingest the Strategic Intelligence Corpus
The repository includes 4 realistic strategic dossiers in `data/documents/` covering semiconductor export controls, the EU AI Act, critical mineral supply chains, and the Taiwan Strait maritime corridor.

Run the automated GraphRAG ingestion script:
```bash
# From project root:
python backend/scripts/ingest_corpus.py
```
This chunks each dossier, computes vector embeddings, stores them in ChromaDB, and extracts entities via spaCy NER into Neo4j.

### Step 3: Run the FastAPI Backend
```bash
cd backend
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On Unix:
source .venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
API Documentation will be accessible at `http://localhost:8000/docs`.

### Step 4: Run the React War Room UI
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser to enter the AEGIS War Room.

---

## 4. Operational Demo Scenarios

The AEGIS Operation Center includes 4 preset high-value intelligence scenarios ready for one-click deployment:
- **Scenario A: Multilateral Lithography & Packaging Chokepoints** — ASML immersion DUV restrictions, Chinese sub-7nm foundry limits, and NVIDIA H20 accelerator substitution.
- **Scenario B: EU AI Act High-Risk Governance** — Compliance exposure for cloud hyperscalers under Regulation 2024/1689 Annex III.
- **Scenario C: Gallium & Germanium Dual-Use Export Bans** — Defense radar avionics supply chain impacts and secondary scrap mitigation.
- **Scenario D: Taiwan Strait Maritime Trade Disruption** — Container routing diversions and Lloyd's war-risk insurance premium spikes.

---

## 5. Repository Structure

```
AEGIS/
├── backend/
│   ├── app/
│   │   ├── agents/          # Recon, Financial, Geopolitical, Devil's Advocate, Synthesis
│   │   ├── orchestrator/    # LangGraph StateGraph workflow & routing
│   │   ├── retrieval/       # Chunking, Embeddings, ChromaDB, Neo4j Graph, Hybrid Fusion
│   │   ├── confidence/      # Per-claim and global confidence engine
│   │   ├── database/        # Supabase PostgreSQL client & query logging
│   │   ├── shared/          # Pydantic schemas, constants, WebSocket manager
│   │   └── main.py          # FastAPI application, REST endpoints & WebSockets
│   └── scripts/
│       └── ingest_corpus.py # Production GraphRAG ingestion pipeline
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

## 6. License & Academic Citation
Developed for final-year engineering capstone presentation. All rights reserved.
