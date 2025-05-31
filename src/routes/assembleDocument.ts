import { Router } from "express";
import { assembleDocumentController } from "../controllers/assembleDocumentController.js";
export const assembleDocumentRouter = Router();

assembleDocumentRouter.get("/:chunkId", assembleDocumentController);
