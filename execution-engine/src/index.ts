import express from "express";
import executeRoute from "./routes/execute.route";

const app = express();
app.use(express.json());

app.use("/execute", executeRoute);

app.listen(5001, () => {
  console.log("Execution Engine running on port 5001");
});