import React from 'react';
import { Reward } from '../../types/customer.types';
import { Gift, CheckCircle, Tag } from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

interface RewardsCatalogProps {
  rewards: Reward[];
  userPoints?: number;
  availablePoints?: number;
  onRedeem: (rewardId: string) => void;
  isRedeeming?: boolean;
}

export const RewardsCatalog: React.FC<RewardsCatalogProps> = ({
  rewards,
  userPoints = 0,
  availablePoints = 0,
  onRedeem,
  isRedeeming = false,
}) => {
  const points = userPoints || availablePoints;
  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Available Rewards Balance</span>
          <span className="text-2xl font-bold text-slate-900 tracking-tight">{points.toLocaleString()} PTS</span>
        </div>
        <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
          <Gift className="w-5 h-5" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rewards.map((reward) => {
          const canAfford = points >= reward.pointsRequired;
          const isRedeemed = reward.status === 'REDEEMED';

          return (
            <div key={reward.id} className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">{reward.category}</span>
                  {isRedeemed ? (
                    <Badge variant="success">REDEEMED</Badge>
                  ) : (
                    <Badge variant="neutral">{reward.pointsRequired} PTS</Badge>
                  )}
                </div>

                <h4 className="font-bold text-slate-900 text-sm">{reward.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{reward.description}</p>
              </div>

              <Button
                variant={isRedeemed ? 'secondary' : canAfford ? 'primary' : 'outline'}
                size="sm"
                fullWidth
                disabled={isRedeemed || !canAfford || isRedeeming}
                onClick={() => onRedeem(reward.id)}
              >
                {isRedeemed ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5" /> Voucher Claimed
                  </>
                ) : (
                  `Redeem Voucher (${reward.pointsRequired} PTS)`
                )}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
