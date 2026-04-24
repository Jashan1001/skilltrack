
# SkillTrack

SkillTrack is a pattern-based DSA interview platform built around one core challenge:

> How do you safely execute untrusted user code while keeping the system scalable, reliable, and secure?

It combines structured learning with a real execution engine using a multi-service architecture.

---

## ⚙️ System Architecture

SkillTrack is built as three independent services:

```plaintext
SkillTrack/
│
├── client/             # React frontend (UI layer)
├── server/             # API, authentication, database
└── execution-engine/   # Docker-based code execution sandbox

### Why this design?

- Isolates untrusted code execution from the main backend  
- Prevents crashes or exploits from affecting core services  
- Enables independent scaling of execution workloads  

---

## 🔄 Execution Flow

1. User writes code in the frontend  
2. Code is sent to the backend API  
3. Backend forwards execution request to the execution engine  
4. Execution engine:
   - Spins up a Docker container  
   - Executes code against test cases  
   - Captures output, errors, and runtime  
5. Results are returned to backend → frontend  

---

## 🎯 Core Philosophy

SkillTrack moves beyond random problem-solving by focusing on:

- Structured DSA curriculum (12 patterns)  
- Ordered progression system  
- Hybrid learning (guided + free exploration)  
- Real execution environment  
- Production-level system design  

---

## 🧠 Key Design Decisions

### Docker-based Isolation
- Each submission runs inside a container  
- Prevents access to host system  
- Ensures consistent runtime environment  

### Multi-Language Support
- JavaScript, Python, C++  
- Separate execution pipelines per language  

### Public vs Private Test Cases
- Public → visible for debugging  
- Private → used for final evaluation  

### 3-Service Architecture
- Clear separation of concerns  
- Improves fault isolation  
- Enables scalability  

---

## 🔥 Features

### Structured Curriculum
- 80+ curated DSA problems  
- Pattern-based roadmap  
- Master sheet view  

### Authentication & Roles
- Student / Recruiter / Admin  
- JWT-based authentication  
- Role-based access control  

### Code Execution
- Docker-isolated containers  
- Strict & partial evaluation  
- Hidden test cases  
- Runtime measurement  

### Progress Tracking
- Unique solved problem detection  
- Pattern-based completion tracking  
- Leaderboard with optimized aggregation  

---

## 🧱 Tech Stack

**Frontend**
- React, TypeScript, Tailwind CSS, React Router  

**Backend**
- Node.js, Express, MongoDB  
- JWT Authentication, RBAC  

**Execution Engine**
- Docker containers  
- Multi-language execution (JS, Python, C++)  

---

## ⚙️ Setup Instructions

### Clone

```bash
git clone https://github.com/Jashan1001/skilltrack.git
cd skilltrack
```
---

### Server

```bash
cd server
npm install
npm run dev
```

Create `.env`:

PORT=
MONGO_URI=
JWT_SECRET=

---

### Client

```bash
cd client
npm install
npm run dev
```
---

### Execution Engine

```bash
cd execution-engine
npm install
npm start
```

> Ensure Docker is installed and running.

---

## 🌱 Seeding Structured Curriculum

Server includes seed scripts for:

* Patterns
* Master track problems
* Ordered progression

Run:

```bash
npm run seed
```
---

## 🔐 Security Considerations

* Docker isolation for untrusted code execution
* JWT-based authentication with protected routes
* Role-based access control
* Hidden private test cases to prevent hardcoding

---

## 📈 Vision

SkillTrack focuses on structured mastery over random practice by combining:

* Guided learning paths
* Real execution environment
* Production-level architecture

---

## 👤 Author

Jashan
GitHub: [https://github.com/Jashan1001](https://github.com/Jashan1001)

