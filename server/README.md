# SkillTrack Server

The server handles authentication, curriculum management, progress tracking, and integration with the execution engine.

---

## 🧱 Tech Stack

- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- Docker integration

---

## 📦 Features

- JWT authentication
- Role-based access control
- Problem CRUD
- Pattern-based structured curriculum
- Public & private test case handling
- Unique solved problem detection
- Leaderboard generation

---

## 📂 Structure

```
server/
│
├── controllers/
├── models/
├── routes/
├── middleware/
├── seed/
├── types/
└── utils/
└── index.ts
```

---

## 🚀 Start Server

```bash
npm install
npm run dev
```

---

## 🔐 Environment Variables

Create `.env`:

```
PORT=
MONGO_URI=
JWT_SECRET=
```

---

## 🌱 Seeding

```bash
npm run seed
```