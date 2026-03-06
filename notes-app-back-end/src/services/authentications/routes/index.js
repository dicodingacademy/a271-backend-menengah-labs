import { Router } from 'express';
import { login, refreshToken, logout } from '../controllers/authentication-controller.js';
import validate from '../../../middlewares/validate.js';
import {
  postAuthenticationPayloadSchema,
  putAuthenticationPayloadSchema,
  deleteAuthenticationPayloadSchema,
} from '../validator/schema.js';

const router = Router();

router.post('/', validate(postAuthenticationPayloadSchema), login);
router.put('/', validate(putAuthenticationPayloadSchema), refreshToken);
router.delete('/', validate(deleteAuthenticationPayloadSchema), logout);

export default router;
