export interface Task {
  id: string;
  title: string;
  description: string;
  due_date: string; // ISO string date
  completed: boolean;
  priority: "Low" | "Medium" | "High"; // you can extend this enum if needed
  assigned_to: string;
  opportunity_id: string;
  tenant_id: string;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
  created_by: string;
  updated_by: string;
  deleted_at: string | null;
}
