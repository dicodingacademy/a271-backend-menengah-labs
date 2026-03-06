import CollaborationRepositories from '../repositories/collaboration-repositories.js';
import NoteRepositories from '../../notes/repositories/note-repositories.js';
import response from '../../../utils/response.js';
import InvariantError from '../../../exceptions/invariant-error.js';
import AuthorizationError from '../../../exceptions/authorization-error.js';

export const addCollaboration = async (req, res, next) => {
  const { id: credentialId } = req.user;
  const { noteId, userId } = req.validated;

  const isOwner = await NoteRepositories.verifyNoteOwner(noteId, credentialId);
  if (!isOwner) {
    return next(new AuthorizationError('Anda tidak berhak mengakses resource ini'));
  }

  const collaboration = await CollaborationRepositories.addCollaboration(noteId, userId);
  if (!collaboration) {
    return next(new InvariantError('Kolaborasi gagal ditambahkan'));
  }

  return response(res, 201, 'Kolaborasi berhasil ditambahkan', collaboration);
};

export const deleteCollaboration = async (req, res, next) => {
  const { noteId, userId } = req.validated;
  const { id: credentialId } = req.user;

  const isOwner = await NoteRepositories.verifyNoteOwner(noteId, credentialId);
  if (!isOwner) {
    return next(new AuthorizationError('Anda tidak berhak mengakses resource ini'));
  }

  await CollaborationRepositories.deleteCollaboration(noteId, userId);

  return response(res, 200, 'Kolaborasi berhasil dihapus', '');
};
