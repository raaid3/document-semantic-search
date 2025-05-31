import { Router } from "express";
import { processFiles } from "../controllers/fileUploadController.js";
import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
export const fileUploadRouter = Router();

fileUploadRouter.post("/", upload.array("file"), processFiles);
