import { Router } from 'express';
import { createNote, getNotes, getNoteById, editNote, deleteNote } from '../controllers/note-controller.js';
import validate from '../../../middlewares/validate.js';
import authenticateToken from '../../../middlewares/auth.js';
import { notePayloadSchema } from '../../../services/notes/validator/schema.js';

const router = Router();

router.post('/', authenticateToken, validate(notePayloadSchema), createNote);
router.get('/', authenticateToken, getNotes);
router.get('/:id', authenticateToken, getNoteById);
router.put('/:id', authenticateToken, validate(notePayloadSchema), editNote);
router.delete('/:id', authenticateToken, deleteNote);

export default router;