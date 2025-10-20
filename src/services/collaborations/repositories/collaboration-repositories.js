import { Pool } from 'pg';
import { nanoid } from 'nanoid';
import CacheService from '../../../cache/redis-config.js';

class CollaborationRepositories {
  constructor() {
    this.pool = new Pool();
    this.cacheService = new CacheService();
  }

  async addCollaboration(noteId, userId) {
    const id = nanoid(16);

    const query = {
      text: 'INSERT INTO collaborations(id, note_id, user_id) VALUES($1, $2, $3) RETURNING id',
      values: [id, noteId, userId],
    };

    const result = await this.pool.query(query);

    await this.cacheService.delete(`notes:${userId}`);
    return result.rows[0].id;
  }

  async deleteCollaboration(noteId, userId) {
    const query = {
      text: 'DELETE FROM collaborations WHERE note_id = $1 AND user_id = $2 RETURNING id',
      values: [noteId, userId],
    };

    const result = await this.pool.query(query);

    await this.cacheService.delete(`notes:${userId}`);

    return result.rows[0];
  }

  async verifyCollaborator(noteId, userId) {
    const query = {
      text: 'SELECT * FROM collaborations WHERE note_id = $1 AND user_id = $2',
      values: [noteId, userId],
    };

    const result = await this.pool.query(query);
    return result.rows.length > 0;
  }
}

export default new CollaborationRepositories();
