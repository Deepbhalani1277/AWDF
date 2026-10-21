# Advanced Web Development Frameworks (AWDF) — Master Practicals Repository

[![CI Pipeline](https://github.com/Deepbhalani1277/AWDF/actions/workflows/ci.yml/badge.svg)](https://github.com/Deepbhalani1277/AWDF/actions/workflows/ci.yml)

**Student:** Deep Bhalani  
**Institution:** Charotar University of Science and Technology (CHARUSAT) — CSE  
**Semester:** 5th Semester  
**Course:** Advanced Web Development Frameworks (AWDF)  

---

## 📖 Overview

This repository provides an integrated, progressive full-stack web application encompassing **Practicals 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, and 13**. It combines a modular React frontend (Vite) with an Express RESTful API backend connected to MongoDB via Mongoose ODM, containerized via multi-container Docker & Docker Compose orchestration, automated with Continuous Integration (CI) testing via GitHub Actions, integrating secure server-side AI capabilities (OpenAI & Gemini) with robust graceful degradation and responsible AI governance, featuring asynchronous background processing using native Node.js `EventEmitter`, server-side in-memory caching (`node-cache`) with telemetry, route-based code splitting and lazy loading (`React.lazy()` / `Suspense`), JWT-based authentication, bcrypt password hashing, Express middleware pipelines, centralized API services, optimistic UI updates, delete confirmation dialogs, and real-time toast feedback.

---

## 📂 Project Architecture

```text
awdf-project/
├── .github/
│   └── workflows/
│       └── ci.yml                     # [Prac 12] GitHub Actions automated CI test & build pipeline
├── frontend/                          # Client application (React 19 + Vite)
│   ├── public/                        # Static assets & icons
│   ├── src/
│   │   ├── components/                # Modular UI Components
│   │   │   ├── Header.jsx & .css      # [Prac 1] Hero section with props
│   │   │   ├── About.jsx & .css       # [Prac 1] Student bio & details
│   │   │   ├── Skills.jsx & .css      # [Prac 1] Tech stack cards
│   │   │   ├── Footer.jsx & .css      # [Prac 1] Consistent site footer
│   │   │   ├── Navbar.jsx & .css      # [Prac 1 & 2] Sticky navigation bar with auth badge & logout
│   │   │   ├── SearchBar.jsx & .css   # [Prac 3] Live keyword search bar
│   │   │   ├── Spinner.jsx & .css     # [Prac 3 & 6] Asynchronous loading spinner
│   │   │   ├── ErrorMessage.jsx & .css# [Prac 3 & 6] Error boundary with retry
│   │   │   ├── RepoCard.jsx & .css    # [Prac 3] GitHub repository card
│   │   │   ├── Toast.jsx & .css       # [Prac 6] Auto-dismissing toast notifications
│   │   │   ├── ConfirmModal.jsx & .css# [Prac 6] Delete confirmation modal dialog
│   │   │   ├── AuthModal.jsx & .css   # [Prac 7] JWT Login & Register interactive modal
│   │   │   ├── PageLoader.jsx & .css  # [Prac 8] Suspense fallback skeleton UI
│   │   │   └── TaskAnalyticsChart.jsx # [Prac 8, 9, 10] Analytics, cache telemetry & event bus logs
│   │   ├── utils/
│   │   │   └── lazyWithDelay.js       # [Prac 8] Minimum-delay loader preventing UI flicker
│   │   ├── services/                  # Centralized API layer
│   │   │   └── api.js                 # [Prac 6, 7, 9, 10, 13] REST client helpers with JWT, cache, events & AI APIs
│   │   ├── pages/                     # Routed Views (Code-Split in Practical 8)
│   │   │   ├── Home.jsx & .css        # Eager landing portfolio view (Prac 1 & 2)
│   │   │   ├── Projects.jsx & .css    # Lazy-loaded coursework showcase chunk (Prac 2 & 8)
│   │   │   ├── Repositories.jsx & .css# Lazy-loaded GitHub API integration chunk (Prac 3 & 8)
│   │   │   ├── Tasks.jsx & .css       # Lazy-loaded Full-Stack Task Manager (Prac 4-13) with AI Generator
│   │   │   ├── Contact.jsx & .css     # Reactive contact form (Prac 2 & 8)
│   │   │   └── NotFound.jsx & .css    # 404 handler page (Prac 2 & 8)
│   │   ├── App.jsx & App.css          # React Router, Suspense boundary & Auth state
│   │   ├── index.css                  # Global styling reset & variables
│   │   └── main.jsx                   # Vite root entrypoint
│   ├── vite.config.js                 # Proxy config for backend API (local + container)
│   ├── Dockerfile                     # [Prac 11] Multi-stage React Vite container definition
│   ├── .dockerignore                  # [Prac 11] Excludes node_modules & dist from build context
│   └── package.json
│
├── backend/                           # Server REST API (Node.js + Express + MongoDB)
│   ├── src/
│   │   ├── models/
│   │   │   ├── User.js                # [Prac 7] User schema with bcrypt password hashing
│   │   │   └── Task.js                # [Prac 5] Mongoose Schema & pre-save hook
│   │   ├── controllers/
│   │   │   ├── authController.js      # [Prac 7] Register, Login, and /me controllers
│   │   │   ├── taskController.js      # [Prac 5, 6, 9, 10] Mongoose CRUD, Cache & Event triggers
│   │   │   └── aiController.js        # [Prac 13] OpenAI/Gemini integration with graceful degradation
│   │   ├── routes/
│   │   │   ├── authRoutes.js          # [Prac 7] /register, /login, /me endpoints
│   │   │   ├── taskRoutes.js          # [Prac 4, 5, 7, 9, 10] Protected /api/tasks & event endpoints
│   │   │   └── aiRoutes.js            # [Prac 13] /api/ai/generate-description endpoint
│   │   ├── middleware/
│   │   │   ├── auth.js                # [Prac 7] JWT Bearer verification middleware
│   │   │   ├── validateTaskInput.js   # [Prac 7] Request input validation middleware
│   │   │   ├── logger.js              # [Prac 4] Global request logger
│   │   │   ├── validateId.js          # [Prac 5] MongoDB ObjectId format validator
│   │   │   ├── contentTypeValidator.js# [Prac 4] Content-Type application/json check
│   │   │   ├── notFoundHandler.js     # [Prac 4] 404 undefined endpoint fallback
│   │   │   └── errorHandler.js        # [Prac 5] Mongoose ValidationError/CastError parser
│   │   ├── events/
│   │   │   ├── taskEvents.js          # [Prac 10] Native Node.js EventEmitter bus singleton
│   │   │   └── taskListeners.js       # [Prac 10] Asynchronous listeners for created/deleted/error
│   │   ├── utils/
│   │   │   └── cache.js               # [Prac 9] In-memory cache manager (node-cache) with telemetry
│   │   └── data/
│   │       └── tasks.js               # [Prac 4] In-memory seed reference
│   ├── public/                        # Standalone API interactive test bench
│   │   ├── index.html
│   │   ├── style.css
│   │   └── app.js
│   ├── tests/                         # [Prac 12] Automated backend integration test suite
│   │   └── api.test.js                # [Prac 12] Supertest API assertions (health, cache, auth)
│   ├── jest.config.json               # [Prac 12] Jest test runner configuration (ESM)
│   ├── server.js                      # Express application, JWT auth, listeners & MongoDB connection
│   ├── Dockerfile                     # [Prac 11] Backend Node.js container definition
│   ├── .dockerignore                  # [Prac 11] Excludes node_modules & .env from build context
│   ├── .env                           # Local environment variables (git-ignored)
│   ├── .env.example                   # Environment configuration template
│   └── package.json
│
├── docker-compose.yml                 # [Prac 11] Multi-container orchestration (frontend, backend, mongodb)
├── .dockerignore                      # [Prac 11] Root build context exclusion filter
├── package.json                       # Monorepo root scripts (concurrently + docker compose)
├── .gitignore                         # Standard git ignore (node_modules, .env)
└── README.md                          # Repository documentation
```

---

## 🚀 Practicals Breakdown

### 🔹 Practical 1: React Components & Props
* **Objective:** Construct modular UI with functional components and props passing.
* **Key Components:** `Header`, `About`, `Skills`, `Footer`.

### 🔹 Practical 2: State Management & Routing
* **Objective:** Client-side routing via React Router and reactive state via `useState`.
* **Key Features:** Multi-page routing (`/`, `/projects`, `/contact`, `/not-found`), Contact form character counter.

### 🔹 Practical 3: REST API Integration & Data Rendering
* **Objective:** Consume an external REST API asynchronously with loading and error boundaries.
* **Key Features:** GitHub API integration (`Deepbhalani1277`), search filtering, loading spinner, error retry.

### 🔹 Practical 4: RESTful API Backend with Express
* **Objective:** Build a complete RESTful API with structured routing and custom middleware pipeline.
* **Key Features:** In-memory CRUD endpoints on `/tasks`, request logging, Content-Type validation, numeric ID validation, 404 and 500 error handlers.

### 🔹 Practical 5: MongoDB Integration & Schema Design with Mongoose
* **Objective:** Connect a MongoDB database to an Express server and enforce data validation through Mongoose schema.
* **Key Features:** Mongoose connection (`MONGO_URI`), Task schema with required fields, defaults, `priority` enum, pre-save whitespace trimming hook, structured JSON validation errors.

### 🔹 Practical 6: Full Stack Integration (React + Node + MongoDB)
* **Objective:** Wire the React frontend to the Node/Express/MongoDB backend into a fully functional full-stack application.
* **Architecture:** React (`:5173`) ↔ Express (`:5000`) ↔ MongoDB (`:27017`).
* **Key Features:** CORS middleware, central API service, optimistic UI updates, delete confirmation modal, auto-dismissing toast notifications.

### 🔹 Practical 7: Authentication and Middleware Pipeline
* **Objective:** Implement JWT-based authentication, bcrypt password hashing, and server-side input validation within the Express middleware pipeline.
* **Key Features:**
  - **Secure Password Hashing:** Uses `bcryptjs` with salt rounds (10) in Mongoose pre-save hooks so plaintext passwords are never stored.
  - **JWT Token Generation & Expiry:** Generates signed JSON Web Tokens (`jwt.sign`) on login with 1-hour expiration and secret stored safely in `.env`.
  - **Auth Middleware (`authenticate`):** Intercepts requests, validates `Authorization: Bearer <token>`, decodes user identity onto `req.user`, and prevents server crashes by safely handling expired/malformed tokens with HTTP 401.
  - **Server-Side Input Validation (`validateTaskInput`):** Rejects invalid task creation/mutation payloads with HTTP 400 before hitting the database.
  - **`/me` Endpoint *(Supplementary)*:** Returns decoded logged-in user profile from `req.user`.
  - **Frontend Token Handling & Logout *(Supplementary)*:** Tokens stored in `localStorage`, attached to all outbound requests; automatic 401 expiration handling redirects/prompts re-authentication; explicit logout cleans client state.

### 🔹 Practical 8: Performance Optimization and Lazy Loading in React
* **Objective:** Improve frontend performance and initial load time using route-based code splitting, `React.lazy()`, and `Suspense`.
* **Key Features:** Route-based code splitting, fallback skeleton UI (`PageLoader`), anti-flicker delay (`lazyWithDelay`), and on-demand heavy component lazy loading (`TaskAnalyticsChart`).

### 🔹 Practical 9: In-Memory Caching and Query Optimization
* **Objective:** Implement server-side in-memory caching using `node-cache`, establish strict cache invalidation on write operations, and measure the empirical API response time impact.
* **Key Features:** 60-second TTL in-memory caching, auto-invalidation on write operations, single-task caching under `task_{id}`, and real-time telemetry stats (`GET /api/tasks/cache/stats`).

### 🔹 Practical 10: Asynchronous Processing with Event-Driven Architecture
* **Objective:** Implement asynchronous background processing using Node.js native `EventEmitter` without external dependencies.
* **Architecture & Flow:**
  ```text
  POST /api/tasks Request
         │
         ▼
  Save task document to MongoDB
         │
         ▼
  API Responds Immediately (201 Created) ──► Client receives instant response (~12 ms)
         │
         ▼ (Asynchronous Side-Effect, Non-blocking)
  taskEvents.emit('task-created', { task, user, apiTimestamp })
         │
         ▼
  [Notification Listener / Worker]
  └── Simulates email/webhook dispatch (1200ms delay) ──► Worker finishes at 07:12:08.119Z
  ```
* **Key Features:**
  - **Native Node.js EventEmitter Bus:** Decouples background notifications from the main HTTP request-response cycle.
  - **Proven Response-Before-Handler Timing:** HTTP response returned at `07:12:06.909Z` (~12 ms), while the heavy worker completed 1.21 seconds later at `07:12:08.119Z` without blocking.
  - **Supplementary Events:** Implemented `task-deleted`, `task-updated`, and safe `error` event handlers.
  - **Live Event Stream Endpoint:** Exposes `GET /api/tasks/events/history` to audit background worker jobs in real-time.

### 🔹 Practical 11: Containerization with Docker and Docker Compose
* **CO/PO Mapping:** CO5 / PO3, PO5
* **Objective:** Containerize the full-stack Task Management application using Docker and orchestrate all microservices using Docker Compose.
* **Architecture & Orchestration Flow:**
  ```text
  docker-compose.yml
  ├── awdf-frontend (React 19 + Vite Preview, port 5173:5173)
  ├── awdf-backend  (Node.js / Express REST API, port 5000:5000)
  └── awdf-mongodb  (Official Mongo 6+ Image, port 27017:27017, named volume: mongo-data)

  Internal Network: app-network (bridge)
  awdf-frontend ──► awdf-backend ──► awdf-mongodb
  Single-Command Bootstrap: docker compose up --build
  ```
* **Key Components & Files:**
  - `backend/Dockerfile`: Production Node.js 18 environment, optimized layer caching (`COPY package*.json` -> `RUN npm install` -> `COPY . .`), exposes port 5000.
  - `backend/.dockerignore`: Excludes `node_modules`, `npm-debug.log`, `.env`, and `.git` from the Docker build context.
  - `frontend/Dockerfile`: Multi-stage build (`FROM node:18 AS build`) compiling production assets with `npm run build` and serving through `npm run preview -- --host 0.0.0.0 --port 5173`.
  - `frontend/.dockerignore`: Excludes `node_modules`, `dist`, `.env`, and `.git` from frontend context to ensure fast and lightweight image builds.
  - `docker-compose.yml`: Coordinates all 3 services, configures inter-service environment variables (`MONGO_URI=mongodb://mongodb:27017/taskdb`, `VITE_API_TARGET=http://backend:5000`), handles service startup order via `depends_on`, attaches the bridge network `app-network`, and provisions the persistent named volume `mongo-data`.
* **Key Questions / Viva Analysis:**
  1. **Why does the backend container reference the MongoDB container by service name (`mongodb`) rather than `localhost`?**
     - Each Docker container runs in its own isolated network namespace with its own `localhost` (127.0.0.1) loopback adapter. Connecting to `localhost:27017` from the backend would query port 27017 inside the backend container itself where no database exists. On a Docker user-defined bridge network (`app-network`), Docker provides an automatic internal DNS server that resolves Compose service names (like `mongodb`) to that container's dynamic private IP address.
  2. **What is the difference between `EXPOSE` in a Dockerfile and the `ports` mapping in `docker-compose.yml`?**
     - `EXPOSE` is purely documentation/metadata within the image declaring that the containerized process listens on that port. It does not bind or publish the port to the host system.
     - The `ports` directive (`host_port:container_port`, e.g., `5173:5173`) creates an active NAT firewall/forwarding rule on the host operating system, allowing external traffic (such as host web browsers) to reach the service inside the container.
  3. **Why is it bad practice to copy `node_modules` into a Docker image instead of running `npm install` inside the container?**
     - Host `node_modules` often contain native C/C++ compiled binaries (such as `bcrypt`) built for the host OS (e.g., Windows x64) which crash when executed inside a Linux container environment (`ELF` architecture mismatch).
     - Copying `node_modules` inflates build context transfer sizes by hundreds of megabytes, breaking Docker build caching and significantly degrading build performance. Running `npm install` within the container guarantees clean, compatible native compilation for the container target OS.
* **Supplementary Solutions:**
  - Added `.dockerignore` files for root, frontend, and backend contexts.
  - Configured multi-stage build structure for the React frontend.
  - Implemented persistent named volume `mongo-data:/data/db` so MongoDB data persists seamlessly across container teardowns and restarts.

### 🔹 Practical 12: CI/CD Pipeline with GitHub Actions
* **CO/PO Mapping:** CO5 / PO3, PO5
* **Objective:** Automate build verification and end-to-end integration testing of the application using a continuous integration (CI) pipeline powered by GitHub Actions.
* **Architecture & Pipeline Flow:**
  ```text
  git push origin main / pull_request
         │
         ▼
  GitHub Actions Trigger (on: push, pull_request)
         │
         ▼
  Job: build-and-test (Runner: ubuntu-latest)
  ├── Service Container: mongodb:latest (port 27017:27017)
  ├── Step 1: actions/checkout@v4 (fetch source tree)
  ├── Step 2: actions/setup-node@v4 (Node.js v18 LTS)
  ├── Step 3: Install Monorepo & Service Dependencies (root, backend, frontend)
  ├── Step 4: Build Frontend Production Bundle (Vite compile check)
  ├── Step 5: Execute Automated Integration Tests (Jest + Supertest)
  └── Step 6: Publish Pipeline Telemetry & Status
         │
         ▼
  Green Checkmark (✔ Build & Test Passed) or Red X (✖ Failed Test Alert)
  ```
* **Key Components & Files:**
  - `.github/workflows/ci.yml`: Defines automated workflow triggers on `push` and `pull_request` targeting `main`, launches a live MongoDB service container, compiles the frontend bundle, and runs the backend test suite.
  - `backend/tests/api.test.js`: Integration tests using `jest` and `supertest`:
    1. **Health Check (`GET /health`):** Asserts HTTP 200, uptime, and `{ status: 'ok' }`.
    2. **Telemetry Telemetry (`GET /api/tasks/cache/stats`):** Asserts HTTP 200, `{ success: true }`, and cache telemetry keys (`hits`, `misses`, `keysCount`).
    3. **Auth Guard (`GET /api/tasks`):** Asserts HTTP 401 Unauthorized when no JWT Bearer token is provided, verifying security middleware.
  - `backend/jest.config.json`: Native ES Modules (`type: module`) test runner configuration.
  - `package.json`: Unified root script `"test": "npm --prefix backend test"`.
* **Key Questions / Viva Analysis:**
  1. **What is the difference between Continuous Integration (CI) and Continuous Deployment (CD), and which one does this practical demonstrate?**
     - **Continuous Integration (CI)** is the practice of automatically integrating code changes from multiple contributors into a shared repository several times a day. Each integration is verified by an automated build and test runner to detect integration defects as early as possible.
     - **Continuous Deployment (CD)** is the automated release phase where code changes that pass all CI stages are automatically published and deployed to staging or production infrastructure without human intervention.
     - **Practical Demonstration:** This practical demonstrates **Continuous Integration (CI)** — on every push or pull request to `main`, GitHub Actions provisions a clean Linux runner, installs dependencies, compiles assets, and executes automated test suites with real-time pass/fail status reporting.
  2. **Why does running tests automatically on every push catch problems earlier than testing manually before a release?**
     - Automated CI provides an immediate feedback loop within seconds of pushing code. A developer knows immediately which specific commit caused a regression while the implementation details are fresh in memory.
     - In contrast, manual pre-release testing batches weeks or months of changes together. When a failure occurs, identifying which specific change broke the application requires time-consuming root-cause debugging across dozens of commits and multiple developer contributions.
  3. **What would happen to the pipeline if the test file path were incorrect — would the workflow fail at the same step as a genuine test failure?**
     - If the test file path is wrong, Jest will exit with code 1 reporting `No tests found matching pattern`, causing the `npm test` step to fail due to a runner configuration error. However, if configured with `--passWithNoTests`, it would silently pass with exit code 0, creating a dangerous false positive.
     - A genuine test failure occurs when tests execute, assertions fail (`expect().toBe()`), and Jest exits with code 1 while outputting assertion diffs. While both cause the pipeline step to fail (red X), their log signatures and root causes are completely different.
* **Deliberate Failure & Fix Demonstration (Lab Requirement):**
  - **Demonstrating Failure (Red X):** Modify an assertion in `backend/tests/api.test.js` (e.g., `expect(res.statusCode).toBe(500)`), push to GitHub, and observe the red X under the Actions tab with detailed error diffs.
  - **Demonstrating Fix (Green Checkmark):** Restore the assertion to `200`, commit and push, and observe the pipeline execute successfully with a green checkmark.
* **Supplementary Solutions:**
  - Multi-endpoint test coverage (Health, Cache telemetry, Auth security).
  - Live MongoDB service container integrated into the GitHub Actions runner.
  - Embedded live CI pipeline status badge in [README.md](file:///d:/clg/sem%205/AWDF/awdf-project/README.md).

### 🔹 Practical 13: AI API Integration into a Web Application
* **CO/PO Mapping:** CO6 / PO3, PO5, PO12
* **Objective:** Securely integrate an external AI service (OpenAI / Gemini) into the full-stack web application with robust graceful degradation and adhere to responsible AI principles.
* **Architecture & Data Flow:**
  ```text
  React Frontend (Tasks Modal Form)
         │  Click: "✨ Generate with AI"
         ▼  (Dispatches POST /api/ai/generate-description)
  Express Backend REST API (/api/ai/generate-description)
         │  Enforces client rate-limiting cooldown (4s)
         │  Reads API Key securely server-side from .env (OPENAI_API_KEY / GEMINI_API_KEY)
         ▼
  External AI Service (OpenAI gpt-4o-mini / Gemini 1.5 Flash)
         │
         ├──► Success: Returns AI-synthesized 2-3 sentence task description + suggested priority
         │
         └──► Failure / Offline / Missing Key: Graceful Degradation activates:
              Returns contextual heuristic draft without crashing application!
         │
         ▼
  React Frontend receives structured payload:
  - Fills description textarea as an editable draft
  - Updates suggested priority level
  - Displays visible AI Disclaimer Banner
  ```
* **Key Components & Files:**
  - `backend/src/controllers/aiController.js`: Secure server-side controller with multi-provider AI support (OpenAI SDK & Gemini REST API), IP-based rate limiting, input validation, and intelligent local heuristic fallback.
  - `backend/src/routes/aiRoutes.js`: Exposes `POST /api/ai/generate-description`.
  - `backend/server.js`: Mounted at `/ai` and `/api/ai`.
  - `frontend/src/services/api.js`: Added `generateAIDescriptionAPI(title)` helper.
  - `frontend/src/pages/Tasks.jsx` & `Tasks.css`: Added "✨ Generate with AI" button, animated loading state spinner, rate-limit cooldown toast alerts, and prominent AI Disclaimer badge.
* **Key Questions / Viva Analysis:**
  1. **Why must the AI API key be called from the backend rather than directly from the React frontend?**
     - Frontend code runs entirely in the client's browser environment. Any API key embedded in frontend JavaScript or passed via headers is visible in browser DevTools Network inspect panels and decompiled source bundles. Exposing keys publicly allows malicious actors to steal credentials, exhaust API token quotas, and incur unauthorized financial charges.
     - Confining the API key strictly to server-side environment variables (`process.env.OPENAI_API_KEY`) protects secrets, prevents credential leakage, and enables server-side rate-limiting, request sanitization, and access control.
  2. **What does 'graceful degradation' mean in this context, and why does it matter for a feature that depends on a third-party service outside your control?**
     - **Graceful degradation** is an architectural principle where a web application continues operating with baseline functionality when an auxiliary or non-critical external dependency fails.
     - Third-party AI services are subject to network timeouts, latency spikes, rate limits (HTTP 429), or service outages. By encapsulating AI requests in a `try/catch` pipeline and returning a contextual heuristic fallback (`fallback: true`), the task creation process never halts, and the application remains 100% operational even during total third-party AI downtime.
  3. **What are the privacy and governance implications of sending task data to an external AI API, and what kind of data should never be sent this way?**
     - Sending data to public external AI APIs transfers user inputs across external networks to third-party model providers, where data could potentially be logged or used for future model training unless zero-data retention agreements are established.
     - **Data that must NEVER be sent:** Personally Identifiable Information (PII) such as national IDs, passwords, credit card numbers, confidential health/medical records, proprietary algorithms, internal company financial figures, or encryption keys.
* **Supplementary Solutions:**
  - Loading state with animated spinner (`aiLoading`) in the frontend UI.
  - Client-side and server-side rate limiting (4-second cooldown per client to prevent quota flooding).
  - Clear, prominent UI disclaimer banner stating that suggestions are AI-generated and should be reviewed by the user.

---

## 🛠️ API Reference Table

| Method | Endpoint | Auth Required | Description | Status Codes |
|---|---|---|---|---|
| `POST` | `/api/auth/register` | No | Register new user (hashes password with bcrypt) | `201 Created`, `400 Bad Request` |
| `POST` | `/api/auth/login` | No | Authenticate user & issue signed JWT token | `200 OK`, `400 Bad Request`, `401 Unauthorized` |
| `GET` | `/api/auth/me` | **Yes (Bearer JWT)** | Retrieve currently authenticated user profile | `200 OK`, `401 Unauthorized` |
| `GET` | `/api/tasks` | **Yes (Bearer JWT)** | List tasks (in-memory cached, 60s TTL) | `200 OK`, `401 Unauthorized` |
| `GET` | `/api/tasks/:id` | **Yes (Bearer JWT)** | Get task by ID (cached separately under `task_{id}`) | `200 OK`, `400 Bad Request`, `404 Not Found`, `401 Unauthorized` |
| `POST` | `/api/tasks` | **Yes (Bearer JWT)** | Create task, invalidate cache & emit `task-created` | `201 Created`, `400 Bad Request`, `401 Unauthorized` |
| `PUT` | `/api/tasks/:id` | **Yes (Bearer JWT)** | Update task, invalidate cache & emit `task-updated` | `200 OK`, `400 Bad Request`, `404 Not Found`, `401 Unauthorized` |
| `DELETE`| `/api/tasks/:id` | **Yes (Bearer JWT)** | Delete task, invalidate cache & emit `task-deleted` | `200 OK`, `400 Bad Request`, `404 Not Found`, `401 Unauthorized` |
| `GET` | `/api/tasks/cache/stats` | No | Cache performance telemetry & hit-rate debug stats | `200 OK` |
| `POST` | `/api/tasks/cache/flush` | No | Clear all keys from in-memory cache | `200 OK` |
| `GET` | `/api/tasks/events/history` | No | Asynchronous background event bus logs | `200 OK` |
| `POST` | `/api/ai/generate-description` | No (Rate-limited) | AI-powered task description generator with graceful fallback | `200 OK`, `400 Bad Request`, `429 Too Many Requests` |
| `GET` | `/tasks/simulate/error` | No | Deliberately triggers internal error to test 500 handler | `500 Internal Server Error` |

---

## ⚡ Quick Start & Run Guide

### Option A: Run with Docker Compose (Practical 11 — Recommended)

Build and launch the complete multi-container stack with a single command:
```bash
docker compose up --build
```
* **Frontend App:** http://localhost:5173
* **Backend REST API:** http://localhost:5000
* **API Test Bench:** http://localhost:5000/
* **MongoDB:** `localhost:27017` (data persisted in `mongo-data` named volume)

**Verification & Management Commands:**
```bash
# Check running containers
docker ps

# Follow container logs
docker compose logs -f

# Stop all services gracefully
docker compose down

# Stop and wipe volume data (clean state reset)
docker compose down -v
```

---

### Option B: Run Locally with Node.js & Concurrently (Practicals 1–10)

#### 1. Configure Environment
Create `.env` in `backend/`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/taskmanager
JWT_SECRET=supersecret_jwt_key_practical7_charusat_2026
```

#### 2. Start Both Frontend and Backend Concurrently
From the root directory:
```bash
npm run dev
```
* **Frontend:** http://localhost:5173
* **Backend API:** http://localhost:5000
* **API Test Bench:** http://localhost:5000/

