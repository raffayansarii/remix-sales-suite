import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CreateRoleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateRole: (role: {
    name: string;
    description: string;
    tenantType: 'user' | 'manager' | 'admin';
  }) => void;
}

export function CreateRoleModal({ open, onOpenChange, onCreateRole }: CreateRoleModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tenantType: '' as 'user' | 'manager' | 'admin' | ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.description && formData.tenantType) {
      onCreateRole({
        name: formData.name,
        description: formData.description,
        tenantType: formData.tenantType
      });
      setFormData({ name: '', description: '', tenantType: '' });
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', description: '', tenantType: '' });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Role</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Role Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter role name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter role description"
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tenantType">Tenant Type</Label>
            <Select
              value={formData.tenantType}
              onValueChange={(value: 'user' | 'manager' | 'admin') =>
                setFormData({ ...formData, tenantType: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select tenant type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-3 justify-end">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit">
              Create Role
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}