import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Search } from 'lucide-react';

interface FieldPermission {
  id: string;
  roleId: string;
  roleName: string;
  module: string;
  fieldName: string;
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
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

const mockFieldPermissions: FieldPermission[] = [
  {
    id: '1',
    roleId: '2',
    roleName: 'Sales Manager',
    module: 'Opportunity Pipelines',
    fieldName: 'value',
    create: true,
    read: true,
    update: true,
    delete: false
  },
  {
    id: '2',
    roleId: '3',
    roleName: 'Sales Representative',
    module: 'Opportunity Pipelines',
    fieldName: 'stage',
    create: false,
    read: true,
    update: true,
    delete: false
  }
];

export function FieldPermissions() {
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedModule, setSelectedModule] = useState<string>('');
  const [searchField, setSearchField] = useState<string>('');
  const [fieldPermissions, setFieldPermissions] = useState<FieldPermission[]>(mockFieldPermissions);

  const filteredPermissions = fieldPermissions.filter(permission => {
    const matchesRole = !selectedRole || permission.roleId === selectedRole;
    const matchesModule = !selectedModule || permission.module === selectedModule;
    const matchesField = !searchField || permission.fieldName.toLowerCase().includes(searchField.toLowerCase());
    
    return matchesRole && matchesModule && matchesField;
  });

  const handlePermissionChange = (permissionId: string, field: keyof Omit<FieldPermission, 'id' | 'roleId' | 'roleName' | 'module' | 'fieldName'>, value: boolean) => {
    setFieldPermissions(prev => 
      prev.map(p => 
        p.id === permissionId 
          ? { ...p, [field]: value }
          : p
      )
    );
  };

  const getRoleBadgeVariant = (tenantType: string) => {
    switch (tenantType) {
      case 'admin': return 'destructive';
      case 'manager': return 'default';
      case 'user': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Field Permissions</h2>
        <p className="text-muted-foreground">Manage field-level CRUD permissions for roles</p>
      </div>

      <Card className="bg-background">
        <CardHeader>
          <CardTitle>Filter Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role-filter">Role</Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Roles</SelectItem>
                  {mockRoles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="module-filter">Object (Module)</Label>
              <Select value={selectedModule} onValueChange={setSelectedModule}>
                <SelectTrigger>
                  <SelectValue placeholder="All Modules" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Modules</SelectItem>
                  {appModules.map((module) => (
                    <SelectItem key={module} value={module}>
                      {module}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="field-search">Search Field</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="field-search"
                  value={searchField}
                  onChange={(e) => setSearchField(e.target.value)}
                  placeholder="Search field name..."
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-background">
        <CardHeader>
          <CardTitle>Field Permissions Table</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredPermissions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No field permissions found. Apply filters to see relevant permissions.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role</TableHead>
                  <TableHead>Module</TableHead>
                  <TableHead>Field</TableHead>
                  <TableHead className="text-center">Create</TableHead>
                  <TableHead className="text-center">Read</TableHead>
                  <TableHead className="text-center">Update</TableHead>
                  <TableHead className="text-center">Delete</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPermissions.map((permission) => {
                  const role = mockRoles.find(r => r.id === permission.roleId);
                  return (
                    <TableRow key={permission.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{permission.roleName}</span>
                          {role && (
                            <Badge variant={getRoleBadgeVariant(role.tenantType)}>
                              {role.tenantType}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{permission.module}</TableCell>
                      <TableCell className="font-medium">{permission.fieldName}</TableCell>
                      <TableCell className="text-center">
                        <Switch
                          checked={permission.create}
                          onCheckedChange={(checked) => 
                            handlePermissionChange(permission.id, 'create', checked)
                          }
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Switch
                          checked={permission.read}
                          onCheckedChange={(checked) => 
                            handlePermissionChange(permission.id, 'read', checked)
                          }
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Switch
                          checked={permission.update}
                          onCheckedChange={(checked) => 
                            handlePermissionChange(permission.id, 'update', checked)
                          }
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Switch
                          checked={permission.delete}
                          onCheckedChange={(checked) => 
                            handlePermissionChange(permission.id, 'delete', checked)
                          }
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}