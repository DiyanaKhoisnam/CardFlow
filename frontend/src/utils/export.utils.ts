import { Transaction } from '../types/customer.types';

/**
 * Generates and triggers a browser download for a CSV file of transactions.
 */
export const exportTransactionsToCSV = (transactions: Transaction[], filename = 'CardFlow_Transactions.csv') => {
  if (!transactions || transactions.length === 0) {
    alert('No transactions available to export.');
    return;
  }

  const headers = ['Transaction ID', 'Merchant', 'Category', 'Amount (USD)', 'Status', 'Date'];
  const rows = transactions.map((tx) => [
    tx.id,
    `"${tx.merchant.replace(/"/g, '""')}"`,
    tx.category,
    tx.amount.toFixed(2),
    tx.status,
    new Date(tx.date).toISOString().split('T')[0],
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);

  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Generates and triggers a printable PDF document view for monthly statements.
 */
export const downloadStatementPDF = (month: string, totalSpent: number, cardLast4 = '8821') => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>CardFlow Statement - ${month}</title>
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #1e293b; }
          .header { display: flex; justify-content: space-between; align-items: center; border-b: 2px solid #3b82f6; padding-bottom: 20px; }
          .logo { font-size: 24px; font-weight: 800; color: #1e3a8a; }
          .summary { margin-top: 30px; background: #f8fafc; padding: 20px; border-radius: 8px; }
          .amount { font-size: 28px; font-weight: bold; color: #2563eb; }
          .footer { margin-top: 50px; font-size: 12px; color: #64748b; border-t: 1px solid #e2e8f0; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">CardFlow Enterprise</div>
          <div>Statement Period: <strong>${month}</strong></div>
        </div>

        <div class="summary">
          <h3>Account Summary</h3>
          <p>Card Number: <strong>•••• •••• •••• ${cardLast4}</strong></p>
          <p>Total Monthly Spend:</p>
          <div class="amount">$${totalSpent.toFixed(2)}</div>
          <p>Status: <span style="color: #10b981; font-weight: bold;">PAID IN FULL</span></p>
        </div>

        <div class="footer">
          CardFlow Financial Services • Official Monthly Billing Record • Generated on ${new Date().toLocaleDateString()}
        </div>
        <script>
          window.onload = function() { window.print(); };
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
};
