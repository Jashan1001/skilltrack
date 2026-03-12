import express from "express";
import dotenv from "dotenv";
import executeRouter from "./routes/execute.route";

dotenv.config();

const app = express();

/* ============================= */
/* Internal Auth Guard          */
/* ============================= */

const INTERNAL_SECRET = process.env.INTERNAL_SECRET;

if (!INTERNAL_SECRET) {
  throw new Error(
    "INTERNAL_SECRET environment variable is not set. " +
    "Set a strong random string shared between the server and execution engine."
  );
}

app.use((req, res, next) => {
  const token = req.headers["x-internal-token"];

  if (token !== INTERNAL_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  next();
});

/* ============================= */
/* Body Parser                  */
/* ============================= */

app.use(express.json({ limit: "100kb" }));

/* ============================= */
/* Routes                       */
/* ============================= */

app.use("/", executeRouter);

/* ============================= */
/* Health Check                 */
/* ============================= */

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "execution-engine" });
});

/* ============================= */
/* Start                        */
/* ============================= */

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Execution engine running on port ${PORT}`);
});