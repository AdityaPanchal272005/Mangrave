import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  Search, 
  UserCheck, 
  UserX, 
  Star,
  MapPin,
  Calendar,
  Mail,
  Shield,
  AlertTriangle,
  Eye,
  Award,
  TrendingUp,
  Activity,
  Send,
  Plus,
  X
} from "lucide-react";
import { api } from "@/lib/api";

interface User {
  id: string;
  name: string;
  email: string;
  type: 'NGO' | 'Community' | 'Individual' | 'Government';
  location: string;
  joinDate: string;
  totalReports: number;
  resolvedReports: number;
  points: number;
  status: 'active' | 'inactive' | 'banned';
  avatar?: string;
}

const mockUsers: User[] = [
  {
    id: 'USR-001',
    name: 'Marine Bio NGO',
    email: 'contact@marinebio.org',
    type: 'NGO',
    location: 'Jakarta, Indonesia',
    joinDate: '2023-03-15',
    totalReports: 45,
    resolvedReports: 38,
    points: 2340,
    status: 'active'
  },
  {
    id: 'USR-002',
    name: 'Ahmad Rahman',
    email: 'ahmad.r@email.com',
    type: 'Community',
    location: 'Surabaya, Indonesia',
    joinDate: '2023-06-20',
    totalReports: 28,
    resolvedReports: 22,
    points: 1560,
    status: 'active'
  },
  {
    id: 'USR-003',
    name: 'EcoGuardians',
    email: 'team@ecoguardians.org',
    type: 'NGO',
    location: 'Bangkok, Thailand',
    joinDate: '2023-01-10',
    totalReports: 67,
    resolvedReports: 59,
    points: 3780,
    status: 'active'
  },
  {
    id: 'USR-004',
    name: 'Dr. Sarah Chen',
    email: 'sarah.chen@university.edu',
    type: 'Individual',
    location: 'Singapore',
    joinDate: '2023-08-05',
    totalReports: 23,
    resolvedReports: 20,
    points: 1290,
    status: 'active'
  },
  {
    id: 'USR-005',
    name: 'Coastal Watch',
    email: 'info@coastalwatch.org',
    type: 'Government',
    location: 'Manila, Philippines',
    joinDate: '2023-02-28',
    totalReports: 34,
    resolvedReports: 31,
    points: 1980,
    status: 'inactive'
  },
  {
    id: 'USR-006',
    name: 'Mangrove Conservation Society',
    email: 'info@mangroveconservation.org',
    type: 'NGO',
    location: 'Kuala Lumpur, Malaysia',
    joinDate: '2023-04-12',
    totalReports: 52,
    resolvedReports: 45,
    points: 2890,
    status: 'active'
  },
  {
    id: 'USR-007',
    name: 'Prof. Michael Torres',
    email: 'm.torres@research.edu',
    type: 'Individual',
    location: 'Quezon City, Philippines',
    joinDate: '2023-07-18',
    totalReports: 19,
    resolvedReports: 16,
    points: 1120,
    status: 'active'
  },
  {
    id: 'USR-008',
    name: 'Blue Ocean Foundation',
    email: 'contact@blueocean.org',
    type: 'NGO',
    location: 'Ho Chi Minh City, Vietnam',
    joinDate: '2023-05-03',
    totalReports: 41,
    resolvedReports: 35,
    points: 2150,
    status: 'active'
  },
  {
    id: 'USR-009',
    name: 'Local Fishermen Association',
    email: 'fishermen@local.org',
    type: 'Community',
    location: 'Bali, Indonesia',
    joinDate: '2023-09-22',
    totalReports: 33,
    resolvedReports: 28,
    points: 1780,
    status: 'active'
  },
  {
    id: 'USR-010',
    name: 'Environmental Protection Agency',
    email: 'epa@government.gov',
    type: 'Government',
    location: 'Bangkok, Thailand',
    joinDate: '2023-01-15',
    totalReports: 78,
    resolvedReports: 72,
    points: 4250,
    status: 'active'
  },
  {
    id: 'USR-011',
    name: 'Dr. Lisa Wang',
    email: 'lisa.wang@marine.edu',
    type: 'Individual',
    location: 'Taipei, Taiwan',
    joinDate: '2023-08-30',
    totalReports: 26,
    resolvedReports: 23,
    points: 1450,
    status: 'active'
  },
  {
    id: 'USR-012',
    name: 'Green Earth Initiative',
    email: 'info@greenearth.org',
    type: 'NGO',
    location: 'Yangon, Myanmar',
    joinDate: '2023-06-08',
    totalReports: 37,
    resolvedReports: 32,
    points: 1920,
    status: 'active'
  }
];

