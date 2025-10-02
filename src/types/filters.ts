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
  { value: 'contains_exactly', label: 'Contains exactly' },
  { value: 'contains_any_of', label: 'Contains any of' },
  { value: 'contains_all_of', label: 'Contains all of' },
  { value: 'doesnt_contain_exactly', label: "Doesn't contain exactly" },
  { value: 'ends_with_any_of', label: 'Ends with any of' },
  { value: 'starts_with_any_of', label: 'Starts with any of' },
  { value: 'has_never_contained_exactly', label: 'Has never contained exactly' },
  { value: 'equals', label: 'Equals' },
  { value: 'not_equals', label: 'Not equals' },
  { value: 'is_empty', label: 'Is empty' },
  { value: 'is_not_empty', label: 'Is not empty' },
  { value: 'greater_than', label: 'Greater than' },
  { value: 'less_than', label: 'Less than' },
  { value: 'between', label: 'Between' },
  { value: 'in_last_days', label: 'In last X days' },
  { value: 'before_date', label: 'Before date' },
  { value: 'after_date', label: 'After date' }
];

export const FILTER_FIELDS = [
  { value: 'title', label: 'Title', type: 'text' },
  { value: 'company', label: 'Company', type: 'text' },
  { value: 'contact', label: 'Contact', type: 'text' },
  { value: 'stage', label: 'Status/Stage', type: 'select', options: ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won'] },
  { value: 'awardType', label: 'Award Type', type: 'select', options: ['Contract', 'Grant', 'Cooperative Agreement', 'Purchase Order'] },
  { value: 'agency', label: 'Agency', type: 'text' },
  { value: 'solicitation', label: 'Solicitation', type: 'text' },
  { value: 'value', label: 'Value', type: 'number' },
  { value: 'probability', label: 'Probability', type: 'number' },
  { value: 'closeDate', label: 'Close Date', type: 'date' },
  { value: 'createdAt', label: 'Created', type: 'date' },
  { value: 'updatedAt', label: 'Updated', type: 'date' },
  { value: 'tags', label: 'Tags', type: 'text' }
];

