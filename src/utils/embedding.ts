import { AzureOpenAI } from "openai";
import { ObjectId } from "mongodb";
import "dotenv/config";
import {MarkdownChunk} from "./chunkers.js";
const endpoint = process.env.AZURE_OPENAI_ENDPOINT!;
const modelName = "text-embedding-3-small";
const apiKey = process.env.AZURE_OPENAI_KEY!;
const apiVersion = "2024-04-01-preview";
const deployment = "text-embedding-3-small";
const options = { endpoint, apiKey, deployment, apiVersion };

const client = new AzureOpenAI(options);


export interface EmbeddedChunk {
  _id: ObjectId;
  content: string;
  rawMarkdown: string;
  embedding: number[];
  sessionId: string;
  documentId: string;
  metadata: {
    chunkIndex: number;
    filename: string;
  };
  createdAt: Date;
}


export async function embedChunks(
  chunks: MarkdownChunk[],
  sessionId: string
): Promise<EmbeddedChunk[]> {
  try {
    console.log(`Generating embeddings for ${chunks.length} chunks...`);

    const textsToEmbed = chunks.map((chunk) => chunk.content);

    const response = await client.embeddings.create({
      input: textsToEmbed,
      model: deployment,
    });

    if (!response.data || response.data.length !== chunks.length) {
      throw new Error(
        `Embedding response mismatch: expected ${
          chunks.length
        } embeddings, got ${response.data?.length || 0}`
      );
    }


    const embeddedChunks: EmbeddedChunk[] = chunks.map((chunk, index) => ({
      _id: chunk._id,
      content: chunk.content,
      rawMarkdown: chunk.rawMarkdown,
      embedding: response.data[index].embedding,
      sessionId,
      documentId: chunk.metadata.documentId,
      metadata: {
        chunkIndex: chunk.metadata.chunkIndex,
        filename: chunk.metadata.filename,
      },
      createdAt: new Date(),
    }));

    console.log(
      `Successfully generated embeddings for ${embeddedChunks.length} chunks`
    );
    console.log(
      `Total tokens used: ${response.usage?.total_tokens || "unknown"}`
    );

    return embeddedChunks;
  } catch (error) {
    console.error("Error generating embeddings:", error);
    throw new Error(
      `Failed to generate embeddings: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

export async function embedQuery(queryText: string): Promise<number[]> {
  try {
    const response = await client.embeddings.create({
      input: [queryText],
      model: deployment,
    });

    if (!response.data || response.data.length === 0) {
      throw new Error("No embedding returned for query");
    }

    return response.data[0].embedding;
  } catch (error) {
    console.error("Error generating query embedding:", error);
    throw new Error(
      `Failed to generate query embedding: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
