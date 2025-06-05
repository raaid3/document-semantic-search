import express from "express";
import dotenv from "dotenv";
import { apiRouter } from "./routes/apiRoute.js";
import cors from "cors";
dotenv.config();

const app = express();
const PORT = process.env.PORT;
app.use(express.json());
app.use(cors());
app.use("/api", apiRouter);
app.get("/ping", (req, res) => {
  res.status(200).send("PONG");
});
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
