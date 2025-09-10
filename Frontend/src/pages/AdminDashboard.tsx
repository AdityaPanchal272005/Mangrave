import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, Users, TrendingUp, TrendingDown, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MetricCard = ({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend,
  onClick
}: {
  title: string;
  value: string;
  description: string;
  icon: any;
  trend?: 'up' | 'down';
  onClick?: () => void;
}) => (
  <Card 
    className={`hover:shadow-ocean transition-all duration-300 ${onClick ? 'cursor-pointer hover:scale-105' : ''}`}
    onClick={onClick}
  >
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <Icon className="h-4 w-4 text-primary" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-foreground">{value}</div>
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        {trend === 'up' && <TrendingUp className="h-3 w-3 text-status-success" />}
        {trend === 'down' && <TrendingDown className="h-3 w-3 text-destructive" />}
        {description}
      </div>
    </CardContent>
  </Card>
);

const RecentIncident = ({ 
  id, 
  type, 
  location, 
  status, 
  time 
}: {
  id: string;
  type: string;
  location: string;
  status: 'resolved' | 'investigating' | 'new';
  time: string;
}) => {
  const statusColors = {
    resolved: 'text-status-success bg-status-success/10',
    investigating: 'text-status-warning bg-status-warning/10',
    new: 'text-destructive bg-destructive/10'
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-3">
        <AlertTriangle className="h-4 w-4 text-primary" />
        <div>
          <p className="text-sm font-medium text-foreground">{type}</p>
          <p className="text-xs text-muted-foreground">{location}</p>
        </div>
      </div>
      <div className="text-right">
        <span className={`text-xs px-2 py-1 rounded-full ${statusColors[status]}`}>
          {status}
        </span>
        <p className="text-xs text-muted-foreground mt-1">{time}</p>
      </div>
    </div>
  );
};

const TopContributor = ({ 
  name, 
  reports, 
  points 
}: {
  name: string;
  reports: number;
  points: number;
}) => (
  <div className="flex items-center justify-between p-3 rounded-lg border border-border">
    <div className="flex items-center gap-3">
      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
        <Users className="h-4 w-4 text-primary" />
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">{name}</p>
        <p className="text-xs text-muted-foreground">{reports} reports</p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-sm font-bold text-accent">{points} pts</p>
    </div>
  </div>
);

export const AdminDashboard = () => {
  const navigate = useNavigate();
  
  const recentIncidents = [
    { id: '1', type: 'Illegal Logging', location: 'Sector A-7', status: 'new' as const, time: '2h ago' },
    { id: '2', type: 'Unauthorized Fishing', location: 'Coastal Zone B', status: 'investigating' as const, time: '4h ago' },
    { id: '3', type: 'Pollution Discharge', location: 'River Delta C', status: 'resolved' as const, time: '1d ago' },
    { id: '4', type: 'Wildlife Poaching', location: 'Protected Area D', status: 'investigating' as const, time: '2d ago' },
  ];

  const topContributors = [
    { name: 'Marine Bio NGO', reports: 23, points: 1250 },
    { name: 'Coastal Watch', reports: 18, points: 980 },
    { name: 'EcoGuardians', reports: 15, points: 875 },
    { name: 'Local Community', reports: 12, points: 650 },
  ];

  const handleNewIncidentsClick = () => {
    navigate('/admin/incidents?status=new');
  };

  const handleResolvedCasesClick = () => {
    navigate('/admin/incidents?status=resolved');
  };

  const handleActiveContributorsClick = () => {
    navigate('/admin/users');
  };

  const handleAreasMonitoredClick = () => {
    navigate('/admin/incidents');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Executive Overview</h1>
        <p className="text-muted-foreground">Mangrove surveillance system dashboard</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="New Incidents This Week"
          value="24"
          description="+12% from last week"
          icon={AlertTriangle}
          trend="up"
          onClick={handleNewIncidentsClick}
        />
        <MetricCard
          title="Resolved Cases"
          value="89"
          description="+8% resolution rate"
          icon={CheckCircle}
          trend="up"
          onClick={handleResolvedCasesClick}
        />
        <MetricCard
          title="Active Contributors"
          value="156"
          description="3 new this week"
          icon={Users}
          trend="up"
          onClick={handleActiveContributorsClick}
        />
        <MetricCard
          title="Areas Monitored"
          value="42"
          description="Across 8 zones"
          icon={Eye}
          onClick={handleAreasMonitoredClick}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Incidents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              Recent Incidents
            </CardTitle>
            <CardDescription>
              Latest reported incidents requiring attention
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentIncidents.map((incident) => (
              <RecentIncident key={incident.id} {...incident} />
            ))}
          </CardContent>
        </Card>

        {/* Top Contributors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Top Contributors
            </CardTitle>
            <CardDescription>
              Most active community members and organizations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {topContributors.map((contributor, index) => (
              <TopContributor key={index} {...contributor} />
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Trend Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Incident Trends Over Time
          </CardTitle>
          <CardDescription>
            Weekly incident reports and resolution rates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gradient-ocean/10 rounded-lg flex items-center justify-center border border-border">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-primary mx-auto mb-2" />
              <p className="text-muted-foreground">Chart visualization would be implemented here</p>
              <p className="text-xs text-muted-foreground mt-1">Showing incident trends and patterns</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};