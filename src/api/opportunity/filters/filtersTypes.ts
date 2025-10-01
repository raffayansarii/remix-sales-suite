export interface UserFilterCondition {
  field: string;
  operator: string;
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
  p_tenant_id: string;
}

export interface ApplyCustomFiltersRequest {
  p_user_id: string;
  p_tenant_id: string;
  p_filter_groups: UserFilterCondition[];
}
