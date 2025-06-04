import express from "express";
import dotenv from "dotenv";
import { apiRouter } from "./routes/apiRoute.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use("/api", apiRouter);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT} and host 0.0.0.0`);
});
