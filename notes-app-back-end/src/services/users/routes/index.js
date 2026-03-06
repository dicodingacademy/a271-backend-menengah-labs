import { Router } from 'express';
import { createUser, getUsers, getUserById, editUser, deleteUser } from '../controllers/user-controller.js';
import validate from '../../../middlewares/validate.js';
import { userPayloadSchema, userUpdatePayloadSchema } from '../../../services/users/validator/schema.js';

const router = Router();

// Public route - Register user
router.post('/', validate(userPayloadSchema), createUser);

// Protected routes - Require authentication
router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', validate(userUpdatePayloadSchema), editUser);
router.delete('/:id', deleteUser);

export default router;
