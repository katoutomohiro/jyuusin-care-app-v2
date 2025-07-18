import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UserCard } from '../../components/UserCard';
import { User, ServiceType, Gender } from '../../types';
import { vi, test } from 'vitest';

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  Link: ({ children, to, ...props }: any) => (
    <a href={to} {...props}>{children}</a>
  ),
}));

describe('UserCard', () => {
  const mockUser: User = {
    id: '1',
    name: '田中太郎',
    initials: 'TT',
    age: 75,
    gender: Gender.MALE,
    roomNumber: '101',
    careLevel: 3,
    emergencyContact: '田中花子',
    emergencyPhone: '090-1234-5678',
    medicalHistory: ['糖尿病', '高血圧'],
    allergies: ['ペニシリン'],
    medications: ['インスリン', '降圧剤'],
    notes: '特になし',
    serviceType: [ServiceType.LIFE_CARE],
    medicalCare: [],
    underlyingConditions: [],
    handbooks: [],
    assistanceLevel: '自立',
    school: '特別支援学校',
    disabilityLevel: '軽度',
    disabilityType: '知的障害',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  };

  const defaultProps = {
    user: mockUser,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should render user initials and age/gender', () => {
    render(<UserCard {...defaultProps} />);
    expect(screen.getAllByText('TT')[0]).toBeInTheDocument();
    expect(screen.getByText('75歳 • MALE')).toBeInTheDocument();
  });

  test('should render serviceType as tag', () => {
    render(<UserCard {...defaultProps} />);
    expect(screen.getByText('LIFE_CARE')).toBeInTheDocument();
  });

  test('should render notes if present', () => {
    render(<UserCard {...defaultProps} />);
    expect(screen.getByText('特になし')).toBeInTheDocument();
  });

  test('should render medicalCare if present', () => {
    const userWithMedicalCare = {
      ...mockUser,
      medicalCare: ['インスリン注射']
    };
    render(<UserCard user={userWithMedicalCare} />);
    expect(screen.getByText('医療ケア')).toBeInTheDocument();
    expect(screen.getByText('インスリン注射')).toBeInTheDocument();
  });

  test('should render underlyingConditions if present', () => {
    const userWithCond = {
      ...mockUser,
      underlyingConditions: ['糖尿病', '高血圧']
    };
    render(<UserCard user={userWithCond} />);
    expect(screen.getByText('基礎疾患')).toBeInTheDocument();
    expect(screen.getByText('糖尿病, 高血圧')).toBeInTheDocument();
  });

  test('should render action links', () => {
    render(<UserCard {...defaultProps} />);
    expect(screen.getByText('詳細')).toBeInTheDocument();
    expect(screen.getByText('記録')).toBeInTheDocument();
    expect(screen.getByText('連携ノート')).toBeInTheDocument();
  });

  test('should render with custom className', () => {
    const { container } = render(
      <UserCard {...defaultProps} className="custom-user-card" />
    );
    expect(container.firstChild).toHaveClass('custom-user-card');
  });

  test('should render edit and delete buttons when callbacks provided', () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    render(<UserCard {...defaultProps} onEdit={onEdit} onDelete={onDelete} />);
    
    const editButton = screen.getByLabelText('編集');
    const deleteButton = screen.getByLabelText('削除');
    
    expect(editButton).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();
  });

  test('should not render edit and delete buttons when callbacks not provided', () => {
    render(<UserCard {...defaultProps} />);
    
    expect(screen.queryByLabelText('編集')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('削除')).not.toBeInTheDocument();
  });
}); 