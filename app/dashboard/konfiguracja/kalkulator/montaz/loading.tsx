import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function LoadingMountingSystems() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/konfiguracja/kalkulator">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Powrót
          </Link>
        </Button>
      </div>

      <div className="flex flex-col space-y-2 mb-8">
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-md" />
          <Skeleton className="h-10 w-64" />
        </div>
        <Skeleton className="h-5 w-full max-w-xl" />
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <Skeleton className="h-10 w-full max-w-sm" />
        <Skeleton className="h-10 w-48" />
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="p-4">
          <div className="flex items-center justify-between border-b pb-4">
            <Skeleton className="h-5 w-[300px]" />
            <Skeleton className="h-5 w-[200px]" />
            <Skeleton className="h-5 w-[150px]" />
            <Skeleton className="h-5 w-[120px]" />
          </div>

          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="flex items-center justify-between py-4 border-b">
                <Skeleton className="h-5 w-[280px]" />
                <Skeleton className="h-5 w-[180px]" />
                <Skeleton className="h-5 w-[130px]" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
