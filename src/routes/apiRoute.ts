import { Router } from "express";
import { fileUploadRouter } from "./fileUpload.js";
export const apiRouter = Router();

apiRouter.use("/fileUpload", fileUploadRouter);
