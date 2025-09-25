import { Skeleton } from "./skeleton"
import { cn } from "@/lib/utils"

interface PageLoaderProps {
  className?: string
  message?: string
}

export function PageLoader({ className, message = "Loading..." }: PageLoaderProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center min-h-screen bg-background",
      className
    )}>
      <div className="flex flex-col items-center space-y-4 max-w-sm w-full px-6">
        {/* Logo/Brand skeleton */}
        <Skeleton className="h-12 w-12 rounded-full" />
        
        {/* Loading bars */}
        <div className="w-full space-y-2">
          <Skeleton className="h-2 w-3/4 mx-auto" />
          <Skeleton className="h-2 w-1/2 mx-auto" />
        </div>
        
        {/* Message */}
        <p className="text-sm text-muted-foreground animate-pulse">
          {message}
        </p>
      </div>
    </div>
  )
}