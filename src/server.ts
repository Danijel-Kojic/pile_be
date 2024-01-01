// src/server.ts

import express from 'express';
import accountRoutes from './routes/accountRoutes';
import transactionRoutes from './routes/transactionRoutes';
import { errorHandler } from "./middleware/errorHandler";
import bodyParser from 'body-parser';

const app = express();

// Init Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Add any other middleware, configuration, and routes as needed

app.use('/api/v1/accounts', accountRoutes); // Mount the account routes under the /api/v1/accounts path
app.use('/api/v1/transactions', transactionRoutes); // Mount the transaction routes under the /api/v1/transactions path

// global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
