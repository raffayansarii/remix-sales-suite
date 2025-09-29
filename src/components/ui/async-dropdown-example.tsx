// Example usage of AsyncDropdown with RTK Query

import React from "react"
import { AsyncDropdown, AsyncDropdownOption } from "./async-dropdown"
import { baseApi } from "@/api/baseApi"

// Example: Create a search API endpoint
const searchApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    searchOpportunities: builder.query<any[], { search: string; limit?: number }>({
      query: ({ search, limit = 50 }) => ({
        url: "opportunities",
        params: {
          ...(search && { [search.split('.')[0]]: search }),
          limit,
          select: "*"
        }
      }),
      providesTags: ["Opportunity"],
    }),
    searchTags: builder.query<any[], { search: string; limit?: number }>({
      query: ({ search, limit = 50 }) => ({
        url: "tags", 
        params: {
          ...(search && { [search.split('.')[0]]: search }),
          limit,
          select: "*"
        }
      }),
      providesTags: ["Tag"],
    }),
  }),
})

export const { useLazySearchOpportunitiesQuery, useLazySearchTagsQuery } = searchApi

// Example component showing usage
export function AsyncDropdownExamples() {
  return (
    <div className="space-y-4 p-4">
      <div>
        <label className="text-sm font-medium">Search Opportunities</label>
        <AsyncDropdown
          placeholder="Select opportunity..."
          useSearchQuery={({ search, limit }) => {
            const [trigger, result] = useLazySearchOpportunitiesQuery()
            
            // Trigger search when needed
            React.useEffect(() => {
              if (search) {
                trigger({ search, limit })
              }
            }, [search, limit, trigger])
            
            return result
          }}
          mapToOptions={(items) => 
            items.map(item => ({
              value: item.id,
              label: `${item.title} - ${item.company}`,
              ...item
            }))
          }
          searchConfig={{
            searchFields: ["title", "company"],
            operator: "ilike",
            limit: 20
          }}
          onValueChange={(value) => console.log("Selected opportunity:", value)}
        />
      </div>

      <div>
        <label className="text-sm font-medium">Search Tags</label>
        <AsyncDropdown
          placeholder="Select tag..."
          useSearchQuery={({ search, limit }) => {
            const [trigger, result] = useLazySearchTagsQuery()
            
            React.useEffect(() => {
              if (search) {
                trigger({ search, limit })
              }
            }, [search, limit, trigger])
            
            return result
          }}
          mapToOptions={(items) => 
            items.map(item => ({
              value: item.id,
              label: item.name,
              color: item.color
            }))
          }
          searchConfig={{
            searchFields: ["name"],
            operator: "ilike",
            limit: 10
          }}
          onValueChange={(value) => console.log("Selected tag:", value)}
        />
      </div>
    </div>
  )
}

// Alternative: Create a custom hook for easier usage
export function useAsyncDropdownQuery<T>(
  lazyQueryHook: any,
  mapFn: (items: T[]) => AsyncDropdownOption[]
) {
  const [trigger, result] = lazyQueryHook()

  const searchQuery = React.useCallback(({ search, limit }: { search: string; limit?: number }) => {
    if (search) {
      trigger({ search, limit })
    }
    return {
      data: result.data ? mapFn(result.data) : [],
      isLoading: result.isLoading,
      isError: result.isError,
      error: result.error
    }
  }, [trigger, result, mapFn])

  return searchQuery
}