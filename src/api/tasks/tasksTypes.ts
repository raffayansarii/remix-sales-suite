export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  completed: boolean;
  priority: 'Low' | 'Medium' | 'High';
  assignedTo?: string;
  opportunityId?: string;
  createdAt: string;
}
