import { MODE } from '#app.config.ts';
import pino, { type LoggerOptions } from 'pino';

const isProduction = MODE === 'production';

const config: LoggerOptions = {
  level: isProduction ? 'info' : 'debug',
};

export const logger = pino(config);
