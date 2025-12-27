export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum Status {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export interface IAuthProvider {
  provider: 'google' | 'credentials'; // "Google", "Credential"
  providerId: string;
}

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  role?: Role;
  picture?: string;
  status?: Status;
  auths: IAuthProvider[];
  isVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
