// seedData.ts

import fs from 'fs';
import path from 'path';
import { sequelize } from '../config/database'; // Import your Sequelize instance
import Account from '../models/Account'; // Import your Account model

const seedData = async () => {
  try {
    // Sync the model with the database
    await sequelize.sync();

    // Read data from the JSON file
    const jsonDataPath = path.resolve(__dirname, 'accounts.json');
    const jsonData = fs.readFileSync(jsonDataPath, 'utf-8');
    const sampleAccounts = JSON.parse(jsonData).data;
    const inputAccounts = sampleAccounts.map((account: any) => ({
      ...account,
      iban: account.IBAN,
      balance: account.balances.available.value,
      currency: account.balances.available.currency
    })
    );

    // Insert sample accounts into the database
    await Account.bulkCreate(inputAccounts);

    console.log('Data seeded successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    // Close the database connection
    await sequelize.close();
  }
};

// Run the seeding script
seedData();
