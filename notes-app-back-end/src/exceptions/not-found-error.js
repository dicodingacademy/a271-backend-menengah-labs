import ClientError from '../exceptions/client-error.js';

class NotFoundError extends ClientError {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export default NotFoundError;
