# SkillTrack Execution Engine

The execution engine is responsible for running untrusted user-submitted code in a secure, isolated environment using Docker containers.

It is designed to ensure **safe execution, consistent results, and strict resource control**.

---

## ⚙️ Role in System

The execution engine operates as an independent service:

- Receives execution requests from the backend  
- Runs code inside isolated containers  
- Evaluates against test cases  
- Returns output, errors, and runtime  

---

## 🔄 Execution Flow

1. Server sends code execution request  
2. Engine prepares execution environment  
3. A Docker container is created  
4. Code is compiled/executed inside container  
5. Test cases are run sequentially or in parallel  
6. Output, errors, and runtime are captured  
7. Container is destroyed after execution  
8. Results are sent back to the server  

---

## 🐳 Why Docker?

- Isolates untrusted code from host system  
- Prevents access to sensitive resources  
- Ensures consistent runtime environment  
- Enables controlled execution limits  

---

## 🧱 Supported Languages

- JavaScript  
- Python  
- C++  

Each language uses a separate execution pipeline.

---

## 🔐 Security Model

- **Container isolation** → no direct host access  
- **No network access** inside containers  
- **Execution timeouts** to prevent infinite loops  
- **Memory limits** to prevent abuse  
- **Ephemeral containers** (destroyed after each run)  

---

## ⚙️ Evaluation Strategy

- Public test cases → shown to users  
- Private test cases → used for final evaluation  
- Strict and partial evaluation supported  
- Runtime measurement included  

---

## 🚀 Run Execution Engine

```bash
npm install
npm run dev
```