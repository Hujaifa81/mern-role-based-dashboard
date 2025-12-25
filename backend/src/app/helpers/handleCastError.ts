/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose from 'mongoose';
import { TGenericErrorResponse } from '../interfaces/error.types';
import httpStatusCodes from 'http-status-codes';

export const handleCastError = (
  err: mongoose.Error.CastError
): TGenericErrorResponse => {
  return {
    statusCode: httpStatusCodes.BAD_REQUEST,
    message: 'Invalid MongoDB ObjectID. Please provide a valid id',
  };
};
