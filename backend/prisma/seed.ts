import { PrismaClient, Role, CardType, CardStatus, CardApplicationStatus, TransactionCategory, TransactionStatus, RewardStatus } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding for Phase 3 Admin & Customer modules...');

  const passwordHash = await bcrypt.hash('Password123!', 10);
  const adminPasswordHash = await bcrypt.hash('AdminPass123!', 10);

  // 1. Create or upsert Customer User
  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      password: passwordHash,
      firstName: 'Alex',
      lastName: 'Morgan',
      role: Role.CUSTOMER,
      isSuspended: false,
    },
  });

  // 2. Create second Customer User (Active)
  const customer2 = await prisma.user.upsert({
    where: { email: 'jordan.lee@example.com' },
    update: {},
    create: {
      email: 'jordan.lee@example.com',
      password: passwordHash,
      firstName: 'Jordan',
      lastName: 'Lee',
      role: Role.CUSTOMER,
      isSuspended: false,
    },
  });

  // 3. Create third Customer User (Suspended)
  const customer3 = await prisma.user.upsert({
    where: { email: 'blocked.user@example.com' },
    update: {},
    create: {
      email: 'blocked.user@example.com',
      password: passwordHash,
      firstName: 'Marcus',
      lastName: 'Vance',
      role: Role.CUSTOMER,
      isSuspended: true,
    },
  });

  // 4. Create Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: adminPasswordHash,
      firstName: 'Sarah',
      lastName: 'Connor',
      role: Role.ADMIN,
      isSuspended: false,
    },
  });

  console.log(`👤 Users created: ${customer.email}, ${customer2.email}, ${customer3.email}, ${admin.email}`);

  // 5. Create Approved Credit Cards for Customer 1
  const card1 = await prisma.card.upsert({
    where: { cardNumber: '4532 •••• •••• 8821' },
    update: {},
    create: {
      userId: customer.id,
      cardNumber: '4532 •••• •••• 8821',
      cardHolder: 'ALEX MORGAN',
      cardType: CardType.BLACK_EDITION,
      expiryDate: '12/28',
      cvv: '842',
      creditLimit: 15000.0,
      availableCredit: 11450.5,
      outstandingBalance: 3549.5,
      status: CardStatus.ACTIVE,
      applicationStatus: CardApplicationStatus.APPROVED,
    },
  });

  const card2 = await prisma.card.upsert({
    where: { cardNumber: '5412 •••• •••• 4109' },
    update: {},
    create: {
      userId: customer.id,
      cardNumber: '5412 •••• •••• 4109',
      cardHolder: 'ALEX MORGAN',
      cardType: CardType.PLATINUM,
      expiryDate: '09/27',
      cvv: '319',
      creditLimit: 8000.0,
      availableCredit: 6200.0,
      outstandingBalance: 1800.0,
      status: CardStatus.ACTIVE,
      applicationStatus: CardApplicationStatus.APPROVED,
    },
  });

  // 6. Create Pending & Blocked Cards for Customer 2 & 3
  const card3 = await prisma.card.upsert({
    where: { cardNumber: '3782 •••• •••• 9102' },
    update: {},
    create: {
      userId: customer2.id,
      cardNumber: '3782 •••• •••• 9102',
      cardHolder: 'JORDAN LEE',
      cardType: CardType.TITANIUM,
      expiryDate: '11/29',
      cvv: '512',
      creditLimit: 12000.0,
      availableCredit: 12000.0,
      outstandingBalance: 0.0,
      status: CardStatus.ACTIVE,
      applicationStatus: CardApplicationStatus.PENDING,
    },
  });

  const card4 = await prisma.card.upsert({
    where: { cardNumber: '4000 •••• •••• 1111' },
    update: {},
    create: {
      userId: customer3.id,
      cardNumber: '4000 •••• •••• 1111',
      cardHolder: 'MARCUS VANCE',
      cardType: CardType.GOLD,
      expiryDate: '01/26',
      cvv: '999',
      creditLimit: 5000.0,
      availableCredit: 0.0,
      outstandingBalance: 5000.0,
      status: CardStatus.BLOCKED,
      applicationStatus: CardApplicationStatus.APPROVED,
    },
  });

  console.log(`💳 Cards seeded across users`);

  // 7. Sample Transactions
  const transactionsData = [
    { merchant: 'Apple Store Fifth Ave', category: TransactionCategory.SHOPPING, amount: 1299.0, status: TransactionStatus.COMPLETED, date: new Date('2026-07-20T14:32:00Z') },
    { merchant: 'Whole Foods Market', category: TransactionCategory.GROCERIES, amount: 184.25, status: TransactionStatus.COMPLETED, date: new Date('2026-07-18T11:15:00Z') },
    { merchant: 'Delta Air Lines Flight', category: TransactionCategory.TRAVEL, amount: 650.0, status: TransactionStatus.COMPLETED, date: new Date('2026-07-15T09:40:00Z') },
    { merchant: 'Nobu Restaurant Dining', category: TransactionCategory.DINING, amount: 245.8, status: TransactionStatus.COMPLETED, date: new Date('2026-07-12T20:10:00Z') },
    { merchant: 'Uber Trip Ride', category: TransactionCategory.TRAVEL, amount: 32.5, status: TransactionStatus.COMPLETED, date: new Date('2026-07-10T18:05:00Z') },
    { merchant: 'Netflix Monthly Premium', category: TransactionCategory.ENTERTAINMENT, amount: 22.99, status: TransactionStatus.COMPLETED, date: new Date('2026-07-05T04:00:00Z') },
  ];

  await prisma.transaction.deleteMany({ where: { userId: customer.id } });

  for (const tx of transactionsData) {
    await prisma.transaction.create({
      data: {
        userId: customer.id,
        cardId: card1.id,
        merchant: tx.merchant,
        category: tx.category,
        amount: tx.amount,
        status: tx.status,
        date: tx.date,
        description: `Purchase at ${tx.merchant}`,
      },
    });
  }

  // Sample transactions for Customer 2
  await prisma.transaction.create({
    data: {
      userId: customer2.id,
      cardId: card3.id,
      merchant: 'Tesla Supercharger',
      category: TransactionCategory.UTILITIES,
      amount: 45.0,
      status: TransactionStatus.COMPLETED,
      date: new Date('2026-07-22T09:30:00Z'),
    },
  });

  console.log(`🧾 Transactions seeded`);

  // 8. Rewards
  await prisma.reward.deleteMany({ where: { userId: customer.id } });

  const rewardsData = [
    { title: '$50 Amazon Gift Card', description: 'Digital voucher code redeemable instantly', category: 'Shopping', pointsRequired: 500 },
    { title: '$100 Flight Discount Voucher', description: 'Valid on Delta, United, and American Airlines', category: 'Travel', pointsRequired: 1000 },
    { title: 'Airport VIP Lounge Access Pass', description: 'Complimentary pass to Priority Pass lounges worldwide', category: 'Travel', pointsRequired: 1200 },
    { title: '$25 Starbucks eGift Card', description: 'Coffee and beverage reward voucher', category: 'Dining', pointsRequired: 250 },
    { title: 'Cashback Credit $200', description: 'Direct statement credit credited within 24 hours', category: 'Cashback', pointsRequired: 2000 },
  ];

  for (const reward of rewardsData) {
    await prisma.reward.create({
      data: {
        userId: customer.id,
        title: reward.title,
        description: reward.description,
        category: reward.category,
        pointsRequired: reward.pointsRequired,
        status: RewardStatus.AVAILABLE,
      },
    });
  }

  console.log('✅ Admin & Customer Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
