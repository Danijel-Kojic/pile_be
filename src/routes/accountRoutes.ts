// src/routes/accountRoutes.ts

import express from 'express';
import AccountController from '../controllers/accountController';

const router = express.Router();

// Endpoint for listing and filtering accounts
router.get('/', AccountController.listAccounts);

// Endpoint for getting a single account by IBAN
router.get('/:iban', AccountController.getAccountByIBAN);

// Additional endpoints for updating balance after fund transfer, if needed

export default router;
