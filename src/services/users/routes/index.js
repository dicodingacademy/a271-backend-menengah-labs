import { Router } from 'express';
import { createUser, getUsers, getUserById, editUser, deleteUser } from '../controllers/user-controller.js';
import validate from '../../../middlewares/validate.js';
import authenticateToken from '../../../middlewares/auth.js';
import { userPayloadSchema, userUpdatePayloadSchema } from '../../../services/users/validator/schema.js';

const router = Router();

// Public route - Register user
router.post('/', validate(userPayloadSchema), createUser);

// Protected routes - Require authentication
router.get('/', authenticateToken, getUsers);
router.get('/:id', authenticateToken, getUserById);
router.put('/:id', authenticateToken, validate(userUpdatePayloadSchema), editUser);
router.delete('/:id', authenticateToken, deleteUser);

export default router;
