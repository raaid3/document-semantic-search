import { useState, type FormEvent, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "./Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon, Loader2 } from "lucide-react";
import SearchResultCard from "./SearchResultCard";
import SearchResultSkeleton from "./SearchResultSkeleton";

const apiEndpoint = import.meta.env.VITE_API_URL as string;

// interfaces
interface SearchResult {
  _id: string;
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

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams({ q: "" });
  const q = searchParams.get("q") as string;
  const [query, setQuery] = useState(q);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    setQuery(q);
    if (q) {
      performSearch(q);
    } else {
      setResults([]);
    }
  }, [q]);

  async function performSearch(query: string) {
    // if query is empty
    if (!query.trim()) {
      setError("Please enter a search query.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    setResults([]);

    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("Please upload files before searching.");
      setIsLoading(false);
      return;
    }

    try {
      // Querying the API
      const APIQuery = JSON.stringify({ query, userId });
      const response = await fetch(`${apiEndpoint}/api/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: APIQuery,
      });

      if (!response.ok) {
        const errorData: APIResponse<null> = await response.json();
        console.error(`${errorData.message}`);
        throw new Error(`Search failed with status: ${response.status}`);
      }

      const data: APIResponse<SearchResultData> = await response.json();
      if (data.success && data.data && data.data.results) {
        setResults(data.data.results);
      } else {
        setResults([]);
        setError("No results found or unexpected response format.");
      }
    } catch (err) {
      console.error("Search error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred during search."
      );
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }

  const handleSearchSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchParams({ q: query });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Search form */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center gap-2 mb-8"
          >
            <Input
              type="search"
              placeholder="Enter your search query..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (error) setError(null);
              }}
              className="flex-grow"
              aria-label="Search query"
            />
            <Button type="submit" disabled={isLoading || !query.trim()}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <SearchIcon className="mr-2 h-4 w-4" />
              )}
              Search
            </Button>
          </form>

          {/* Results area */}
          <div className="space-y-4">
            {isLoading && (
              <>
                <SearchResultSkeleton />
                <SearchResultSkeleton />
                <SearchResultSkeleton />
              </>
            )}

            {error && !isLoading && (
              <div className="text-center py-6 bg-destructive/10 text-destructive p-4 rounded-md">
                <p className="font-semibold">Error:</p>
                <p>{error}</p>
              </div>
            )}

            {!isLoading && !error && hasSearched && results.length === 0 && (
              <div className="text-center py-10">
                <p className="text-xl font-semibold text-muted-foreground">
                  No Results Found
                </p>
                <p className="text-muted-foreground">
                  Try a different search term or check your uploaded documents.
                </p>
              </div>
            )}

            {!isLoading && !error && !hasSearched && results.length === 0 && (
              <div className="text-center py-10">
                <p className="text-xl font-semibold text-muted-foreground">
                  Ready to Search?
                </p>
                <p className="text-muted-foreground">
                  Enter your query above to find information within your
                  documents.
                </p>
              </div>
            )}

            {!isLoading && !error && results.length > 0 && (
              <>
                <p className="text-sm text-muted-foreground">
                  Showing {results.length} result(s) for "{q}"
                </p>
                {results.map((result) => (
                  <SearchResultCard key={result._id} result={result} />
                ))}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default SearchPage;
