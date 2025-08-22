import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { CreateRoleModal } from './CreateRoleModal';

interface Role {
  id: string;
  name: string;
  description: string;
  tenantType: 'user' | 'manager' | 'admin';
  createdAt: string;
  userCount: number;
}

const mockRoles: Role[] = [
  {
    id: '1',
    name: 'System Administrator',
    description: 'Full system access and configuration',
    tenantType: 'admin',
    createdAt: '2024-01-15',
    userCount: 2
  },
  {
    id: '2',
    name: 'Sales Manager',
    description: 'Manage sales team and pipelines',
    tenantType: 'manager',
    createdAt: '2024-01-20',
    userCount: 5
  },
  {
    id: '3',
    name: 'Sales Representative',
    description: 'Basic sales operations access',
    tenantType: 'user',
    createdAt: '2024-01-25',
    userCount: 12
  }
];

export function RoleManagement() {
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateRole = (newRole: Omit<Role, 'id' | 'createdAt' | 'userCount'>) => {
    const role: Role = {
      ...newRole,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
      userCount: 0
    };
    setRoles([...roles, role]);
    setIsCreateModalOpen(false);
  };

  const getTenantTypeBadgeColor = (type: Role['tenantType']) => {
    switch (type) {
      case 'admin': return 'bg-destructive text-destructive-foreground';
      case 'manager': return 'bg-warning text-warning-foreground';
      case 'user': return 'bg-primary text-primary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Role Management</h2>
          <p className="text-muted-foreground">Create and manage user roles and permissions</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create New Role
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map((role) => (
          <Card key={role.id} className="bg-background">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{role.name}</CardTitle>
                <Badge className={getTenantTypeBadgeColor(role.tenantType)}>
                  {role.tenantType}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-4">
                {role.description}
              </p>
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <span>{role.userCount} users</span>
                <span>Created: {role.createdAt}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="text-destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <CreateRoleModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onCreateRole={handleCreateRole}
      />
    </div>
  );
}