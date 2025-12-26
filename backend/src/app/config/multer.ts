import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { cloudinaryUpload } from './cloudinary';
import { Request } from 'express';

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: {
    public_id: (
      _req: Request,
      file: Express.Multer.File
    ): string | Promise<string> => {
      const extension = file.originalname.split('.').pop() || '';

      const nameWithoutExt = file.originalname
        .replace(`.${extension}`, '')
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

      const uniqueFileName = `${Math.random().toString(36).substring(2)}-${Date.now()}-${nameWithoutExt}`;

      return extension ? `${uniqueFileName}.${extension}` : uniqueFileName;
    },
  },
});

export const multerUpload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    const allowedMimes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          'Invalid file type. Only JPEG, PNG, GIF and WebP are allowed.'
        )
      );
    }
  },
});
