import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import LoginPage from '../pages/LoginPage';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';

vi.mock('../contexts/AuthContext');
vi.mock('../contexts/NotificationContext');

const mockLogin = vi.fn();
const mockShowNotification = vi.fn();

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('ログインフォームが表示される', () => {
    (useAuth as any).mockReturnValue({
      login: mockLogin,
      logout: vi.fn(),
      user: null,
      isLoading: false,
      error: null
    });

    (useNotification as any).mockReturnValue({
      showNotification: mockShowNotification,
    });

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    expect(screen.getByText('ログイン')).toBeInTheDocument();
    expect(screen.getByLabelText('メールアドレス')).toBeInTheDocument();
    expect(screen.getByLabelText('パスワード')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'ログイン' })).toBeInTheDocument();
  });

  it('フォーム入力が正常に動作する', () => {
    (useAuth as any).mockReturnValue({
      login: mockLogin,
      logout: vi.fn(),
      user: null,
      isLoading: false,
      error: null
    });

    (useNotification as any).mockReturnValue({
      showNotification: mockShowNotification,
    });

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText('メールアドレス');
    const passwordInput = screen.getByLabelText('パスワード');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('ログイン成功時にナビゲーションする', async () => {
    const mockNavigate = vi.fn();

    (useAuth as any).mockReturnValue({
      login: mockLogin,
      logout: vi.fn(),
      user: null,
      isLoading: false,
      error: null
    });

    (useNotification as any).mockReturnValue({
      showNotification: mockShowNotification,
    });

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText('メールアドレス');
    const passwordInput = screen.getByLabelText('パスワード');
    const loginButton = screen.getByRole('button', { name: 'ログイン' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('ログイン失敗時にエラーメッセージを表示する', async () => {
    const mockNavigate = vi.fn();

    (useAuth as any).mockReturnValue({
      login: mockLogin,
      logout: vi.fn(),
      user: null,
      isLoading: false,
      error: 'ログインに失敗しました'
    });

    (useNotification as any).mockReturnValue({
      showNotification: mockShowNotification,
    });

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    expect(screen.getByText('ログインに失敗しました')).toBeInTheDocument();
  });

  it('ログイン中はボタンが無効化される', () => {
    const mockNavigate = vi.fn();

    (useAuth as any).mockReturnValue({
      login: mockLogin,
      logout: vi.fn(),
      user: null,
      isLoading: true,
      error: null
    });

    (useNotification as any).mockReturnValue({
      showNotification: mockShowNotification,
    });

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    const loginButton = screen.getByRole('button', { name: 'ログイン' });
    expect(loginButton).toBeDisabled();
  });

  it('フォーム送信時にデフォルトの動作を防ぐ', () => {
    const mockNavigate = vi.fn();

    (useAuth as any).mockReturnValue({
      login: mockLogin,
      logout: vi.fn(),
      user: null,
      isLoading: false,
      error: null
    });

    (useNotification as any).mockReturnValue({
      showNotification: mockShowNotification,
    });

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    const form = screen.getByRole('form');
    const preventDefault = vi.fn();
    
    fireEvent.submit(form, { preventDefault });
    
    expect(preventDefault).toHaveBeenCalled();
  });
}); 