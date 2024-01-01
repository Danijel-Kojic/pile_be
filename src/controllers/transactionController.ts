// src/controllers/transactionController.ts

import { Request, Response, NextFunction } from 'express';
import TransactionService from '../services/transactionService';
import { validateRequest } from '../middleware/validateMiddleware';
import Joi from 'joi';

class TransactionController {
  public static createTransactionSchema(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
      sourceAccountId: Joi.string().required(),
      amount: Joi.number().positive().required(),
      recipientName: Joi.string().required(),
      targetIBAN: Joi.string().required(),
      targetBIC: Joi.string().required(),
      reference: Joi.string().required(),
    });
    validateRequest(req, next, schema);
  }

  public static async createTransaction(req: Request, res: Response, next: NextFunction) {
    const { sourceAccountId, amount, recipientName, targetIBAN, targetBIC, reference } = req.body;
    TransactionService.createTransaction(
      sourceAccountId,
      parseFloat(amount),
      recipientName,
      targetIBAN,
      targetBIC,
      reference
    )
    .then(tx => res.json(tx))
    .catch(next);
  }

  public static getTransactionsSchema(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
      sourceAccountId: Joi.string().required(),
      page: Joi.number().integer().positive().default(1),
      pageSize: Joi.number().integer().positive().default(10),
    });
    validateRequest(req, next, schema);
  }

  public static async getTransactions(req: Request, res: Response, next: NextFunction) {
    const { sourceAccountId, page, pageSize } = req.query;
    TransactionService.getTransactions(
      sourceAccountId as string,
      parseInt(page as string, 10) || 1,
      parseInt(pageSize as string, 10) || 10
    )
    .then(transactions => res.json(transactions))
    .catch(next);
  }

  // Additional controllers for more transaction-related actions, if needed
}

export default TransactionController;
