import { MongoClient } from "mongodb";
import "dotenv/config";
const uri = process.env.MONGODB_URI!;
import { type EmbeddedChunk } from "../utils/embedding.js";
const client = new MongoClient(uri);

const db = client.db("document-semantic-search");
const files = db.collection("user_files");

export async function storeChunks(chunks: EmbeddedChunk[]) {
  try {
    const result = await files.insertMany(chunks);
    console.log(`Successfully stored ${result.insertedCount} chunks`);
    return result;
  } catch (error) {
    console.error("Error storing chunks:", error);
    throw error;
  }
}

export async function queryDatabase(embedding: number[], userId: string) {
  try {
    const results = await files
      .aggregate([
        {
          $vectorSearch: {
            index: "vector_index",
            path: "embedding",
            queryVector: embedding,
            filter: { userId: userId },
            numCandidates: 100,
            limit: 10,
          },
        },
        {
          $project: {
            content: 1,
            rawMarkdown: 1,
            metadata: 1,
            score: { $meta: "vectorSearchScore" },
          },
        },
      ])
      .toArray();
    return results;
  } catch (err) {
    console.error("Error Querying database");
    throw err;
  }
}
