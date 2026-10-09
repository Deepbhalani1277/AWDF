# Advanced Web Development Frameworks (AWDF) — Master Practicals Repository

**Student:** Deep Bhalani  
**Institution:** Charotar University of Science and Technology (CHARUSAT) — CSE  
**Semester:** 5th Semester  
**Course:** Advanced Web Development Frameworks (AWDF)  

---

## 📖 Overview

This repository provides an integrated, progressive full-stack web application encompassing **Practicals 1, 2, 3, 4, 5, 6, and 7**. It combines a modular React frontend (Vite) with an Express RESTful API backend connected to MongoDB via Mongoose ODM, featuring JWT-based authentication, bcrypt password hashing, Express middleware pipelines, centralized API services, optimistic UI updates, delete confirmation dialogs, and real-time toast feedback.

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
│   │   │   └── AuthModal.jsx & .css   # [Prac 7] JWT Login & Register interactive modal
│   │   ├── services/                  # Centralized API layer
│   │   │   └── api.js                 # [Prac 6 & 7] REST client helpers with JWT Bearer header
│   │   ├── pages/                     # Routed Views
│   │   │   ├── Home.jsx & .css        # Integrated Portfolio view (Prac 1 & 2)
│   │   │   ├── Projects.jsx & .css    # Coursework showcase (Prac 2)
│   │   │   ├── Repositories.jsx & .css# GitHub API integration (Prac 3)
│   │   │   ├── Tasks.jsx & .css       # Full-Stack MongoDB Task Manager UI (Prac 4, 5, 6, 7)
│   │   │   ├── Contact.jsx & .css     # Reactive contact form (Prac 2)
│   │   │   └── NotFound.jsx & .css    # 404 handler page (Prac 2)
│   │   ├── App.jsx & App.css          # React Router & Global Auth state
│   │   ├── index.css                  # Global styling reset & variables
│   │   └── main.jsx                   # Vite root entrypoint
│   ├── vite.config.js                 # Proxy config for backend API
│   └── package.json
│
├── backend/                           # Server REST API (Node.js + Express + MongoDB)
│   ├── src/
│   │   ├── models/
│   │   │   ├── User.js                # [Prac 7] User schema with bcrypt password hashing
│   │   │   └── Task.js                # [Prac 5] Mongoose Schema & pre-save hook
│   │   ├── controllers/
│   │   │   ├── authController.js      # [Prac 7] Register, Login, and /me controllers
│   │   │   └── taskController.js      # [Prac 5 & 6] Mongoose CRUD controllers (async/await)
│   │   ├── routes/
│   │   │   ├── authRoutes.js          # [Prac 7] /register, /login, /me endpoints
│   │   │   └── taskRoutes.js          # [Prac 4, 5, 7] Protected /api/tasks router
│   │   ├── middleware/
│   │   │   ├── auth.js                # [Prac 7] JWT Bearer verification middleware
│   │   │   ├── validateTaskInput.js   # [Prac 7] Request input validation middleware
│   │   │   ├── logger.js              # [Prac 4] Global request logger
│   │   │   ├── validateId.js          # [Prac 5] MongoDB ObjectId format validator
│   │   │   ├── contentTypeValidator.js# [Prac 4] Content-Type application/json check
│   │   │   ├── notFoundHandler.js     # [Prac 4] 404 undefined endpoint fallback
│   │   │   └── errorHandler.js        # [Prac 5] Mongoose ValidationError/CastError parser
│   │   └── data/
│   │       └── tasks.js               # [Prac 4] In-memory seed reference
│   ├── public/                        # Standalone API interactive test bench
│   │   ├── index.html
│   │   ├── style.css
│   │   └── app.js
│   ├── server.js                      # Express application, JWT auth & MongoDB connection
│   ├── .env                           # Local environment variables (git-ignored)
│   ├── .env.example                   # Environment configuration template
│   └── package.json
│
├── package.json                       # Monorepo root scripts (concurrently)
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

---

## 🛠️ API Reference Table

| Method | Endpoint | Auth Required | Description | Status Codes |
|---|---|---|---|---|
| `POST` | `/api/auth/register` | No | Register new user (hashes password with bcrypt) | `201 Created`, `400 Bad Request` |
| `POST` | `/api/auth/login` | No | Authenticate user & issue signed JWT token | `200 OK`, `400 Bad Request`, `401 Unauthorized` |
| `GET` | `/api/auth/me` | **Yes (Bearer JWT)** | Retrieve currently authenticated user profile | `200 OK`, `401 Unauthorized` |
| `GET` | `/api/tasks` | **Yes (Bearer JWT)** | List tasks (supports `?completed=`, `?priority=`, `?search=`) | `200 OK`, `401 Unauthorized` |
| `GET` | `/api/tasks/:id` | **Yes (Bearer JWT)** | Get single task document by MongoDB ObjectId | `200 OK`, `400 Bad Request`, `404 Not Found`, `401 Unauthorized` |
| `POST` | `/api/tasks` | **Yes (Bearer JWT)** | Create task with input validation middleware | `201 Created`, `400 Bad Request`, `401 Unauthorized` |
| `PUT` | `/api/tasks/:id` | **Yes (Bearer JWT)** | Update task document with schema validation | `200 OK`, `400 Bad Request`, `404 Not Found`, `401 Unauthorized` |
| `DELETE`| `/api/tasks/:id` | **Yes (Bearer JWT)** | Delete task document from MongoDB | `200 OK`, `400 Bad Request`, `404 Not Found`, `401 Unauthorized` |
| `GET` | `/tasks/simulate/error` | No | Deliberately triggers internal error to test 500 handler | `500 Internal Server Error` |

---

## ⚡ Quick Start & Run Guide

### 1. Configure Environment
Create `.env` in `backend/`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/taskmanager
JWT_SECRET=supersecret_jwt_key_practical7_charusat_2026
```

### 2. Start Both Frontend and Backend Concurrently
From the root directory:
```bash
npm run dev
```
* **Frontend:** http://localhost:5173
* **Backend API:** http://localhost:5000
* **API Test Bench:** http://localhost:5000/

