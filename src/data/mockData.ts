import { Opportunity, Contact, Task } from '@/types/crm';

export const mockOpportunities: Opportunity[] = [
  {
    id: '1',
    title: 'Enterprise Software License',
    company: 'TechCorp Solutions',
    contact: 'Sarah Johnson',
    value: 125000,
    stage: 'Lead',
    probability: 20,
    closeDate: '2024-12-15',
    createdAt: '2024-10-01',
    updatedAt: '2024-10-15',
    description: 'Large enterprise looking for comprehensive software solution',
    tags: ['enterprise', 'software', 'high-value']
  },
  {
    id: '2',
    title: 'Marketing Automation Platform',
    company: 'Digital Marketing Inc',
    contact: 'Mike Chen',
    value: 75000,
    stage: 'Qualified',
    probability: 45,
    closeDate: '2024-11-30',
    createdAt: '2024-09-15',
    updatedAt: '2024-10-20',
    description: 'Mid-size company needs marketing automation tools',
    tags: ['marketing', 'automation', 'saas']
  },
  {
    id: '3',
    title: 'CRM Integration Project',
    company: 'StartupFlow',
    contact: 'Emma Davis',
    value: 45000,
    stage: 'Proposal',
    probability: 65,
    closeDate: '2024-11-15',
    createdAt: '2024-09-01',
    updatedAt: '2024-10-22',
    description: 'Custom CRM integration for growing startup',
    tags: ['integration', 'crm', 'startup']
  },
  {
    id: '4',
    title: 'Data Analytics Suite',
    company: 'Analytics Pro',
    contact: 'James Wilson',
    value: 95000,
    stage: 'Negotiation',
    probability: 80,
    closeDate: '2024-10-30',
    createdAt: '2024-08-15',
    updatedAt: '2024-10-25',
    description: 'Advanced analytics platform for data-driven decisions',
    tags: ['analytics', 'data', 'enterprise']
  },
  {
    id: '5',
    title: 'Cloud Migration Services',
    company: 'CloudFirst Ltd',
    contact: 'Lisa Brown',
    value: 180000,
    stage: 'Closed Won',
    probability: 100,
    closeDate: '2024-10-01',
    createdAt: '2024-07-01',
    updatedAt: '2024-10-01',
    description: 'Complete cloud infrastructure migration project',
    tags: ['cloud', 'migration', 'infrastructure']
  },
  {
    id: '6',
    title: 'E-commerce Platform',
    company: 'RetailMax',
    contact: 'David Kim',
    value: 85000,
    stage: 'Lead',
    probability: 25,
    closeDate: '2025-01-15',
    createdAt: '2024-10-10',
    updatedAt: '2024-10-20',
    description: 'Custom e-commerce solution for retail chain',
    tags: ['e-commerce', 'retail', 'custom']
  },
  {
    id: '7',
    title: 'Mobile App Development',
    company: 'MobileFirst Agency',
    contact: 'Anna Rodriguez',
    value: 65000,
    stage: 'Qualified',
    probability: 50,
    closeDate: '2024-12-20',
    createdAt: '2024-09-25',
    updatedAt: '2024-10-18',
    description: 'Native mobile app for customer engagement',
    tags: ['mobile', 'app', 'development']
  }
];

export const mockContacts: Contact[] = [
  {
    id: '1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@techcorp.com',
    phone: '+1 (555) 123-4567',
    company: 'TechCorp Solutions',
    position: 'CTO',
    createdAt: '2024-09-15'
  },
  {
    id: '2',
    firstName: 'Mike',
    lastName: 'Chen',
    email: 'mike.chen@digitalmarketing.com',
    phone: '+1 (555) 234-5678',
    company: 'Digital Marketing Inc',
    position: 'Marketing Director',
    createdAt: '2024-09-10'
  },
  {
    id: '3',
    firstName: 'Emma',
    lastName: 'Davis',
    email: 'emma.davis@startupflow.io',
    phone: '+1 (555) 345-6789',
    company: 'StartupFlow',
    position: 'CEO',
    createdAt: '2024-08-30'
  }
];

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Follow up with TechCorp',
    description: 'Send proposal for enterprise software license',
    dueDate: '2024-10-28',
    completed: false,
    priority: 'High',
    assignedTo: 'Current User',
    opportunityId: '1',
    createdAt: '2024-10-20'
  },
  {
    id: '2',
    title: 'Schedule demo with Digital Marketing Inc',
    description: 'Product demonstration for marketing automation platform',
    dueDate: '2024-10-30',
    completed: false,
    priority: 'Medium',
    assignedTo: 'Current User',
    opportunityId: '2',
    createdAt: '2024-10-22'
  },
  {
    id: '3',
    title: 'Prepare contract for StartupFlow',
    description: 'Draft final contract for CRM integration project',
    dueDate: '2024-11-02',
    completed: true,
    priority: 'High',
    assignedTo: 'Current User',
    opportunityId: '3',
    createdAt: '2024-10-18'
  }
];