import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export interface User {
  id: number;
  username: string;
  email: string;
  name?: string;
  avatar?: string;
  createdAt: string;
}

export interface UserContext {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  register: (userData: { username: string; password: string; email: string; name?: string }) => Promise<User>;
}

// Create the context
export const AuthContext = createContext<UserContext | undefined>(undefined);

// Auth Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  // Enhanced user data query with better error handling
  const { 
    data: userData, 
    isLoading,
    error 
  } = useQuery({
    queryKey: ['/api/me'],
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
    retry: 1,
    queryFn: async () => {
      try {
        const response = await fetch('/api/me', {
          credentials: 'include',
          headers: {
            'Accept': 'application/json'
          }
        });
        
        console.log('Auth check response status:', response.status);
        
        if (response.status === 401) {
          console.log('User not authenticated');
          return null;
        }
        
        if (!response.ok) {
          throw new Error(`Error fetching user data: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Auth check successful, got user data:', data);
        return data;
      } catch (err) {
        console.error('Error in auth check:', err);
        return null;
      }
    }
  });
  
  // Use effect to update user state when data changes
  useEffect(() => {
    if (userData) {
      console.log('Setting user state with:', userData);
      setUser(userData as User);
    } else if (!isLoading) {
      console.log('No user data, setting user to null');
      setUser(null);
    }
  }, [userData, isLoading]);
  
  // Log authentication errors for debugging
  useEffect(() => {
    if (error) {
      console.error('Authentication error:', error);
    }
  }, [error]);

  const login = async (username: string, password: string): Promise<User> => {
    try {
      // Validate credentials
      if (!username || !password) {
        throw new Error('Username and password are required');
      }
      
      console.log('Attempting login with credentials...');
      
      // Attempt login
      const response = await apiRequest('POST', '/api/login', { username, password });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Authentication failed');
      }
      
      // If successful, parse user data
      const user = await response.json();
      console.log('Login successful, user data:', user);
      
      // Update state immediately
      setUser(user);
      
      // Store login success info
      sessionStorage.setItem('login_success', 'true');
      sessionStorage.setItem('return_path', window.location.pathname + window.location.search);
      
      // Force refresh of auth state
      await queryClient.invalidateQueries({ queryKey: ['/api/me'] });
      
      return user;
    } catch (error: any) {
      console.error('Login error in auth context:', error);
      setUser(null);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    await apiRequest('POST', '/api/logout');
    setUser(null);
    // Invalidate the me query to refresh the user data
    queryClient.invalidateQueries({ queryKey: ['/api/me'] });
    window.location.href = '/';
  };

  const register = async (userData: { username: string; password: string; email: string; name?: string }): Promise<User> => {
    try {
      console.log('Attempting registration with data:', userData.username);
      
      const response = await apiRequest('POST', '/api/register', userData);
      const user = await response.json();
      
      console.log('Registration successful, user data:', user);
      
      // Update state immediately
      setUser(user);
      
      // Store registration success in session storage
      sessionStorage.setItem('login_success', 'true');
      sessionStorage.setItem('return_path', window.location.pathname + window.location.search);
      
      // Force refresh of auth state
      await queryClient.invalidateQueries({ queryKey: ['/api/me'] });
      
      return user;
    } catch (error) {
      console.error('Registration error in auth context:', error);
      // Let the caller handle the error
      setUser(null);
      throw error;
    }
  };

  const contextValue: UserContext = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    register
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}