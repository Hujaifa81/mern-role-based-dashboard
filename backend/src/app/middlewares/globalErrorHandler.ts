import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import mongoose from 'mongoose';
import {
  ErrorType,
  MongoError,
  TErrorSources,
} from '../interfaces/error.types';
import { deleteImageFromCloudinary, envVars } from '../config';
import {
  handleCastError,
  handleDuplicateError,
  handleValidationError,
  handleZodError,
} from '../helpers';
import { AppError } from '../errorHelpers.ts';
import httpStatusCodes from 'http-status-codes';

export const globalErrorHandler = async (
  err: ErrorType,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (envVars.NODE_ENV === 'development') {
    console.log(err);
  }

  if (req.file) {
    await deleteImageFromCloudinary(req.file.path);
  }

  if (req.files && Array.isArray(req.files) && req.files.length) {
    const imageUrls = (req.files as Express.Multer.File[]).map(
      (file) => file.path
    );

    await Promise.all(imageUrls.map((url) => deleteImageFromCloudinary(url)));
  }

  let errorSources: TErrorSources[] = [];
  let statusCode = httpStatusCodes.INTERNAL_SERVER_ERROR;
  let message = 'Something Went Wrong!!';

  //Duplicate error
  if ('code' in err && err.code === 11000) {
    const simplifiedError = handleDuplicateError(err as MongoError);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  }
  // Object ID error / Cast Error
  else if (err.name === 'CastError') {
    const simplifiedError = handleCastError(err as mongoose.Error.CastError);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  } else if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources as TErrorSources[];
  }
  //Mongoose Validation Error
  else if (err.name === 'ValidationError') {
    const simplifiedError = handleValidationError(
      err as mongoose.Error.ValidationError
    );
    statusCode = simplifiedError.statusCode;
    errorSources = simplifiedError.errorSources as TErrorSources[];
    message = simplifiedError.message;
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    statusCode = httpStatusCodes.INTERNAL_SERVER_ERROR;
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    err: envVars.NODE_ENV === 'development' ? err : null,
    stack: envVars.NODE_ENV === 'development' ? err.stack : null,
  });
};
