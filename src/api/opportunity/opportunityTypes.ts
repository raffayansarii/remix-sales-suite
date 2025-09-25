export interface IOpportunity {
  id: string;
  title: string;
  company: string;
  contact: string;
  value: number;
  stage: string;
  award_type: string;
  agency: string;
  solicitation: string;
  probability: number;
  close_date: string;
  description: string;
  pinned: boolean | {state:boolean; color:string} ;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  tenant_id: string;
  deleted_at: string | null;
  tags: { id: string; name: string; color: string }[];
  created_by_user: { id: string; name: string | null; email: string } | null;
}
export interface IOptiionalOpportunity {
  id?: string;
  title?: string;
  company?: string;
  contact?: string;
  value?: number;
  stage?: string;
  award_type?: string;
  agency?: string;
  solicitation?: string;
  probability?: number;
  close_date?: string;
  description?: string;
  pinned?: boolean;
  created_at?: string;
  updated_at?: string;
  created_by?: string | null;
  tenant_id?: string;
  deleted_at?: string | null;
  tags?: { id?: string; name?: string; color?: string }[];
  created_by_user?: { id?: string; name?: string | null; email?: string } | null;
}
export interface ICreateOpportunityRequest {
  title?: string;
  company: string;
  contact: string;
  value: string; // keeping as string since your payload shows "75000.00"
  stage: string;
  award_type: string;
  agency: string;
  solicitation: string;
  probability: number;
  close_date: string; // ISO date string "YYYY-MM-DD"
  description: string;
  pinned: boolean;
  tenant_id: string;   // UUID
  created_by: string;  // UUID
}
