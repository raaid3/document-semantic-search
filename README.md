# Document Semantic Search

Perform semantic search on Markdown documents leveraging embeddings, chunking, and vector database retrieval.

## Features

- **Markdown Upload & Chunking:** Upload Markdown documents, which are split into semantic chunks using a recursive text splitter. This supports robust handling of structured content.
- **Embedding Generation:** Each chunk is embedded using Azure OpenAI's embedding API, ensuring high-quality semantic representation.
- **Vector Database Search:** Embedded chunks are stored in MongoDB with vector search capabilities. Semantic queries are mapped to vectors and matched against stored chunks for highly relevant search results.
- **React Frontend:** User-friendly React + Typescript UI with file upload, semantic search, and document viewing capabitlities. Mobile-first responsive styling using TailwindCSS. 
- **Express API Backend:** Handles file processing, embedding, chunk storage, and semantic query endpoints.

## Tech Stack

- **Frontend:** React, Typescript, Vite, TailwindCSS
- **Backend:** Node.js, Express
- **Database:** MongoDB Vector Database
- **Embeddings:** Azure OpenAI (text-embedding-3-small)
- **Chunking:** LangChain's `RecursiveCharacterTextSplitter`
- **Other:** ESLint, Prettier

## How It Works

- **Upload:** Users uplaod Markdown files via the web interface.
- **Chunking:** Files are split into semantic segments, prioritizing headings and structure.
- **Embedding:** Each chunk is embedded using Azure OpenAI and stored with metadata.
- **Storage:** Embedded chunks are stored in MongoDB, indexed for vector search.
- **Search:** User queries are embedded, and a MongoDB vector search retrieves relevant document chunks.
- **Display:** Results are presented with similarity scores and document context.

## API Endpoints
- `POST /api/upload`
    - Accepts files, returns chunking/embedding stats.
- `POST /api/search`
    - Accepts a query and user ID, returns relevant chunks with scores.
- `GET /api/document/:chunkId`
    - Retrieves full document context for a specific chunk result.
