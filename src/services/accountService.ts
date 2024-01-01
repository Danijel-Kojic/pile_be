// src/services/accountService.ts

import Account from '../models/Account';
import sequelize from 'sequelize';
import cache from 'memory-cache';

class AccountService {
  public static async listAccounts(minBalance?: number, maxBalance?: number, page = 1, pageSize = 10) {
    // Generate a unique key for caching based on the provided parameters
    const cacheKey = `accounts-list-${minBalance}-${maxBalance}-${page}-${pageSize}`;

    // Check if the data is already in the cache
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }
    const offset = (page - 1) * pageSize;
    const whereClause: any = {};

    // Handle min and max balance conditions correctly
    if (minBalance !== undefined || maxBalance !== undefined) {
      whereClause.balance = {};
      if (minBalance !== undefined) {
        whereClause.balance[sequelize.Op.gte] = minBalance;
      }
      if (maxBalance !== undefined) {
        whereClause.balance[sequelize.Op.lte] = maxBalance;
      }
    }

    const accounts = await Account.findAndCountAll({
      where: whereClause,
      offset,
      limit: pageSize,
    });

    const totalBalance = accounts.rows.reduce((sum, account) => sum + (+account.balance), 0);
    const ret = { accounts: accounts.rows, totalBalance, totalPages: Math.ceil(accounts.count / pageSize) };
    // Store the fetched data in the cache with a TTL of 5 minutes
    cache.put(cacheKey, ret, 5 * 60 * 1000);
    return ret;
  }

  public static async getAccountByIBAN(iban: string) {
    // Generate a unique key for caching based on the IBAN
    const cacheKey = `account-iban-${iban}`;
    // Check if the data is already in the cache
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }
    const account = Account.findOne({
      where: { iban },
    });
    // Store the fetched data in the cache with a TTL of 5 minutes
    cache.put(cacheKey, account, 5 * 60 * 1000);
    return account;
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
