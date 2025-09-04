import { AdminFeature } from '@/features/admin';
import { TenantGuard } from '@/components/guards';

export default function Admin() {
  return (
    <TenantGuard 
      requiredRole="admin" 
      fallback={
        <div className="p-6">
          <h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
          <p className="text-muted-foreground">You need admin role to access this page.</p>
        </div>
      }
    >
      <AdminFeature />
    </TenantGuard>
  );
}