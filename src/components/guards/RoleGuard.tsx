import React from 'react';
import { useTenantGuard } from '@/hooks/useTenantGuard';

interface RoleGuardProps {
  children: React.ReactNode;
  role: string;
  tenantId?: string;
  fallback?: React.ReactNode;
  hideOnNoAccess?: boolean;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  role,
  tenantId,
  fallback = null,
  hideOnNoAccess = false
}) => {
  const { hasRole, isAuthenticated, loading } = useTenantGuard();

  // TODO: Replace with actual loading state from backend
  if (loading) {
    return hideOnNoAccess ? null : fallback;
  }

  // TODO: Replace with actual authentication check
  if (!isAuthenticated) {
    console.log('🔐 [RoleGuard] User not authenticated for role:', role);
    return hideOnNoAccess ? null : fallback;
  }

  // TODO: This will connect to backend role system
  const hasRoleAccess = hasRole(role, tenantId);
  
  if (!hasRoleAccess) {
    console.log('🔐 [RoleGuard] Role access denied:', role);
    return hideOnNoAccess ? null : fallback;
  }

  console.log('🔐 [RoleGuard] Role access granted:', role);
  return <>{children}</>;
};