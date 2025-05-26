import { Router } from "express";

export const testRouter = Router();

testRouter.get("/", (req, res) => {
  console.log("GET request made.");
  res.status(404).send("Hi, this is a test route.");
});
