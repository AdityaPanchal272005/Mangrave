import { useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  BarChart3,
  AlertTriangle,
  Users,
  Trophy,
  Settings,
  LogOut,
  Menu,
  X,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navigation = [
  { name: "Dashboard", href: "/admin_dashboard", icon: BarChart3 },
  { name: "Incidents", href: "/admin_incidents", icon: AlertTriangle },
  { name: "Users", href: "/admin_users", icon: Users },
  { name: "Gamification", href: "/admin_gamification", icon: Trophy },
  { name: "Settings", href: "/admin_settings", icon: Settings },
];

export const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 transform bg-card border-r border-border
        transition-transform duration-300 ease-in-out md:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center gap-2 px-6 py-4 border-b border-border">
            <Shield className="h-8 w-8 text-primary" />
            <div className="flex flex-col">
              <span className="text-lg font-bold text-foreground">Mangrove</span>
              <span className="text-xs text-muted-foreground">Surveillance</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium
                    transition-colors duration-200
                    ${isActive 
                      ? 'bg-primary text-primary-foreground shadow-mangrove' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }
                  `}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.photoURL} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {user?.name?.charAt(0) || 'A'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user?.name || 'Admin'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email || 'admin@mangrove.org'}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={async () => {
                try {
                  await logout();
                  setSidebarOpen(false);
                } catch (error) {
                  console.error('Logout error:', error);
                }
              }}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 border-b border-border">
          <div className="flex items-center justify-between px-4 py-3">
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <div className="hidden md:block">
              <h1 className="text-xl font-semibold text-foreground">
                {navigation.find(item => item.href === location.pathname)?.name || 'Dashboard'}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};