import { type Request, type Response } from "express";
import { embedQuery } from "../utils/embedding.js";
import { queryDatabase } from "../db/mongoClient.js";
import { ObjectId } from "mongodb";

interface SearchResult {
  _id: ObjectId;
  content: string;
  rawMarkdown: string;
  similarityScore: number;
  documentName: string;
}

interface SearchResultData {
  query: string;
  userId: string;
  resultsCount: number;
  results: SearchResult[];
}

interface APIResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export async function searchQuery(req: Request, res: Response) {
  try {
    const { query, userId }: { query: string; userId: string } = req.body;
    // Generate an embedding for the query
    const embedding = await embedQuery(query);

    const results = await queryDatabase(embedding, userId);
    const jsonResponse: APIResponse<SearchResultData> = {
      success: true,
      message: "Successful search",
      data: {
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
      },
    };
    res.json(jsonResponse);
  } catch (error) {
    console.error(`Error searching for query: ${error.message}`);
    const jsonResponse: APIResponse<null> = {
      success: false,
      message: "Search failed",
      data: null,
    };
    res.status(500).json(jsonResponse);
  }
}
