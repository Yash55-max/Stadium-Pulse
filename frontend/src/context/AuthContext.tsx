import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  name: string;
  role: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  login: (name: string, role: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (name: string, role: string) => {
    setUser({
      name,
      role,
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDd18Kljd8UHx3d6QCGS9SDJkcC70ns0T0iNOI4Ig0xQ2yuoaJQw7BC7euUaLpzDfKwvA6hBhtHymHggybouNJa9Qugg1uK6rEAPsAc-2AqB59VyxSy0B00jkgMqU2UhBvRdevQNUbCu3t38eddX75U-S2bXPhgW5GwE0IiQ_VYNqMAm7XwFi6BYh00IWDBMevsenIYRXMZkBJdlkaPLB04U25r4ZHZvf6RR6fYisrQaH_SI-L3vTdXlkDJILpAi3qfu1hzU0vqEPA"
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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
