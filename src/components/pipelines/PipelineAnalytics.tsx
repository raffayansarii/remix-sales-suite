import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, DollarSign, Target, Calendar } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { Opportunity } from '@/types/crm';
import { IOpportunity } from '@/api/opportunity/opportunityTypes';

interface PipelineAnalyticsProps {
  opportunities: IOpportunity[];
}

const STAGE_COLORS = {
  'Lead': '#3B82F6',
  'Qualified': '#8B5CF6', 
  'Proposal': '#F59E0B',
  'Negotiation': '#F97316',
  'Closed Won': '#10B981'
};

export function PipelineAnalytics({ opportunities }: PipelineAnalyticsProps) {
  const analytics = useMemo(() => {
    // Pipeline by Stage
    const stageData = Object.entries(
      opportunities.reduce((acc, opp) => {
        acc[opp.stage] = (acc[opp.stage] || 0) + opp.value;
        return acc;
      }, {} as Record<string, number>)
    ).map(([stage, value]) => ({ stage, value, count: opportunities.filter(o => o.stage === stage).length }));

    // Opportunities by Agency
    const agencyData = Object.entries(
      opportunities.reduce((acc, opp) => {
        acc[opp.agency] = (acc[opp.agency] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    ).map(([agency, count]) => ({ 
      agency: agency.length > 20 ? agency.substring(0, 20) + '...' : agency, 
      count,
      value: opportunities.filter(o => o.agency === agency).reduce((sum, o) => sum + o.value, 0)
    })).slice(0, 8);

    // Award Type Distribution
    const awardTypeData = Object.entries(
      opportunities.reduce((acc, opp) => {
        acc[opp.award_type] = (acc[opp.award_type] || 0) + opp.value;
        return acc;
      }, {} as Record<string, number>)
    ).map(([type, value]) => ({ type, value, count: opportunities.filter(o => o.award_type === type).length }));

    // Monthly Trends (mock data based on created dates)
    const monthlyData = opportunities.reduce((acc, opp) => {
      const month = new Date(opp.created_at).toLocaleString('default', { month: 'short' });
      if (!acc[month]) acc[month] = { month, opportunities: 0, value: 0 };
      acc[month].opportunities += 1;
      acc[month].value += opp.value;
      return acc;
    }, {} as Record<string, any>);

    const trendData = Object.values(monthlyData).slice(-6);

    // Key Metrics
    const totalValue = opportunities.reduce((sum, opp) => sum + opp.value, 0);
    const avgDealSize = totalValue / opportunities.length || 0;
    const winRate = opportunities.filter(o => o.stage === 'Closed Won').length / opportunities.length * 100;
    const totalOpportunities = opportunities.length;

    return {
      stageData,
      agencyData,
      awardTypeData,
      trendData,
      metrics: { totalValue, avgDealSize, winRate, totalOpportunities }
    };
  }, [opportunities]);

  return (
    <div className="space-y-6 p-6 bg-muted/30">
      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-gradient-primary text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4" />
              <span className="text-sm font-medium">Total Pipeline</span>
            </div>
            <div className="text-2xl font-bold">${analytics.metrics.totalValue.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-success" />
              <span className="text-sm font-medium text-muted-foreground">Win Rate</span>
            </div>
            <div className="text-2xl font-bold text-success">{analytics.metrics.winRate.toFixed(1)}%</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-warning" />
              <span className="text-sm font-medium text-muted-foreground">Avg Deal Size</span>
            </div>
            <div className="text-2xl font-bold text-warning">${Math.round(analytics.metrics.avgDealSize).toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Total Opportunities</span>
            </div>
            <div className="text-2xl font-bold text-primary">{analytics.metrics.totalOpportunities}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Pipeline by Stage */}
        <Card className="bg-background">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Pipeline Value by Stage
              <Badge variant="secondary" className="ml-2">${analytics.metrics.totalValue.toLocaleString()}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.stageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="stage" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip 
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
                />
                <Bar 
                  dataKey="value" 
                  fill="#3B82F6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Award Type Distribution */}
        <Card className="bg-background">
          <CardHeader>
            <CardTitle>Award Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.awardTypeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ type, percent }) => `${type}: ${(percent * 100).toFixed(0)}%`}
                >
                  {analytics.awardTypeData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={['#3B82F6', '#10B981', '#F59E0B', '#EF4444'][index % 4]} 
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Total Value']}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Agencies */}
        <Card className="bg-background">
          <CardHeader>
            <CardTitle>Opportunities by Agency</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.agencyData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis 
                  dataKey="agency" 
                  type="category" 
                  tick={{ fontSize: 10 }}
                  width={120}
                />
                <Tooltip 
                  formatter={(value: number) => [`${value} opportunities`, 'Count']}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
                />
                <Bar 
                  dataKey="count" 
                  fill="#8B5CF6"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Trends */}
        <Card className="bg-background">
          <CardHeader>
            <CardTitle>Monthly Pipeline Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analytics.trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    name === 'value' ? `$${value.toLocaleString()}` : value,
                    name === 'value' ? 'Pipeline Value' : 'Opportunities'
                  ]}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#10B981" 
                  fill="#10B981" 
                  fillOpacity={0.3}
                />
                <Line 
                  type="monotone" 
                  dataKey="opportunities" 
                  stroke="#F59E0B" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}