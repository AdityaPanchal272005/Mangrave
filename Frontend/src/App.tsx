import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminLayout } from "@/components/AdminLayout";

// Pages
import { AdminLogin } from "@/pages/AdminLogin";
import { AdminDashboard } from "@/pages/AdminDashboard";
import { AdminIncidents } from "@/pages/AdminIncidents";
import { AdminUsers } from "@/pages/AdminUsers";
import { AdminGamification } from "@/pages/AdminGamification";
import { AdminSettings } from "@/pages/AdminSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Route */}
            <Route path="/admin_login" element={<AdminLogin />} />
            
            {/* Protected Routes with Admin Layout */}
            <Route path="/" element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="admin_dashboard" element={<AdminDashboard />} />
              <Route path="admin_incidents" element={<AdminIncidents />} />
              <Route path="admin_users" element={<AdminUsers />} />
              <Route path="admin_gamification" element={<AdminGamification />} />
              <Route path="admin_settings" element={<AdminSettings />} />
            </Route>
            
            {/* Alternative route structure for /admin/* paths */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="incidents" element={<AdminIncidents />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="gamification" element={<AdminGamification />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
            
            {/* Catch-all Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
