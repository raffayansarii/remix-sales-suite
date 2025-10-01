export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  tenant_id: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
  is_active: boolean;
}

export interface CreateUserPayload {
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  tenant_id: string;
}

export interface UpdateUserPayload extends Partial<CreateUserPayload> {
  is_active?: boolean;
}
