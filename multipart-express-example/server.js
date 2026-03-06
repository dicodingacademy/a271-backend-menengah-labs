import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDirectory = path.resolve(__dirname, 'uploads');
if (!fs.existsSync(uploadsDirectory)) {
  fs.mkdirSync(uploadsDirectory, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDirectory);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 500000,
  },
});

const app = express();

app.post('/uploads', upload.single('data'), (req, res) => {
  console.log(req.file);

  if (!req.file) {
    return res.status(400).json({ message: 'Berkas gagal diproses' });
  }

  return res.json({ message: `Berkas ${req.file.originalname} berhasil diproses!` });
});

app.use((err, req, res, next) => {
  if (err) {
    console.error(err);
    return res.status(400).json({ message: 'Berkas gagal diproses' });
  }

  return next();
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server start at http://localhost:${port}`);
});
