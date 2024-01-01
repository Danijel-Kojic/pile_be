// src/services/transactionService.ts

import Account from '../models/Account';
import Transaction from '../models/Transaction';
import { sequelize } from '../config/database';

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
      await sourceAccount.update({ balance: sourceAccount.balance - amount }, { transaction });

      // Update the target account balance
      await targetAccount.update({ balance: targetAccount.balance + amount }, { transaction });

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

      return createdTransaction;
    } catch (error) {
      // Rollback the transaction in case of an error
      await transaction.rollback();
      console.error('Error creating transaction:', error);
      throw error;
    }
  }

  public static async getTransactions(sourceAccountId: string, page = 1, pageSize = 10) {
    const offset = (page - 1) * pageSize;

    const transactions = await Transaction.findAndCountAll({
      where: { sourceAccountId },
      offset,
      limit: pageSize,
    });

    return { transactions: transactions.rows, totalPages: Math.ceil(transactions.count / pageSize) };
  }
}

export default TransactionService;
