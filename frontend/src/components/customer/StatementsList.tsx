import React from 'react';
import { Statement } from '../../types/customer.types';
import { FileText, Download } from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { downloadStatementPDF } from '../../utils/export.utils';

interface StatementsListProps {
  statements: Statement[];
}

export const StatementsList: React.FC<StatementsListProps> = ({ statements }) => {
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-200 flex items-center justify-between">
        <h3 className="font-bold text-slate-900 text-sm">Monthly Statements Ledger</h3>
        <span className="text-xs text-slate-500">Official Billing Records</span>
      </div>

      <div className="divide-y divide-slate-100">
        {statements.map((st, idx) => (
          <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-slate-50 border border-slate-200 flex items-center justify-center text-blue-600">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-slate-900 text-xs">{st.month} {st.year} Statement</div>
                <div className="text-[11px] text-slate-400">Card ending in •••• {st.cardLast4} • Due {st.dueDate}</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="font-bold text-slate-900 text-xs">{formatCurrency(st.totalSpent)}</div>
                <Badge variant="success">PAID IN FULL</Badge>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadStatementPDF(st.month, st.totalSpent, st.cardLast4)}
              >
                <Download className="w-3.5 h-3.5" /> PDF
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
