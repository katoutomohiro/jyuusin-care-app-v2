import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import UsersPage from '../src/pages/UsersPage';
import { useData } from '../src/contexts/DataContext';
import { useAuth } from '../src/contexts/AuthContext';
import { useNotification } from '../src/contexts/NotificationContext';
import { User, Gender, ServiceType } from '../src/types';

vi.mock('../src/contexts/DataContext');
vi.mock('../src/contexts/AuthContext');
vi.mock('../src/contexts/NotificationContext');

const mockUsers: User[] = [
  {
    id: '1',
    name: '田中太郎',
    initials: 'TT',
    age: 25,
    gender: Gender.MALE,
    serviceType: [ServiceType.LIFE_CARE],
    disabilityLevel: '重度',
    disabilityType: '知的障害',
    underlyingConditions: ['てんかん'],
    medicalCare: ['経管栄養'],
    handbooks: ['身体障害者手帳'],
    assistanceLevel: '全介助',
    school: '特別支援学校',
    notes: 'テスト用データ'
  },
  {
    id: '2',
    name: '佐藤花子',
    initials: 'SH',
    age: 30,
    gender: Gender.FEMALE,
    serviceType: [ServiceType.DAY_SERVICE],
    disabilityLevel: '中度',
    disabilityType: '発達障害',
    underlyingConditions: [],
    medicalCare: [],
    handbooks: [],
    assistanceLevel: '部分介助',
    school: '',
    notes: ''
  }
];

const mockAddUser = vi.fn();
const mockUpdateUser = vi.fn();
const mockDeleteUser = vi.fn();
const mockShowNotification = vi.fn();

vi.mocked(useData).mockReturnValue({
  users: mockUsers,
  isLoading: false,
  addUser: mockAddUser,
  updateUser: mockUpdateUser,
  deleteUser: mockDeleteUser,
});

vi.mocked(useAuth).mockReturnValue({
  user: { id: 'admin', permissions: ['admin'] },
});

vi.mocked(useNotification).mockReturnValue({
  showNotification: mockShowNotification,
});

describe('UsersPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('タイトルと検索ボックスが表示される', () => {
    render(
      <BrowserRouter>
        <UsersPage />
      </BrowserRouter>
    );
    expect(screen.getByText('利用者管理')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('利用者名またはメールアドレスで検索...')).toBeInTheDocument();
  });

  it('利用者リストが表示される', () => {
    render(
      <BrowserRouter>
        <UsersPage />
      </BrowserRouter>
    );
    expect(screen.getByText('田中太郎')).toBeInTheDocument();
    expect(screen.getByText('佐藤花子')).toBeInTheDocument();
  });

  it('管理者は「新規追加」ボタンが表示される', () => {
    render(
      <BrowserRouter>
        <UsersPage />
      </BrowserRouter>
    );
    expect(screen.getByText('新規追加')).toBeInTheDocument();
  });

  it('利用者カードの詳細情報が表示される', () => {
    render(
      <BrowserRouter>
        <UsersPage />
      </BrowserRouter>
    );
    
    // 利用者の基本情報が表示されることを確認
    expect(screen.getByText('田中太郎')).toBeInTheDocument();
    expect(screen.getByText('25歳')).toBeInTheDocument();
    expect(screen.getByText('生活介護')).toBeInTheDocument();
  });
});

export {}; 