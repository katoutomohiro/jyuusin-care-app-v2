import * as React from "react";
type Props = { children?: React.ReactNode }; type State = { hasError: boolean; error?: any };
export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError(e: any) { return { hasError: true, error: e }; }
  componentDidCatch() {}
  render() { return this.state.hasError ? null : this.props.children; }
}
