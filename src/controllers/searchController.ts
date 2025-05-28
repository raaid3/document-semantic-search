import { type Request, type Response } from "express";
import { embedQuery } from "../utils/embedding.js";
import { queryDatabase } from "../db/mongoClient.js";
export async function searchQuery(req: Request, res: Response) {
  try {
    const { query, userId }: { query: string; userId: string } = req.body;
    // Generate an embedding for the query
    const embedding = await embedQuery(query);

    const results = await queryDatabase(embedding, userId);

    res.json({
      query,
      userId,
      resultsCount: results.length,
      results: results.map((result) => ({
        _id: result._id,
        content: result.content,
        rawMarkdown: result.rawMarkdown,
        similarityScore: result.score,
        documentName: result.metadata?.filename,
      })),
    });
  } catch (error) {
    console.error("Error Searching for query :(");
    res.status(500).json({
      success: false,
      message: "Search failed",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
