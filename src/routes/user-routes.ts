import { Router } from 'express';
import * as userController from '../services/user/user.controller';
import authMiddleware from '../middlewares/auth-middleware';

const router = Router();

router.post('/register', userController.register);
router.post('/login', userController.login);

// Rute yang memerlukan otentikasi
router.get('/balance', authMiddleware, userController.getBalance);
router.post('/top-up', authMiddleware, userController.topUp);
router.post('/transaction', authMiddleware, userController.createTransaction);


// Rute baru untuk mendapatkan pengguna berdasarkan ID
router.get('/:id', authMiddleware, userController.getUserById);

// Rute baru untuk memperbarui data pengguna
router.patch('/:id', authMiddleware, userController.updateUser);


export default router;
