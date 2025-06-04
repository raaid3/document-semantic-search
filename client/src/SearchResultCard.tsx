import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface SearchResult {
  _id: string;
  content: string;
  rawMarkdown: string;
  similarityScore: number;
  documentName: string;
}

interface SearchResultCardProps {
  result: SearchResult;
}

export default function SearchResultCard({ result }: SearchResultCardProps) {
  const snippet =
    result.content.length > 200
      ? result.content.substring(0, 200) + "..."
      : result.content;

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg">
          {result.documentName || "Untitled Document"}
        </CardTitle>
        {result.similarityScore !== undefined && (
          <CardDescription>
            Relevance: {(result.similarityScore * 100).toFixed(1)}%
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-4">{snippet}</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" asChild className="ml-auto">
          <Link to={`/view-document/${result._id}`}>
            View Details
            <ExternalLink className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
