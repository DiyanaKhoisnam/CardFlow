import React from 'react';
import { useRewardsQuery, useRedeemRewardMutation } from '../../hooks/useCustomerData';
import { RewardsCatalog } from '../../components/customer/RewardsCatalog';
import { Loader2 } from 'lucide-react';

export const RewardsPage: React.FC = () => {
  const { data, isLoading } = useRewardsQuery();
  const redeemMutation = useRedeemRewardMutation();

  if (isLoading || !data) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-950">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Rewards & Vouchers Portal</h1>
        <p className="text-sm text-slate-400">Redeem points earned from credit card purchases for gift cards and travel vouchers.</p>
      </div>

      <RewardsCatalog
        rewards={data.rewards}
        availablePoints={data.summary.availablePoints}
        onRedeem={(rewardId) => redeemMutation.mutate(rewardId)}
        isRedeeming={redeemMutation.isPending}
      />
    </div>
  );
};
