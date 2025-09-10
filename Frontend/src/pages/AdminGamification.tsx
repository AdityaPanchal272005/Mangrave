import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Trophy, 
  Star, 
  Crown, 
  Medal, 
  Gift,
  TrendingUp,
  Users,
  Award,
  Zap,
  Plus,
  CheckCircle
} from "lucide-react";
import { api } from "@/lib/api";

interface LeaderboardEntry {
  id: string;
  name: string;
  type: 'NGO' | 'Community' | 'Individual' | 'Government';
  points: number;
  reportsThisMonth: number;
  streak: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
  avatar?: string;
}

interface RewardTier {
  name: string;
  minPoints: number;
  color: string;
  benefits: string[];
  icon: any;
}

const mockLeaderboard: LeaderboardEntry[] = [
  {
    id: '1',
    name: 'Marine Bio NGO',
    type: 'NGO',
    points: 3780,
    reportsThisMonth: 12,
    streak: 15,
    tier: 'Diamond'
  },
  {
    id: '2',
    name: 'EcoGuardians',
    type: 'NGO',
    points: 3240,
    reportsThisMonth: 9,
    streak: 22,
    tier: 'Platinum'
  },
  {
    id: '3',
    name: 'Ahmad Rahman',
    type: 'Community',
    points: 2890,
    reportsThisMonth: 8,
    streak: 8,
    tier: 'Gold'
  },
  {
    id: '4',
    name: 'Coastal Watch',
    type: 'Government',
    points: 2340,
    reportsThisMonth: 6,
    streak: 12,
    tier: 'Gold'
  },
  {
    id: '5',
    name: 'Dr. Sarah Chen',
    type: 'Individual',
    points: 1980,
    reportsThisMonth: 5,
    streak: 6,
    tier: 'Silver'
  }
];

const rewardTiers: RewardTier[] = [
  {
    name: 'Bronze',
    minPoints: 100,
    color: 'text-amber-600',
    benefits: ['Basic reporting tools', 'Community access'],
    icon: Medal
  },
  {
    name: 'Silver',
    minPoints: 500,
    color: 'text-gray-400',
    benefits: ['Advanced analytics', 'Priority support', 'Monthly reports'],
    icon: Award
  },
  {
    name: 'Gold',
    minPoints: 1500,
    color: 'text-yellow-500',
    benefits: ['Expert consultation', 'Data export', 'Training materials'],
    icon: Star
  },
  {
    name: 'Platinum',
    minPoints: 3000,
    color: 'text-blue-400',
    benefits: ['Direct hotline', 'Policy influence', 'Research collaboration'],
    icon: Crown
  },
  {
    name: 'Diamond',
    minPoints: 5000,
    color: 'text-cyan-400',
    benefits: ['VIP status', 'Conference invitations', 'Exclusive network'],
    icon: Trophy
  }
];

const TierBadge = ({ tier }: { tier: LeaderboardEntry['tier'] }) => {
  const colors = {
    Bronze: 'bg-amber-600/10 text-amber-600 border-amber-600/20',
    Silver: 'bg-gray-400/10 text-gray-400 border-gray-400/20',
    Gold: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    Platinum: 'bg-blue-400/10 text-blue-400 border-blue-400/20',
    Diamond: 'bg-cyan-400/10 text-cyan-400 border-cyan-400/20'
  };

  return (
    <Badge variant="outline" className={colors[tier]}>
      {tier}
    </Badge>
  );
};