const TypeBadge = ({ type }: { type: User['type'] }) => {
  const variants = {
    NGO: 'bg-primary/10 text-primary border-primary/20',
    Community: 'bg-ocean-medium/10 text-ocean-medium border-ocean-medium/20',
    Individual: 'bg-reef-coral/10 text-reef-coral border-reef-coral/20',
    Government: 'bg-status-info/10 text-status-info border-status-info/20'
  };

  return (
    <Badge variant="outline" className={variants[type]}>
      {type}
    </Badge>
  );
};

const StatusBadge = ({ status }: { status: User['status'] }) => {
  const variants = {
    active: 'bg-status-success/10 text-status-success border-status-success/20',
    inactive: 'bg-status-warning/10 text-status-warning border-status-warning/20',
    banned: 'bg-destructive/10 text-destructive border-destructive/20'
  };

  return (
    <Badge variant="outline" className={variants[status]}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

const UserProfileDialog = ({ user }: { user: User }) => {
  const [isOpen, setIsOpen] = useState(false);
  const successRate = user.totalReports > 0 ? Math.round((user.resolvedReports / user.totalReports) * 100) : 0;
  const [showSendMessage, setShowSendMessage] = useState(false);
  const [showAwardPoints, setShowAwardPoints] = useState(false);
  const [messageSubject, setMessageSubject] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [pointsToAward, setPointsToAward] = useState<string>("");
  const [awardReason, setAwardReason] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!messageSubject.trim() || !messageBody.trim()) {
      toast({ title: "Missing information", description: "Please enter subject and message.", variant: "destructive" });
      return;
    }
    try {
      setLoading(true);
      // Placeholder: integrate with your messaging endpoint when available
      await new Promise((r) => setTimeout(r, 800));
      toast({ title: "Message sent", description: `Your message was sent to ${user.name}.` });
      setMessageSubject("");
      setMessageBody("");
      setShowSendMessage(false);
    } catch (e) {
      toast({ title: "Failed to send", description: "Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleAwardPoints = async () => {
    const points = parseInt(pointsToAward, 10);
    if (!points || points <= 0 || !awardReason.trim()) {
      toast({ title: "Invalid entry", description: "Enter positive points and a reason.", variant: "destructive" });
      return;
    }
    try {
      setLoading(true);
      const resp = await api.gamification.awardPoints(user.id, points, awardReason);
      toast({ title: "Points awarded", description: resp?.message || `${points} points awarded to ${user.name}.` });
      setPointsToAward("");
      setAwardReason("");
      setShowAwardPoints(false);
    } catch (e) {
      toast({ title: "Failed to award", description: e instanceof Error ? e.message : "Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <UserCheck className="h-4 w-4 mr-1" />
          View Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            User Profile - {user.name}
          </DialogTitle>
          <DialogDescription>
            Complete information about this user and their contributions
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* User Header */}
          <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="bg-primary/20 text-primary text-lg">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-foreground">{user.name}</h3>
              <div className="flex items-center gap-1 text-muted-foreground mb-2">
                <Mail className="h-4 w-4" />
                {user.email}
              </div>
              <div className="flex items-center gap-2">
                <TypeBadge type={user.type} />
                <StatusBadge status={user.status} />
              </div>
            </div>
          </div>

          {/* User Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-muted/20 rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Star className="h-4 w-4 text-accent" />
                <span className="text-lg font-bold text-accent">{user.points}</span>
              </div>
              <p className="text-xs text-muted-foreground">Total Points</p>
            </div>
            
            <div className="text-center p-3 bg-muted/20 rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Activity className="h-4 w-4 text-primary" />
                <span className="text-lg font-bold text-primary">{user.totalReports}</span>
              </div>
              <p className="text-xs text-muted-foreground">Total Reports</p>
            </div>
            
            <div className="text-center p-3 bg-muted/20 rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Award className="h-4 w-4 text-status-success" />
                <span className="text-lg font-bold text-status-success">{user.resolvedReports}</span>
              </div>
              <p className="text-xs text-muted-foreground">Resolved</p>
            </div>
            
            <div className="text-center p-3 bg-muted/20 rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingUp className="h-4 w-4 text-status-warning" />
                <span className="text-lg font-bold text-status-warning">{successRate}%</span>
              </div>
              <p className="text-xs text-muted-foreground">Success Rate</p>
            </div>
          </div>

          {/* User Details */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Location</label>
                <div className="flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  <p className="text-foreground">{user.location}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Join Date</label>
                <div className="flex items-center gap-1 mt-1">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <p className="text-foreground">{user.joinDate}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">User Type</label>
                <div className="mt-1">
                  <TypeBadge type={user.type} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div className="mt-1">
                  <StatusBadge status={user.status} />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Recent Activity</label>
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 bg-muted/20 rounded">
                <Activity className="h-4 w-4 text-primary" />
                <span className="text-sm">Submitted {user.totalReports} reports</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-muted/20 rounded">
                <Award className="h-4 w-4 text-status-success" />
                <span className="text-sm">Resolved {user.resolvedReports} incidents</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-muted/20 rounded">
                <Star className="h-4 w-4 text-accent" />
                <span className="text-sm">Earned {user.points} points</span>
              </div>
            </div>
          </div>

          {/* Send Message */}
          {showSendMessage && (
            <div className="p-4 bg-muted/30 rounded-lg border">
              <Label className="mb-2 block">Send Message</Label>
              <div className="space-y-2">
                <Input placeholder="Subject" value={messageSubject} onChange={(e) => setMessageSubject(e.target.value)} />
                <Textarea rows={4} placeholder="Write your message..." value={messageBody} onChange={(e) => setMessageBody(e.target.value)} />
                <div className="flex gap-2">
                  <Button onClick={handleSendMessage} disabled={loading} className="flex items-center gap-2">
                    {loading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> : <Send className="h-4 w-4" />}
                    Send
                  </Button>
                  <Button variant="outline" onClick={() => setShowSendMessage(false)} className="flex items-center gap-2">
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Award Points */}
          {showAwardPoints && (
            <div className="p-4 bg-muted/30 rounded-lg border">
              <Label className="mb-2 block">Award Points</Label>
              <div className="grid gap-2 md:grid-cols-2">
                <Input type="number" min="1" placeholder="Points" value={pointsToAward} onChange={(e) => setPointsToAward(e.target.value)} />
                <Input placeholder="Reason (e.g., exceptional report quality)" value={awardReason} onChange={(e) => setAwardReason(e.target.value)} />
              </div>
              <div className="flex gap-2 mt-2">
                <Button onClick={handleAwardPoints} disabled={loading || !pointsToAward} className="flex items-center gap-2">
                  {loading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> : <Award className="h-4 w-4" />}
                  Award
                </Button>
                <Button variant="outline" onClick={() => setShowAwardPoints(false)} className="flex items-center gap-2">
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            {!showSendMessage && (
              <Button variant="outline" size="sm" onClick={() => setShowSendMessage(true)}>
                <Mail className="h-4 w-4 mr-1" />
                Send Message
              </Button>
            )}
            {!showAwardPoints && (
              <Button variant="outline" size="sm" onClick={() => setShowAwardPoints(true)}>
                <Award className="h-4 w-4 mr-1" />
                Award Points
              </Button>
            )}
            <Button size="sm" className="ml-auto" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const UserCard = ({ user }: { user: User }) => {
  const successRate = user.totalReports > 0 ? Math.round((user.resolvedReports / user.totalReports) * 100) : 0;

  return (
    <Card className="hover:shadow-ocean transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="bg-primary/20 text-primary">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-foreground">{user.name}</h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Mail className="h-3 w-3" />
                {user.email}
              </div>
            </div>
          </div>
          <StatusBadge status={user.status} />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TypeBadge type={user.type} />
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {user.location}
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              Joined {user.joinDate}
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center justify-end gap-1 mb-2">
              <Star className="h-4 w-4 text-accent" />
              <span className="font-bold text-accent">{user.points}</span>
              <span className="text-xs text-muted-foreground">pts</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {user.totalReports} reports • {successRate}% success
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <UserProfileDialog user={user} />
          </div>
          
          <div className="flex gap-1">
            {user.status === 'active' && (
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
                <UserX className="h-4 w-4" />
              </Button>
            )}
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
              <Shield className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [filterType, setFilterType] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await api.users.getAll();
        
        // Transform API data to match our UI structure
        const transformedUsers: User[] = response.users.map((apiUser: any) => ({
          id: apiUser.id || apiUser.uid || `user-${Math.random()}`,
          name: apiUser.name || apiUser.displayName || apiUser.email?.split('@')[0] || 'Unknown User',
          email: apiUser.email || 'no-email@example.com',
          type: apiUser.type || apiUser.organizationType || 'Individual',
          location: apiUser.location || apiUser.address || 'Unknown Location',
          joinDate: apiUser.joinDate || apiUser.createdAt || new Date().toISOString().split('T')[0],
          totalReports: apiUser.totalReports || apiUser.reportsSubmitted || 0,
          resolvedReports: apiUser.resolvedReports || Math.floor((apiUser.totalReports || 0) * 0.8),
          points: apiUser.points || 0,
          status: apiUser.status || 'active',
          avatar: apiUser.avatar || apiUser.photoURL
        }));

        setUsers(transformedUsers);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch users:', err);
        setError('Failed to load users data');
        // Keep using mock data as fallback
        setUsers(mockUsers);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || user.type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const totalPoints = users.reduce((sum, user) => sum + user.points, 0);
  const totalReports = users.reduce((sum, user) => sum + user.totalReports, 0);
  const activeUsers = users.filter(user => user.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">User Management</h1>
        <p className="text-muted-foreground">Manage contributors and community members</p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{users.length}</p>
              <p className="text-sm text-muted-foreground">Total Users</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-status-success">{activeUsers}</p>
              <p className="text-sm text-muted-foreground">Active</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-accent">{totalPoints.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Points</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-ocean-medium">{totalReports}</p>
              <p className="text-sm text-muted-foreground">Total Reports</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Controls */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                All Users
              </CardTitle>
              <CardDescription>
                {filteredUsers.length} users found
              </CardDescription>
            </div>
            
            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full md:w-64"
                />
              </div>
              
              <div className="flex gap-2">
                {['all', 'NGO', 'Community', 'Individual', 'Government'].map((type) => (
                  <Button
                    key={type}
                    variant={filterType === type ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterType(type)}
                  >
                    {type === 'all' ? 'All' : type}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Error State */}
      {error && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-4 w-4" />
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading users...</p>
          </CardContent>
        </Card>
      )}

      {/* Users Grid */}
      {!loading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredUsers.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      )}

      {!loading && filteredUsers.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No users found matching your criteria</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};