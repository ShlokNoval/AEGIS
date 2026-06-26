# AEGIS — Project Explanation

> **For:** Team members, faculty reviewers, viva preparation, and anyone who needs to understand the project quickly
> **Last Updated:** 2026-06-26

---

## What is AEGIS?

**AEGIS** stands for **AI-driven Early Warning Intelligence System**.

Imagine you're a strategic analyst and you need to answer a complex question like:

> *"What would be the impact of new EU AI regulations on US tech companies, considering both financial markets and geopolitical tensions?"*

Today, answering this requires hours of manual research across multiple domains — reading news articles, analyzing stock data, studying policy documents, cross-referencing sources, and synthesizing everything into a coherent brief.

**AEGIS automates this entire process using a team of AI agents that work together, challenge each other, and produce a transparent, confidence-scored intelligence brief in under 60 seconds.**

---

## The Problem We're Solving

Traditional AI chatbots (ChatGPT, Claude, etc.) have fundamental limitations for intelligence analysis:

| Problem | Description |
|---------|-------------|
| **Single perspective** | One LLM gives one opinion — no cross-validation |
| **No source tracking** | You can't verify where information came from |
| **Hallucination risk** | AI confidently states incorrect information |
| **No confidence measure** | You don't know how much to trust the answer |
| **No adversarial testing** | Nobody challenges the AI's claims |
| **Opaque reasoning** | You can't see how the AI reached its conclusion |

**AEGIS solves all of these** by replacing a single AI with a coordinated **team of specialized AI agents** that research, debate, challenge, and score their own work.

---

## How Does AEGIS Work? (The Workflow)

Here's exactly what happens when a user submits a query, step by step:

### Step 1: User Submits a Query
The user types a strategic question into the AEGIS dashboard, for example:
> *"Analyze the impact of semiconductor export controls on the global chip supply chain"*

The query is sent from the **React frontend** to the **FastAPI backend** via a REST API call.

### Step 2: The Orchestrator Takes Over
The **LangGraph Orchestrator** (the "brain" of AEGIS) receives the query and:
1. Decomposes it into **subtasks** — one for each specialist agent
2. Creates a WebSocket channel to stream live updates to the user
3. Dispatches all agents **simultaneously** (in parallel) for speed

```
User Query: "Impact of semiconductor export controls"
  │
  ├── Subtask 1 → Recon Agent: "Gather OSINT on export control policies"
  ├── Subtask 2 → Financial Agent: "Analyze semiconductor stock impacts"
  └── Subtask 3 → Geopolitical Agent: "Map country positions and alliances"
```

### Step 3: Agents Gather Intelligence (In Parallel)

Three specialized agents work **simultaneously**, each with their own data sources and expertise:

#### 🔍 Recon Agent (Intelligence Reconnaissance)
- **What it does:** Searches the open web and official filings for relevant information
- **Data sources:**
  - **DuckDuckGo** — free web search for latest news and articles
  - **SEC Edgar** — official US government financial filings (free)
  - **ChromaDB (RAG)** — searches a pre-loaded knowledge base of documents using AI similarity matching
  - **Neo4j (GraphRAG)** — traverses a knowledge graph of entities and relationships
- **Output:** A list of claims with source citations

#### 💰 Financial Agent
- **What it does:** Analyzes market data and financial implications
- **Data sources:**
  - **Yahoo Finance (yfinance)** — free stock prices, company financials, market data
  - **ChromaDB (RAG)** — retrieves relevant financial news and analysis documents
  - **Neo4j (GraphRAG)** — queries company relationships, supply chains, sector data
- **Output:** Financial analysis with market data and citations

#### 🌍 Geopolitical Agent
- **What it does:** Analyzes political dynamics, policy implications, and international relations
- **Data sources:**
  - **GDELT** — the world's largest free database of global events, updated every 15 minutes
  - **RSS feeds** — major news outlet feeds for breaking news
  - **ChromaDB (RAG)** — retrieves relevant policy documents and analysis
  - **Neo4j (GraphRAG)** — queries geopolitical actor relationships, sanctions, alliances
- **Output:** Geopolitical analysis with policy context and citations

> **Key insight:** These agents don't just ask an AI to guess — they **retrieve real evidence** from databases and the web, then use AI to reason over that evidence.

### Step 4: Devil's Advocate Challenges Everything

