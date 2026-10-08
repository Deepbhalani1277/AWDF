# Advanced Web Development Frameworks (AWDF) — Master Practicals Repository

**Student:** Deep Bhalani  
**Institution:** Charotar University of Science and Technology (CHARUSAT) — CSE  
**Semester:** 5th Semester  
**Course:** Advanced Web Development Frameworks (AWDF)  

---

## 📖 Overview

This repository unifies **Practicals 1, 2, 3, and 4** into a cohesive full-stack web application. It features a modern modular React frontend (Vite) and a high-performance Express RESTful API backend, architected to seamlessly scale for subsequent database and backend integration practicals (such as Practical 5 with MongoDB & Mongoose).

---

## 📂 Project Architecture

```text
awdf-project/
├── frontend/                          # Client application (React + Vite)
│   ├── public/                        # Static assets & icons
│   ├── src/
│   │   ├── components/                # Modular UI Components
│   │   │   ├── Header.jsx & .css      # [Prac 1] Hero section with props
│   │   │   ├── About.jsx & .css       # [Prac 1] Student bio & details
│   │   │   ├── Skills.jsx & .css      # [Prac 1] Tech stack cards
│   │   │   ├── Footer.jsx & .css      # [Prac 1] Consistent site footer
│   │   │   ├── Navbar.jsx & .css      # [Prac 1 & 2] Sticky navigation bar
│   │   │   ├── SearchBar.jsx & .css   # [Prac 3] Live keyword search bar
│   │   │   ├── Spinner.jsx & .css     # [Prac 3] CSS loading spinner
│   │   │   ├── ErrorMessage.jsx & .css# [Prac 3] Error alert with retry
│   │   │   └── RepoCard.jsx & .css    # [Prac 3] GitHub repository card
│   │   ├── pages/                     # Routed Views
│   │   │   ├── Home.jsx & .css        # Integrated Portfolio view (Prac 1 & 2)
│   │   │   ├── Projects.jsx & .css    # Coursework showcase (Prac 2)
│   │   │   ├── Repositories.jsx & .css# GitHub API integration (Prac 3)
│   │   │   ├── Tasks.jsx & .css       # Fullstack Task Manager UI (Prac 4)
│   │   │   ├── Contact.jsx & .css     # Reactive contact form (Prac 2)
│   │   │   └── NotFound.jsx & .css    # 404 handler page (Prac 2)
│   │   ├── App.jsx & App.css          # React Router composition
│   │   ├── index.css                  # Global styling reset & variables
│   │   └── main.jsx                   # Vite root entrypoint
│   ├── vite.config.js                 # Proxy config for backend API
│   └── package.json
│
├── backend/                           # Server REST API (Node.js + Express)
│   ├── src/
│   │   ├── controllers/
│   │   │   └── taskController.js      # [Prac 4] In-memory CRUD controllers
│   │   ├── routes/
│   │   │   └── taskRoutes.js          # [Prac 4] /tasks router
│   │   ├── middleware/
│   │   │   ├── logger.js              # [Prac 4] Global request logger
│   │   │   ├── validateId.js          # [Prac 4] Route-specific numeric ID validator
│   │   │   ├── contentTypeValidator.js# [Prac 4] Content-Type application/json check
│   │   │   ├── notFoundHandler.js     # [Prac 4] 404 undefined endpoint fallback
│   │   │   └── errorHandler.js        # [Prac 4] 500 Centralized error handler
│   │   └── data/
│   │       └── tasks.js               # [Prac 4] Initial task seed data
│   ├── public/                        # Standalone API interactive test bench
│   │   ├── index.html
│   │   ├── style.css
│   │   └── app.js
│   ├── server.js                      # Express application entrypoint
│   ├── .env.example                   # Environment configuration template
│   └── package.json
│
├── package.json                       # Monorepo root scripts
├── .gitignore                         # Standard git ignore (node_modules, .env)
└── README.md                          # Repository documentation
```

---

## 🚀 Practicals Breakdown

