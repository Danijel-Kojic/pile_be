// src/routes/transactionRoutes.ts

import express from 'express';
import TransactionController from '../controllers/transactionController';

const router = express.Router();

// Endpoint for creating a new transaction
router.post('/', TransactionController.createTransaction);

// Endpoint for retrieving transactions for a specific source account
router.get('/', TransactionController.getTransactions);

// Additional endpoints for more transaction-related actions, if needed

export default router;
