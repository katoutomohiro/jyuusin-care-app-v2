import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoadingSpinner from '../../components/LoadingSpinner';
import { vi, test } from 'vitest';

describe('LoadingSpinner', () => {
  test('デフォルトのスピナーとテキストが表示される', () => {
    render(<LoadingSpinner />);
    expect(screen.getByText('読み込み中...')).toBeInTheDocument();
    const spinner = screen.getByRole('status', { hidden: true }) || screen.getByText('読み込み中...').previousSibling;
    expect(spinner).toBeTruthy();
  });

  test('should render with custom size', () => {
    render(<LoadingSpinner size="lg" />);
    const spinner = screen.getByTestId('loading-spinner');
    const spinnerElement = spinner.querySelector('div');
    expect(spinnerElement).toHaveClass('h-12', 'w-12');
  });

  test('should render with custom text', () => {
    render(<LoadingSpinner text="カスタム読み込み中" />);
    expect(screen.getByText('カスタム読み込み中')).toBeInTheDocument();
  });

  test('should render without text when text is empty', () => {
    render(<LoadingSpinner text="" />);
    expect(screen.queryByText('読み込み中...')).not.toBeInTheDocument();
  });

  test('should apply all custom props', () => {
    render(
      <LoadingSpinner 
        size="sm" 
        text="テスト読み込み中"
        className="custom-class"
      />
    );
    const spinner = screen.getByTestId('loading-spinner');
    const spinnerElement = spinner.querySelector('div');
    expect(spinnerElement).toHaveClass('h-4', 'w-4');
    expect(spinner).toHaveClass('custom-class');
    expect(screen.getByText('テスト読み込み中')).toBeInTheDocument();
  });

  test('should handle invalid size gracefully', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<LoadingSpinner size="invalid" as any />);
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toBeInTheDocument();
    consoleSpy.mockRestore();
  });

  test('should apply correct size classes', () => {
    const { rerender } = render(<LoadingSpinner size="sm" />);
    let spinnerElement = screen.getByTestId('loading-spinner').querySelector('div');
    expect(spinnerElement).toHaveClass('h-4', 'w-4');

    rerender(<LoadingSpinner size="md" />);
    spinnerElement = screen.getByTestId('loading-spinner').querySelector('div');
    expect(spinnerElement).toHaveClass('h-8', 'w-8');

    rerender(<LoadingSpinner size="lg" />);
    spinnerElement = screen.getByTestId('loading-spinner').querySelector('div');
    expect(spinnerElement).toHaveClass('h-12', 'w-12');
  });

  test('should have correct default styling', () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByTestId('loading-spinner');
    const spinnerElement = spinner.querySelector('div');
    expect(spinnerElement).toHaveClass('animate-spin', 'rounded-full', 'border-b-2', 'border-sky-blue-600');
    expect(screen.getByText('読み込み中...')).toHaveClass('text-sky-blue-600', 'text-sm');
  });
}); 