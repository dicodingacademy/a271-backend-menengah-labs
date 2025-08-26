import pkg from 'pg';
const { Pool } = pkg;
import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt';

class UserRepositories {
  constructor() {
    this._pool = new Pool();
  }

  async createUser({ username, password, fullname }) {
    const id = nanoid(16);
    const hashedPassword = await bcrypt.hash(password, 10);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, username, hashedPassword, fullname, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    return result.rows[0].id;
  }

  async verifyNewUsername(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async getUsers() {
    const query = {
      text: 'SELECT * FROM users',
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async getUserById(id) {
    const query = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async editUser({ id, username, password, fullname }) {
    const updatedAt = new Date().toISOString();

    const query = {
      text: 'UPDATE users SET username = $1, password = $2, fullname = $3, updated_at = $4 WHERE id = $5 RETURNING id, username, fullname, created_at, updated_at',
      values: [username, password, fullname, updatedAt, id],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async deleteUser(id) {
    const query = {
      text: 'DELETE FROM users WHERE id = $1 RETURNING id, username, fullname, created_at, updated_at',
      values: [id],
    };

    const result = await this._pool.query(query);

    return result.rows[0].id;
  }
}

export default new UserRepositories();
