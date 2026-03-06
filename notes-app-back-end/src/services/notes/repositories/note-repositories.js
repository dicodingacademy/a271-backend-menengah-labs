import { Pool } from 'pg';
import { nanoid } from 'nanoid';
import CacheService from '../../../cache/redis-config.js';

class NoteRepositories {
  constructor() {
    this.pool = new Pool();
    this.cacheService = new CacheService();
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

    // Clear cache after creating note
    await this.cacheService.delete(`notes:${owner}`);

    return result.rows[0];
  }

  async getNotes(owner) {
    const cacheKey = `notes:${owner}`;

    try {
      const notes = await this.cacheService.get(cacheKey);
      return JSON.parse(notes);
    } catch (error) {
      // Cache miss, get from database
      const query = {
        text: `SELECT notes.* FROM notes
        LEFT JOIN collaborations ON collaborations.note_id = notes.id
        WHERE notes.owner = $1 OR collaborations.user_id = $1
        GROUP BY notes.id`,
        values: [owner],
      };

      const result = await this.pool.query(query);

      // Save to cache
      await this.cacheService.set(cacheKey, JSON.stringify(result.rows));

      return result.rows;
    }
  }

  async getNoteById(id) {
    const query = {
      text: `SELECT notes.*, users.username
    FROM notes
    LEFT JOIN users ON users.id = notes.owner
    WHERE notes.id = $1`,
      values: [id],
    };

    const result = await this.pool.query(query);

    return result.rows[0];
  }

  async editNote({ id, title, body, tags }) {
    const updatedAt = new Date().toISOString();

    const query = {
      text: 'UPDATE notes SET title = $1, body = $2, tags = $3, updated_at = $4 WHERE id = $5 RETURNING id, owner',
      values: [title, body, tags, updatedAt, id],
    };

    const result = await this.pool.query(query);

    const owner = result.rows[0].owner;
    if (result.rows[0]) {
      await this.cacheService.delete(`notes:${owner}`);
    }

    return result.rows[0];
  }

  async deleteNote(id) {
    const query = {
      text: 'DELETE FROM notes WHERE id = $1 RETURNING id, owner',
      values: [id],
    };

    const result = await this.pool.query(query);

    const owner = result.rows[0].owner;

    if (result.rows[0]) {
      await this.cacheService.delete(`notes:${owner}`);
    }

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
      text: 'SELECT 1 FROM collaborations WHERE note_id = $1 AND user_id = $2',
      values: [noteId, userId],
    };

    const result =  await this.pool.query(query);

    if (result.rowCount > 0) {
      return true;
    }

    return false;
  }
}

export default new NoteRepositories();