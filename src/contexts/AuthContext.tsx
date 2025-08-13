export function useAuth(){ return { user:{id:"dev",name:"Dev User"}, signIn:()=>{}, signOut:()=>{} }; }
export default {};

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, AuthState } from '../../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true };
    case 'LOGIN_SUCCESS':
      return {
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGIN_FAILURE':
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    default:
      return state;
  }
};

// デフォルトの管理者ユーザー
const defaultUser: User = {
  id: '1',
  name: '管理者',
  email: 'admin@example.com',
  role: 'admin',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export function useAuth() {
  return { user: { id: 'dev', name: 'Dev User' }, signIn: () => {}, signOut: () => {} };
}
export default {};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // ローカルストレージから認証状態を復元
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      } catch (error) {
        localStorage.removeItem('user');
        // エラーが発生した場合はデフォルトユーザーを使用
        localStorage.setItem('user', JSON.stringify(defaultUser));
      }
    } else {
      // ローカルストレージにユーザー情報がない場合はデフォルトユーザーを保存
      localStorage.setItem('user', JSON.stringify(defaultUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      // 簡易的な認証（実際の実装ではAPIを呼び出す）
      if (email === 'admin@example.com' && password === 'password') {
        const user: User = {
          id: '1',
          name: '管理者',
          email: email,
          role: 'admin',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        localStorage.setItem('user', JSON.stringify(user));
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      } else {
        throw new Error('認証に失敗しました');
      }
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
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
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 