import env from 'env-var';
import type { ServiceAccount } from 'firebase-admin';

export const PORT: number = env.get('PORT').required().asIntPositive();
export const CORS_ORIGIN: string = env.get('CORS_ORIGIN').required().asString();
export const MODE: string = env.get('MODE').required().asString();

export const FRONT_ADRESS: string = env.get('FRONT_ADRESS').required().asString();

export const QUERIES_CACHE_TIME_SEC: number = env.get('QUERIES_CACHE_TIME_SEC').required().asIntPositive();

export const JWT_SECRET: string = env.get('JWT_SECRET').required().asString();
export const ACCESS_TOKEN_EXPIRES_IN: number = env.get('ACCESS_TOKEN_EXPIRES_IN').required().asIntPositive();
export const REFRESH_TOKEN_EXPIRES_IN: number = env.get('REFRESH_TOKEN_EXPIRES_IN').required().asIntPositive();

export const FIREBASE_SERVICE_ACCOUNT: ServiceAccount = {
  projectId: env.get('FIREBASE_PROJECT_ID').required().asString(),
  privateKey: env.get('FIREBASE_PRIVATE_KEY').required().asString(),
  clientEmail: env.get('FIREBASE_CLIENT_EMAIL').required().asString(),
};

export const USER_DEFAULT_ROLE: string = env.get('USER_DEFAULT_ROLE').required().asString();
export const USER_ADMIN_ROLE: string = env.get('USER_ADMIN_ROLE').required().asString();
