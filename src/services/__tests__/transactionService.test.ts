// src/services/__tests__/transactionService.test.ts

import TransactionService from '../transactionService';
import { sequelize } from '../../config/database';
import Account from '../../models/Account';
import Transaction from '../../models/Transaction';

describe('TransactionService', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true }); // Sync models with the database and create tables
  });

  afterAll(async () => {
    await sequelize.close(); // Close the Sequelize connection
  });

  const sourceAccountId = '2fd5e4e0-16e2-4337-b63d-22582d2623f5';
  const sourceIBAN = 'DE03678822021961930232';
  const sourceAccountName = '61tuh';
  const targetAccountId = '5f1b6eb7-885f-4f85-af57-a4694ab62eec';
  const targetIBAN = 'DE56530041836982318248';
  const targetAccountName = 'auu9v';

  beforeEach(async () => {
    await sequelize.transaction(async (t) => {
      // Seed test data into the database
      await Account.create({
        id: sourceAccountId,
        iban: sourceIBAN,
        balance: 1000,
        currency: 'EUR',
        country: 'US',
        createdAt: new Date(),
        name: sourceAccountName,
      }, { transaction: t });

      await Account.create({
        id: targetAccountId,
        iban: targetIBAN,
        balance: 500,
        currency: 'EUR',
        country: 'US',
        createdAt: new Date(),
        name: targetAccountName,
      }, { transaction: t });
    });
  });

  afterEach(async () => {
    // Delete all records from the Transactions table
    await Transaction.destroy({ where: {} });
    // Delete all records from the Accounts table
    await Account.destroy({ where: {} });
  });

  it('should create a transaction and update balances', async () => {
    const createdTransaction = await TransactionService.createTransaction(
      sourceAccountId,
      200,
      targetAccountName,
      targetIBAN,
      'targetBIC',
      'Reference'
    );

    // Verify that the transaction was created
    expect(createdTransaction).toBeDefined();
    expect(Number(createdTransaction.amount)).toBe(200);

    const sourceAccount = await Account.findByPk(sourceAccountId);
    expect(Number(sourceAccount?.balance)).toBe(800);

    const targetAccount = await Account.findOne({ where: { iban: targetIBAN } });
    expect(Number(targetAccount?.balance)).toBe(700);
  });

  it('should throw an error for insufficient balance', async () => {
    // Attempt to create a transaction with insufficient balance
    await expect(
      TransactionService.createTransaction(
        sourceAccountId,
        1200, // More than the source account balance
        targetAccountName,
        targetIBAN,
        'targetBIC',
        'Reference'
      )
    ).rejects.toThrow('Insufficient balance in the source account.');

    // Verify that balances remain unchanged
    const sourceAccount = await Account.findByPk(sourceAccountId);
    const targetAccount = await Account.findOne({ where: { iban: targetIBAN } });

    expect(Number(sourceAccount?.balance)).toBe(1000);
    expect(Number(targetAccount?.balance)).toBe(500);
  });

  // Add more test cases as needed
});