This is what makes AEGIS unique. After all agents submit their findings, the **Devil's Advocate Agent** reviews every single claim:

```
For each claim from every agent:
  1. Break the claim into assumptions
  2. Search for counter-evidence (from different sources)
  3. If a valid contradiction is found:
     → Flag the claim as challenged
     → Send the challenged agent back to revise its work
  4. The revised claim is re-checked
  5. This can repeat up to 2 rounds maximum
```

**Example:**
- Financial Agent claims: *"NVIDIA stock will drop 15% due to export controls"*
- Devil's Advocate finds: *SEC filing shows NVIDIA has already diversified supply chains* (Tier 1 source)
- Financial Agent is re-run with this objection → produces a revised, more nuanced claim

The user sees this debate happening **live** on their screen via WebSocket streaming.

### Step 5: Synthesis Agent Compiles the Brief

Once all claims have survived (or been revised through) the adversarial challenge:

- The **Synthesis Agent** collects all validated evidence from all agents
- It composes a structured **strategic intelligence brief** in formal analyst tone
- Every statement includes source citations with trust tiers
- The brief follows a professional format: Executive Summary → Key Findings → Detailed Analysis → Risk Assessment

### Step 6: Confidence Engine Scores Everything

The **Confidence Engine** calculates trust metrics for the entire brief:

| Metric | What It Measures | Example |
|--------|-----------------|---------|
| **Claim Confidence** | How confident we are in each individual claim | 0.87 (87%) |
| **Global Score** | Overall answer confidence | 0.82 (82%) |
| **Evidence Richness** | How many sources back the answer | 3.2 sources/claim |
| **Consensus Score** | How much agents agree with each other | 0.78 (78%) |
| **Challenge Survival Rate** | % of claims that survived Devil's Advocate | 0.85 (85%) |

These scores are **not arbitrary** — they're calculated using a formula based on:
- Number of supporting vs. contradicting sources
- Trust tier of each source (government filings > news > blogs)
- Whether the claim survived adversarial challenge
- How many agents independently reached similar conclusions

### Step 7: User Sees the Result

The final output appears on the dashboard with:
- ✅ A professional strategic brief with sections and citations
- ✅ Real-time log of which agents ran and what they found
- ✅ Which claims were challenged and how they were revised
- ✅ Confidence scores for every claim and the overall answer
- ✅ Source citations with trust tier badges (Tier 1 🟢, Tier 2 🟡, Tier 3 🔴)

---

## What Makes AEGIS Special?

### vs. ChatGPT / Claude / Regular AI

| Feature | ChatGPT | AEGIS |
|---------|---------|-------|
| Multiple specialized agents | ❌ Single model | ✅ 5 agents with different expertise |
| Source citations with trust tiers | ❌ Often fabricates | ✅ Every claim has verified sources |
| Self-challenging (adversarial) | ❌ No self-critique | ✅ Devil's Advocate challenges every claim |
| Confidence scoring | ❌ No confidence measure | ✅ Per-claim and global confidence scores |
| Knowledge graph reasoning | ❌ Text only | ✅ Neo4j graph for entity relationships |
| Real-time transparency | ❌ Black box | ✅ Watch agents work live via WebSocket |
| Evidence retrieval (RAG) | ❌ Training data only | ✅ Searches real databases and web |

### Key Technical Innovations

1. **Hybrid RAG + GraphRAG** — Combines traditional vector similarity search (ChromaDB) with knowledge graph traversal (Neo4j) for richer context retrieval
2. **Adversarial Self-Validation** — The only system that automatically challenges its own conclusions before presenting them
3. **Source Trust Framework** — Tiered credibility scoring where government filings rank higher than blog posts
4. **Confidence Quantification** — Mathematical formulas that turn qualitative trust into quantifiable scores

---

## The Technology Stack

### Complete Stack Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     USER'S BROWSER                              │
│                                                                  │
│   React + Vite + Shadcn/ui + Tailwind CSS                       │
│   ┌──────────┐ ┌──────────────┐ ┌───────────────────────────┐  │
│   │ Query UI │ │ Agent Stream │ │ Brief + Confidence Scores │  │
│   └────┬─────┘ └──────▲───────┘ └────────────▲──────────────┘  │
│        │ REST          │ WebSocket            │ REST             │
└────────┼───────────────┼─────────────────────┼──────────────────┘
         │               │                      │
