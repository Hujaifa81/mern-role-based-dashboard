import jwt, { SignOptions } from 'jsonwebtoken';
import { IJwtPayload } from '../interfaces';

export const generateToken = (
  payload: IJwtPayload,
  secret: string,
  expiresIn: string
) => {
  const token = jwt.sign(payload, secret, {
    algorithm: 'HS256',
    expiresIn,
  } as SignOptions);

  return token;
};

export const verifyToken = (token: string, secret: string) => {
  const verifiedToken = jwt.verify(token, secret);

  return verifiedToken as IJwtPayload;
};
