import React from 'react';
import { useTenantGuard } from '@/hooks/useTenantGuard';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Shield, AlertTriangle } from 'lucide-react';

interface TenantGuardProps {
  children: React.ReactNode;
  requiredPermission?: string;
  requiredRole?: string;
  tenantId?: string;
  fallback?: React.ReactNode;
}

export const TenantGuard: React.FC<TenantGuardProps> = ({
  children,
  requiredPermission,
  requiredRole,
  tenantId,
  fallback
}) => {
  const { user, loading, hasPermission, hasRole, isAuthenticated } = useTenantGuard();

  // TODO: Replace with actual loading state from backend authentication
  if (loading) {
    console.log('🔐 [TenantGuard] Loading authentication state...');
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    );
  }

  // TODO: Replace with actual authentication check from backend
  if (!isAuthenticated) {
    console.log('🔐 [TenantGuard] User not authenticated, blocking access');
    return (
      <Alert variant="destructive">
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Authentication required. Please log in to access this content.
        </AlertDescription>
      </Alert>
    );
  }

  // Check permission if required
  if (requiredPermission && !hasPermission(requiredPermission, tenantId)) {
    console.log('🔐 [TenantGuard] Permission denied:', requiredPermission);
    return fallback || (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          You don't have permission to access this content. Required permission: {requiredPermission}
        </AlertDescription>
      </Alert>
    );
  }

  // Check role if required
  if (requiredRole && !hasRole(requiredRole, tenantId)) {
    console.log('🔐 [TenantGuard] Role access denied:', requiredRole);
    return fallback || (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          You don't have the required role to access this content. Required role: {requiredRole}
        </AlertDescription>
      </Alert>
    );
  }

  console.log('🔐 [TenantGuard] Access granted');
  return <>{children}</>;
};