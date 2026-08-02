/**
 * Mock Email Service to simulate automated transactional email dispatches for:
 * - Payment Due Alerts
 * - Statement Ready Notifications
 * - Reward Points Milestones
 */

export class MockEmailService {
  /**
   * Simulates dispatching a Payment Due Reminder email.
   */
  static async sendPaymentDueAlert(to: string, cardLast4: string, amount: number, dueDate: string): Promise<boolean> {
    console.log(`
📧 [MOCK EMAIL DISPATCH] -------------------------------------
TO: ${to}
SUBJECT: ⚠️ Action Required: CardFlow Payment Due Reminder
BODY:
Dear Customer,

Your monthly statement payment of $${amount.toFixed(2)} for credit card ending in •••• ${cardLast4} is due on ${dueDate}.

Please sign in to your account to submit payment and avoid late penalty fees.
--------------------------------------------------------------`);
    return true;
  }

  /**
   * Simulates dispatching a Statement Ready Notification email.
   */
  static async sendStatementReadyAlert(to: string, month: string, totalSpent: number): Promise<boolean> {
    console.log(`
📧 [MOCK EMAIL DISPATCH] -------------------------------------
TO: ${to}
SUBJECT: 📄 Your CardFlow Monthly Statement is Ready for ${month}
BODY:
Dear Customer,

Your credit card statement for ${month} has been generated.
Total Monthly Spend: $${totalSpent.toFixed(2)}.

Log in to view your itemized transaction breakdown or download PDF statement records.
--------------------------------------------------------------`);
    return true;
  }

  /**
   * Simulates dispatching a Reward Points Milestone email.
   */
  static async sendRewardsEarnedAlert(to: string, pointsEarned: number, totalPoints: number): Promise<boolean> {
    console.log(`
📧 [MOCK EMAIL DISPATCH] -------------------------------------
TO: ${to}
SUBJECT: 🎉 You've Earned ${pointsEarned} New CardFlow Reward Points!
BODY:
Dear Customer,

Congratulations! You earned ${pointsEarned} reward points from your recent purchases.
Your Total Rewards Balance: ${totalPoints} PTS.

Visit the Rewards Vouchers Portal to redeem Amazon gift cards, flight passes, and cashback credits.
--------------------------------------------------------------`);
    return true;
  }
}
