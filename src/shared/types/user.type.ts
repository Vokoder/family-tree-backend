import type { Timestamp } from 'firebase-admin/firestore';

export interface User {
  id: string;
  login: string;
  password: string;
  personId?: string;
  roleId: string;
  active: boolean;
  createdAt: Date;
}

export interface FirebaseUser {
  login: string;
  password: string;
  personId?: string;
  roleId: string;
  active: boolean;
  createdAt: Timestamp;
}

export interface UserDto {
  id?: string;
  login: string;
  personId?: string;
  roleId: string;
  createdAt: Date;
}
