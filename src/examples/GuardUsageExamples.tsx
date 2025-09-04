/**
 * MULTI-TENANT GUARD USAGE EXAMPLES
 * 
 * This file shows how to use the various guard components in your app.
 * TODO: Replace all mock data with actual backend API calls when integrating.
 */

import React from 'react';
import { TenantGuard, PermissionGuard, RoleGuard, TenantSwitcher } from '@/components/guards';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const GuardUsageExamples: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Multi-Tenant Guard Examples</h1>
      
      {/* Tenant Switcher Example */}
      <Card>
        <CardHeader>
          <CardTitle>Tenant Switcher</CardTitle>
        </CardHeader>
        <CardContent>
          <TenantSwitcher />
          <p className="text-sm text-muted-foreground mt-2">
            Switch between tenants - integrates with backend authentication
          </p>
        </CardContent>
      </Card>

      {/* Role-based Protection Example */}
      <Card>
        <CardHeader>
          <CardTitle>Role-based Access Control</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RoleGuard role="admin" hideOnNoAccess>
            <Button variant="destructive">
              Delete All Data (Admin Only)
            </Button>
          </RoleGuard>
          
          <RoleGuard role="user">
            <Button variant="default">
              Create New Record (User+ Access)
            </Button>
          </RoleGuard>
          
          <RoleGuard 
            role="super_admin" 
            fallback={<p className="text-muted-foreground">Super admin features hidden</p>}
          >
            <Button variant="outline">
              System Settings (Super Admin)
            </Button>
          </RoleGuard>
        </CardContent>
      </Card>

      {/* Permission-based Protection Example */}
      <Card>
        <CardHeader>
          <CardTitle>Permission-based Access Control</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <PermissionGuard permission="write" hideOnNoAccess>
            <Button>
              Edit Content (Write Permission)
            </Button>
          </PermissionGuard>
          
          <PermissionGuard permission="delete">
            <Button variant="destructive">
              Delete Item (Delete Permission)
            </Button>
          </PermissionGuard>
          
          <PermissionGuard 
            permission="admin"
            fallback={<p className="text-muted-foreground">Admin tools not available</p>}
          >
            <Button variant="secondary">
              Admin Tools
            </Button>
          </PermissionGuard>
        </CardContent>
      </Card>

      {/* Full Page Protection Example */}
      <Card>
        <CardHeader>
          <CardTitle>Full Page/Component Protection</CardTitle>
        </CardHeader>
        <CardContent>
          <TenantGuard requiredPermission="read">
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-semibold">Protected Content</h3>
              <p>This content is only visible to users with 'read' permission.</p>
            </div>
          </TenantGuard>
          
          <TenantGuard 
            requiredRole="admin"
            fallback={
              <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                <h3 className="font-semibold text-destructive">Access Restricted</h3>
                <p className="text-muted-foreground">Admin role required to view this section.</p>
              </div>
            }
          >
            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20 mt-4">
              <h3 className="font-semibold text-primary">Admin Only Section</h3>
              <p>This is sensitive admin content that only admins can see.</p>
            </div>
          </TenantGuard>
        </CardContent>
      </Card>

      {/* Multi-Tenant Specific Protection */}
      <Card>
        <CardHeader>
          <CardTitle>Multi-Tenant Specific Access</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <PermissionGuard permission="write" tenantId="tenant-1">
            <Button>
              Edit Tenant 1 Data
            </Button>
          </PermissionGuard>
          
          <RoleGuard role="admin" tenantId="tenant-2">
            <Button variant="outline">
              Admin Actions for Tenant 2
            </Button>
          </RoleGuard>
          
          <p className="text-sm text-muted-foreground">
            You can specify specific tenant IDs to check permissions for different tenants.
          </p>
        </CardContent>
      </Card>

      <div className="bg-muted p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Backend Integration Notes:</h3>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
          <li>Replace mock data in useTenantGuard hook with actual API calls</li>
          <li>Implement JWT token validation and refresh logic</li>
          <li>Add real-time permission updates via websockets</li>
          <li>Integrate with your backend's role and permission system</li>
          <li>Add proper error handling and retry logic</li>
          <li>Implement tenant-specific database queries and RLS policies</li>
        </ul>
      </div>
    </div>
  );
};