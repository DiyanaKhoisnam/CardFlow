import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, ArrowLeft } from 'lucide-react';
import { Button } from '../components/common/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-slate-50">
      <div className="max-w-md w-full bg-white border border-slate-200 p-8 rounded-lg text-center space-y-6 shadow-sm">
        <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-slate-600">
          <FileQuestion className="w-6 h-6" />
        </div>

        <div className="space-y-1.5">
          <h2 className="text-xl font-bold text-slate-900">404 - Page Not Found</h2>
          <p className="text-xs text-slate-500">
            The page or feature route you requested does not exist or has been moved.
          </p>
        </div>

        <Link to="/dashboard">
          <Button variant="primary" fullWidth className="gap-1.5">
            <ArrowLeft className="w-4 h-4" /> Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};
