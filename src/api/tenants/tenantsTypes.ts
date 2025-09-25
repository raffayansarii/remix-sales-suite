export interface  ITenant {
  id: string;
  name: string;
  is_active: boolean;
  settings:any;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface ICreateTenantRequest {
  name: string;
  slug: string;
  created_by: string; // UUID
}

export interface IUpdateTenantRequest {
  name?: string;
  slug?: string;
  updated_by: string; // UUID
}

export interface PaginationMeta {
  totalCount: number;
  currentPage: number;
  totalPages: number;
  limit: number;
  offset: number;
}