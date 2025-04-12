import { useState } from 'react';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: number;
  username: string;
  email: string;
  name?: string;
  createdAt: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  name?: string;
}

export function useDirectAuth() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      console.log("Attempting login with:", username);
      
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password
        }),
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Authentication failed');
      }
      
      // Store original URL to return to after reload
      const currentPath = window.location.pathname;
      const currentSearch = window.location.search;
      
      // Store login success in session storage
      sessionStorage.setItem('login_success', 'true');
      sessionStorage.setItem('return_path', currentPath + currentSearch);
      
      console.log("Login successful, reloading page to update UI");
      
      toast({
        title: "Success",
        description: "You have successfully logged in",
      });
      
      // Force a page reload to ensure all components reflect the authentication state
      window.location.href = '/';
      
      return true;
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: error.message || "Could not authenticate. Please check your credentials.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      console.log("Attempting registration with:", data.username);
      
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }
      
      // Store original URL to return to after reload
      const currentPath = window.location.pathname;
      const currentSearch = window.location.search;
      
      // Store registration success in session storage
      sessionStorage.setItem('login_success', 'true');
      sessionStorage.setItem('return_path', currentPath + currentSearch);
      
      console.log("Registration successful, redirecting to home page");
      
      toast({
        title: "Success",
        description: "Your account has been created successfully",
      });
      
      // Redirect to home page and force a reload to ensure proper auth state
      window.location.href = '/';
      
      return true;
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "Registration Failed",
        description: error.message || "Could not create account. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    login,
    register,
    isSubmitting
  };
}