// src/controllers/accountController.ts

import { Request, Response } from 'express';
import AccountService from '../services/accountService';

class AccountController {
  public static async listAccounts(req: Request, res: Response) {
    try {
      const { minBalance, maxBalance, page, pageSize } = req.query;
      const result = await AccountService.listAccounts(
        parseFloat(minBalance as string) || undefined,
        parseFloat(maxBalance as string) || undefined,
        parseInt(page as string, 10) || 1,
        parseInt(pageSize as string, 10) || 10
      );
      res.json(result);
    } catch (error) {
      // console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  public static async getAccountByIBAN(req: Request, res: Response) {
    try {
      const { iban } = req.params;
      const account = await AccountService.getAccountByIBAN(iban);
      if (account) {
        res.json(account);
      } else {
        res.status(404).json({ error: 'Account not found' });
      }
    } catch (error) {
      // console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // Additional controllers for updating balance after fund transfer, if needed
}

export default AccountController;
