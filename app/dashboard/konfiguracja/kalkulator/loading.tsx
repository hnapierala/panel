import { Skeleton } from "@/components/ui/skeleton"

export default function CalculatorSettingsLoading() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="flex flex-col space-y-2 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-9 w-24" />
        </div>
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-5 w-1/2" />
      </div>

      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="p-4 border-b border-neutral-200 last:border-b-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div>
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-4 w-64" />
                </div>
              </div>
              <Skeleton className="h-5 w-5 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
