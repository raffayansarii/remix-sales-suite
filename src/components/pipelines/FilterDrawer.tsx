import { useState, useEffect } from "react";
import { X, Plus, Save, FolderOpen, Trash2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FilterGroup } from "./FilterGroup";
import {
  FilterGroup as FilterGroupType,
  FilterConfig,
  FILTER_FIELDS,
} from "@/types/filters";
import { useToast } from "@/hooks/use-toast";
import { FilterDrawerProps } from "./types-and-schemas";
import { Textarea } from "../ui/textarea";
import { CreateUserFilterRequest } from "@/api/opportunity/filters/filtersTypes";

export function FilterDrawer({
  isOpen,
  onClose,
  onApplyFilters,
  activeFilters,
}: FilterDrawerProps) {
  const [filterGroups, setFilterGroups] = useState<FilterGroupType[]>([]);
  const [savedConfigs, setSavedConfigs] = useState<FilterConfig[]>([]);
  const [selectedConfig, setSelectedConfig] = useState<string>("");
  const [configName, setConfigName] = useState("");
  const [configDescription, setConfigDescription] = useState("");
  const [showSaveForm, setShowSaveForm] = useState(false);
  const { toast } = useToast();

  // Initialize with active filters or create a default group
  useEffect(() => {
    if (
      activeFilters &&
      typeof activeFilters === "string" &&
      activeFilters.length > 0
    ) {
      // Optionally, parse the query string back to filterGroups if needed
      // For now, just reset to a single default group
      setFilterGroups([]);
      addFilterGroup();
    } else if (filterGroups.length === 0) {
      addFilterGroup();
    }
  }, [activeFilters]);

  // TODO: Replace with API calls to backend for filter persistence
  // Load saved configs from localStorage
  useEffect(() => {
    console.log("💾 [FILTERS] Loading saved filter configurations");
    const saved = localStorage.getItem("filterConfigs");
    if (saved) {
      const configs = JSON.parse(saved);
      setSavedConfigs(configs);
      console.log(
        "💾 [FILTERS] Loaded",
        configs.length,
        "saved configurations"
      );
    }
  }, []);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addFilterGroup = () => {
    const newGroup: FilterGroupType = {
      id: generateId(),
      field: FILTER_FIELDS[0].value,
      operator: "contains_exactly",
      value: "",
    };
    setFilterGroups([...filterGroups, newGroup]);
  };

  const updateFilterGroup = (index: number, updatedGroup: FilterGroupType) => {
    const updated = [...filterGroups];
    updated[index] = updatedGroup;
    setFilterGroups(updated);
  };

  const removeFilterGroup = (index: number) => {
    const updated = filterGroups.filter((_, i) => i !== index);
    setFilterGroups(updated);
  };

  const clearAllFilters = () => {
    setFilterGroups([]);
    // addFilterGroup();
    onApplyFilters("");
  };

  const applyFilters = () => {
    const validGroups = filterGroups.filter(
      (group) =>
        group.field &&
        group.operator &&
        (!["is_empty", "is_not_empty"].includes(group.operator)
          ? group.value
          : true)
    );

    const filterString = buildPostgresQueryString(validGroups);
    console.log(filterString, validGroups);
    onApplyFilters(filterString);
    // toast({
    //   title: "Filters applied",
    //   description: `Applied ${validGroups.length} filter rule(s)`,
    // });
  };

  const saveFilterConfig = () => {
    if (!configName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a configuration name",
        variant: "destructive",
      });
      return;
    }

    console.log("💾 [FILTERS] Saving filter configuration:", configName);

    const validGroups = filterGroups.filter(
      (group) =>
        group.field &&
        group.operator &&
        (!["is_empty", "is_not_empty"].includes(group.operator)
          ? group.value
          : true)
    );

    const newConfig: FilterConfig = {
      id: generateId(),
      name: configName,
      groups: validGroups,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const BEFilter: CreateUserFilterRequest = {
      p_user_id: "string",
      p_tenant_id: "string",
      p_name: "string",
      p_description: "string",
      p_filter_groups: [
        {
          field: "string",
          operator: "string",
          value: "",
        },
      ],
      p_is_shared: true,
      p_is_default: true,
    };
    console.log("🌐 [API] Would call POST /api/filter-configs", newConfig);

    const existingIndex = savedConfigs.findIndex(
      (config) => config.name === configName
    );
    let updatedConfigs;

    if (existingIndex >= 0) {
      console.log("💾 [FILTERS] Updating existing configuration");
      updatedConfigs = [...savedConfigs];
      updatedConfigs[existingIndex] = {
        ...newConfig,
        id: savedConfigs[existingIndex].id,
      };
    } else {
      console.log("💾 [FILTERS] Creating new configuration");
      updatedConfigs = [...savedConfigs, newConfig];
    }

    setSavedConfigs(updatedConfigs);
    // TODO: Replace localStorage with API call - POST /api/filter-configs
    localStorage.setItem("filterConfigs", JSON.stringify(updatedConfigs));
    setConfigName("");
    setShowSaveForm(false);

    toast({
      title: "Configuration saved",
      description: `Filter configuration "${newConfig.name}" has been saved`,
    });
  };

  const loadFilterConfig = (configId: string) => {
    const config = savedConfigs.find((c) => c.id === configId);
    if (config) {
      setFilterGroups(config.groups);
      setSelectedConfig(configId);
      toast({
        title: "Configuration loaded",
        description: `Loaded "${config.name}" filter configuration`,
      });
    }
  };

  const deleteFilterConfig = (configId: string) => {
    const config = savedConfigs.find((c) => c.id === configId);
    if (config) {
      const updated = savedConfigs.filter((c) => c.id !== configId);
      setSavedConfigs(updated);
      localStorage.setItem("filterConfigs", JSON.stringify(updated));
      if (selectedConfig === configId) {
        setSelectedConfig("");
      }
      toast({
        title: "Configuration deleted",
        description: `Deleted "${config.name}" filter configuration`,
      });
    }
  };

  function buildPostgresQueryString(groups: FilterGroupType[]): string {
    const params: string[] = [];

    groups.forEach((group) => {
      const field = group.field;
      const value = group.value;

      switch (group.operator) {
        // Text operators
        case "contains_exactly":
          params.push(`${field}=ilike.%${value}%`);
          break;
        case "contains_any_of":
          if (Array.isArray(value)) {
            params.push(`${field}=in.(${value.join(",")})`);
          } else {
            const values = value.split(",").map((v) => v.trim());
            params.push(`${field}=in.(${values.join(",")})`);
          }
          break;
        case "contains_all_of":
          if (Array.isArray(value)) {
            value.forEach((v) => params.push(`${field}=cs.{${v}}`));
          } else {
            const values = value.split(",").map((v) => v.trim());
            values.forEach((v) => params.push(`${field}=cs.{${v}}`));
          }
          break;
        case "doesnt_contain_exactly":
          params.push(`${field}=not.ilike.%${value}%`);
          break;
        case "ends_with_any_of":
          if (Array.isArray(value)) {
            params.push(`${field}=ilike.%${value.join("|%")}`);
          } else {
            params.push(`${field}=ilike.%${value}`);
          }
          break;
        case "starts_with_any_of":
          if (Array.isArray(value)) {
            params.push(`${field}=ilike.${value.join("%|")}%`);
          } else {
            params.push(`${field}=ilike.${value}%`);
          }
          break;
        case "has_never_contained_exactly":
          params.push(`${field}=not.ilike.%${value}%`);
          break;

        // Equality operators
        case "equals":
          params.push(`${field}=eq.${value}`);
          break;
        case "not_equals":
          params.push(`${field}=neq.${value}`);
          break;

        // Null checks
        case "is_empty":
          params.push(`${field}=is.null`);
          break;
        case "is_not_empty":
          params.push(`${field}=not.is.null`);
          break;

        // Numeric comparisons
        case "greater_than":
          params.push(`${field}=gt.${value}`);
          break;
        case "less_than":
          params.push(`${field}=lt.${value}`);
          break;
        case "between":
          if (Array.isArray(value) && value.length === 2) {
            params.push(`${field}=gte.${value[0]}`);
            params.push(`${field}=lte.${value[1]}`);
          }
          break;

        // Date operators
        case "before_date":
          params.push(`${field}=lt.${value}`);
          break;
        case "after_date":
          params.push(`${field}=gt.${value}`);
          break;
        case "in_last_days":
          const daysAgo = new Date();
          daysAgo.setDate(daysAgo.getDate() - parseInt(value as string));
          params.push(`${field}=gte.${daysAgo.toISOString()}`);
          break;

        default:
          console.warn(`Unknown operator: ${group.operator}`);
      }
    });

    return params.join("&");
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[600px] sm:max-w-[600px] bg-background">
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            Advanced Filters
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1 h-[calc(100vh-200px)] pr-4">
          <div className="space-y-6 py-6">
            {/* Saved Configurations */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">
                  Saved Filter Configurations
                </Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSaveForm(!showSaveForm)}
                  className="text-xs"
                >
                  <Save className="w-3 h-3 mr-1" />
                  Save Current
                </Button>
              </div>

              {showSaveForm && (
                <div className="flex flex-col gap-2 p-3 border rounded-lg bg-muted/50 items-center">
                  <Input
                    placeholder="Configuration name"
                    value={configName}
                    onChange={(e) => setConfigName(e.target.value)}
                    className="flex-1"
                  />
                  <Textarea
                    placeholder="Configuration Description (optional)"
                    value={configDescription}
                    onChange={(e) => setConfigDescription(e.target.value)}
                    className="flex-1"
                  />
                  <div className="flex gap-2 flex-wrap justify-end w-full">
                    <Button size="sm" onClick={saveFilterConfig}>
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowSaveForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {savedConfigs.length > 0 && (
                <div className="space-y-2">
                  {savedConfigs.map((config) => (
                    <div
                      key={config.id}
                      className="flex items-center gap-2 p-2 border rounded bg-card"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-sm">{config.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {config.groups.length} rule(s) •{" "}
                          {new Date(config.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => loadFilterConfig(config.id)}
                        className="text-primary hover:text-primary-foreground hover:bg-primary"
                      >
                        <FolderOpen className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteFilterConfig(config.id)}
                        className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            {/* Filter Groups */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Filter Rules</Label>
                <Badge variant="secondary" className="text-xs">
                  {filterGroups.length} active rule(s)
                </Badge>
              </div>

              <div className="space-y-3">
                {filterGroups.map((group, index) => (
                  <FilterGroup
                    key={group.id}
                    group={group}
                    onUpdate={(updatedGroup) =>
                      updateFilterGroup(index, updatedGroup)
                    }
                    onRemove={() => removeFilterGroup(index)}
                    canRemove={filterGroups.length > 1}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                onClick={addFilterGroup}
                className="w-full gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Filter Rule
              </Button>
            </div>
          </div>
        </ScrollArea>

        {/* Actions */}
        <div className="border-t pt-4 space-y-2">
          <div className="flex gap-2">
            <Button onClick={applyFilters} className="flex-1">
              Apply Filters
            </Button>
            <Button variant="outline" onClick={clearAllFilters}>
              Clear All
            </Button>
          </div>
          <Button variant="ghost" onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
