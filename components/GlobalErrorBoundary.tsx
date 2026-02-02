import React, { Component, ErrorInfo, ReactNode } from 'react';
import { eventTracker } from '../services/telemetry/EventTracker';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Global Error Boundary
 */
// Comment: Fix: Explicitly extending Component from React ensures proper inheritance of setState and props in TypeScript, resolving errors where these properties were not found on the instance.
export class GlobalErrorBoundary extends Component<Props, State> {
  // Comment: Fix: Explicitly defining the state property with the State interface for type safety.
  public state: State = {
    hasError: false,
    error: undefined
  };

  constructor(props: Props) {
    super(props);
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("🔴 [CRITICAL UI ERROR]:", error, errorInfo);
    eventTracker.trackCriticalError(error, 'GLOBAL_BOUNDARY_CATCH');
  }

  // Comment: Fix: handleReset is implemented as an arrow function to preserve 'this' context, ensuring that this.setState is correctly called.
  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.hash = '/feed';
    window.location.reload();
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0c0f14] flex flex-col items-center justify-center p-6 text-center font-['Inter']">
          <style>{`
            .error-circle {
              width: 80px; height: 80px;
              background: rgba(0, 194, 255, 0.1);
              border: 2px solid #00c2ff;
              border-radius: 24px;
              display: flex; align-items: center; justify-content: center;
              color: #00c2ff; font-size: 32px; margin-bottom: 24px;
              box-shadow: 0 0 30px rgba(0, 194, 255, 0.2);
            }
            .error-title { font-size: 24px; font-weight: 800; color: #fff; margin-bottom: 8px; }
            .error-msg { font-size: 14px; color: #666; max-width: 300px; margin-bottom: 32px; line-height: 1.6; }
            .retry-btn {
              background: #00c2ff; color: #000;
              padding: 16px 40px; border-radius: 16px;
              font-weight: 800; font-size: 14px; text-transform: uppercase;
              letter-spacing: 1px; border: none; cursor: pointer;
              transition: all 0.2s ease;
              box-shadow: 0 10px 20px rgba(0, 194, 255, 0.2);
            }
            .retry-btn:active { transform: scale(0.98); }
          `}</style>

          <div className="error-circle animate-pulse">
            <i className="fa-solid fa-microchip"></i>
          </div>
          
          <h1 className="error-title">Ops! Algo falhou.</h1>
          <p className="error-msg">
            Ocorreu um erro inesperado na interface. Mas não se preocupe, seus dados estão seguros.
          </p>

          <button className="retry-btn" onClick={this.handleReset}>
            Recuperar Sistema
          </button>

          <div className="mt-12 opacity-20 text-[9px] font-black uppercase tracking-[4px]">
            Flux Recovery Engine
          </div>
        </div>
      );
    }

    // Comment: Fix: Correctly accessing children via this.props which is inherited from Component.
    return this.props.children || null;
  }
}
