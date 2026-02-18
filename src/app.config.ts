import env from 'env-var'
import type { ServiceAccount } from 'firebase-admin';

export const PORT: number = env.get('PORT').required().asIntPositive();
export const CORS_ORIGIN: string = env.get('CORS_ORIGIN').required().asString();

export const FRONT_ADRESS: string = env.get('FRONT_ADRESS').required().asString();

export const QUERIES_CACHE_TIME_SEC: number = env.get('QUERIES_CACHE_TIME_SEC').required().asIntPositive();

export const JWT_SECRET: string = env.get('JWT_SECRET').required().asString();

export const FIREBASE_SERVICE_ACCOUNT: ServiceAccount = {
  projectId: env.get('FIREBASE_PROJECT_ID').required().asString(),
  privateKey: env.get('FIREBASE_PRIVATE_KEY').required().asString(),
  clientEmail: env.get('FIREBASE_CLIENT_EMAIL').required().asString(),
};