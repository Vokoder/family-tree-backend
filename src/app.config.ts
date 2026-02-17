import env from 'env-var'

export const PORT: number = env.get('PORT').required().asIntPositive();
export const CORS_ORIGIN: string = env.get('CORS_ORIGIN').required().asString();

export const FRONT_ADRESS: string = env.get('FRONT_ADRESS').required().asString();

export const QUERIES_CACHE_TIME_SEC: number = env.get('QUERIES_CACHE_TIME_SEC').required().asIntPositive();

export const JWT_SECRET: string = env.get('JWT_SECRET').required().asString();