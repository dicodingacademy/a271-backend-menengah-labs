import { Router } from 'express';
import { createNote, getNotes, getNoteById, editNote, deleteNote } from '../controllers/note-controller.js';
import validate from '../../../middlewares/validate.js';
import { notePayloadSchema } from '../../../services/notes/validator/schema.js';

const router = Router();

router.post('/', validate(notePayloadSchema), createNote);
router.get('/', getNotes);
router.get('/:id', getNoteById);
router.put('/:id', validate(notePayloadSchema), editNote);
router.delete('/:id', deleteNote);

export default router;