### 🔹 Practical 1: React Components & Props
* **Objective:** Construct modular UI with functional components and props passing.
* **Key Components:**
  - `Header`: Displays title, subtitle, and dynamic tagline passed via props.
  - `About`: Student biographical data and institutional details.
  - `Skills`: Interactive tech stack cards with hover elevation animations.
  - `Footer`: Clean metadata and contact coordinates.

### 🔹 Practical 2: State Management & Routing
* **Objective:** Implement client-side routing via React Router and reactive state via `useState`.
* **Key Features:**
  - Multi-page routing with `BrowserRouter`, `Routes`, `Route`, and `NavLink`.
  - Pages: `Home` (`/`), `Projects` (`/projects`), `Contact` (`/contact`), `NotFound` (`*`).
  - Interactive Contact form featuring real-time character counting and conditional help drawer.

### 🔹 Practical 3: REST API Integration & Data Rendering
* **Objective:** Consume an external REST API asynchronously with loading and error boundaries.
* **Key Features:**
  - Live data fetching from GitHub API (`https://api.github.com/users/Deepbhalani1277/repos`).
  - Search filter filtering repositories dynamically by name.
  - Loading spinner indicator during asynchronous network requests.
  - Error state fallback with "Retry" action button.

### 🔹 Practical 4: RESTful API Backend with Node.js & Express
* **Objective:** Build a complete RESTful API with structured routing and custom middleware pipeline.
* **Key Features:**
  - Full CRUD endpoints on `/tasks`:
    - `GET /tasks` - Retrieve all tasks (supports query filters for status, priority, search).
    - `GET /tasks/:id` - Retrieve task by ID with numeric validation.
    - `POST /tasks` - Create task with required title validation.
    - `PUT /tasks/:id` - Update existing task properties.
    - `DELETE /tasks/:id` - Remove task by ID.
  - Middleware Pipeline:
    1. Built-in CORS and JSON body parsers (`express.json()`).
    2. Global request logger printing timestamp, HTTP method, and path.
    3. Header validator enforcing `Content-Type: application/json`.
    4. Param validator checking numeric integer `:id`.
    5. Undefined route fallback returning structured 404 JSON.
    6. Centralized 500 error handler catching unhandled exceptions.

---

## 🛠️ API Reference Table

| Method | Endpoint | Description | Status Codes |
|---|---|---|---|
| `GET` | `/tasks` | List all tasks (supports `?status=`, `?priority=`, `?search=`) | `200 OK` |
| `GET` | `/tasks/:id` | Get specific task by ID | `200 OK`, `400 Bad Request`, `404 Not Found` |
| `POST` | `/tasks` | Create a new task (body: `{ title, description?, status?, priority? }`) | `201 Created`, `400 Bad Request` |
| `PUT` | `/tasks/:id` | Update an existing task | `200 OK`, `400 Bad Request`, `404 Not Found` |
| `DELETE`| `/tasks/:id` | Delete a task by ID | `200 OK`, `400 Bad Request`, `404 Not Found` |
| `GET` | `/tasks/simulate/error` | Deliberately triggers internal error to test 500 handler | `500 Internal Server Error` |

---

## ⚡ Quick Start & Run Guide

### 1. Install Dependencies
In the root directory or inside both folders:
```bash
# In backend/
cd backend
npm install

# In frontend/
cd ../frontend
npm install
```

### 2. Start the Backend API
```bash
cd backend
npm run dev
# Server running at: http://localhost:5000
```

### 3. Start the Frontend Application
```bash
cd frontend
npm run dev
# Vite dev server running at: http://localhost:5173
```

---

## 🔜 Next Step: Practical 5 (MongoDB & Mongoose)
This combined backend is architecturally pre-configured for **Practical 5**:
* Replacing the in-memory array (`src/data/tasks.js`) with a real Mongoose Model (`src/models/Task.js`).
* Enforcing schema validation (`title` required, `completed` boolean, `priority` enum `['low', 'medium', 'high']`, pre-save whitespace trimming hook).
* Connecting via `.env` (`MONGO_URI`).
