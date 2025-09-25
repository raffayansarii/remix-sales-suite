import { Skeleton } from "./skeleton"
import { cn } from "@/lib/utils"

interface ContentLoaderProps {
  className?: string
  type?: "table" | "cards" | "list" | "form"
  rows?: number
  cols?: number
}

export function ContentLoader({ 
  className, 
  type = "table", 
  rows = 5, 
  cols = 4 
}: ContentLoaderProps) {
  const renderTableLoader = () => (
    <div className="space-y-4">
      {/* Table header */}
      <div className="grid grid-cols-4 gap-4 p-4 border-b">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
      
      {/* Table rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-4 gap-4 p-4 border-b border-border/40">
          {Array.from({ length: cols }).map((_, colIndex) => (
            <Skeleton 
              key={colIndex} 
              className={cn(
                "h-4",
                colIndex === 0 ? "w-3/4" : colIndex === 1 ? "w-full" : "w-1/2"
              )} 
            />
          ))}
        </div>
      ))}
    </div>
  )

  const renderCardsLoader = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-4 border rounded-lg space-y-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
          <div className="flex space-x-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  )

  const renderListLoader = () => (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center space-x-3 p-3 border rounded">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-8 w-16" />
        </div>
      ))}
    </div>
  )

  const renderFormLoader = () => (
    <div className="space-y-6 max-w-md">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      <Skeleton className="h-10 w-24 mt-6" />
    </div>
  )

  const renderLoader = () => {
    switch (type) {
      case "cards":
        return renderCardsLoader()
      case "list":
        return renderListLoader()
      case "form":
        return renderFormLoader()
      default:
        return renderTableLoader()
    }
  }

  return (
    <div className={cn("animate-pulse", className)}>
      {renderLoader()}
    </div>
  )
}