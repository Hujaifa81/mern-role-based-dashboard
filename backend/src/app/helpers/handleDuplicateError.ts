import { TGenericErrorResponse } from '../interfaces/error.types';
import httpStatusCodes from 'http-status-codes';

interface MongoError extends Error {
  code?: number;
  keyValue?: Record<string, unknown>;
}

export const handleDuplicateError = (
  err: MongoError
): TGenericErrorResponse => {
  const matchedArray = err.message.match(/"([^"]*)"/);

  return {
    statusCode: httpStatusCodes.CONFLICT,
    message: `${matchedArray?.[1]} already exists!!`,
  };
};
