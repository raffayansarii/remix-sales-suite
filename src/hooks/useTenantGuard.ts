import { useState, useEffect } from 'react';

// TODO: Replace with actual backend API types
interface TenantPermission {
  tenantId: string;
  role: 'admin' | 'user' | 'viewer';
  permissions: string[];
}

interface User {
  id: string;
  email: string;
  tenants: TenantPermission[];
  currentTenantId: string;
}

// TODO: Replace mock data with actual backend API calls
const mockUser: User = {
  id: 'user-123',
  email: 'user@example.com',
  currentTenantId: 'tenant-1',
  tenants: [
    {
      tenantId: 'tenant-1',
      role: 'admin',
      permissions: ['read', 'write', 'delete', 'admin']
    },
    {
      tenantId: 'tenant-2',
      role: 'user',
      permissions: ['read', 'write']
    }
  ]
};

export const useTenantGuard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // TODO: Replace with actual API call to get user and tenant permissions
    // Example: const response = await fetch('/api/auth/me');
    console.log('🔐 [TenantGuard] Fetching user permissions from backend...');
    
    // Simulate API call delay
    setTimeout(() => {
      setUser(mockUser);
      setLoading(false);
      console.log('🔐 [TenantGuard] User permissions loaded:', mockUser);
    }, 1000);
  }, []);

  const switchTenant = async (tenantId: string) => {
    // TODO: Replace with actual API call to switch tenant context
    // Example: await fetch('/api/auth/switch-tenant', { method: 'POST', body: { tenantId } });
    console.log('🔐 [TenantGuard] Switching to tenant:', tenantId);
    
    if (user) {
      setUser({ ...user, currentTenantId: tenantId });
      console.log('🔐 [TenantGuard] Tenant switched successfully');
    }
  };

  const hasPermission = (permission: string, tenantId?: string): boolean => {
    if (!user) return false;
    
    const targetTenantId = tenantId || user.currentTenantId;
    const tenantPermission = user.tenants.find(t => t.tenantId === targetTenantId);
    
    const hasAccess = tenantPermission?.permissions.includes(permission) || false;
    console.log(`🔐 [TenantGuard] Checking permission "${permission}" for tenant "${targetTenantId}":`, hasAccess);
    
    return hasAccess;
  };

  const hasRole = (role: string, tenantId?: string): boolean => {
    if (!user) return false;
    
    const targetTenantId = tenantId || user.currentTenantId;
    const tenantPermission = user.tenants.find(t => t.tenantId === targetTenantId);
    
    const hasRoleAccess = tenantPermission?.role === role;
    console.log(`🔐 [TenantGuard] Checking role "${role}" for tenant "${targetTenantId}":`, hasRoleAccess);
    
    return hasRoleAccess;
  };

  const getCurrentTenant = () => {
    if (!user) return null;
    return user.tenants.find(t => t.tenantId === user.currentTenantId) || null;
  };

  return {
    user,
    loading,
    error,
    switchTenant,
    hasPermission,
    hasRole,
    getCurrentTenant,
    isAuthenticated: !!user
  };
};