┌────────▼───────────────┼──────────────────────┼──────────────────┐
│              FASTAPI BACKEND (Python)                            │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  LangGraph Orchestrator                                    │  │
│  │  ┌─────────┐ ┌──────────┐ ┌─────────────┐                │  │
│  │  │  Recon  │ │Financial │ │Geopolitical │  ← Parallel     │  │
│  │  │ (Flash) │ │ (Flash)  │ │  (Flash)    │                 │  │
│  │  └────┬────┘ └────┬─────┘ └──────┬──────┘                │  │
│  │       └───────────┬───────────────┘                        │  │
│  │          ┌────────▼─────────┐                              │  │
│  │          │Devil's Advocate  │ ← Gemini Pro (better reason.)│  │
│  │          │  (max 2 rounds)  │                              │  │
│  │          └────────┬─────────┘                              │  │
│  │          ┌────────▼─────────┐                              │  │
│  │          │Synthesis Agent   │ ← Gemini Pro                 │  │
│  │          └────────┬─────────┘                              │  │
│  │          ┌────────▼─────────┐                              │  │
│  │          │Confidence Engine │                              │  │
│  │          └──────────────────┘                              │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐  ┌───────────────┐  │
│  │ ChromaDB │  │  Neo4j   │  │ Supabase  │  │Free APIs:     │  │
│  │(embedded)│  │ (Docker) │  │ (cloud)   │  │DuckDuckGo     │  │
│  │Vector DB │  │ Graph DB │  │ DB + Auth │  │yfinance       │  │
│  └──────────┘  └──────────┘  └───────────┘  │GDELT, SEC     │  │
│                                              └───────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

### Technology Breakdown

#### 🧠 AI & Intelligence Layer (Shlok's Domain)

| Technology | What It Does | Why We Chose It |
|-----------|-------------|----------------|
| **Gemini 1.5 Flash** | Powers Recon, Financial, and Geopolitical agents | Fastest Gemini model (~2-5s response); optimized for low latency |
| **Gemini 1.5 Pro** | Powers Synthesis and Devil's Advocate agents | Superior reasoning quality for complex analysis and critique |
| **Vertex AI** | Google Cloud AI platform that hosts Gemini models | $1,000 in free credits; ~90,000 queries of runway |
| **LangGraph** | Orchestrates the multi-agent workflow as a state machine | Industry-standard for complex agent workflows with conditional routing |
| **ChromaDB** | Vector database for RAG (Retrieval-Augmented Generation) | Free, embedded mode (zero latency), handles ~1M vectors |
| **Neo4j** | Graph database for GraphRAG | Free Community Edition; Cypher queries for entity relationships |
| **spaCy** | Named Entity Recognition (NER) for graph population | Free, fast (~10ms/doc), runs offline |
| **text-embedding-005** | Converts text into numerical vectors for similarity search | Google's embedding model; covered by Vertex AI credits |

#### 🌐 Platform Layer (Aditya's Domain)

| Technology | What It Does | Why We Chose It |
|-----------|-------------|----------------|
| **React** | Frontend JavaScript framework for the dashboard UI | Largest ecosystem, component-based, excellent DevTools |
| **Vite** | Build tool for the React app | Instant hot-reload, fast builds, modern JS tooling |
| **Shadcn/ui** | Beautiful, accessible UI component library | Premium-looking components; free; copy-paste (not a dependency) |
| **Tailwind CSS** | Utility-first CSS framework for styling | Rapid development, consistent design, modern aesthetic |
| **FastAPI** | Python backend framework for REST APIs and WebSockets | Async-first, auto-docs (Swagger), built-in WebSocket support |
| **Supabase** | Cloud platform providing PostgreSQL + Auth + Realtime | Free tier: 500MB DB, built-in JWT auth, row-level security |
| **Docker Compose** | Containers for running all services together | One command to start everything; consistent across machines |
| **GitHub Actions** | CI/CD for automated linting and testing | Free for public repos; runs on every push/PR |

#### 📡 External Data Sources (All Free)

| Source | Data Type | Cost |
|--------|-----------|------|
| **DuckDuckGo** | Web search results | Free, no API key |
| **SEC Edgar** | US government financial filings | Free, no API key |
| **Yahoo Finance (yfinance)** | Stock prices, market data, company financials | Free, no API key |
| **GDELT** | Global geopolitical events (updated every 15 min) | Free, no API key |
| **RSS Feeds** | Breaking news from major outlets | Free |

