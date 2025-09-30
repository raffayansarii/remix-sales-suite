"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { FormLabel } from "./form";

type AsyncSelectProps<T> = {
  fetchOptions: (params?: string) => Promise<T[]>; // backend fetcher
  renderOption: (item: T) => React.ReactNode;
  getOptionLabel: (item: T) => string;
  onSelect: (item: T) => void;
  placeholder?: string;
  label?: string;
  searchKey?: string; // 🔑 new: allows ?name=, ?slug=, etc.
};

export function AsyncSelect<T>({
  fetchOptions,
  renderOption,
  getOptionLabel,
  onSelect,
  placeholder = "Select...",
  label = "Select",
  searchKey = "q", // default
}: AsyncSelectProps<T>) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [options, setOptions] = React.useState<T[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [selected, setSelected] = React.useState<T | null>(null);

  // Debounce query
  const [debouncedQuery, setDebouncedQuery] = React.useState("");
  React.useEffect(() => {
    const timeout = setTimeout(() => setDebouncedQuery(query), 400);
    return () => clearTimeout(timeout);
  }, [query]);

  // Stable fetch
  const stableFetch = React.useCallback(fetchOptions, []);

  // Fetch when open or query changes
  React.useEffect(() => {
    if (!open) return;
    setLoading(true);

    let param: string | undefined;
    if (debouncedQuery.trim().length > 0) {
      param = `${searchKey}=ilike.%${encodeURIComponent(debouncedQuery)}%`;
    }

    stableFetch(param)
      .then((res) => setOptions(res))
      .finally(() => setLoading(false));
  }, [debouncedQuery, open, stableFetch, searchKey]);

  return (
    <div className="min-w-[250px] w-full">
      <FormLabel>{label}</FormLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div
            className="mt-2 border rounded px-3 py-2 text-sm cursor-pointer flex items-center justify-between"
            role="button"
          >
            {selected ? getOptionLabel(selected) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            <span className="ml-2 text-muted-foreground">▾</span>
          </div>
        </PopoverTrigger>

        <PopoverContent className="p-0 w-[250px]">
          <Command>
            {/* Search input inside dropdown */}
            <div className="p-2">
              <Input
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
            </div>

            <CommandList>
              {loading && <div className="p-2 text-sm">Loading...</div>}

              {!loading && options.length > 0 && (
                <CommandGroup>
                  {options.map((item, idx) => (
                    <CommandItem
                      key={idx}
                      onSelect={() => {
                        setSelected(item);
                        onSelect(item);
                        setOpen(false);
                        setQuery(""); // clear search after selection
                      }}
                    >
                      {renderOption(item)}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {!loading && options.length === 0 && (
                <CommandEmpty>No results found.</CommandEmpty>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
