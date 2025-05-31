import { type Request, type Response } from "express";
import { assembleDocument } from "../utils/assembleDocumentUtils.js";

interface APIResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface assembleDocumentResponse {
  rawMarkdown: string;
  documentTitle: string;
}

export async function assembleDocumentController(req: Request, res: Response) {
  try {
    const chunkId = req.params.chunkId;
    const { rawMd, docTitle } = await assembleDocument(chunkId);
    const jsonRes: APIResponse<assembleDocumentResponse> = {
      success: true,
      message: "Document Retrieved",
      data: { rawMarkdown: rawMd, documentTitle: docTitle },
    };
    res.json(jsonRes);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
}
