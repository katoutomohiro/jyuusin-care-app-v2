import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorMessage from '../src/components/ErrorMessage';

describe('ErrorMessage', () => {
  it('正常にレンダリングされる', () => {
    const message = 'テストエラーメッセージ';
    render(<ErrorMessage message={message} />);
    
    expect(screen.getByText(message)).toBeInTheDocument();
  });

  it('エラータイトルが表示される', () => {
    render(<ErrorMessage message="テストメッセージ" />);
    
    expect(screen.getByText('エラー')).toBeInTheDocument();
  });

  it('デフォルトでエラースタイルでレンダリングされる', () => {
    render(<ErrorMessage message="テストメッセージ" />);
    
    const container = screen.getByText('テストメッセージ').closest('.bg-red-50');
    expect(container).toBeInTheDocument();
  });

  it('警告タイプでレンダリングされる', () => {
    render(<ErrorMessage message="警告メッセージ" type="warning" />);
    
    const container = screen.getByText('警告メッセージ').closest('div');
    expect(container).toHaveClass('bg-yellow-50', 'border-yellow-200', 'text-yellow-600');
  });

  it('情報タイプでレンダリングされる', () => {
    render(<ErrorMessage message="情報メッセージ" type="info" />);
    
    const container = screen.getByText('情報メッセージ').closest('div');
    expect(container).toHaveClass('bg-blue-50', 'border-blue-200', 'text-blue-600');
  });

  it('閉じるボタンが表示される', () => {
    const onClose = jest.fn();
    render(<ErrorMessage message="テストメッセージ" onClose={onClose} />);
    
    const closeButton = screen.getByText('閉じる');
    expect(closeButton).toBeInTheDocument();
  });

  it('閉じるボタンがクリックされた時にコールバックが呼ばれる', () => {
    const onClose = jest.fn();
    render(<ErrorMessage message="テストメッセージ" onClose={onClose} />);
    
    const closeButton = screen.getByText('閉じる');
    fireEvent.click(closeButton);
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('onCloseが提供されていない場合に閉じるボタンが表示されない', () => {
    render(<ErrorMessage message="テストメッセージ" />);
    
    const closeButton = screen.queryByText('閉じる');
    expect(closeButton).not.toBeInTheDocument();
  });

  it('カスタムクラス名が適用される', () => {
    const customClass = 'custom-error-class';
    render(<ErrorMessage message="テストメッセージ" className={customClass} />);
    
    const container = screen.getByText('テストメッセージ').closest('div');
    expect(container).toHaveClass(customClass);
  });

  it('アイコンが正しく表示される', () => {
    render(<ErrorMessage message="テストメッセージ" />);
    
    const icon = document.querySelector('.h-6.w-6.text-red-600.mr-3');
    expect(icon).toBeInTheDocument();
  });

  it('エラータイプのアイコン色が正しい', () => {
    render(<ErrorMessage message="テストメッセージ" type="error" />);
    
    const icon = screen.getByText('テストメッセージ').previousElementSibling;
    expect(icon).toHaveClass('text-red-500');
  });

  it('警告タイプのアイコン色が正しい', () => {
    render(<ErrorMessage message="テストメッセージ" type="warning" />);
    
    const icon = screen.getByText('テストメッセージ').previousElementSibling;
    expect(icon).toHaveClass('text-yellow-500');
  });

  it('情報タイプのアイコン色が正しい', () => {
    render(<ErrorMessage message="テストメッセージ" type="info" />);
    
    const icon = screen.getByText('テストメッセージ').previousElementSibling;
    expect(icon).toHaveClass('text-blue-500');
  });

  it('閉じるボタンのスタイルが正しい', () => {
    const onClose = jest.fn();
    render(<ErrorMessage message="テストメッセージ" onClose={onClose} />);
    
    const closeButton = screen.getByText('閉じる');
    expect(closeButton).toHaveClass('mt-4', 'w-full', 'bg-red-600', 'text-white', 'px-4', 'py-2', 'rounded-md', 'hover:bg-red-700', 'transition-colors');
  });

  it('アクセシビリティ属性が正しく設定される', () => {
    const onClose = jest.fn();
    render(<ErrorMessage message="テストメッセージ" onClose={onClose} />);
    
    const closeButton = screen.getByText('閉じる');
    const srOnlyText = screen.getByText('Dismiss');
    expect(srOnlyText).toHaveClass('sr-only');
  });

  it('レイアウトが正しく適用される', () => {
    render(<ErrorMessage message="テストメッセージ" />);
    
    const container = document.querySelector('.flex.items-center.justify-center.min-h-screen');
    expect(container).toBeInTheDocument();
    
    const card = document.querySelector('.bg-red-50.border.border-red-200.rounded-lg.p-6.max-w-md');
    expect(card).toBeInTheDocument();
  });
}); 