import { Router } from "express";
import { searchQuery } from "../controllers/searchController.js";
const searchRouter = Router();

searchRouter.post("/", searchQuery);
