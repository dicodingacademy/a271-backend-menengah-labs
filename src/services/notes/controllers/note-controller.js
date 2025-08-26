import NoteRepositories from '../repositories/index.js';
import response from '../../../utils/response.js';

export const createNote = async (req, res, next) => {
  try {
    const {
      title,
      body,
      tags
    } = req.validated;

    const note = await NoteRepositories.createNote({
      title,
      body,
      tags
    });

    return response(res, 201, 'Catatan sukses ditambahkan', note);
  } catch (error) {
    return next(error);
  }
};

export const getNotes = async (req, res, next) => {
  try {
    const notes = await NoteRepositories.getNotes();
    return response(res, 200, 'Catatan sukses ditampilkan', notes);
  } catch (error) {
    return next(error);
  }
};

export const getNoteById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const note = await NoteRepositories.getNoteById(id);
    return response(res, 200, 'Catatan sukses ditampilkan', note);
  } catch (error) {
    return next(error);
  }
};

export const editNote = async (req, res, next) => {
  try {
    const { id } = req.params;

    const {
      title,
      body,
      tags
    } = req.validated;

    const note = await NoteRepositories.editNote({
      id,
      title,
      body,
      tags
    });

    return response(res, 200, 'Catatan berhasil diperbarui', note);
  } catch (error) {
    return next(error);
  }
};

export const deleteNote = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedNote = await NoteRepositories.deleteNote(id);

    return response(res, 200, 'Catatan berhasil dihapus', deletedNote);
  } catch (error) {
    return next(error);
  }
};