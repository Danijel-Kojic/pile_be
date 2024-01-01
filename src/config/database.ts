// src/config/database.ts

import { Sequelize } from 'sequelize';
// Load environment variables from a .env file (optional)
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
{
  dialect: 'postgres',
  host: process.env.PGHOST,
  port: parseInt(process.env.PGPORT || "5432"),
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
}
);

export { sequelize };
