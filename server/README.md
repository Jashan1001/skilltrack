# SkillTrack Server

Backend service for SkillTrack — responsible for authentication, problem management, evaluation orchestration, and system state.

It acts as the central coordinator between the frontend and the execution engine.

---

## ⚙️ Role in System

The server handles:

- User authentication and authorization  
- Problem and curriculum management  
- Submission handling and evaluation requests  
- Communication with the execution engine  
- Progress tracking and leaderboard generation  

---

## 🔄 Request Flow

1. Client sends request (auth / problem / submission)  
2. Server validates request and user permissions  
3. For code execution:
   - forwards request to execution engine  
   - receives execution results  
4. Stores results and updates progress  
5. Sends response back to client  

---

## 🧱 Tech Stack

- Node.js  
- Express  
- MongoDB + Mongoose  
- JWT Authentication  
- Role-Based Access Control  
- Docker-based execution integration  

---

## 📦 Core Features

- Secure JWT-based authentication  
- Role-based access control (Student / Recruiter / Admin)  
- Problem CRUD with structured curriculum support  
- Public & private test case handling  
- Submission evaluation orchestration  
- Unique solved problem detection  
- Leaderboard generation using aggregation  

---

## 📂 Project Structure

```plaintext
server/
│
├── controllers/   # request handlers
├── models/        # database schemas
├── routes/        # API routes
├── middleware/    # auth, validation
├── seed/          # curriculum seeding
├── types/         # TypeScript types
├── utils/         # helpers
└── index.ts       # entry point

## 🚀 Run Server

```bash
npm install
npm run dev
```
---

## 🔐 Environment Variables

Create `.env`:

PORT=
MONGO_URI=
JWT_SECRET=

---

## 🌱 Seeding
```bash
npm run seed
```
