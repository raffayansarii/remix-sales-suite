export type FilterOperator =
  | "contains_any_of"
  | "contains_all_of"
  | "contains_exactly"
  | "doesnt_contain_exactly"
  | "between"
  | "ends_with_any_of"
  | "starts_with_any_of"; // add more as needed

export interface UserFilterCondition {
  field: string;
  operator: FilterOperator;
  value: string | string[];
}

export interface CreateUserFilterRequest {
  p_user_id: string;
  p_tenant_id: string;
  p_name: string;
  p_description?: string;
  p_filter_groups: UserFilterCondition[];
  p_is_shared: boolean;
  p_is_default: boolean;
}

export interface GetUserFiltersRequest {
  p_user_id: string;
  p_tenant_id: string;
}

export interface UpdateUserFilterRequest {
  p_user_id: string;
  p_tenant_id: string;
  p_name: string;
  p_description?: string;
  p_filter_groups: UserFilterCondition[];
  p_is_shared: boolean;
  p_is_default: boolean;
}

export interface DeleteUserFilterRequest {
  p_user_id: string;
  p_filter_id: string;
}


export interface ApplyCustomFiltersRequest {
  p_tenant_id: string;
  p_logic_operator: "AND" | "OR";
  p_filter_groups: UserFilterCondition[];
}
