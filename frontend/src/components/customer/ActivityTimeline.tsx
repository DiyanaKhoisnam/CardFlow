import React from 'react';
import { Clock, ShieldCheck, CreditCard, Gift, FileText } from 'lucide-react';

export const ActivityTimeline: React.FC = () => {
  const events = [
    { title: 'Credit Card Approved', description: 'CardFlow Titanium Card line activated', date: '2 hours ago', icon: <CreditCard className="w-3.5 h-3.5 text-blue-600" /> },
    { title: 'Reward Voucher Redeemed', description: 'Redeemed $50 Amazon Gift Card voucher', date: '1 day ago', icon: <Gift className="w-3.5 h-3.5 text-amber-600" /> },
    { title: 'Monthly Statement Generated', description: 'July 2026 statement ready for review', date: '3 days ago', icon: <FileText className="w-3.5 h-3.5 text-emerald-600" /> },
    { title: 'Security Verification Passed', description: 'Session verified via JWT HttpOnly cookie', date: '5 days ago', icon: <ShieldCheck className="w-3.5 h-3.5 text-slate-600" /> },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <Clock className="w-4 h-4 text-blue-600" />
        <h3 className="font-bold text-slate-900 text-sm">Recent Activity</h3>
      </div>

      <div className="relative pl-5 border-l border-slate-200 space-y-5">
        {events.map((ev, idx) => (
          <div key={idx} className="relative group">
            <div className="absolute -left-[27px] top-0 w-5 h-5 rounded-full bg-white border border-slate-300 flex items-center justify-center">
              {ev.icon}
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-900">{ev.title}</span>
                <span className="text-[10px] text-slate-400">{ev.date}</span>
              </div>
              <p className="text-xs text-slate-500">{ev.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
