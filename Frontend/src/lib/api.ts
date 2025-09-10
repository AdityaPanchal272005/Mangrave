import { auth } from './firebase';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Helper function to get auth token
const getAuthToken = async (): Promise<string | null> => {
  const currentUser = auth.currentUser;
  if (currentUser) {
    return await currentUser.getIdToken();
  }
  return null;
};

// Generic API request helper
const apiRequest = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  try {
    const token = await getAuthToken();
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    
    // Return mock data for development/demo purposes when backend is not available
    if (error instanceof Error && error.message.includes('fetch')) {
      console.warn('Backend not available, using mock data for demo');
      return getMockData(endpoint);
    }
    
    throw error;
  }
};

// Mock data fallback for demo purposes
const getMockData = (endpoint: string): any => {
  if (endpoint === '/admin/dashboard/stats') {
    return {
      totalReports: 156,
      resolvedReports: 89,
      pendingReports: 67,
      activeUsers: 234,
      categoriesBreakdown: {
        'Illegal Logging': 45,
        'Unauthorized Fishing': 32,
        'Pollution Discharge': 28,
        'Wildlife Poaching': 25,
        'Land Reclamation': 26
      }
    };
  }
  
  if (endpoint.includes('/admin/incidents')) {
    return {
      incidents: [
        {
          id: 'INC-2024-001',
          type: 'Illegal Logging',
          description: 'Large-scale tree cutting observed',
          location: 'Lat: -6.2088, Lng: 106.8456',
          status: 'new',
          timestamp: new Date().toISOString(),
          userId: 'user123',
          severity: 'high'
        }
      ],
      total: 1,
      page: 1,
      totalPages: 1
    };
  }
  
  if (endpoint === '/admin/users') {
    return {
      users: [
        {
          id: 'user1',
          name: 'Marine Bio NGO',
          email: 'contact@marinebio.org',
          points: 1250,
          reportsSubmitted: 23,
          joinDate: '2023-01-15',
          status: 'active'
        }
      ]
    };
  }
  
  if (endpoint === '/admin/gamification') {
    return {
      totalPointsAwarded: 15420,
      totalUsers: 234,
      leaderboard: [
        { userId: 'user1', name: 'Marine Bio NGO', points: 1250 },
        { userId: 'user2', name: 'EcoGuardians', points: 980 }
      ],
      averagePointsPerUser: 65.9
    };
  }
  
  if (endpoint === '/admin/settings') {
    return {
      notifications: {
        emailAlerts: true,
        pushNotifications: true,
        reportThreshold: 10
      },
      moderation: {
        autoApprove: false,
        requireManualReview: true
      },
      gamification: {
        pointsPerReport: 10,
        bonusMultiplier: 1.5
      }
    };
  }
  
  return { message: 'Mock data not available for this endpoint' };
};

// API endpoints
export const api = {
  // Authentication
  auth: {
    verify: (idToken: string) => 
      apiRequest('/auth/verify', {
        method: 'POST',
        body: JSON.stringify({ idToken }),
      }),
  },

  // Admin Dashboard
  dashboard: {
    getStats: () => apiRequest('/admin/dashboard/stats'),
  },

  // Incidents Management
  incidents: {
    getAll: (params?: { page?: number; limit?: number; status?: string; category?: string }) => {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.status) queryParams.append('status', params.status);
      if (params?.category) queryParams.append('category', params.category);
      
      const queryString = queryParams.toString();
      return apiRequest(`/admin/incidents${queryString ? `?${queryString}` : ''}`);
    },
    
    updateStatus: (incidentId: string, status: string) =>
      apiRequest(`/admin/incidents/${incidentId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      }),
  },

  // Users Management
  users: {
    getAll: () => apiRequest('/admin/users'),
  },

  // Gamification
  gamification: {
    getData: () => apiRequest('/admin/gamification'),
  },

  // Settings
  settings: {
    get: () => apiRequest('/admin/settings'),
    update: (settings: any) =>
      apiRequest('/admin/settings', {
        method: 'PUT',
        body: JSON.stringify(settings),
      }),
  },

  // Profile
  profile: {
    get: () => apiRequest('/admin/profile'),
    update: (profile: any) =>
      apiRequest('/admin/profile', {
        method: 'PUT',
        body: JSON.stringify(profile),
      }),
  },

  // Health check
  health: () => apiRequest('/health'),
};

export default api;
