import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import Navbar from "./Navbar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TriangleAlert } from "lucide-react";
import DocumentSkeleton from "./DocumentSkeleton";

interface APIResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface AssembleDocumentResponseData {
  rawMarkdown: string;
  documentTitle: string;
}

export default function DocumentViewPage() {
  const { chunkId } = useParams<{ chunkId: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [markdownContent, setMarkdownContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [documentTitle, setDocumentTitle] = useState<string | null>(null);

  async function fetchDocumentById(
    id: string
  ): Promise<AssembleDocumentResponseData> {
    try {
      const response = await fetch(`/api/assembleDocument/${id}`);
      const responseData: APIResponse<AssembleDocumentResponseData> =
        await response.json();

      if (!response.ok) {
        const errorMessage =
          responseData.message ||
          `Failed to fetch document (status: ${response.status})`;
        console.error(errorMessage);
        throw new Error(errorMessage);
      }

      if (responseData.success) {
        return responseData.data;
      } else {
        const errorMessage =
          responseData.message ||
          "Document content not found or in unexpected format in API response.";
        console.error(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (err) {
      console.error(`Error in fetchDocumentById for id ${id}:`, err);

      if (err instanceof Error) {
        throw err;
      } else {
        throw new Error(
          String(err || "An unknown error occurred during fetch.")
        );
      }
    }
  }

  useEffect(() => {
    if (chunkId) {
      const loadDocument = async () => {
        setIsLoading(true);
        setError(null);
        setMarkdownContent(null);
        setDocumentTitle(null);
        try {
          const { rawMarkdown, documentTitle } = await fetchDocumentById(
            chunkId
          );
          setMarkdownContent(rawMarkdown);
          setDocumentTitle(documentTitle);
        } catch (err) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("An unknown error occurred while fetching the document.");
          }
        } finally {
          setIsLoading(false);
        }
      };
      loadDocument();
    } else {
      setError("Document ID is missing.");
      setIsLoading(false);
      setMarkdownContent(null);
      setDocumentTitle(null);
    }
  }, [chunkId]);

  useEffect(() => {
    if (markdownContent && !isLoading && !error) {
      const timerId = setTimeout(() => {
        const targetElement = document.getElementById("target-chunk");
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth", block: "center" });

          targetElement.style.transition = "background-color 0.5s ease-in-out";
          targetElement.style.backgroundColor = "rgba(255, 255, 0, 0.3)";
          setTimeout(() => {
            targetElement.style.backgroundColor = "";
          }, 2000);
        } else {
          console.warn(
            "Target chunk element with ID 'target-chunk' not found after loading."
          );
        }
      }, 100);

      return () => clearTimeout(timerId);
    }
  }, [markdownContent, isLoading, error]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <DocumentSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Alert variant="destructive" className="max-w-2xl mx-auto">
            <TriangleAlert className="h-5 w-5 mr-2" />
            <AlertTitle>Error Loading Document</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </main>
      </div>
    );
  }

  if (!markdownContent) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="text-center py-10">
            <p className="text-xl font-semibold text-muted-foreground">
              Document Not Found
            </p>
            <p className="text-muted-foreground">
              The requested document could not be loaded or is empty.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 ">
        <article className="max-w-4xl mx-auto bg-card p-6 sm:p-8 rounded-lg shadow overflow-scroll">
          {documentTitle && (
            <h1 className="mb-6 border-b pb-4">{documentTitle}</h1>
          )}
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
          >
            {markdownContent}
          </ReactMarkdown>
        </article>
      </main>
    </div>
  );
}
