import React from 'react';
import { useTenantGuard } from '@/hooks/useTenantGuard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Building2 } from 'lucide-react';

export const TenantSwitcher: React.FC = () => {
  const { user, switchTenant, getCurrentTenant } = useTenantGuard();

  if (!user) return null;

  const currentTenant = getCurrentTenant();

  const handleTenantChange = (tenantId: string) => {
    // TODO: This will make an API call to switch tenant context in backend
    console.log('🔐 [TenantSwitcher] Switching tenant to:', tenantId);
    switchTenant(tenantId);
  };

  return (
    <div className="flex items-center gap-2">
      <Building2 className="h-4 w-4 text-muted-foreground" />
      <Select
        value={user.currentTenantId}
        onValueChange={handleTenantChange}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select tenant" />
        </SelectTrigger>
        <SelectContent>
          {/* TODO: Replace with actual tenant list from backend API */}
          {user.tenants.map((tenant) => (
            <SelectItem key={tenant.tenantId} value={tenant.tenantId}>
              <div className="flex items-center justify-between w-full">
                <span>Tenant {tenant.tenantId}</span>
                <Badge variant="secondary" className="ml-2">
                  {tenant.role}
                </Badge>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {currentTenant && (
        <Badge variant="outline">
          {currentTenant.role}
        </Badge>
      )}
    </div>
  );
};