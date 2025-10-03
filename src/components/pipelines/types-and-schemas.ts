import { IOpportunity } from "@/api/opportunity/opportunityTypes";
import { UseColumnManagerReturn } from "@/hooks/useColumnManager";
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { z } from "zod";

// General types and schemas for pipelines components

// Table View
export interface TableViewProps {
  opportunities: IOpportunity[];
  currentPage: number;
  rowsPerPage: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

// Opportunity Form Schema and Types
export const opportunitySchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  company: z
    .string()
    .min(1, "Company is required")
    .max(100, "Company must be less than 100 characters"),
  contact: z
    .string()
    .min(1, "Contact is required")
    .max(100, "Contact must be less than 100 characters"),
  value: z
    .string()
    .min(1, "Value is required")
    .regex(/^\d+(\.\d{2})?$/, "Value must be a valid number"),
  stage: z.enum(["Lead", "Qualified", "Proposal", "Negotiation", "Closed Won"]),
  award_type: z.enum([
    "Contract",
    "Grant",
    "Cooperative Agreement",
    "Purchase Order",
  ]),
  agency: z
    .string()
    .min(1, "Agency is required")
    .max(100, "Agency must be less than 100 characters"),
  solicitation: z
    .string()
    .min(1, "Solicitation is required")
    .max(50, "Solicitation must be less than 50 characters"),
  probability: z
    .number()
    .min(0, "Probability must be at least 0")
    .max(100, "Probability must be at most 100"),
  close_date: z.string().min(1, "Close date is required"),
  description: z
    .string()
    .max(1000, "Description must be less than 1000 characters")
    .optional(),
  pinned: z.boolean(),
  tenant_id: z.string(),
  created_by: z.string(),
});

export type OpportunityFormData = z.infer<typeof opportunitySchema>;

// Create Opportunity Modal Props
export interface CreateOpportunityModalProps {
  viewOnly?: boolean;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: OpportunityFormData) => void;
  initialData?: Partial<IOpportunity>;
  status?: {
    data?: any;
    error?: SerializedError | FetchBaseQueryError;
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    isUninitialized: boolean;
    reset: () => void;
    status: "uninitialized" | "pending" | "fulfilled" | "rejected";
    originalArgs?: any;
  };
}

// pipelines analytics
export interface PipelineAnalyticsProps {
  opportunities: IOpportunity[];
}

// Opportunity Detail Modal
export interface OpportunityDetailModalProps {
  opportunity: IOpportunity | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate?: (updatedOpportunity: IOpportunity) => void;
  onDelete?: (opportunityId: string) => void;
}

// kanban view
export interface KanbanViewProps {
  opportunities: IOpportunity[];
  onOpportunityUpdate?: (updatedOpportunity: IOpportunity) => void;
  onOpportunityDelete?: (opportunityId: string) => void;
}

// Formula Builder

export interface AvailableColumn {
  id: string;
  name: string;
  type: "system" | "default" | "custom";
}

export interface NodeData extends Record<string, unknown> {
  label: string;
  value: string;
  nodeType: "column" | "operator" | "number" | "bracket";
  columnType?: string;
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, value: string) => void;
}

export interface FormulaBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateColumn: (data: { name: string; formula: string }) => void;
}

// Filter Group
export interface FilterGroup {
  id: string;
  field: string;
  operator: string;
  value: string | string[];
}

export interface FilterConfig {
  id: string;
  name: string;
  groups: FilterGroup[];
  createdAt: string;
  updatedAt: string;
}

export const FILTER_OPERATORS = [
  { value: "contains_exactly", label: "Contains exactly" },
  { value: "contains_any_of", label: "Contains any of" },
  { value: "contains_all_of", label: "Contains all of" },
  { value: "doesnt_contain_exactly", label: "Doesn't contain exactly" },
  { value: "ends_with_any_of", label: "Ends with any of" },
  { value: "starts_with_any_of", label: "Starts with any of" },
  {
    value: "has_never_contained_exactly",
    label: "Has never contained exactly",
  },
  { value: "equals", label: "Equals" },
  { value: "not_equals", label: "Not equals" },
  { value: "is_empty", label: "Is empty" },
  { value: "is_not_empty", label: "Is not empty" },
  { value: "greater_than", label: "Greater than" },
  { value: "less_than", label: "Less than" },
  { value: "between", label: "Between" },
  { value: "in_last_days", label: "In last X days" },
  { value: "before_date", label: "Before date" },
  { value: "after_date", label: "After date" },
];

export const FILTER_FIELDS = [
  { value: "title", label: "Title", type: "text" },
  { value: "company", label: "Company", type: "text" },
  { value: "contact", label: "Contact", type: "text" },
  {
    value: "stage",
    label: "Status/Stage",
    type: "select",
    options: ["Lead", "Qualified", "Proposal", "Negotiation", "Closed Won"],
  },
  {
    value: "awardType",
    label: "Award Type",
    type: "select",
    options: ["Contract", "Grant", "Cooperative Agreement", "Purchase Order"],
  },
  { value: "agency", label: "Agency", type: "text" },
  { value: "solicitation", label: "Solicitation", type: "text" },
  { value: "value", label: "Value", type: "number" },
  { value: "probability", label: "Probability", type: "number" },
  { value: "closeDate", label: "Close Date", type: "date" },
  { value: "createdAt", label: "Created", type: "date" },
  { value: "updatedAt", label: "Updated", type: "date" },
  { value: "tags", label: "Tags", type: "text" },
];

export const getOperatorsForField = (fieldType: string) => {
  switch (fieldType) {
    case "text":
      return FILTER_OPERATORS.filter((op) =>
        [
          "contains_exactly",
          "contains_any_of",
          "contains_all_of",
          "doesnt_contain_exactly",
          "ends_with_any_of",
          "starts_with_any_of",
          "has_never_contained_exactly",
          "equals",
          "not_equals",
          "is_empty",
          "is_not_empty",
        ].includes(op.value)
      );
    case "select":
      return FILTER_OPERATORS.filter((op) =>
        ["equals", "not_equals", "contains_any_of", "contains_all_of"].includes(
          op.value
        )
      );
    case "number":
      return FILTER_OPERATORS.filter((op) =>
        [
          "equals",
          "not_equals",
          "greater_than",
          "less_than",
          "between",
          "is_empty",
          "is_not_empty",
        ].includes(op.value)
      );
    case "date":
      return FILTER_OPERATORS.filter((op) =>
        [
          "equals",
          "not_equals",
          "before_date",
          "after_date",
          "between",
          "in_last_days",
          "is_empty",
          "is_not_empty",
        ].includes(op.value)
      );
    default:
      return FILTER_OPERATORS;
  }
};
export interface FilterGroupProps {
  group: FilterGroup;
  onUpdate: (group: FilterGroup) => void;
  onRemove: () => void;
  canRemove: boolean;
}

// Filter Drawer

export interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (queryString: string, count: number) => void;
  activeFilters: string;
}

// Column Manager Modal
export interface ColumnManagerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  columnManager: UseColumnManagerReturn;
}
