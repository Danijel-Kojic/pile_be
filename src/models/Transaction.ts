// src/models/Transaction.ts

import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

class Transaction extends Model {
  public id!: number;
  public sourceAccount!: string;
  public amount!: number;
  public recipientName!: string;
  public targetIBAN!: string;
  public targetBIC!: string;
  public reference!: string;

  // Add any other fields as needed

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Transaction.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    sourceAccount: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    recipientName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    targetIBAN: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    targetBIC: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reference: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Add any other fields as needed
  },
  {
    sequelize,
    modelName: 'Transaction',
  }
);

export default Transaction;
