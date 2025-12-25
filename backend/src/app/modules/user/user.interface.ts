export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum Status {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role?: Role;
  status?: Status;
  isVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
