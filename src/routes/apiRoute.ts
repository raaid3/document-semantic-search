import { Router } from "express";
import { fileUploadRouter } from "./fileUpload.js";
import { searchRouter } from "./search.js";
import { assembleDocumentRouter } from "./assembleDocument.js";
export const apiRouter = Router();

apiRouter.use("/fileUpload", fileUploadRouter);
apiRouter.use("/search", searchRouter);
apiRouter.use("/assembleDocument", assembleDocumentRouter);
