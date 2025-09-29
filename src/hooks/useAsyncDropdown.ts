import { useEffect, useCallback } from "react"
import { AsyncDropdownOption } from "@/components/ui/async-dropdown"

/**
 * Hook to integrate RTK Query lazy queries with AsyncDropdown component
 * 
 * @param lazyQueryHook - RTK Query lazy query hook (e.g., useLazySearchItemsQuery)
 * @param mapToOptions - Function to transform API response items to dropdown options
 * @returns Function compatible with AsyncDropdown's useSearchQuery prop
 */
export function useAsyncDropdown<TApiResponse>(
  lazyQueryHook: () => [
    (arg: { search: string; limit?: number }) => void,
    {
      data?: TApiResponse[]
      isLoading: boolean
      isError: boolean
      error?: any
    }
  ],
  mapToOptions: (items: TApiResponse[]) => AsyncDropdownOption[]
) {
  const [trigger, result] = lazyQueryHook()

  const searchQuery = useCallback(({ search, limit }: { search: string; limit?: number }) => {
    // Auto-trigger search when search term changes
    if (search) {
      trigger({ search, limit })
    }

    return {
      data: result.data || [],
      isLoading: result.isLoading,
      isError: result.isError,
      error: result.error
    }
  }, [trigger, result])

  return {
    useSearchQuery: searchQuery,
    mapToOptions
  }
}

/**
 * Simplified hook that returns a search function ready to use with AsyncDropdown
 */
export function useAsyncDropdownQuery<TApiResponse>(
  lazyQueryHook: () => [
    (arg: { search: string; limit?: number }) => void,
    {
      data?: TApiResponse[]
      isLoading: boolean
      isError: boolean
      error?: any
    }
  ],
  mapToOptions: (items: TApiResponse[]) => AsyncDropdownOption[]
) {
  const [trigger, result] = lazyQueryHook()

  return useCallback(({ search, limit }: { search: string; limit?: number }) => {
    useEffect(() => {
      if (search) {
        trigger({ search, limit })
      }
    }, [search, limit])

    return {
      data: result.data ? mapToOptions(result.data) : [],
      isLoading: result.isLoading,
      isError: result.isError,
      error: result.error
    }
  }, [trigger, result, mapToOptions])
}