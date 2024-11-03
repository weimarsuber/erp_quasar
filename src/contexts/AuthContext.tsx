import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  branches: Branch[];
}

interface Branch {
  id: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  branch: Branch | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, branchId: string) => Promise<void>;
  logout: () => void;
  setBranch: (branch: Branch) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [branch, setBranch] = useState<Branch | null>(null);

  const login = async (email: string, password: string, branchId: string) => {
    try {
      const response = await fetch('http://2.58.80.90:81/erp/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, branchId }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      setUser(data.user);
      setBranch(data.user.branches.find((b: Branch) => b.id === branchId) || null);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setBranch(null);
  };

  const changeBranch = (newBranch: Branch) => {
    setBranch(newBranch);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        branch,
        isAuthenticated: !!user,
        login,
        logout,
        setBranch: changeBranch,
      }}
    >
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