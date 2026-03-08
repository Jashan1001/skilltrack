import express from "express";
import executeRoute from "./routes/execute.route";

const app = express();

app.use(express.json());

/* Health check */
app.get("/", (_req, res) => {
  res.status(200).send("Execution Engine is running");
});

/* Execute API */
app.use("/execute", executeRoute);

/* Fix: ensure PORT is number */
const PORT = Number(process.env.PORT) || 5001;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Execution Engine running on port ${PORT}`);
});