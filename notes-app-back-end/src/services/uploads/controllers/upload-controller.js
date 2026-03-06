import ClientError from '../../../exceptions/client-error.js';
import response from '../../../utils/response.js';
import storageService from '../storage/storage-service.js';

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
