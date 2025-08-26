import { Router } from 'express';
import { createUser, getUsers, getUserById, editUser, deleteUser } from '../controllers/user-controller.js';
import validate from '../../../middlewares/validate.js';
import { userPayloadSchema, userUpdatePayloadSchema } from '../../../services/users/validator/schema.js';

const router = Router();

router.post('/', validate(userPayloadSchema), createUser);
router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', validate(userUpdatePayloadSchema), editUser);
router.delete('/:id', deleteUser);

export default router;
