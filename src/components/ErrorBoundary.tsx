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
      if (this.props.children && (this.props as any).excelOnly) {
        return (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg text-center">
            Excelエクスポートでエラーが発生しました。データが空の場合は記録を追加してください。
          </div>
        );
      }
      // デバッグ用にエラー情報を表示
      return (
        <div className="p-4 text-red-600 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="font-bold mb-2">UI クラッシュ:</h3>
          <p className="mb-2">{this.state.error?.message}</p>
          <details className="text-sm">
            <summary className="cursor-pointer">スタックトレース</summary>
            <pre className="mt-2 text-xs overflow-auto bg-gray-100 p-2 rounded">
              {this.state.error?.stack}
            </pre>
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}
