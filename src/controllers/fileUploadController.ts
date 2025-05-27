import { type Response, type Request } from "express";
import { v4 as uuidv4 } from "uuid";
import "dotenv/config";
import {
  RecursiveMarkdownChunker,
  processMarkdownFile,
  processMarkdownFileAdvanced,
  processMarkdownFileWithMath,
} from "../utils/chunkers.js";
import { embedChunks, type EmbeddedChunk } from "../utils/embedding.js";
import { storeChunks } from "../db/mongoClient.js";

export async function processFile(req: Request, res: Response) {
  console.log("Processing file...");

  try {
    // Get the user's unique id (generated client-side)
    const userId: string = req.body.userId;
    const documentId: string = uuidv4();
    const fileName = req.file.originalname;
    const rawText = req.file.buffer.toString("utf8");

    console.log(`Processing file: ${fileName} for user: ${userId}`);

    // Use math-aware chunker for better handling of mathematical content
    const chunks = await processMarkdownFileWithMath(
      rawText,
      documentId,
      fileName
    );

    console.log(`Created ${chunks.length} chunks from ${fileName}`);

    // Generate embeddings for all chunks
    const embeddedChunks: EmbeddedChunk[] = await embedChunks(chunks, userId);

    // Log statistics
    const totalTokensEstimate = embeddedChunks.reduce(
      (sum, chunk) => sum + chunk.content.split(" ").length,
      0
    );

    //storing in database
    const result = await storeChunks(embeddedChunks);

    res.status(200).json({
      success: true,
      message: "File processed and embedded and stored successfully",
      data: {
        documentId,
        filename: fileName,
        chunksCreated: embeddedChunks.length,
        // mathChunks: mathChunks.length,
        estimatedTokens: totalTokensEstimate,
        embeddingDimensions: embeddedChunks[0]?.embedding.length || 0,
        storeResult: result,
      },
    });
  } catch (error) {
    console.error("Error processing file:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process file",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
