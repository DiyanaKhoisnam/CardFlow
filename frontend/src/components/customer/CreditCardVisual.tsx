import React from 'react';
import { Card as CardType, CardStatus } from '../../types/customer.types';
import { CreditCard, Snowflake, Lock } from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

interface CreditCardVisualProps {
  card: CardType;
  onFreezeToggle?: (cardId: string, currentStatus: string) => void;
  onUpdateStatus?: (cardId: string, status: CardStatus) => void;
  onBlock?: (cardId: string) => void;
  isProcessing?: boolean;
  isUpdating?: boolean;
}

export const CreditCardVisual: React.FC<CreditCardVisualProps> = ({
  card,
  onFreezeToggle,
  onUpdateStatus,
  onBlock,
  isProcessing = false,
  isUpdating = false,
}) => {
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  const loading = isProcessing || isUpdating;

  const handleFreeze = () => {
    if (onUpdateStatus) {
      onUpdateStatus(card.id, card.status === 'FROZEN' ? 'ACTIVE' : 'FROZEN');
    } else if (onFreezeToggle) {
      onFreezeToggle(card.id, card.status);
    }
  };

  const handleBlock = () => {
    if (onUpdateStatus) {
      onUpdateStatus(card.id, 'BLOCKED');
    } else if (onBlock) {
      onBlock(card.id);
    }
  };

  const getStatusBadge = () => {
    switch (card.status) {
      case 'ACTIVE': return <Badge variant="success">ACTIVE</Badge>;
      case 'FROZEN': return <Badge variant="warning">FROZEN</Badge>;
      case 'BLOCKED': return <Badge variant="danger">BLOCKED</Badge>;
      default: return <Badge variant="neutral">{card.status}</Badge>;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-5">
      {/* Header & Status */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-bold text-slate-900">{card.cardType.replace('_', ' ')}</span>
        </div>
        {getStatusBadge()}
      </div>

      {/* Credit Card Visual Shell */}
      <div className="w-full h-44 rounded-lg bg-gradient-to-r from-slate-900 to-slate-800 text-white p-5 flex flex-col justify-between shadow-md relative overflow-hidden">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-[10px] uppercase font-semibold text-slate-400">CardFlow Business</div>
            <div className="text-xs font-bold tracking-wider">{card.cardHolder}</div>
          </div>
          <div className="text-xs font-bold tracking-widest text-slate-400">VISA</div>
        </div>

        <div className="text-lg font-mono tracking-widest font-semibold">
          •••• •••• •••• {card.cardNumber.slice(-4)}
        </div>

        <div className="flex justify-between items-end text-xs">
          <div>
            <div className="text-[9px] uppercase text-slate-400">EXP</div>
            <div className="font-mono font-medium">{card.expiryDate}</div>
          </div>
          <div>
            <div className="text-[9px] uppercase text-slate-400">LIMIT</div>
            <div className="font-mono font-medium">{formatCurrency(card.creditLimit)}</div>
          </div>
        </div>
      </div>

      {/* Balance Metrics */}
      <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-100">
        <div>
          <span className="text-slate-500 block text-[11px]">Available Line</span>
          <span className="font-bold text-slate-900 text-sm">{formatCurrency(card.availableCredit)}</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[11px]">Balance Due</span>
          <span className="font-bold text-slate-900 text-sm">{formatCurrency(card.outstandingBalance)}</span>
        </div>
      </div>

      {/* Actions */}
      {(onFreezeToggle || onUpdateStatus) && (
        <div className="flex items-center gap-2 pt-1">
          <Button
            variant={card.status === 'FROZEN' ? 'primary' : 'outline'}
            size="sm"
            fullWidth
            onClick={handleFreeze}
            isLoading={loading}
          >
            <Snowflake className="w-3.5 h-3.5" />
            {card.status === 'FROZEN' ? 'Unfreeze Card' : 'Freeze Card'}
          </Button>

          {card.status !== 'BLOCKED' && (onBlock || onUpdateStatus) && (
            <Button
              variant="danger"
              size="sm"
              onClick={handleBlock}
              isLoading={loading}
            >
              <Lock className="w-3.5 h-3.5" />
              Block
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
