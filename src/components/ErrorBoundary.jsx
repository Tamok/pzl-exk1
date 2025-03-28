import React from 'react';

export default class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('[AdminPanel Error]', error, info);
  }

  render() {
    return this.state.hasError
      ? <div className="text-red-600 p-4">Something went wrong. Please reload.</div>
      : this.props.children;
  }
}
