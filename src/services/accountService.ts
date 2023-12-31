// src/services/accountService.ts

import Account from '../models/Account';
import sequelize from 'sequelize';

class AccountService {
  public static async listAccounts(minBalance?: number, maxBalance?: number, page = 1, pageSize = 10) {
    const offset = (page - 1) * pageSize;
    const whereClause: any = {};

    if (minBalance !== undefined) {
      whereClause.balance = { [sequelize.Op.gte]: minBalance };
    }

    if (maxBalance !== undefined) {
      whereClause.balance = { [sequelize.Op.lte]: maxBalance };
    }

    const accounts = await Account.findAndCountAll({
      where: whereClause,
      offset,
      limit: pageSize,
    });

    const totalBalance = accounts.rows.reduce((sum, account) => sum + (+account.balance), 0);

    return { accounts: accounts.rows, totalBalance, totalPages: Math.ceil(accounts.count / pageSize) };
  }

  public static async getAccountByIBAN(iban: string) {
    return Account.findOne({
      where: { iban },
    });
  }

  public static async updateBalance(iban: string, amount: number) {
    const account = await Account.findOne({
      where: { iban },
    });

    if (!account) {
      throw new Error('Account not found');
    }

    // Update balance based on the transaction amount
    account.balance += amount;

    // Save the updated balance to the database
    await account.save();

    return account;
  }
}

export default AccountService;
