import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ErrorMessage from '../../src/components/ErrorMessage';
import { vi } from 'vitest';

describe('ErrorMessage', () => {
  const defaultProps = {
    message: 'エラーメッセージ',
    onClose: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('エラーメッセージが表示される', () => {
    render(<ErrorMessage {...defaultProps} />);
    expect(screen.getByText('エラーメッセージ')).toBeInTheDocument();
    expect(screen.getByText('エラー')).toBeInTheDocument();
  });

  test('閉じるボタンがクリックされたときonCloseが呼ばれる', () => {
    const onClose = vi.fn();
    render(<ErrorMessage message="エラー発生" onClose={onClose} />);
    const closeButton = screen.getByText('閉じる');
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalled();
  });

  test('onCloseがない場合は閉じるボタンが表示されない', () => {
    render(<ErrorMessage message="エラー発生" />);
    expect(screen.queryByText('閉じる')).not.toBeInTheDocument();
  });
}); 