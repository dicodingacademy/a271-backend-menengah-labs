import { Pool } from 'pg';
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

    return result.rows[0];
  }

  async verifyNewUsername(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    return result.rows.length > 0;
  }
  async getUsers() {
    const result = await this._pool.query('SELECT * FROM users');

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
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    const query = {
      text: 'UPDATE users SET username = COALESCE($1, username), password = COALESCE($2, password), fullname = COALESCE($3, fullname), updated_at = $5 WHERE id = $6 RETURNING id, username, fullname, email, created_at, updated_at',
      values: [username, hashedPassword, fullname, updatedAt, id],
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

  async getUserByUsername(username) {
    const query = {
      text: 'SELECT id, username, fullname FROM users WHERE username LIKE $1',
      values: [`%${username}%`],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async verifyUserCredential(username, password) {
    const query = {
      text: 'SELECT id, password FROM users WHERE username = $1',
      values: [username],
    };

    const user = await this._pool.query(query);

    if (!user) {
      return null;
    }

    const { id, password: hashedPassword } = user.rows[0];

    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      return null;
    }

    return id;
  }
}

export default new UserRepositories();
