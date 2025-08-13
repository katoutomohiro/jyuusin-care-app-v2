import * as React from 'react';

type Props = { children: React.ReactNode };
type State = { error?: Error };

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = {};

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(err: Error, info: any) {
    if (import.meta.env.DEV) console.error('[ErrorBoundary]', err, info);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div style={{ padding: 16, fontFamily: 'system-ui' }}>
        <h2>⚠️ アプリでエラーが発生しました（dev）</h2>
        <pre style={{ whiteSpace: 'pre-wrap' }}>{String(this.state.error?.message ?? this.state.error)}</pre>
        <button onClick={() => location.reload()}>再読み込み</button>
      </div>
    );
  }
}
