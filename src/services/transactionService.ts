// src/services/transactionService.ts

import Account from '../models/Account';
import Transaction from '../models/Transaction';
import { sequelize } from '../config/database';
import cache from 'memory-cache';

class TransactionService {
  public static async createTransaction(
    sourceAccountId: string,
    amount: number,
    recipientName: string,
    targetIBAN: string,
    targetBIC: string,
    reference: string
  ) {
    const transaction = await sequelize.transaction();

    try {
      // Fetch the source account
      const sourceAccount = await Account.findByPk(sourceAccountId, { transaction });

      if (!sourceAccount) {
        throw new Error(`Source account with ID ${sourceAccountId} not found.`);
      }

      // Check if the source account has a sufficient balance
      if (sourceAccount.balance < amount) {
        throw new Error('Insufficient balance in the source account.');
      }

      // Fetch the target account using the targetIBAN
      const targetAccount = await Account.findOne({ where: { iban: targetIBAN }, transaction });

      if (!targetAccount) {
        throw new Error(`Target account with IBAN ${targetIBAN} not found.`);
      }

      // Update the source account balance
      await sourceAccount.update({ balance: Number(sourceAccount.balance) - amount }, { transaction });

      // Update the target account balance
      await targetAccount.update({ balance: Number(targetAccount.balance) + amount }, { transaction });

      // Create the transaction record
      const createdTransaction = await Transaction.create(
        {
          sourceAccountId,
          amount,
          recipientName,
          targetIBAN,
          targetBIC,
          reference,
        },
        { transaction }
      );

      // Commit the transaction
      await transaction.commit();

      // Invalidate relevant caches after a successful transaction
      this.invalidateCaches(sourceAccountId, targetIBAN);

      return createdTransaction;
    } catch (error) {
      // Rollback the transaction in case of an error
      await transaction.rollback();
      console.error('Error creating transaction:', error);
      throw error;
    }
  }

  public static async getTransactions(sourceAccountId: string, page = 1, pageSize = 10) {
    // Generate a unique key for caching based on the accountId
    const cacheKey = `transactions-${sourceAccountId}-${page}-${pageSize}`;
    // Check if the data is already in the cache
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const offset = (page - 1) * pageSize;

    const transactions = await Transaction.findAndCountAll({
      where: { sourceAccountId },
      offset,
      limit: pageSize,
    });
    const ret = { transactions: transactions.rows, totalPages: Math.ceil(transactions.count / pageSize) };

    // Store the fetched data in the cache with a TTL of 5 minutes
    cache.put(cacheKey, ret, 5 * 60 * 1000);
    return ret;
  }

  // Function to invalidate relevant caches after a successful transaction
  private static invalidateCaches(sourceAccountId: string, targetIBAN: string): void {
    // Invalidate the cached transactions for the source account
    const cacheKeys = cache.keys();
    const sourceAccountKey = `transactions-${sourceAccountId}-`;
    const accountListKey = 'accounts-list-';

    cacheKeys.forEach((key: string)=> {
      if (key.startsWith(sourceAccountKey)) {
        cache.del(sourceAccountKey);
      }
      // TODO: Optimize invalidation of accounts list
      if (key.startsWith(accountListKey)) {
        cache.del(accountListKey);
      }
    });

    // Invalidate the cached account by IBAN
    const targetAccountKey = `account-iban-${targetIBAN}`;
    cache.del(targetAccountKey);
  }
}

export default TransactionService;
