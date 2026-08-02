import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '../components/common/Button';

export const UnauthorizedPage: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 bg-slate-950">
      <div className="max-w-md w-full glass-panel p-8 rounded-2xl text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
          <ShieldAlert className="w-8 h-8" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">Access Denied (403)</h2>
          <p className="text-sm text-slate-400">
            You do not have the required role permissions to view this resource. Contact your administrator if you believe this is an error.
          </p>
        </div>

        <Link to="/dashboard">
          <Button variant="secondary" fullWidth className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};
