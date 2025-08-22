import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ObjectPermission {
  module: string;
  read: boolean;
  write: boolean;
  delete: boolean;
  edit: boolean;
}

interface Role {
  id: string;
  name: string;
  tenantType: 'user' | 'manager' | 'admin';
}

const mockRoles: Role[] = [
  { id: '1', name: 'System Administrator', tenantType: 'admin' },
  { id: '2', name: 'Sales Manager', tenantType: 'manager' },
  { id: '3', name: 'Sales Representative', tenantType: 'user' }
];

const appModules = [
  'Dashboard',
  'Opportunity Pipelines',
  'Tasks',
  'Contacts'
];

const defaultPermissions: Record<string, ObjectPermission> = {
  'Dashboard': { module: 'Dashboard', read: true, write: false, delete: false, edit: false },
  'Opportunity Pipelines': { module: 'Opportunity Pipelines', read: true, write: true, delete: false, edit: true },
  'Tasks': { module: 'Tasks', read: true, write: true, delete: true, edit: true },
  'Contacts': { module: 'Contacts', read: true, write: true, delete: false, edit: true }
};

export function ObjectPermissions() {
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [permissions, setPermissions] = useState<Record<string, ObjectPermission>>(defaultPermissions);

  const handlePermissionChange = (module: string, permission: keyof Omit<ObjectPermission, 'module'>, value: boolean) => {
    setPermissions(prev => ({
      ...prev,
      [module]: {
        ...prev[module],
        [permission]: value
      }
    }));
  };

  const getSelectedRoleName = () => {
    const role = mockRoles.find(r => r.id === selectedRole);
    return role?.name || 'Select a role';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Object Permissions</h2>
          <p className="text-muted-foreground">Manage module-level permissions for roles</p>
        </div>
        <div className="w-64">
          <Label htmlFor="role-select">Select Role</Label>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger>
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              {mockRoles.map((role) => (
                <SelectItem key={role.id} value={role.id}>
                  <div className="flex items-center gap-2">
                    <span>{role.name}</span>
                    <Badge variant={role.tenantType === 'admin' ? 'destructive' : 
                                  role.tenantType === 'manager' ? 'default' : 'secondary'}>
                      {role.tenantType}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedRole && (
        <Card className="bg-background">
          <CardHeader>
            <CardTitle>Permissions for {getSelectedRoleName()}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {appModules.map((module) => {
                const modulePermissions = permissions[module];
                return (
                  <div key={module} className="border rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-4">{module}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={`${module}-read`}
                          checked={modulePermissions.read}
                          onCheckedChange={(checked) => 
                            handlePermissionChange(module, 'read', checked)
                          }
                        />
                        <Label htmlFor={`${module}-read`} className="text-sm font-medium">
                          Read
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={`${module}-write`}
                          checked={modulePermissions.write}
                          onCheckedChange={(checked) => 
                            handlePermissionChange(module, 'write', checked)
                          }
                        />
                        <Label htmlFor={`${module}-write`} className="text-sm font-medium">
                          Write
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={`${module}-edit`}
                          checked={modulePermissions.edit}
                          onCheckedChange={(checked) => 
                            handlePermissionChange(module, 'edit', checked)
                          }
                        />
                        <Label htmlFor={`${module}-edit`} className="text-sm font-medium">
                          Edit
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={`${module}-delete`}
                          checked={modulePermissions.delete}
                          onCheckedChange={(checked) => 
                            handlePermissionChange(module, 'delete', checked)
                          }
                        />
                        <Label htmlFor={`${module}-delete`} className="text-sm font-medium">
                          Delete
                        </Label>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}