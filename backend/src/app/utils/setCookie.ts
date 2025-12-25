import { Response } from 'express';
import { envVars } from '../config';

export interface ITokenInfo {
  accessToken?: string;
  refreshToken?: string;
}

export const setCookie = (res: Response, tokenInfo: ITokenInfo) => {
  const cookieOptions = {
    httpOnly: true,
    secure: envVars.NODE_ENV === 'production',
    sameSite: envVars.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
  } as const;

  if (tokenInfo.accessToken) {
    res.cookie('accessToken', tokenInfo.accessToken, {
      ...cookieOptions,
      maxAge: Number(envVars.JWT_ACCESS_EXPIRES),
    });
  }

  if (tokenInfo.refreshToken) {
    res.cookie('refreshToken', tokenInfo.refreshToken, {
      ...cookieOptions,
      maxAge: Number(envVars.JWT_REFRESH_EXPIRES),
    });
  }
};
