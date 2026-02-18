import NodeCache from 'node-cache';
import type { Request, Response } from 'express';
import { QUERIES_CACHE_TIME_SEC } from '#app.config.ts';
import { getJWTPayload } from './jwt.utils.ts';

export const cache = new NodeCache({
  stdTTL: 0,
  checkperiod: 60,
});

export const clearUserCache = (user_id: string): void => {
  const allKeys = cache.keys();
  const keysToDelete = allKeys.filter((key) => key.startsWith(user_id));
  if (keysToDelete.length > 0) {
    cache.del(keysToDelete);
  }
};

export const deleteRequestCache = (req: Request): void => {
  const cacheKey = buildCacheKey(req);
  cache.del(cacheKey);
}

interface CacheEntry {
  body: Parameters<Response['send']>[0];
  status: number;
  method: 'send' | 'json';
}

const buildCacheKey = (req: Request): string => {
  const user_id = getJWTPayload(req)?.user_id;
  const sortedQuery = Object.entries(req.query).sort();
  const key = `${user_id}|${req.originalUrl}|${JSON.stringify(sortedQuery)}`;
  return key;
};

export const getCache = (req: Request): CacheEntry | undefined => {
  if (req.method !== 'GET') return undefined;
  const key = buildCacheKey(req);
  return cache.get<CacheEntry>(key);
};

export const setCache = (
  req: Request,
  body: Parameters<Response['send']>[0],
  method: 'send' | 'json' = 'json',
  ttlSeconds: number = QUERIES_CACHE_TIME_SEC,
  status: number = 200,
): void => {
  if (req.method !== 'GET') return;
  const key = buildCacheKey(req);
  cache.set(key, { body, status, method }, ttlSeconds);
};

export const sendCachedResponse = (res: Response, cache: CacheEntry): void => {
  res.status(cache.status);
  if (cache.method === 'json') res.json(cache.body);
  else if (cache.method === 'send') res.send(cache.body);
};
