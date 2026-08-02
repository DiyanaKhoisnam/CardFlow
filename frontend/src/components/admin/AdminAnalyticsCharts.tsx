import React from 'react';
import { AdminAnalytics } from '../../types/admin.types';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, CreditCard } from 'lucide-react';

interface AdminAnalyticsChartsProps {
  analytics: AdminAnalytics;
}

export const AdminAnalyticsCharts: React.FC<AdminAnalyticsChartsProps> = ({ analytics }) => {
  const COLORS = ['#2563EB', '#64748B', '#0EA5E9', '#F59E0B', '#10B981'];

  const userAcquisitionData = (analytics.userAcquisition || []).map((item: any) => ({
    month: item.month,
    users: item.newUsers ?? item.users ?? 0,
  }));

  const spendingTrendsData = analytics.spendingTrends || (analytics as any).monthlySystemVolume || [];
  const cardDistributionData = analytics.cardTypeDistribution || [];

  return (
    <div className="space-y-6">
      {/* 2-Column Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Acquisition Growth Bar Chart */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-sm">User Acquisition Growth</h3>
            </div>
            <span className="text-xs text-slate-500">Monthly Registrations</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userAcquisitionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={{ stroke: '#E2E8F0' }} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="users" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly System Volume Area Chart */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-sm">System Transaction Volume</h3>
            </div>
            <span className="text-xs text-slate-500">6-Month Volume</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={spendingTrendsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="adminBlueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={{ stroke: '#E2E8F0' }} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(val: any) => [`$${val.toFixed(2)}`, 'Volume']}
                />
                <Area type="monotone" dataKey="volume" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#adminBlueGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Card Type Portfolio Distribution */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm">Credit Card Portfolio Breakdown</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={cardDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="count"
                  nameKey="type"
                >
                  {cardDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '8px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2">
            {cardDistributionData.map((dist: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-md bg-slate-50 border border-slate-100 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                  <span className="font-semibold text-slate-900">{(dist.type || dist.cardType || '').replace('_', ' ')}</span>
                </div>
                <span className="font-mono font-bold text-slate-900">{dist.count} Issued</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
