import mongoose from 'mongoose';
import { ZodError } from 'zod';
import { AppError } from '../errorHelpers.ts';

export interface TErrorSources {
  path: string | number;
  message: string;
}

export interface TGenericErrorResponse {
  statusCode: number;
  message: string;
  errorSources?: TErrorSources[];
}

export interface MongoError extends Error {
  code?: number;
  keyValue?: Record<string, unknown>;
}

export type ErrorType =
  | ZodError
  | mongoose.Error.ValidationError
  | mongoose.Error.CastError
  | MongoError
  | AppError
  | Error;
