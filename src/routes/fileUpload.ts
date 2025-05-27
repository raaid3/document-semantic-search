import { Router } from "express";
import { processFile } from "../controllers/fileUploadController.js";
import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
export const fileUploadRouter = Router();

fileUploadRouter.post("/", upload.single("file"), processFile);
