// src/models/Account.ts

import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

class Account extends Model {
  public id!: string;
  public iban!: string;
  public balance!: number;
  public country!: string;
  public createdAt!: Date;
  public name!: string;

  // Add any other fields as needed

  public readonly updatedAt!: Date;
}

Account.init(
  {
    id: {
      type: DataTypes.UUID, // Assuming id is a UUID
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4, // Default value is a generated UUID
    },
    iban: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    balance: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Add any other fields as needed
  },
  {
    sequelize,
    modelName: 'Account',
  }
);

export default Account;
