import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const NotFound = () => {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-foreground mb-2">Page Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The surveillance page you're looking for doesn't exist in our system.
          </p>
        </div>
        
        <div className="space-y-4">
          {user ? (
            <a 
              href="/admin_dashboard" 
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              Return to Dashboard
            </a>
          ) : (
            <a 
              href="/admin_login" 
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              Go to Login
            </a>
          )}
        </div>
        
        <div className="mt-8 text-xs text-muted-foreground">
          Path: {location.pathname}
        </div>
      </div>
    </div>
  );
};

export default NotFound;
