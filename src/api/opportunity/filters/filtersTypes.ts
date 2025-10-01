export interface GetUserFiltersRequest {
  p_user_id: string;
  p_tenant_id: string;
}

export interface CreateUserFilterRequest {
  p_user_id: string;
  p_tenant_id: string;
  p_filter_name: string;
  p_filter_config: any;
}

export interface UpdateUserFilterRequest {
  p_filter_id: string;
  p_user_id: string;
  p_tenant_id: string;
  p_filter_name: string;
  p_filter_config: any;
}

export interface DeleteUserFilterRequest {
  p_filter_id: string;
  p_user_id: string;
  p_tenant_id: string;
}

export interface ApplyCustomFiltersRequest {
  p_user_id: string;
  p_tenant_id: string;
  p_filter_config: any;
}
