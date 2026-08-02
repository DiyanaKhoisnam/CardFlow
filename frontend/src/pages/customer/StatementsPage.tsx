import React from 'react';
import { useStatementsQuery } from '../../hooks/useCustomerData';
import { StatementsList } from '../../components/customer/StatementsList';
import { Loader2 } from 'lucide-react';

export const StatementsPage: React.FC = () => {
  const { data: statements, isLoading } = useStatementsQuery();

  if (isLoading || !statements) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-950">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Monthly Card Statements</h1>
        <p className="text-sm text-slate-400">Access and download PDF statements for tax and accounting records.</p>
      </div>

      <StatementsList statements={statements} />
    </div>
  );
};
