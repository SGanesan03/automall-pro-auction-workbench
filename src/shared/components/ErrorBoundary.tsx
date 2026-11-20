import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false, message: '' };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message || 'Module runtime error' };
  }

  public componentDidCatch(error: Error, info: ErrorInfo) {
    const sanitize = (s: string) => String(s).replace(/[\r\n]/g, ' ');
    console.error('[AutoMall ErrorBoundary]:', sanitize(error.message), sanitize(info.componentStack ?? ''));
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-slate-900">
          <div className="flex items-center gap-2 font-semibold text-rose-700">
            <AlertTriangle className="h-5 w-5" />
            <span>{this.props.fallbackTitle || 'Section Temporarily Unavailable'}</span>
          </div>
          <p className="mt-1 text-sm text-slate-600">{this.state.message}</p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false, message: '' })}
            className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-[#2E054E] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#45126E]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reload Section
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
