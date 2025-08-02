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
      // それ以外は何も表示しない（他ページでグローバルエラーが出ないように）
      return null;
    }
    return this.props.children;
  }
}
