import { Router } from 'express';

import { authenticate } from '../middlewares/authMiddleware';
import userValidation from '../validation/userValidation';
import userController from '../controllers/userController';
const router = Router();
// UnAuthenticated
// POST ROUTES
router.post('/register', userValidation.loginValidation, userController.register);
router.post('/login', userValidation.loginValidation, userController.login);
router.post('/sendVerificationEmail', userValidation.verificationEmailValidation, userController.sendVerificationEmail);
router.post('/verifyEmail', userValidation.verifyEmailValidation, userController.verifyEmail);
// Protect the routes below with the authenticate middleware
router.use(authenticate);
// POST ROUTES
router.post(
  '/completeRegistration',
  userValidation.completeRegistrationValidation,
  userController.completeRegistration,
);
router.post('/createPin', userValidation.createPinValidation, userController.createPin);
router.post('/updatePin', userValidation.updatePinValidation, userController.updatePin);
router.post('/verifyPin', userValidation.createPinValidation, userController.verifyPin);
// GET ROUTES
router.get('/profile', userController.getProfile);

// Add other protected routes here, e.g., payment-related routes

export default router;
