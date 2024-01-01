// src/controllers/accountController.ts

import { Request, Response, NextFunction } from 'express';
import AccountService from '../services/accountService';
import Joi from 'joi';
import { validateRequest } from '../middleware/validateMiddleware';

class AccountController {
  public static listAccountsSchema(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
      minBalance: Joi.number(),
      maxBalance: Joi.number(),
      page: Joi.number().integer().positive().default(1),
      pageSize: Joi.number().integer().positive().default(10),
    });
    validateRequest(req, next, schema);
  }

  public static async listAccounts(req: Request, res: Response, next: NextFunction) {
    const { minBalance, maxBalance, page, pageSize } = req.query;
    AccountService.listAccounts(
      parseFloat(minBalance as string) || undefined,
      parseFloat(maxBalance as string) || undefined,
      parseInt(page as string, 10) || 1,
      parseInt(pageSize as string, 10) || 10
    )
    .then(accounts => res.json(accounts))
    .catch(next);
  }

  public static getAccountByIBANSchema(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
      iban: Joi.string().required()
    });
    validateRequest(req, next, schema);
  }

  public static async getAccountByIBAN(req: Request, res: Response, next: NextFunction) {
    const { iban } = req.params;
    AccountService.getAccountByIBAN(iban)
    .then(account => {
      if (account) {
        res.json(account);
      } else {
        res.status(404).json({ error: 'Account not found' });
      }
    })
    .catch(next);
  }

  // Additional controllers for updating balance after fund transfer, if needed
}

export default AccountController;
