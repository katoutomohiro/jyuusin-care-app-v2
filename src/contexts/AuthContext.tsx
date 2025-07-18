import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AdminUser, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: AdminUser }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload,
        error: undefined,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: 'ログインに失敗しました',
      };
    case 'LOGOUT':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: undefined,
      };
    default:
      return state;
  }
};

const defaultUser: AdminUser = {
  id: '001',
  name: '重心ケア管理者',
  email: 'admin@example.com',
  role: 'admin',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const initialState: AuthState = {
  isAuthenticated: true, // 開発中は自動ログイン
  isLoading: false,
  user: defaultUser,  // 開発中はデフォルトユーザーでログイン
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // 開発中は自動ログインをスキップ
  useEffect(() => {
    // 本番環境では localStorage からの復元処理などをここに記述
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      // 本番環境では実際の認証 API を呼び出し
      // 現在は開発用の模擬ログイン
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (email === 'admin@example.com' && password === 'password') {
        const user: AdminUser = {
          id: '001',
          name: '重心ケア管理者',
          email: email,
          role: 'admin',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      } else {
        dispatch({ type: 'LOGIN_FAILURE' });
      }
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' });
    }
  };

  const logout = (): void => {
    dispatch({ type: 'LOGOUT' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
