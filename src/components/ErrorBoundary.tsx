import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  excelOnly?: boolean;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Excel出力専用エラー表示は、propsでカスタマイズ可能に
      if (this.props.excelOnly) {
        return (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg text-center">
            <div className="text-lg mb-2">📊 データ出力エラー</div>
            <p>Excelエクスポートでエラーが発生しました。</p>
            <p className="text-sm mt-1">データが空の場合は記録を追加してください。</p>
          </div>
        );
      }
      
      // 一般的なフォームやコンポーネント用のエラー表示
      return (
        <div className="p-4 text-red-600 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center mb-2">
            <span className="text-xl mr-2">⚠️</span>
            <h3 className="font-bold">フォームエラーが発生しました</h3>
          </div>
          <p className="mb-3 text-gray-700">
            このセクションで問題が発生しました。ページをリロードしてもう一度お試しください。
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            ページをリロード
          </button>
          {import.meta.env.DEV && (
            <details className="mt-4 text-sm">
              <summary className="cursor-pointer">開発者用エラー詳細</summary>
              <div className="mt-2">
                <p className="mb-2 font-semibold">{this.state.error?.message}</p>
                <pre className="text-xs overflow-auto bg-gray-100 p-2 rounded">
                  {this.state.error?.stack}
                </pre>
              </div>
            </details>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}
