import { Router } from 'express';

import { authenticate } from '../middlewares/authMiddleware';
import userValidation from '../validation/userValidation';
import userController from '../controllers/userController';
const router = Router();
// UnAuthenticated
// POST ROUTES
router.post('/register', userValidation.registerValidation, userController.register);
router.post('/login', userValidation.loginValidation, userController.login);
router.post('/sendVerificationEmail', userValidation.verificationEmailValidation, userController.sendVerificationEmail);
router.post('/checkEmail', userValidation.verificationEmailValidation, userController.checkEmail);
router.post('/verifyEmail', userValidation.verifyEmailValidation, userController.verifyEmail);
router.post('/sendForgotPassword', userValidation.verificationEmailValidation, userController.sendForgotPassword);
router.post('/verifyForgotPassword', userValidation.verifyForgotEmailValidation, userController.verifyForgotPassword);

// Protect the routes below with the authenticate middleware
router.use(authenticate);
// GET ROUTES
router.get('/profile', userController.getProfile);

export default router;
