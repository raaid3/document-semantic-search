import { MongoClient } from "mongodb";
import "dotenv/config";
const uri = process.env.MONGODB_URI!;
import { type EmbeddedChunk } from "../utils/embedding.js";
const client = new MongoClient(uri);

export async function storeChunks(chunks: EmbeddedChunk[]) {
  const db = client.db("document-semantic-search");
  const files = db.collection("user_files");

  try {
    const result = await files.insertMany(chunks);
    console.log(`Successfully stored ${result.insertedCount} chunks`);
    return result;
  } catch (error) {
    console.error("Error storing chunks:", error);
    throw error;
  }
}
