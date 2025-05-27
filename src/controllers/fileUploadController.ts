import { createClient } from "@supabase/supabase-js";
import { type Response, type Request } from "express";
import "dotenv/config";
import {
  processMarkdownFile,
  processMarkdownFileAdvanced,
  processMarkdownFileWithMath,
} from "../utils/chunkers.js";

export async function processFile(req: Request, res: Response) {
  const fileName = req.file.originalname;

  console.log("Uploading file...");
  const rawText = req.file.buffer.toString("utf8");

  // Use math-aware chunker for better handling of mathematical content
  const chunks = await processMarkdownFileWithMath(rawText, "1", fileName);

  console.log(`📄 Processed ${fileName}`);
  console.log(`📊 Created ${chunks.length} chunks`);

  // Log math statistics
  const mathChunks = chunks.filter((chunk) => chunk.metadata.hasMath);
  if (mathChunks.length > 0) {
    console.log(`🧮 Found ${mathChunks.length} chunks with math expressions`);
  }

  for (const chunk of chunks) {
    const mathInfo = chunk.metadata.hasMath
      ? ` [📐 ${chunk.metadata.mathCount} math expressions]`
      : "";
    console.log(
      `Chunk ${chunk.metadata.chunkIndex}: ${chunk.content.substring(
        0,
        100
      )}...${mathInfo}`
    );
  }

  res.status(200).json({
    success: true,
    message: "File processed successfully",
    chunksCreated: chunks.length,
    mathChunks: mathChunks.length,
    filename: fileName,
  });
}
