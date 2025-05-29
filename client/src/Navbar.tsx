import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { FileSearch } from "lucide-react";

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b px-2.5">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link to="/" className="mr-6 flex items-center space-x-2">
          <FileSearch />
          <span className="font-bold">Markdown Semantic Search</span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button variant="ghost" asChild>
            <Link to="/">Home</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/fileUpload">Upload Files</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/search">Search</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
