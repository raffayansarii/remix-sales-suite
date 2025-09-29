import * as React from "react"
import { useState, useEffect, useMemo } from "react"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface AsyncDropdownOption {
  value: string | number
  label: string
  [key: string]: any
}

export interface AsyncDropdownProps {
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  value?: string | number
  onValueChange?: (value: string | number) => void
  disabled?: boolean
  className?: string
  // RTK Query hook - should be a lazy query hook
  useSearchQuery: (arg: { search: string; limit?: number }) => {
    data?: any[]
    isLoading: boolean
    isError: boolean
    error?: any
  }
  // Function to map API response items to dropdown options
  mapToOptions: (items: any[]) => AsyncDropdownOption[]
  // PostgREST search configuration
  searchConfig?: {
    searchFields: string[] // fields to search in
    operator?: 'ilike' | 'eq' | 'fts' // PostgREST operators
    limit?: number
  }
  // Debounce delay in ms
  debounceMs?: number
}

export function AsyncDropdown({
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  emptyText = "No options found.",
  value,
  onValueChange,
  disabled = false,
  className,
  useSearchQuery,
  mapToOptions,
  searchConfig = {
    searchFields: ["name"],
    operator: "ilike",
    limit: 50
  },
  debounceMs = 300
}: AsyncDropdownProps) {
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchValue)
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [searchValue, debounceMs])

  // Build PostgREST query string
  const searchQuery = useMemo(() => {
    if (!debouncedSearch.trim()) return ""
    
    const { searchFields, operator = "ilike" } = searchConfig
    
    // Create PostgREST query for multiple fields
    const conditions = searchFields.map(field => {
      if (operator === "ilike") {
        return `${field}.${operator}.*${debouncedSearch}*`
      } else if (operator === "fts") {
        return `${field}.${operator}.${debouncedSearch}`
      } else {
        return `${field}.${operator}.${debouncedSearch}`
      }
    })
    
    return conditions.length > 1 ? `or=(${conditions.join(",")})` : conditions[0]
  }, [debouncedSearch, searchConfig])

  // Use the RTK Query hook
  const { data, isLoading, isError } = useSearchQuery({
    search: searchQuery,
    limit: searchConfig.limit
  })

  // Map API response to dropdown options
  const options = useMemo(() => {
    if (!data) return []
    return mapToOptions(data)
  }, [data, mapToOptions])

  // Find selected option
  const selectedOption = options.find(option => option.value === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={disabled}
        >
          {selectedOption ? selectedOption.label : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" style={{ width: "var(--radix-popover-trigger-width)" }}>
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={searchPlaceholder}
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            {isLoading && (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="ml-2 text-sm text-muted-foreground">Searching...</span>
              </div>
            )}
            
            {isError && (
              <div className="p-4 text-sm text-destructive">
                Error loading options
              </div>
            )}
            
            {!isLoading && !isError && options.length === 0 && (
              <CommandEmpty>{emptyText}</CommandEmpty>
            )}
            
            {!isLoading && !isError && options.map((option) => (
              <CommandItem
                key={option.value}
                value={option.value.toString()}
                onSelect={() => {
                  onValueChange?.(option.value)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === option.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}