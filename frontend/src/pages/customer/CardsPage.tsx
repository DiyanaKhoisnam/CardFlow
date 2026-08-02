import React from 'react';
import { useUserCardsQuery, useUpdateCardStatusMutation } from '../../hooks/useCustomerData';
import { CreditCardVisual } from '../../components/customer/CreditCardVisual';
import { Loader2, Plus } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const CardsPage: React.FC = () => {
  const { data: cards, isLoading } = useUserCardsQuery();
  const updateCardStatusMutation = useUpdateCardStatusMutation();

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-950">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Credit Cards Portfolio</h1>
          <p className="text-sm text-slate-400">View card details, freeze/unfreeze, or block cards safely.</p>
        </div>
        <Button variant="primary" size="sm" onClick={() => alert('New Credit Card Application submitted for review.')}>
          <Plus className="w-4 h-4 mr-1.5" /> Request New Card
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {cards?.map((card) => (
          <CreditCardVisual
            key={card.id}
            card={card}
            onUpdateStatus={(cardId, status) => updateCardStatusMutation.mutate({ cardId, status })}
            isUpdating={updateCardStatusMutation.isPending}
          />
        ))}
      </div>
    </div>
  );
};
