import { JwtPayload } from 'jsonwebtoken';
import { Role } from '../modules/user/user.interface';

export interface IJwtPayload extends JwtPayload {
  userId: string;
  email: string;
  role: Role;
}

declare global {
  namespace Express {
    interface Request {
      user: IJwtPayload;
    }
  }
}

export {};
