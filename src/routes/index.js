import { Router } from 'express';
import notes from '../services/notes/routes/index.js';
import users from '../services/users/routes/index.js';
import authentications from '../services/authentications/routes/index.js';

const router = Router();

router.use('/notes', notes);
router.use('/users', users);
router.use('/authentications', authentications);

export default router;