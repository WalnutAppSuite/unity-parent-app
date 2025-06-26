import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="tw-flex tw-items-center tw-justify-center tw-min-h-screen">
          <div className="tw-text-center">
            <h2 className="tw-text-xl tw-font-semibold tw-text-red-500 tw-mb-4">
              Something went wrong
            </h2>
            <p className="tw-text-gray-600 tw-mb-4">
              An unexpected error occurred. Please try refreshing the page.
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="tw-px-4 tw-py-2 tw-bg-primary tw-text-white tw-rounded tw-cursor-pointer"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 