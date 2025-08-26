import { Router } from 'express';
import notes from '../services/notes/routes/index.js';

const router = Router();

router.use('/notes', notes);

export default router;