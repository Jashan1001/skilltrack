# SkillTrack

SkillTrack is a structured, pattern-based DSA interview mastery platform built using the MERN stack with a Docker-powered multi-language execution engine.

It combines guided curriculum learning with free exploration through a hybrid model.

---

## 🚀 Platform Overview

SkillTrack is built with three independent layers:

```
SkillTrack/
│
├── client/             # React frontend (UI layer)
├── server/             # API + database + authentication
├── execution-engine/   # Docker-based code execution sandbox
```

---

## 🎯 Core Philosophy

SkillTrack is not just a problem list platform.

It provides:

- Structured DSA curriculum (12 patterns)
- Ordered progression system
- Hybrid learning (guided + free mode)
- Real code execution engine
- Production-level architecture

---

## 🧱 Tech Stack

Frontend:
- React
- TypeScript
- Tailwind CSS
- React Router

Backend:
- Node.js
- Express
- MongoDB
- JWT Authentication
- Role-based access control

Execution Engine:
- Docker sandbox
- Multi-language support:
  - JavaScript
  - Python
  - C++
- Public & private test cases
- Secure container-based evaluation

---

## 🔥 Major Features

### Structured Curriculum
- 80+ curated DSA problems
- 12 core patterns
- Pattern-based roadmap
- Master sheet view

### Authentication & Roles
- Student
- Recruiter
- Admin

### Code Execution
- Docker-isolated containers
- Strict & partial evaluation
- Hidden test cases
- Runtime measurement

### Progress Tracking
- Unique solved problem detection
- Pattern-based completion tracking
- Leaderboard

---

## ⚙️ Setup Instructions

### 1️⃣ Clone

```bash
git clone https://github.com/jashan1001/skilltrack.git
cd skilltrack
```

---

## 🖥 Run Server

```bash
cd server
npm install
npm run dev
```

Create `.env` inside `server/`:

```
PORT=
MONGO_URI=
JWT_SECRET=
```

---

## 🎨 Run Client

```bash
cd client
npm install
npm run dev
```

---

## 🐳 Run Execution Engine

```bash
cd execution-engine
npm install
npm start
```

Ensure Docker is installed and running.

---

## 🌱 Seeding Structured Curriculum

Server includes seed scripts for:

- Patterns
- Master track problems
- Ordered progression

Run:

```bash
npm run seed
```

---

## 🔐 Security

- JWT-based authentication
- Role-based route protection
- Docker container isolation for code execution
- Hidden private test cases

---

## 📈 Vision

SkillTrack aims to move beyond random practice toward structured mastery.

It focuses on:

- Curriculum-driven learning
- Clean architecture
- Production-ready engineering
- Interview-centric pattern progression

---

## 👤 Author

Jashan  
GitHub: https://github.com/jashan1001