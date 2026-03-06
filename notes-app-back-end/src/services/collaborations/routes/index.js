import { Router } from 'express';
import { addCollaboration, deleteCollaboration } from '../controllers/collaboration-controller.js';
import validate from '../../../middlewares/validate.js';
import authenticateToken from '../../../middlewares/auth.js';
import { collaborationPayloadSchema } from '../validator/schema.js';

const router = Router();

router.post('/', authenticateToken, validate(collaborationPayloadSchema), addCollaboration);
router.delete('/', authenticateToken, validate(collaborationPayloadSchema), deleteCollaboration);

export default router;
