import { Pool } from 'pg';
import { nanoid } from 'nanoid';

class NoteRepositories {
  constructor() {
    this.pool = new Pool();
  }

  async createNote({ title, body, tags, owner }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO notes(id, title, body, tags, created_at, updated_at, owner) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id, title, body, tags, created_at, updated_at',
      values: [id, title, body, tags, createdAt, updatedAt, owner],
    };

    const result = await this.pool.query(query);

    return result.rows[0];
  }

  async getNotes(owner) {
    const query = {
      text: 'SELECT * FROM notes WHERE owner = $1',
      values: [owner],
    };

    const result = await this.pool.query(query);

    return result.rows;
  }

  async getNoteById(id) {
    const query = {
      text: 'SELECT * FROM notes WHERE id = $1',
      values: [id],
    };

    const result = await this.pool.query(query);

    return result.rows[0];
  }

  async editNote({ id, title, body, tags }) {
    const updatedAt = new Date().toISOString();

    const query = {
      text: 'UPDATE notes SET title = $1, body = $2, tags = $3, updated_at = $4 WHERE id = $5 RETURNING id',
      values: [title, body, tags, updatedAt, id],
    };

    const result = await this.pool.query(query);

    return result.rows[0];
  }

  async deleteNote(id) {
    const query = {
      text: 'DELETE FROM notes WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this.pool.query(query);
    return result.rows[0].id;
  }

  async verifyNoteOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM notes WHERE id = $1',
      values: [id],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      return null;
    }

    const note = result.rows[0];

    if (note.owner !== owner) {
      return null;
    }

    return result.rows[0];
  }

  async verifyNoteAccess(noteId, userId) {
    const ownerResult = await this.verifyNoteOwner(noteId, userId);

    if (ownerResult) {
      return ownerResult;
    }

    const query = {
      text: 'SELECT * FROM collaborations WHERE note_id = $1 AND user_id = $2',
      values: [noteId, userId],
    };

    await this.pool.query(query);

    return false;
  }
}

export default new NoteRepositories();