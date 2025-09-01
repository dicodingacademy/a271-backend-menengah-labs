import ClientError from '../../../exceptions/client-error.js';
import response from '../../../utils/response.js';
import StorageService from '../storage/s3-service.js';
import path from 'path';

const storageService = new StorageService();

export const uploadImages = async (req, res, next) => {
  if (!req.file) {
    return next(new ClientError('No file uploaded'));
  }

  const filename = `${Date.now()}-${req.file.originalname}`;
  const fileLocation = await storageService.writeFile(req.file, {
    filename,
    contentType: req.file.mimetype,
  });

  return response(res, 201, 'success', { fileLocation });
};

export const getImage = async (req, res) => {
  const filename = decodeURIComponent(req.params.filename);
  const imagePath = path.resolve('', filename);
  return response(res, 200, 'success', imagePath);
};
