// Complete example showing how to use AsyncDropdown with existing APIs

import React, { useState } from "react"
import { AsyncDropdown } from "./async-dropdown"
import { baseApi } from "@/api/baseApi"

// Extend existing API with search endpoints
const searchApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    searchOpportunities: builder.query<any[], { search: string; limit?: number }>({
      query: ({ search, limit = 50 }) => {
        const params: any = { limit, select: "*" }
        if (search) {
          // Parse PostgREST query and add to params
          const queryParts = search.split('.')
          if (queryParts.length >= 3) {
            params[queryParts[0]] = `${queryParts[1]}.${queryParts.slice(2).join('.')}`
          }
        }
        return {
          url: "opportunities",
          params
        }
      },
      providesTags: ["Opportunity"],
    }),
  }),
})

export const { useLazySearchOpportunitiesQuery } = searchApi

// Usage example in a form component
export function OpportunitySelector() {
  const [selectedOpportunity, setSelectedOpportunity] = useState<string | number>("")
  const [trigger, result] = useLazySearchOpportunitiesQuery()

  return (
    <div className="w-full max-w-md">
      <AsyncDropdown
        placeholder="Search and select opportunity..."
        value={selectedOpportunity}
        onValueChange={setSelectedOpportunity}
        useSearchQuery={({ search, limit }) => {
          // Trigger the search when search term changes
          React.useEffect(() => {
            if (search) {
              trigger({ search, limit })
            }
          }, [search, limit])

          return {
            data: result.data || [],
            isLoading: result.isLoading,
            isError: result.isError,
            error: result.error
          }
        }}
        mapToOptions={(opportunities) =>
          opportunities.map((opp) => ({
            value: opp.id,
            label: `${opp.title} - ${opp.company}`,
            company: opp.company,
            value_amount: opp.value
          }))
        }
        searchConfig={{
          searchFields: ["title", "company", "agency"],
          operator: "ilike",
          limit: 20
        }}
        debounceMs={400}
      />
    </div>
  )
}

// Example with form integration
export function CreateTaskWithOpportunity() {
  const [opportunityId, setOpportunityId] = useState<string | number>("")
  const [trigger, result] = useLazySearchOpportunitiesQuery()

  return (
    <form className="space-y-4 p-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          Link to Opportunity (optional)
        </label>
        <AsyncDropdown
          placeholder="Search opportunities..."
          value={opportunityId}
          onValueChange={setOpportunityId}
          useSearchQuery={({ search, limit }) => {
            React.useEffect(() => {
              if (search) {
                trigger({ search, limit })
              }
            }, [search, limit])

            return {
              data: result.data || [],
              isLoading: result.isLoading,
              isError: result.isError
            }
          }}
          mapToOptions={(opportunities) =>
            opportunities.map((opp) => ({
              value: opp.id,
              label: `${opp.title} (${opp.company}) - $${opp.value?.toLocaleString() || 0}`
            }))
          }
          searchConfig={{
            searchFields: ["title", "company"],
            operator: "ilike"
          }}
        />
      </div>
      
      {opportunityId && (
        <p className="text-sm text-muted-foreground">
          Selected opportunity ID: {opportunityId}
        </p>
      )}
    </form>
  )
}