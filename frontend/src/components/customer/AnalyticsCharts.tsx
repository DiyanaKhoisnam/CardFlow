import React from 'react';
import { SpendingAnalytics } from '../../types/customer.types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { PieChart as PieIcon, TrendingUp } from 'lucide-react';

interface AnalyticsChartsProps {
  analytics: SpendingAnalytics;
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ analytics }) => {
  const COLORS = ['#2563EB', '#64748B', '#0EA5E9', '#F59E0B', '#10B981', '#8B5CF6', '#EC4899'];

  const monthlyData = (analytics.monthlySpending || []).map((item: any) => ({
    month: item.month,
    total: item.amount ?? item.total ?? 0,
  }));

  const categoryData = analytics.categorySpending || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Monthly Spending Trend Area Chart */}
      <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm">Monthly Spending Volume</h3>
          </div>
          <span className="text-xs text-slate-500">6-Month Trend</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={{ stroke: '#E2E8F0' }} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '8px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                formatter={(val: any) => [`$${val.toFixed(2)}`, 'Volume']}
              />
              <Area type="monotone" dataKey="total" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#blueGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Breakdown Donut Chart */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm">Category Breakdown</h3>
          </div>
        </div>

        <div className="h-44 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={3}
                dataKey="amount"
                nameKey="category"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '8px', fontSize: '12px' }}
                formatter={(val: any) => [`$${val.toFixed(2)}`, 'Spent']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-1.5 pt-2 border-t border-slate-100">
          {categoryData.map((cat, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                <span className="text-slate-600 capitalize">{cat.category.toLowerCase()}</span>
              </div>
              <span className="font-semibold text-slate-900">${cat.amount.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
