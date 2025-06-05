import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Search, UploadCloud } from "lucide-react";
import Navbar from "./Navbar.tsx";
function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
    </div>
  );
}

function Hero() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-background flex-grow flex justify-center">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-6 text-center">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
              Unlock Your Markdown's Potential
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Easily upload your markdown files and dive deep with intelligent
              semantic search. Find what you need, faster.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Button size="lg" asChild>
              <Link to="/fileUpload">
                <UploadCloud className="mr-2 h-5 w-5 " />
                Upload Documents
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/search">
                <Search className="mr-2 h-5 w-5" />
                Start Searching
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Home;
