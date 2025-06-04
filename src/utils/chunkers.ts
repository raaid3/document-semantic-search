import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { v4 as uuidv4 } from "uuid";
import { ObjectId } from "mongodb";
import removeMarkdown from "remove-markdown"

const chunkSize = 900; // characters
const chunkOverlap = 0; // characters

export interface MarkdownChunk {
  _id: ObjectId;
  content: string;
  rawMarkdown: string;
  metadata: {
    chunkIndex: number;
    documentId: string;
    filename: string;
  };
}

const chunker = new RecursiveCharacterTextSplitter({
      chunkSize,
      chunkOverlap, 
      
      separators: [
        "\n# ",
        "\n## ",
        "\n### ", 
        "\n#### ",
        "\n##### ",
        "\n###### ",
        "\n\n---\n\n",
        "\n\n",
        "\n```\n",
        "```\n",
        "\n- ",
        "\n* ",
        "\n+ ",
        "\n1. ",
        "\n2. ",
        "\n",
        ". ",
        "! ",
        "? ",
        "; ",
        ", ",
        " ",
        "",
      ],
    });



export async function chunkDocument(
  markdown: string,
  documentId: string,
  filename: string
): Promise<MarkdownChunk[]> {

  // Split using recursive splitter
  const docs = await chunker.createDocuments([markdown]);

  const chunks: MarkdownChunk[] = [];

  for (let i = 0; i < docs.length; i++) {
    const doc = docs[i];

    chunks.push({
      _id: new ObjectId(),
      content: removeMarkdown(doc.pageContent),
      rawMarkdown: doc.pageContent,
      metadata: {
        chunkIndex: i,
        documentId,
        filename,
      },
    });
  }

    return chunks;
  }



