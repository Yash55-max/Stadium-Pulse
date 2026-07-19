# StadiumPulse
### PromptWars Virtual — Challenge 4: Smart Stadiums & Tournament Operations

## Table of Contents
1. [Chosen Vertical](#chosen-vertical)
2. [Problem & Approach](#problem--approach)
3. [How the Solution Works](#how-the-solution-works)
4. [Tech Stack](#tech-stack)
5. [Setup & Run](#setup--run)
6. [Demo](#demo)
7. [Assumptions](#assumptions)
8. [Known Limitations / Roadmap](#known-limitations--roadmap)
9. [Security Notes](#security-notes)
10. [Team](#team)

## 1. Chosen Vertical
Smart Stadiums & Tournament Operations for the FIFA World Cup 2026. We built both a Fan Assistant and an Ops Dashboard, focused on providing navigation, accessibility, and multilingual support for fans, coupled with live crowd-based decision support for operations staff.

## 2. Problem & Approach
Modern stadiums often struggle with static signage, fragmented fan communication, and reactive crowd management during massive events like the World Cup. Our solution addresses this by deploying a generative AI-powered Fan Assistant that routes intent and answers queries dynamically, and an Ops Dashboard that monitors live data. We grounded our large language models in structured tool outputs and deterministic venue graphs, ensuring that responses are factual and hallucinations are mitigated rather than relying on free generation.

## 3. How the Solution Works
- **Fan Assistant:** A chat widget that acts as an orchestrator agent. It classifies user intent, calls appropriate tools (like navigation or incident reporting), and mirrors the fan's language to provide a tailored response.
- **Ops Dashboard:** A dedicated interface for staff that displays the current live state of the stadium, generates real-time summaries, and recommends actions based on predefined thresholds.
- **Data:** The system relies on a hand-authored venue graph representing gates and sections, a vector store for RAG containing policies and FAQs, and a synthetic data simulator that generates crowd density and transport events to represent live sensor data for this demonstration.
- **Architecture:**
  ```text
                         ┌─────────────────────┐        ┌──────────────────────┐
                         │   Fan Assistant UI    │        │   Ops Dashboard UI    │
                         │  (chat widget, React) │        │ (map/heatmap, React) │
                         └──────────┬───────────┘        └───────────┬──────────┘
                                    │ REST / WS                       │ REST / WS
                         ┌──────────▼───────────────────────────────▼──────────┐
                         │                    API Gateway (FastAPI)             │
                         │  /chat  /route  /ops/summary  /ops/incidents  /trace │
                         └───────────────────────┬──────────────────────────────┘
                                                  │
                  ┌───────────────────────────────┼───────────────────────────────┐
                  │                               │                               │
        ┌─────────▼─────────┐          ┌──────────▼──────────┐         ┌──────────▼──────────┐
        │  Orchestrator      │          │  Ops Intelligence    │         │  Incident Triage     │
        │  Agent (Fan-facing)│          │  Agent (scheduled)   │         │  Agent               │
        │  - intent routing  │          │  - summarize state   │         │  - classify severity │
        │  - tool calling    │          │  - recommend actions │         │  - route to response │
        └─────────┬─────────┘          └──────────┬──────────┘         └──────────┬──────────┘
                  │  tool calls                    │ reads                        │ writes
        ┌─────────▼─────────────────────────────────▼──────────────────────────────▼─────────┐
        │                              Tool / Service Layer                                    │
        │  get_route()   search_knowledge()   get_transport_status()   get_crowd_state()       │
        │  file_incident()   get_zone_capacity()                                                │
        └─────────┬───────────────────────────┬───────────────────────────┬────────────────────┘
                  │                           │                           │
        ┌─────────▼────────┐       ┌──────────▼──────────┐     ┌─────────▼─────────┐
        │  Venue Graph DB    │       │  Vector Store (RAG)  │     │  Live State Store  │
        │  (nodes/edges/     │       │  (FAQs, policies,    │     │  (Redis/in-memory: │
        │   amenities)       │       │   sustainability)     │     │  crowd, transport,  │
        │  static JSON/SQLite│       │  SQLite + embeddings  │     │  incidents)         │
        └────────────────────┘       └───────────────────────┘     └─────────▲───────────┘
                                                                                │ writes
                                                                    ┌───────────┴───────────┐
                                                                    │  Synthetic Data         │
                                                                    │  Simulator (cron/loop)  │
                                                                    │  generates crowd/transit│
                                                                    │  /incident events        │
                                                                    └─────────────────────────┘

                              ┌───────────────────────────┐
                              │   LLM Provider (Groq API)   │
                              │  called by all 3 agents via  │
                              │  the orchestration layer     │
                              └───────────────────────────┘
  ```

## 4. Tech Stack

| Layer | Technology |
|---|---|
| LLM | ![Groq API](https://img.shields.io/badge/Groq-API-orange?style=flat) |
| Backend | ![Python](https://img.shields.io/badge/Python-3670A0?style=flat&logo=python&logoColor=ffdd54) ![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=flat&logo=fastapi) ![MCP](https://img.shields.io/badge/MCP-purple?style=flat) |
| Frontend | ![React](https://img.shields.io/badge/React-%2320232a.svg?style=flat&logo=react&logoColor=%2361DAFB) ![TypeScript](https://img.shields.io/badge/TypeScript-%23007ACC.svg?style=flat&logo=typescript&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-%23646CFF.svg?style=flat&logo=vite&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-%2338B2AC.svg?style=flat&logo=tailwind-css&logoColor=white) ![Recharts](https://img.shields.io/badge/Recharts-22b5bf?style=flat) |
| Data Store(s) | ![SQLite](https://img.shields.io/badge/SQLite-%2307405e.svg?style=flat&logo=sqlite&logoColor=white) ![Redis](https://img.shields.io/badge/Redis-%23DD0031.svg?style=flat&logo=redis&logoColor=white) Vector Store (RAG) |
| Deployment | ![Firebase Hosting](https://img.shields.io/badge/Firebase_Hosting-%23039BE5.svg?style=flat&logo=firebase) ![Google Cloud Run](https://img.shields.io/badge/Google_Cloud_Run-%234285F4.svg?style=flat&logo=google-cloud&logoColor=white) |

## 5. Setup & Run
```bash
# Clone the repository
git clone <repo-url>
cd stadium-pulse

# Environment Configuration
cp .env.example .env
# Open .env and add your GROQ_API_KEY

# Backend Setup
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

# Frontend Setup
cd ../frontend
npm install
npm run dev
```

## 6. Demo
- **Live URL:** https://studio-1560217422-e282c.web.app
- **Demo Video:** [Link to be added]
- **Suggested Demo Script:** The application was validated against a comprehensive script of 20 queries spanning navigation (e.g. "How do I get from Gate C to Section 214?"), accessibility (e.g. "I use a wheelchair, how do I get from Gate B to Section 118?"), multilingual support, transportation (e.g. "Is parking Lot 3 full?"), policies, and incident reports (e.g. "Someone near me just collapsed").

## 7. Assumptions
- Due to the lack of real-time stadium sensor and transit feeds, all crowd, transport, and incident data are generated by a synthetic simulator that mimics realistic patterns.
- A single demo venue is modeled with a representative subset of gates, sections, and amenities rather than the full data of a real stadium.
- The user inputs for navigation and incident reports follow standard expected formats.

## 8. Known Limitations / Roadmap
- Voice input is not yet implemented.
- The multilingual support has only been end-to-end tested in five core languages for the demo.
- **Scaling to Production:**
  - **Live State Store:** Migrate to managed Redis/DynamoDB with pub/sub fan-out for many concurrent dashboard viewers (e.g., using Kafka).
  - **Synthetic Simulator:** Replace with real IoT/camera-based crowd sensors and transit APIs.
  - **Orchestrator Agent:** Add a caching layer for repeated FAQ-type queries to cut LLM cost and latency at scale.
  - **Multi-venue Support:** Parameterize venue graph loading per stadium ID.

## 9. Security Notes
- No personally identifiable information (PII) is collected or stored.
- API keys are injected via environment variables and are never committed to version control.
- Rate limiting should be applied on the chat endpoint in a production environment.
- All user-supplied text (chat input, incident reports) is length-limited and sanitized before being included in prompts or rendered in the UI (preventing prompt injection and XSS).
- Ops Dashboard endpoints require a session token and are not publicly writable without auth.
- Error responses don't leak stack traces or internal paths to the client.

## 10. Team
- StadiumPulse Team
