import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserRole } from './types';

type User = {
  email: string;
  role: UserRole;
  name?: string;
};

interface RegisteredUser {
  email: string;
  password: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage on mount
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const register = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    try {
      // Get existing users or initialize empty array
      const usersJson = localStorage.getItem('users') || '[]';
      const users: RegisteredUser[] = JSON.parse(usersJson);
      
      // Check if user already exists
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        return false; // User already exists
      }
      
      // Add new user
      users.push({ email, password, role });
      
      // Save updated users array
      localStorage.setItem('users', JSON.stringify(users));
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Get registered users
      const usersJson = localStorage.getItem('users') || '[]';
      const users: RegisteredUser[] = JSON.parse(usersJson);
      
      // Find matching user
      const matchedUser = users.find(u => u.email === email && u.password === password);
      
      if (matchedUser) {
        // Create user object without password
        const loggedInUser: User = {
          email: matchedUser.email,
          role: matchedUser.role,
          name: matchedUser.email.split('@')[0] // Generate name from email
        };
        
        // Save to localStorage and state
        localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
        setUser(loggedInUser);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}