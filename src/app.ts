import express from "express";
import dotenv from "dotenv";
import { testRouter } from "./routes/testRoute.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/api", (req, res) => {
  res.send("hi");
});

app.use("/test", testRouter);

app.listen(PORT);