---

## What is RAG? (Retrieval-Augmented Generation)

**RAG** is the technique that prevents AI from hallucinating. Instead of relying solely on training data, the AI **retrieves relevant documents first**, then uses them as context to generate an answer.

### How RAG Works in AEGIS

```
                    The AI doesn't guess — it reads real evidence first

1. INGESTION (done beforehand)
   ┌──────────────┐     ┌───────────┐     ┌─────────────┐     ┌──────────┐
   │ PDF / Text   │ ──► │  Chunk    │ ──► │  Embed      │ ──► │ ChromaDB │
   │ documents    │     │ into 500  │     │ into vectors│     │ (stored) │
   └──────────────┘     │ token pcs │     │ via Vertex  │     └──────────┘
                        └───────────┘     └─────────────┘

2. RETRIEVAL (at query time)
   ┌──────────┐     ┌───────────┐     ┌─────────────┐     ┌──────────────┐
   │ User     │ ──► │ Embed     │ ──► │ Search      │ ──► │ Top 8 most   │
   │ query    │     │ query     │     │ ChromaDB    │     │ relevant     │
   └──────────┘     └───────────┘     │ by cosine   │     │ chunks       │
                                      │ similarity  │     └──────┬───────┘
                                      └─────────────┘            │
                                                                 │
3. GENERATION                                                    ▼
   ┌─────────────────────────────────────────────────────────────────┐
   │  Gemini prompt: "Based on these documents: [chunks],           │
   │  answer: [user query]. Cite your sources."                     │
   └─────────────────────────────────────────────────────────────────┘
```

### What is GraphRAG? (Our Enhancement)

Standard RAG finds documents by **text similarity** — but misses **relationships** between entities. GraphRAG adds a knowledge graph layer:

```
Standard RAG:  "Find documents similar to 'NVIDIA export controls'"
               → Returns text chunks mentioning NVIDIA

GraphRAG:      "Find documents similar to 'NVIDIA export controls'"
               → Returns text chunks mentioning NVIDIA
               + ALSO queries Neo4j:
                 NVIDIA ──supplies_to──► Apple, Microsoft, Tesla
                 NVIDIA ──headquartered_in──► USA
                 USA ──sanctioned──► China (chip exports)
                 NVIDIA ──has_competitor──► AMD, Intel

               → The AI now has BOTH textual context AND
                 structured relationship knowledge
```

This is why AEGIS produces richer, more connected analysis than standard RAG systems.

---

## What is the Confidence Engine?

The Confidence Engine answers: **"How much should I trust this answer?"**

### Per-Claim Scoring

Every claim gets a confidence score (0% to 100%) based on:

```
confidence = base_confidence
             + 0.1 × (supporting_sources - contradicting_sources)
             + 0.2 × (survived_challenge ? +1 : -1)
```

**Example:**
| Factor | Value | Impact |
|--------|-------|--------|
| Base confidence (from agent) | 0.70 | — |
| Supported by 3 sources, contradicted by 1 | +0.2 | 3-1 = 2, × 0.1 |
| Survived Devil's Advocate challenge | +0.2 | × 0.2 |
| **Final confidence** | **0.90 (90%)** | — |

### Source Trust Tiers

Not all sources are equal. A government filing is more trustworthy than a blog post:

| Tier | Trust Score | Examples |
|------|-----------|----------|
| 🟢 **Tier 1** (Official) | 0.85 – 1.0 | Government reports, SEC filings, academic journals |
| 🟡 **Tier 2** (Major) | 0.60 – 0.84 | Reuters, Bloomberg, BBC, major think-tanks |
| 🔴 **Tier 3** (General) | 0.30 – 0.59 | Blogs, social media, opinion pieces |

---

## What Does the User See?

### The Dashboard Experience

When a user submits a query, they see:

1. **Real-time Agent Activity Panel** — Watch each agent start, search, and complete
2. **Challenge Notifications** — See when Devil's Advocate challenges a claim
3. **Strategic Brief** — Professional formatted analysis with sections
4. **Confidence Badges** — Per-claim confidence scores with color coding
5. **Source Citations** — Click to see the original source with tier badge
6. **Global Metrics** — Overall confidence, evidence richness, consensus score

### Example Output Preview

