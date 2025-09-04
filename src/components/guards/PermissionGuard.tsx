import React from 'react';
import { useTenantGuard } from '@/hooks/useTenantGuard';

interface PermissionGuardProps {
  children: React.ReactNode;
  permission: string;
  tenantId?: string;
  fallback?: React.ReactNode;
  hideOnNoAccess?: boolean;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  permission,
  tenantId,
  fallback = null,
  hideOnNoAccess = false
}) => {
  const { hasPermission, isAuthenticated, loading } = useTenantGuard();

  // TODO: Replace with actual loading state from backend
  if (loading) {
    return hideOnNoAccess ? null : fallback;
  }

  // TODO: Replace with actual authentication check
  if (!isAuthenticated) {
    console.log('🔐 [PermissionGuard] User not authenticated for permission:', permission);
    return hideOnNoAccess ? null : fallback;
  }

  // TODO: This will connect to backend permission system
  const hasAccess = hasPermission(permission, tenantId);
  
  if (!hasAccess) {
    console.log('🔐 [PermissionGuard] Access denied for permission:', permission);
    return hideOnNoAccess ? null : fallback;
  }

  console.log('🔐 [PermissionGuard] Permission granted:', permission);
  return <>{children}</>;
};