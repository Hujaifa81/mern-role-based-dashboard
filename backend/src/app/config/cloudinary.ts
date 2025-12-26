import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { envVars } from './envVars';
import httpStatus from 'http-status-codes';
import { AppError } from '../errorHelpers.ts';

cloudinary.config({
  cloud_name: envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
  api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
  api_secret: envVars.CLOUDINARY.CLOUDINARY_API_SECRET,
});

export const uploadBufferToCloudinary = async (
  buffer: Buffer,
  fileName: string
): Promise<UploadApiResponse | undefined> => {
  try {
    return new Promise((resolve, reject) => {
      const public_id = `${fileName}-${Date.now()}`;

      cloudinary.uploader
        .upload_stream(
          {
            resource_type: 'auto',
            public_id: public_id,
            folder: 'uploads',
          },
          (error, result) => {
            if (error) {
              return reject(error);
            }
            resolve(result);
          }
        )
        .end(buffer);
    });
  } catch (error: any) {
    console.error('Cloudinary upload error:', error);
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Error uploading file: ${error.message}`
    );
  }
};

export const deleteImageFromCloudinary = async (url: string): Promise<void> => {
  try {
    const regex = /\/v\d+\/(.*?)\.(jpg|jpeg|png|gif|webp)$/i;

    const match = url.match(regex);

    if (match && match[1]) {
      const public_id = match[1];
      await cloudinary.uploader.destroy(public_id);
      console.log(`File ${public_id} deleted from Cloudinary`);
    } else {
      console.warn('Could not extract public_id from URL:', url);
    }
  } catch (error: any) {
    console.error('Cloudinary deletion error:', error);
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Cloudinary image deletion failed: ${error.message}`
    );
  }
};

export const cloudinaryUpload = cloudinary;
