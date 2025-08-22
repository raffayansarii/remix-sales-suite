export interface Opportunity {
  id: string;
  title: string;
  company: string;
  contact: string;
  value: number;
  stage: 'Lead' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Closed Won';
  awardType: 'Contract' | 'Grant' | 'Cooperative Agreement' | 'Purchase Order';
  agency: string;
  solicitation: string;
  probability: number;
  closeDate: string;
  createdAt: string;
  updatedAt: string;
  description?: string;
  tags: string[];
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  createdAt: string;
}

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

export type ViewType = 'kanban' | 'table';

export interface PipelineStage {
  id: string;
  name: string;
  color: string;
  opportunities: Opportunity[];
}