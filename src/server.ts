// src/server.ts

import express from 'express';
import accountRoutes from './routes/accountRoutes';
import transactionRoutes from './routes/transactionRoutes';

const app = express();

// Add any other middleware, configuration, and routes as needed

app.use('/api/v1/accounts', accountRoutes); // Mount the account routes under the /api/accounts path
app.use('/api/v1/transactions', transactionRoutes); // Mount the transaction routes under the /api/transactions path

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
