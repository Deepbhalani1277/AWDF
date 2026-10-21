# Advanced Web Development Frameworks (AWDF) — Master Practicals Repository

**Student:** Deep Bhalani  
**Institution:** Charotar University of Science and Technology (CHARUSAT) — CSE  
**Semester:** 5th Semester  
**Course:** Advanced Web Development Frameworks (AWDF)  

---

## 📖 Overview

This repository provides an integrated, progressive full-stack web application encompassing **Practicals 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, and 11**. It combines a modular React frontend (Vite) with an Express RESTful API backend connected to MongoDB via Mongoose ODM, containerized via multi-container Docker & Docker Compose orchestration, featuring asynchronous background processing using native Node.js `EventEmitter`, server-side in-memory caching (`node-cache`) with telemetry, route-based code splitting and lazy loading (`React.lazy()` / `Suspense`), JWT-based authentication, bcrypt password hashing, Express middleware pipelines, centralized API services, optimistic UI updates, delete confirmation dialogs, and real-time toast feedback.

---

## 📂 Project Architecture

```text
awdf-project/
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
│   │   │   └── api.js                 # [Prac 6, 7, 9, 10] REST client helpers with JWT, cache & event APIs
│   │   ├── pages/                     # Routed Views (Code-Split in Practical 8)
│   │   │   ├── Home.jsx & .css        # Eager landing portfolio view (Prac 1 & 2)
│   │   │   ├── Projects.jsx & .css    # Lazy-loaded coursework showcase chunk (Prac 2 & 8)
│   │   │   ├── Repositories.jsx & .css# Lazy-loaded GitHub API integration chunk (Prac 3 & 8)
│   │   │   ├── Tasks.jsx & .css       # Lazy-loaded Full-Stack Task Manager chunk (Prac 4-10)
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
│   │   │   └── taskController.js      # [Prac 5, 6, 9, 10] Mongoose CRUD, Cache & Event triggers
│   │   ├── routes/
│   │   │   ├── authRoutes.js          # [Prac 7] /register, /login, /me endpoints
│   │   │   └── taskRoutes.js          # [Prac 4, 5, 7, 9, 10] Protected /api/tasks & event endpoints
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

