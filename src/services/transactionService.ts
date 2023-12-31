// src/services/transactionService.ts

import Transaction from '../models/Transaction';

class TransactionService {
  public static async createTransaction(
    sourceAccount: string,
    amount: number,
    recipientName: string,
    targetIBAN: string,
    targetBIC: string,
    reference: string
  ) {
    // Validate source account balance (assuming you have a validation logic)
    // You might want to implement more validation checks as needed

    // Create a new transaction record
    const transaction = await Transaction.create({
      sourceAccount,
      amount,
      recipientName,
      targetIBAN,
      targetBIC,
      reference,
    });

    // Log the transaction (this can be extended based on your logging needs)
    // console.log(`Transaction logged: ${JSON.stringify(transaction, null, 2)}`);

    return transaction;
  }

  public static async getTransactions(sourceAccount: string, page = 1, pageSize = 10) {
    const offset = (page - 1) * pageSize;

    const transactions = await Transaction.findAndCountAll({
      where: { sourceAccount },
      offset,
      limit: pageSize,
    });

    return { transactions: transactions.rows, totalPages: Math.ceil(transactions.count / pageSize) };
  }
}

export default TransactionService;
