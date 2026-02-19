import type { Timestamp } from "firebase-admin/firestore";

export interface RefreshToken {
  uid: string;
  token: string;
  createdAt: Timestamp;
  expiresAt: Timestamp;
}