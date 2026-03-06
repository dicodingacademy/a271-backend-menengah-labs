import { nanoid } from 'nanoid';
import notes from '../src/notes.js';

export const createNote = (req, res, next) => {
  try {
    const { title = 'untitled', tags, body } = req.body;
    const id = nanoid(16);
    const ts = new Date().toISOString();

    const newNote = { title, tags, body, id, createdAt: ts, updatedAt: ts };
    notes.push(newNote);

    const isSuccess = notes.some((n) => n.id === id);
    if (isSuccess) {
      return res.status(201).json({
        status: 'success',
        message: 'Catatan berhasil ditambahkan',
        data: { noteId: id }
      });
    }

    return res.status(500).json({
      status: 'fail',
      message: 'Catatan gagal ditambahkan'
    });
  } catch (err) {
    next(err);
  }
};

export const getNotes = (req, res) => {
  return res.json({
    status: 'success',
    data: { notes }
  });
};

export const getNoteById = (req, res) => {
  const { id } = req.params;
  const note = notes.find((n) => n.id === id);

  if (note) {
    return res.json({
      status: 'success',
      data: { note }
    });
  }

  return res.status(404).json({
    status: 'fail',
    message: 'Catatan tidak ditemukan'
  });
};

export const editNoteById = (req, res) => {
  const { id } = req.params;
  const { title, tags, body } = req.body;
  const updatedAt = new Date().toISOString();

  const idx = notes.findIndex((n) => n.id === id);
  if (idx !== -1) {
    notes[idx] = { ...notes[idx], title, tags, body, updatedAt };
    return res.json({
      status: 'success',
      message: 'Catatan berhasil diperbarui'
    });
  }

  return res.status(404).json({
    status: 'fail',
    message: 'Gagal memperbarui catatan. Id tidak ditemukan'
  });
};

export const deleteNoteById = (req, res) => {
  const { id } = req.params;
  const idx = notes.findIndex((n) => n.id === id);

  if (idx !== -1) {
    notes.splice(idx, 1);
    return res.json({
      status: 'success',
      message: 'Catatan berhasil dihapus'
    });
  }

  return res.status(404).json({
    status: 'fail',
    message: 'Catatan gagal dihapus. Id tidak ditemukan'
  });
};
