import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';
import { SAMPLE_STAFF } from '../constants';
import { Staff } from '../types';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_KEY = 'jyushin_care_auth';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<Staff | null>(() => {
    try {
      const stored = localStorage.getItem(AUTH_KEY);
      return stored ? JSON.parse(stored) : SAMPLE_STAFF[0];
    } catch (err) {
      console.error('Failed to load auth state:', err);
      return SAMPLE_STAFF[0];
    }
  });
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const savedUser = localStorage.getItem(AUTH_KEY);
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } else {
          // 保存されたユーザーがない場合はデフォルト管理者を設定
          setUser(SAMPLE_STAFF[0]);
          setIsAuthenticated(true);
          localStorage.setItem(AUTH_KEY, JSON.stringify(SAMPLE_STAFF[0]));
        }
      } catch (err) {
        console.error('Failed to load auth state:', err);
        // エラーの場合もデフォルト管理者を設定
        setUser(SAMPLE_STAFF[0]);
        setIsAuthenticated(true);
        localStorage.setItem(AUTH_KEY, JSON.stringify(SAMPLE_STAFF[0]));
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    setIsAuthenticated(!!user);
  }, [user]);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // Find staff member with matching credentials
      const staffMember = SAMPLE_STAFF.find(
        staff => staff.username === username && staff.password === password
      );

      if (staffMember) {
        setUser(staffMember);
        setIsAuthenticated(true);
        setError(null);
        
        // Save to localStorage
        localStorage.setItem(AUTH_KEY, JSON.stringify(staffMember));
        
        return true;
      } else {
        setError('ユーザー名またはパスワードが正しくありません');
        return false;
      }
    } catch (err) {
      setError('ログインに失敗しました');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
    localStorage.removeItem(AUTH_KEY);
    // ログアウト後はデフォルト管理者に戻す
    setUser(SAMPLE_STAFF[0]);
    setIsAuthenticated(true);
    localStorage.setItem(AUTH_KEY, JSON.stringify(SAMPLE_STAFF[0]));
  };

  const clearError = () => {
    setError(null);
  };

  const isAdmin = user?.permissions?.includes('admin') ?? false;

  const value: AuthContextType = {
    user,
    currentUser: user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    error,
    clearError,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};