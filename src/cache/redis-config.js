import { createClient } from 'redis';

class CacheService {
  constructor() {
    this._client = createClient({
      socket: {
        host: process.env.REDIS_SERVER,
      },
    });

    this._client.on('error', (error) => {
      console.error(error);
    });

    // Perhatikan: connect() mengembalikan Promise. Kamu bisa await di pemanggilnya.
    this._client.connect();
  }

  async set(key, value, expirationInSecond = 3600) {
    await this._client.set(key, value, {
      EX: expirationInSecond,
    });
  }

  async get(key) {
    const result = await this._client.get(key);
    if (result === null) throw new Error('Cache tidak ditemukan');
    return result;
  }

  async delete(key) {
    return await this._client.del(key);
  }
}

export default CacheService;