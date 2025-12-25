import { ZodError, ZodIssue } from 'zod';
import {
  TErrorSources,
  TGenericErrorResponse,
} from '../interfaces/error.types';
import httpStatusCodes from 'http-status-codes';

export const handleZodError = (err: ZodError): TGenericErrorResponse => {
  const errorSources: TErrorSources[] = [];

  err.issues.forEach((issue: ZodIssue) => {
    errorSources.push({
      path: issue.path[issue.path.length - 1],
      message: issue.message,
    });
  });

  return {
    statusCode: httpStatusCodes.BAD_REQUEST,
    message: 'Zod Error',
    errorSources,
  };
};
