import { type Response, type Request } from "express";
import { v4 as uuidv4 } from "uuid";
import "dotenv/config";
import {
  chunkDocument
} from "../utils/chunkers.js";
import { embedChunks, type EmbeddedChunk } from "../utils/embedding.js";
import { storeChunks } from "../db/mongoClient.js";

export async function processFiles(req: Request, res: Response) {
  console.log("Processing files...");

  try {
    // Get the user's unique id (generated client-side)
    const userId: string = req.body.userId;
    const files = req.files as Express.Multer.File[];

    // metadata
    let numChunksCreated = 0;
    let totalTokensEstimate = 0;

    for (const file of files) {
      const documentId: string = uuidv4();
      const fileName = file.originalname;
      const rawText = file.buffer.toString("utf8");

      console.log(`Processing file: ${fileName} for user: ${userId}`);

      // Use math-aware chunker for better handling of mathematical content
      const chunks = await chunkDocument(
        rawText,
        documentId,
        fileName
      );

      console.log(`Created ${chunks.length} chunks from ${fileName}`);

      // Generate embeddings for all chunks
      const embeddedChunks: EmbeddedChunk[] = await embedChunks(chunks, userId);

      // Log statistics
      const tokensEstimate = embeddedChunks.reduce(
        (sum, chunk) => sum + chunk.content.split(" ").length,
        0
      );

      //storing in database
      await storeChunks(embeddedChunks);

      numChunksCreated += embeddedChunks.length;
      totalTokensEstimate += tokensEstimate;
    }

    res.status(200).json({
      success: true,
      message: "Files processed and embedded and stored successfully",
      data: {
        filesStored: files.length,
        chunksCreated: numChunksCreated,
        estimatedTokens: totalTokensEstimate,
      },
    });
  } catch (error) {
    console.error("Error processing files:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process files",
      data: {
        error: error instanceof Error ? error.message : "Unknown error",
      },
    });
  }
}