```
╔══════════════════════════════════════════════════════════╗
║  AEGIS Strategic Intelligence Brief                      ║
║  Query: "Impact of EU AI Act on US tech companies"       ║
║  Confidence: 82% 🟢                                     ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  EXECUTIVE SUMMARY                                       ║
║  The EU AI Act will significantly impact US tech...      ║
║                                                          ║
║  KEY FINDINGS                                            ║
║  ┌────────────────────────────────────────────────────┐  ║
║  │ 1. Compliance costs estimated at $5-15M per firm   │  ║
║  │    Confidence: 87% 🟢                              │  ║
║  │    Sources: EU AI Act text [Tier 1], Reuters [T2]  │  ║
║  │    ✅ Survived Devil's Advocate challenge           │  ║
║  ├────────────────────────────────────────────────────┤  ║
║  │ 2. High-risk AI systems require conformity assess. │  ║
║  │    Confidence: 92% 🟢                              │  ║
║  │    Sources: EU Official Journal [T1], NIST [T1]    │  ║
║  ├────────────────────────────────────────────────────┤  ║
║  │ 3. US tech lobbying may delay enforcement          │  ║
║  │    Confidence: 61% 🟡                              │  ║
║  │    Sources: Politico [T2], blog analysis [T3]      │  ║
║  │    ⚠️ Challenged by Devil's Advocate - revised     │  ║
║  └────────────────────────────────────────────────────┘  ║
║                                                          ║
║  AGENT ACTIVITY LOG                                      ║
║  ✅ Recon Agent: 5 claims, 3.2s                          ║
║  ✅ Financial Agent: 4 claims, 4.1s                      ║
║  ✅ Geopolitical Agent: 3 claims, 3.8s                   ║
║  ⚔️ Devil's Advocate: 2 challenges, 1 revision           ║
║  ✅ Synthesis: Brief compiled, 2.1s                      ║
║  Total time: 28s                                         ║
╚══════════════════════════════════════════════════════════╝
```

---

## Project Cost Summary

| Resource | Cost | Notes |
|----------|------|-------|
| Gemini LLM (Vertex AI) | $1,000 credits (free) | ~90,000 queries of runway |
| All other infrastructure | $0 | Everything is free-tier or open-source |
| **Total project cost** | **$0** | — |
| Est. cost per query | ~$0.011 | Well within credit budget |

---

## Project Timeline

| Weeks | Milestone | What Gets Built |
|-------|-----------|----------------|
| 1-2 | Foundation | Docker setup, shared schemas, project skeleton |
| 3-5 | RAG + Backend | ChromaDB, Recon Agent, FastAPI APIs, basic frontend |
| 5-7 | GraphRAG | Neo4j, entity extraction, hybrid retrieval |
| 7-10 | Multi-Agent | Financial + Geo agents, LangGraph orchestrator, Synthesis |
| 10-13 | Adversarial + Confidence | Devil's Advocate, confidence scoring, trust engine |
| 13-16 | Polish + Demo | Integration testing, UI polish, demo preparation |

**Deadline: ~8 weeks from now (end of August 2026)**

---

## Team Structure

| Member | Role | Owns |
|--------|------|------|
| **Shlok Noval** | Lead AI Architect | Agents, LangGraph, RAG, GraphRAG, Neo4j, Confidence Engine |
| **Aditya** | Lead Platform Engineer | Frontend, FastAPI, Supabase, Auth, WebSocket, Docker, CI/CD |
| **Both** | Shared | Integration testing, documentation, demo, final report |

---

## One-Paragraph Summary (For Presentations)

> AEGIS is a multi-agent AI intelligence system that produces transparent, evidence-grounded strategic briefs. When a user asks a complex strategic question, AEGIS dispatches three specialized AI agents (Recon, Financial, Geopolitical) in parallel to gather intelligence from web search, financial markets, and geopolitical databases. A unique Devil's Advocate agent then challenges every claim, triggering targeted re-investigations when contradictions are found. A Synthesis agent compiles the vetted evidence into a professional brief, while a Confidence Engine quantifies trust using source credibility tiers and adversarial survival rates. Built with Gemini AI (via Google Vertex AI), LangGraph orchestration, hybrid RAG+GraphRAG retrieval (ChromaDB + Neo4j), and a React dashboard with real-time WebSocket streaming, AEGIS demonstrates that AI systems can be made more trustworthy through structured self-critique and evidence transparency — all at zero external cost.
