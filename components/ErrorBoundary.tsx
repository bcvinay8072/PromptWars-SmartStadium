'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

/**
 * Catches JavaScript errors in child components and renders a fallback UI.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(): void {
    // Expected to just catch the error and not crash the whole app.
    // In production we would log this to an external service.
  }

  private handleRetry = (): void => {
    this.setState({ hasError: false, errorMessage: '' });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="glass-panel p-md" role="alert" aria-live="assertive">
          <h2 className="text-error mb-md">Something went wrong</h2>
          <p className="text-muted mb-lg">
            {this.state.errorMessage || 'An unexpected error occurred.'}
          </p>
          <button onClick={this.handleRetry} aria-label="Retry" className="btn-primary">
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
