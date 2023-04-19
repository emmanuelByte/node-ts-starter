import { Router } from 'express';

import { authenticate } from '../middlewares/authMiddleware';
import userValidation from '../validation/userValidation';
import userController from '../controllers/userController';
const router = Router();
router.post('/register', userValidation.loginValidation, userController.register);
router.post('/login', userValidation.loginValidation, userController.login);
// Protect the routes below with the authenticate middleware
router.use(authenticate);

// Add other protected routes here, e.g., payment-related routes

export default router;
