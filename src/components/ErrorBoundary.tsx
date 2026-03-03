import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RotateCcw, Home } from "lucide-react";
import { Button } from "./ui/button";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
          <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
            <AlertCircle className="h-10 w-10 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">
            Something went wrong
          </h1>
          <p className="text-muted-foreground max-w-md mb-8">
            We encountered an unexpected error. Please try refreshing the page
            or return home.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="default"
              onClick={() => window.location.reload()}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" /> Reload Page
            </Button>
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/")}
              className="gap-2"
            >
              <Home className="h-4 w-4" /> Go Home
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