const LeaderboardCard = ({ entry, rank }: { entry: LeaderboardEntry; rank: number }) => {
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Award className="h-5 w-5 text-amber-600" />;
    return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
  };

  return (
    <Card className={`hover:shadow-ocean transition-all duration-300 ${
      rank <= 3 ? 'ring-2 ring-primary/20' : ''
    }`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10">
              {getRankIcon(rank)}
            </div>
            <Avatar className="h-12 w-12">
              <AvatarImage src={entry.avatar} />
              <AvatarFallback className="bg-primary/20 text-primary">
                {entry.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-foreground">{entry.name}</h3>
              <p className="text-sm text-muted-foreground">{entry.type}</p>
            </div>
          </div>
          <TierBadge tier={entry.tier} />
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star className="h-4 w-4 text-accent" />
              <span className="font-bold text-accent">{entry.points}</span>
            </div>
            <p className="text-xs text-muted-foreground">Points</p>
          </div>
          
          <div>
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="h-4 w-4 text-status-success" />
              <span className="font-bold text-status-success">{entry.reportsThisMonth}</span>
            </div>
            <p className="text-xs text-muted-foreground">This Month</p>
          </div>
          
          <div>
            <div className="flex items-center justify-center gap-1 mb-1">
              <Zap className="h-4 w-4 text-status-warning" />
              <span className="font-bold text-status-warning">{entry.streak}</span>
            </div>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const RewardTierCard = ({ tier }: { tier: RewardTier }) => {
  const IconComponent = tier.icon;
  
  return (
    <Card className="hover:shadow-mangrove transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-lg bg-card ${tier.color}`}>
            <IconComponent className="h-6 w-6" />
          </div>
          <div>
            <h3 className={`font-bold text-lg ${tier.color}`}>{tier.name}</h3>
            <p className="text-sm text-muted-foreground">{tier.minPoints}+ points</p>
          </div>
        </div>
        
        <div className="space-y-2">
          {tier.benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-sm text-foreground">{benefit}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export const AdminGamification = () => {
  const [selectedTab, setSelectedTab] = useState<'leaderboard' | 'rewards'>('leaderboard');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(mockLeaderboard);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [pointsToAward, setPointsToAward] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const { toast } = useToast();

  const totalParticipants = leaderboard.length;
  const averagePoints = leaderboard.reduce((sum, entry) => sum + entry.points, 0) / totalParticipants;
  const topPerformer = leaderboard[0];

  useEffect(() => {
    const fetchGamificationData = async () => {
      try {
        setLoading(true);
        const response = await api.gamification.getData();
        
        // Transform API data to match our UI structure
        if (response.leaderboard && Array.isArray(response.leaderboard)) {
          const transformedLeaderboard: LeaderboardEntry[] = response.leaderboard.map((entry: any, index: number) => ({
            id: entry.userId || entry.id || `user-${index}`,
            name: entry.name || 'Unknown User',
            type: entry.type || 'Individual',
            points: entry.points || 0,
            reportsThisMonth: entry.reportsThisMonth || Math.floor(Math.random() * 15),
            streak: entry.streak || Math.floor(Math.random() * 30),
            tier: getTierFromPoints(entry.points || 0),
            avatar: entry.avatar
          }));
          setLeaderboard(transformedLeaderboard);
        }
      } catch (err) {
        console.error('Failed to fetch gamification data:', err);
        // Keep using mock data as fallback
        setLeaderboard(mockLeaderboard);
      } finally {
        setLoading(false);
      }
    };

    fetchGamificationData();
  }, []);

  const getTierFromPoints = (points: number): LeaderboardEntry['tier'] => {
    if (points >= 5000) return 'Diamond';
    if (points >= 3000) return 'Platinum';
    if (points >= 1500) return 'Gold';
    if (points >= 500) return 'Silver';
    return 'Bronze';
  };

  const handleAwardPoints = async () => {
    if (!selectedUser || !pointsToAward || !reason.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select a user, enter points, and provide a reason.",
        variant: "destructive",
      });
      return;
    }

    const points = parseInt(pointsToAward);
    if (isNaN(points) || points <= 0) {
      toast({
        title: "Invalid Points",
        description: "Please enter a valid positive number for points.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      // Call the real API
      const response = await api.gamification.awardPoints(selectedUser, points, reason);
      
      // Update local state
      setLeaderboard(prev => prev.map(entry => 
        entry.id === selectedUser 
          ? { ...entry, points: entry.points + points }
          : entry
      ));

      toast({
        title: "Points Awarded Successfully",
        description: response.message || `Awarded ${points} points to ${leaderboard.find(u => u.id === selectedUser)?.name}`,
      });

      // Reset form
      setSelectedUser('');
      setPointsToAward('');
      setReason('');
    } catch (err) {
      console.error('Failed to award points:', err);
      toast({
        title: "Failed to Award Points",
        description: err instanceof Error ? err.message : "There was an error awarding points. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Gamification & Rewards</h1>
        <p className="text-muted-foreground">Manage contributor incentives and recognition</p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <Users className="h-5 w-5 text-primary" />
                <p className="text-2xl font-bold text-primary">{totalParticipants}</p>
              </div>
              <p className="text-sm text-muted-foreground">Active Contributors</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <Star className="h-5 w-5 text-accent" />
                <p className="text-2xl font-bold text-accent">{Math.round(averagePoints)}</p>
              </div>
              <p className="text-sm text-muted-foreground">Avg Points</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                <p className="text-2xl font-bold text-yellow-500">{topPerformer.points}</p>
              </div>
              <p className="text-sm text-muted-foreground">Top Score</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <Gift className="h-5 w-5 text-reef-coral" />
                <p className="text-2xl font-bold text-reef-coral">5</p>
              </div>
              <p className="text-sm text-muted-foreground">Reward Tiers</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2">
        <Button
          variant={selectedTab === 'leaderboard' ? 'default' : 'outline'}
          onClick={() => setSelectedTab('leaderboard')}
          className="flex items-center gap-2"
        >
          <Trophy className="h-4 w-4" />
          Leaderboard
        </Button>
        <Button
          variant={selectedTab === 'rewards' ? 'default' : 'outline'}
          onClick={() => setSelectedTab('rewards')}
          className="flex items-center gap-2"
        >
          <Gift className="h-4 w-4" />
          Reward System
        </Button>
      </div>

      {/* Content */}
      {selectedTab === 'leaderboard' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                Top Contributors
              </CardTitle>
              <CardDescription>
                Current month's leading contributors and their achievements
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {leaderboard.map((entry, index) => (
              <LeaderboardCard key={entry.id} entry={entry} rank={index + 1} />
            ))}
          </div>
        </div>
      )}

      {selectedTab === 'rewards' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-primary" />
                Reward Tiers
              </CardTitle>
              <CardDescription>
                Recognition levels and benefits for community contributors
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {rewardTiers.map((tier) => (
              <RewardTierCard key={tier.name} tier={tier} />
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                Manual Point Awards
              </CardTitle>
              <CardDescription>
                Award additional points for exceptional contributions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="contributor-select">Select Contributor</Label>
                  <Select value={selectedUser} onValueChange={setSelectedUser}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a contributor..." />
                    </SelectTrigger>
                    <SelectContent>
                      {leaderboard.map((entry) => (
                        <SelectItem key={entry.id} value={entry.id}>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={entry.avatar} />
                              <AvatarFallback className="text-xs">
                                {entry.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span>{entry.name}</span>
                            <Badge variant="outline" className="ml-auto">
                              {entry.points} pts
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="points-input">Points to Award</Label>
                  <Input
                    id="points-input"
                    type="number"
                    placeholder="100"
                    value={pointsToAward}
                    onChange={(e) => setPointsToAward(e.target.value)}
                    min="1"
                    max="1000"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reason-input">Reason for Award</Label>
                <Input
                  id="reason-input"
                  placeholder="e.g., Exceptional report quality, Community leadership, etc."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={handleAwardPoints}
                  disabled={loading || !selectedUser || !pointsToAward || !reason.trim()}
                  className="flex items-center gap-2"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Star className="h-4 w-4" />
                  )}
                  {loading ? 'Awarding...' : 'Award Points'}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedUser('');
                    setPointsToAward('');
                    setReason('');
                  }}
                >
                  Clear Form
                </Button>
              </div>
              
              {selectedUser && (
                <div className="p-3 bg-muted/50 rounded-lg border">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-status-success" />
                    <span className="text-muted-foreground">
                      Selected: <strong>{leaderboard.find(u => u.id === selectedUser)?.name}</strong>
                      {pointsToAward && ` • Will receive ${pointsToAward} points`}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};