import { Router } from "express";
import { searchQuery } from "../controllers/searchController.js";
export const searchRouter = Router();

searchRouter.post("/", searchQuery);
