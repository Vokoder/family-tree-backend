import env from 'env-var'

export const PORT: number = env.get('PORT').required().asIntPositive();
export const CORS_ORIGIN: string = env.get('CORS_ORIGIN').required().asString();

export const FRONT_ADRESS: string = env.get('FRONT_ADRESS').required().asString();