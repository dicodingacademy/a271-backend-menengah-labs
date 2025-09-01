import fs from 'fs';
import path from 'path';
import multer from 'multer';
import ClientError from '../../../exceptions/client-error.js';

export const UPLOAD_FOLDER = path.resolve('uploads/file/images');
if (!fs.existsSync(UPLOAD_FOLDER)) {
  fs.mkdirSync(UPLOAD_FOLDER, { recursive: true });
}

const storage = multer.memoryStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_FOLDER),
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype && file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new ClientError('Only image files are allowed'), false);
  }
});

export default { UPLOAD_FOLDER, storage, upload };