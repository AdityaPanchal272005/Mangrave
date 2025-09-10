import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Settings, 
  User, 
  Lock, 
  Bell, 
  Mail, 
  Shield,
  Save,
  Camera,
  Key
} from "lucide-react";

export const AdminSettings = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // Profile settings
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Admin User',
    email: user?.email || 'admin@mangrove.org',
    title: 'Surveillance System Administrator',
    department: 'Environmental Protection',
    location: 'Jakarta, Indonesia'
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    newIncidents: true,
    weeklyReports: true,
    systemAlerts: true,
    userRegistrations: false,
    criticalAlerts: true,
    emailDigest: true
  });

  // Security settings
  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    sessionTimeout: '4', // hours
    loginAlerts: true
  });

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const remote = await api.profile.get();
        setProfileData((prev) => ({ ...prev, ...remote }));
        const remoteSettings = await api.settings.get();
        if (remoteSettings?.notifications) setNotifications(remoteSettings.notifications);
        if (remoteSettings?.security) setSecurity(remoteSettings.security);
      } catch (e) {
        // ignore to keep page usable if backend empty
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      await api.profile.update(profileData);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    setIsLoading(true);
    try {
      await api.settings.update({ notifications });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSecurity = async () => {
    setIsLoading(true);
    try {
      await api.settings.update({ security });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences and system configuration</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Settings */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Update your personal information and profile details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user?.photoURL} />
                  <AvatarFallback className="bg-primary/20 text-primary text-xl">
                    {profileData.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm" className="mb-2">
                    <Camera className="h-4 w-4 mr-2" />
                    Change Photo
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG or GIF. Max size 2MB.
                  </p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    value={profileData.title}
                    onChange={(e) => setProfileData({...profileData, title: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={profileData.department}
                    onChange={(e) => setProfileData({...profileData, department: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={profileData.location}
                    onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                  />
                </div>
              </div>

              <Button onClick={handleSaveProfile} disabled={isLoading} className="w-full md:w-auto">
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Saving...' : 'Save Profile'}
              </Button>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Manage your account security and authentication preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch
                    checked={security.twoFactorAuth}
                    onCheckedChange={(checked) => 
                      setSecurity({...security, twoFactorAuth: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Login Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when someone logs into your account
                    </p>
                  </div>
                  <Switch
                    checked={security.loginAlerts}
                    onCheckedChange={(checked) => 
                      setSecurity({...security, loginAlerts: checked})
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeout">Session Timeout (hours)</Label>
                  <Input
                    id="timeout"
                    type="number"
                    min="1"
                    max="24"
                    value={security.sessionTimeout}
                    onChange={(e) => setSecurity({...security, sessionTimeout: e.target.value})}
                    className="w-24"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <Button variant="outline" className="mb-4">
                  <Key className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
              </div>

              <Button onClick={handleSaveSecurity} disabled={isLoading} className="w-full md:w-auto">
                <Shield className="h-4 w-4 mr-2" />
                {isLoading ? 'Saving...' : 'Save Security Settings'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Notification Settings */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Notifications
              </CardTitle>
              <CardDescription>
                Configure how you receive updates and alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>New Incidents</Label>
                    <p className="text-xs text-muted-foreground">
                      Immediate alerts
                    </p>
                  </div>
                  <Switch
                    checked={notifications.newIncidents}
                    onCheckedChange={(checked) => 
                      setNotifications({...notifications, newIncidents: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Critical Alerts</Label>
                    <p className="text-xs text-muted-foreground">
                      High-priority incidents
                    </p>
                  </div>
                  <Switch
                    checked={notifications.criticalAlerts}
                    onCheckedChange={(checked) => 
                      setNotifications({...notifications, criticalAlerts: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Weekly Reports</Label>
                    <p className="text-xs text-muted-foreground">
                      Summary reports
                    </p>
                  </div>
                  <Switch
                    checked={notifications.weeklyReports}
                    onCheckedChange={(checked) => 
                      setNotifications({...notifications, weeklyReports: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>System Alerts</Label>
                    <p className="text-xs text-muted-foreground">
                      Technical updates
                    </p>
                  </div>
                  <Switch
                    checked={notifications.systemAlerts}
                    onCheckedChange={(checked) => 
                      setNotifications({...notifications, systemAlerts: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>User Registrations</Label>
                    <p className="text-xs text-muted-foreground">
                      New user signups
                    </p>
                  </div>
                  <Switch
                    checked={notifications.userRegistrations}
                    onCheckedChange={(checked) => 
                      setNotifications({...notifications, userRegistrations: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Digest</Label>
                    <p className="text-xs text-muted-foreground">
                      Daily summary email
                    </p>
                  </div>
                  <Switch
                    checked={notifications.emailDigest}
                    onCheckedChange={(checked) => 
                      setNotifications({...notifications, emailDigest: checked})
                    }
                  />
                </div>
              </div>

              <Button onClick={handleSaveNotifications} disabled={isLoading} className="w-full">
                <Mail className="h-4 w-4 mr-2" />
                {isLoading ? 'Saving...' : 'Save Preferences'}
              </Button>
            </CardContent>
          </Card>

          {/* System Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                System Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Version</span>
                <span className="font-mono">v2.1.4</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Last Updated</span>
                <span>Jan 15, 2024</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Server Status</span>
                <span className="text-status-success">Online</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Data Backup</span>
                <span className="text-status-success">Current</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};