import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Users, Shield, Database, Bell, Palette } from 'lucide-react';
import { RoleManagement } from './components/RoleManagement';
import { ObjectPermissions } from './components/ObjectPermissions';
import { FieldPermissions } from './components/FieldPermissions';

export function AdminFeature() {
  const [activeTab, setActiveTab] = useState('permissions');

  const adminSections = [
    {
      title: 'System Settings',
      description: 'Configure global system preferences',
      icon: Settings,
      color: 'text-stage-negotiation'
    },
    {
      title: 'Custom Fields',
      description: 'Manage custom field configurations',
      icon: Database,
      color: 'text-warning'
    },
    {
      title: 'Notifications',
      description: 'Set up email alerts and notifications',
      icon: Bell,
      color: 'text-stage-proposal'
    },
    {
      title: 'Theme Customization',
      description: 'Customize branding and appearance',
      icon: Palette,
      color: 'text-stage-qualified'
    }
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-muted/30">
      {/* Header Section */}
      <div className="bg-background border-b p-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">System Administration</h1>
          <p className="text-muted-foreground mt-1">Manage system settings and configurations</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="permissions">Roles</TabsTrigger>
            <TabsTrigger value="object-permissions">Object Permissions</TabsTrigger>
            <TabsTrigger value="field-permissions">Field Permissions</TabsTrigger>
          </TabsList>

          <TabsContent value="permissions">
            <RoleManagement />
          </TabsContent>

          <TabsContent value="object-permissions">
            <ObjectPermissions />
          </TabsContent>

          <TabsContent value="field-permissions">
            <FieldPermissions />
          </TabsContent>
        </Tabs>

        {/* Other Admin Sections */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Other System Configurations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {adminSections.map((section, index) => (
              <Card key={index} className="bg-background hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-muted ${section.color}`}>
                      <section.icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4">
                    {section.description}
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Configure
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* System Status */}
        <Card className="mt-8 bg-background">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-success mb-1">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">247</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-warning mb-1">2.3GB</div>
                <div className="text-sm text-muted-foreground">Storage Used</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="mt-6 bg-background">
          <CardHeader>
            <CardTitle>Recent System Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-muted">
                <span className="text-sm">User 'john.doe@company.com' logged in</span>
                <span className="text-xs text-muted-foreground">2 minutes ago</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-muted">
                <span className="text-sm">Database backup completed successfully</span>
                <span className="text-xs text-muted-foreground">1 hour ago</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-muted">
                <span className="text-sm">New opportunity created by Sarah Johnson</span>
                <span className="text-xs text-muted-foreground">3 hours ago</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm">System maintenance scheduled</span>
                <span className="text-xs text-muted-foreground">Yesterday</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}