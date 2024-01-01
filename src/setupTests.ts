// src/setupTests.ts

// Example: Set up a mock database connection for testing
import { sequelize } from './config/database';

beforeAll(async () => {
  // Connect to the mock database before all tests
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  // Close the database connection after all tests
  await sequelize.close();
});
