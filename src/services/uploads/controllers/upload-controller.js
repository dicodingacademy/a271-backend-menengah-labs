import path from 'path';
import ClientError from '../../../exceptions/client-error.js';
import response from '../../../utils/response.js';
import { UPLOAD_FOLDER } from '../storage/storage-config.js';

export const uploadImages = async (req, res, next) => {
  if (!req.file) {
    return next(new ClientError('No file uploaded'));
  }

  const host = process.env.HOST || 'localhost';
  const port = process.env.PORT || 3000;
  const encodedFilename = encodeURIComponent(req.file.filename);
  const fileLocation = `http://${host}:${port}/upload/${encodedFilename}`;

  return response(res, 201, 'success', { fileLocation });
};

export const getImage = async (req, res) => {
  const filename = decodeURIComponent(req.params.filename);
  const imagePath = path.resolve(UPLOAD_FOLDER, filename);
  return response(res, 200, 'success', imagePath);
};
