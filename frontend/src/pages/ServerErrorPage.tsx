import React from 'react';
import { AlertOctagon, RefreshCw } from 'lucide-react';
import { Button } from '../components/common/Button';

export const ServerErrorPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-slate-50">
      <div className="max-w-md w-full bg-white border border-slate-200 p-8 rounded-lg text-center space-y-6 shadow-sm">
        <div className="w-12 h-12 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mx-auto text-red-600">
          <AlertOctagon className="w-6 h-6" />
        </div>

        <div className="space-y-1.5">
          <h2 className="text-xl font-bold text-slate-900">500 - Server Error</h2>
          <p className="text-xs text-slate-500">
            An unexpected error occurred on our server. Our engineering team has been notified.
          </p>
        </div>

        <Button variant="primary" fullWidth onClick={() => window.location.reload()} className="gap-1.5">
          <RefreshCw className="w-4 h-4" /> Refresh Page
        </Button>
      </div>
    </div>
  );
};
