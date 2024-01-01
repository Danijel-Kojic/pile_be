// src/config/database.ts

import { Sequelize } from 'sequelize';
import config from "config";

const sequelize = new Sequelize(
  `postgres://${config.get("host")}/${config.get("database")}`
);

export { sequelize };
