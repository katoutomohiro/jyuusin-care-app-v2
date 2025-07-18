import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from '../src/components/LoadingSpinner';

describe('LoadingSpinner', () => {
  it('正常にレンダリングされる', () => {
    render(<LoadingSpinner />);
    
    expect(screen.getByText('読み込み中...')).toBeInTheDocument();
  });

  it('正しいクラス名が適用される', () => {
    render(<LoadingSpinner />);

    // スピナーコンテナが存在することを確認
    const spinnerContainer = screen.getByRole('status');
    expect(spinnerContainer).toBeInTheDocument();

    // スピナー要素が存在することを確認
    const spinner = spinnerContainer.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('アクセシビリティ属性が設定される', () => {
    render(<LoadingSpinner />);

    const spinnerContainer = screen.getByRole('status');
    expect(spinnerContainer).toHaveAttribute('aria-label', '読み込み中...');
  });

  it('カスタムメッセージが表示される', () => {
    const customMessage = 'データを読み込み中です...';
    render(<LoadingSpinner message={customMessage} />);

    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });
}); 