import React from 'react';

interface ErrorBoundaryProps {
  children?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  constructor(props: ErrorBoundaryProps) {
    super(props);
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-100 text-red-800 p-8 text-center text-2xl font-bold">
          <h1>アプリケーションエラーが発生しました</h1>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', marginTop: 16, fontSize: '1.2em', color: '#b91c1c', background: '#fee2e2', padding: '1em', borderRadius: '8px' }}>{this.state.error?.stack || this.state.error?.toString()}</pre>
        </div>
      );
    }
    return this.props.children ?? null;
  }
}

export default ErrorBoundary;
