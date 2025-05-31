import { Skeleton } from "@/components/ui/skeleton";

export default function DocumentSkeleton() {
  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <article className="max-w-4xl mx-auto bg-card p-6 sm:p-8 rounded-lg shadow">
        <Skeleton className="h-10 w-3/4 mb-6" />
        <Skeleton className="h-4 w-full mb-4" />

        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </article>
    </main>
  );
}
