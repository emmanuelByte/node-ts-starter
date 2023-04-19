import { Router } from 'express';

import { authenticate } from '../middlewares/authMiddleware';
import userValidation from '../validation/userValidation';
import UserController from '../controllers/userController';
import UserService from '../services/userService';
import { MongooseUserRepository } from '../infra/repository/userRepository';

const router = Router();

const userController = new UserController(new UserService(new MongooseUserRepository()));
router.post('/register', userController.register);
router.post('/login', userValidation.UserLoginValidation, userController.login);

// Protect the routes below with the authenticate middleware
router.use(authenticate);

// Add other protected routes here, e.g., payment-related routes

export default router;
