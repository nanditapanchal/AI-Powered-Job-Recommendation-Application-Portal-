import express from 'express';
import { register, login, getProfile } from '../controllers/auth.controller.js';
import auth from "../middleware/auth.js";
import { forgotPassword, resetPassword, changePassword } from '../controllers/password.controller.js';

const router = express.Router();

// Registration & Login
router.post('/register', register);
router.post('/login', login);

// Profile
router.get("/profile", auth, getProfile);

// Password management
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/change-password', auth, changePassword);

export default router;
