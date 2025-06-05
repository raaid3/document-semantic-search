import {
  collectFileChunks,
  getDocumentInfoByChunkId,
} from "../db/mongoClient.js";
import { type EmbeddedChunk } from "../utils/embedding.js";
import { ObjectId } from "mongodb"; // Import ObjectId

export async function assembleDocument(chunkId: string) {
  try {
    const { docId, docTitle } = await getDocumentInfoByChunkId(chunkId);
    const chunks: EmbeddedChunk[] = await collectFileChunks(docId);

    const targetChunkObjectId = new ObjectId(chunkId);

    const rawMarkdownChunks = chunks.map((chunk) => {
      if (chunk._id.equals(targetChunkObjectId)) {
        return `\n<div id="target-chunk">\n\n${chunk.rawMarkdown}\n\n</div>\n`;
      }
      return chunk.rawMarkdown;
    });

    return { rawMd: rawMarkdownChunks.join("\n\n"), docTitle: docTitle };
  } catch (error) {
    console.error(
      `Error assembling document from chunk id: ${chunkId}: `,
      error
    );
    throw error;
  }
}
