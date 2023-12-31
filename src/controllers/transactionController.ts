// src/controllers/transactionController.ts

import { Request, Response } from 'express';
import TransactionService from '../services/transactionService';

class TransactionController {
  public static async createTransaction(req: Request, res: Response) {
    try {
      const { sourceAccount, amount, recipientName, targetIBAN, targetBIC, reference } = req.body;
      const transaction = await TransactionService.createTransaction(
        sourceAccount,
        parseFloat(amount),
        recipientName,
        targetIBAN,
        targetBIC,
        reference
      );
      res.json(transaction);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  public static async getTransactions(req: Request, res: Response) {
    try {
      const { sourceAccount, page, pageSize } = req.query;
      const result = await TransactionService.getTransactions(
        sourceAccount as string,
        parseInt(page as string, 10) || 1,
        parseInt(pageSize as string, 10) || 10
      );
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // Additional controllers for more transaction-related actions, if needed
}

export default TransactionController;
