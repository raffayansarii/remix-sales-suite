import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart3, TrendingUp, Users, Target, Calendar, Plus } from 'lucide-react';
import { mockOpportunities, mockTasks } from '@/data/mockData';

export default function Dashboard() {
  const totalOpportunities = mockOpportunities.length;
  const totalValue = mockOpportunities.reduce((sum, opp) => sum + opp.value, 0);
  const closedWonOpportunities = mockOpportunities.filter(opp => opp.stage === 'Closed Won');
  const winRate = (closedWonOpportunities.length / totalOpportunities * 100).toFixed(1);
  const avgDealSize = Math.round(totalValue / totalOpportunities);
  
  const recentOpportunities = mockOpportunities.slice(0, 5);
  const upcomingTasks = mockTasks.filter(task => !task.completed).slice(0, 4);

  return (
    <div className="flex-1 space-y-6 p-6 bg-muted/30">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your sales.</p>
        </div>
        <Button className="gap-2 bg-gradient-primary hover:bg-primary-hover">
          <Plus className="w-4 h-4" />
          Quick Add
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-primary text-white border-0">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Total Pipeline</CardTitle>
              <Target className="w-4 h-4 opacity-80" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
            <p className="text-xs opacity-80 mt-1">{totalOpportunities} active opportunities</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Win Rate</CardTitle>
              <TrendingUp className="w-4 h-4 text-success" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{winRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">+2.4% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg Deal Size</CardTitle>
              <BarChart3 className="w-4 h-4 text-warning" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">${avgDealSize.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">+15% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Contacts</CardTitle>
              <Users className="w-4 h-4 text-stage-negotiation" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-stage-negotiation">247</div>
            <p className="text-xs text-muted-foreground mt-1">+12 new this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Recent Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentOpportunities.map((opportunity) => (
              <div key={opportunity.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                <div className="flex-1">
                  <div className="font-medium text-sm">{opportunity.title}</div>
                  <div className="text-xs text-muted-foreground">{opportunity.company}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-success">${opportunity.value.toLocaleString()}</div>
                  <Badge variant="outline" className="text-xs">
                    {opportunity.stage}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Upcoming Tasks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                <div className="flex-1">
                  <div className="font-medium text-sm">{task.title}</div>
                  <div className="text-xs text-muted-foreground">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <Badge 
                    variant={task.priority === 'High' ? 'destructive' : task.priority === 'Medium' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {task.priority}
                  </Badge>
                </div>
              </div>
            ))}
            {upcomingTasks.length === 0 && (
              <div className="text-center text-muted-foreground py-4">
                <p className="text-sm">No upcoming tasks</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}