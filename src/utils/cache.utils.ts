import NodeCache from 'node-cache';
import type { Request, Response } from 'express';
import { QUERIES_CACHE_TIME_SEC } from '#app.config.ts';

export const cache = new NodeCache({
  stdTTL: 0,
  checkperiod: 60,
});

export const clearUserCache = (uid: string) => {
  const allKeys = cache.keys();
  const keysToDelete = allKeys.filter((key) => key.startsWith(uid));
  if (keysToDelete.length > 0) {
    cache.del(keysToDelete);
  }
};

interface CacheEntry {
  body: Parameters<Response['send']>[0];
  status: number;
  method: 'send' | 'json';
}

const buildCacheKey = (req: Request, uid: string): string => {
  const sortedQuery = Object.entries(req.query).sort();
  const key = `${uid}|${req.originalUrl}|${JSON.stringify(sortedQuery)}`;
  return key;
};

export const getCache = (req: Request, uid: string): CacheEntry | undefined => {
  if (req.method !== 'GET') return undefined;
  const key = buildCacheKey(req, uid);
  return cache.get<CacheEntry>(key);
};

export const setCache = (
  req: Request,
  uid: string,
  body: Parameters<Response['send']>[0],
  method: 'send' | 'json' = 'json',
  ttlSeconds: number = QUERIES_CACHE_TIME_SEC,
  status: number = 200,
): void => {
  if (req.method !== 'GET') return;
  const key = buildCacheKey(req, uid);
  cache.set(key, { body, status, method }, ttlSeconds);
};

export const sendCachedResponse = (res: Response, cache: CacheEntry): void => {
  res.status(cache.status);
  if (cache.method === 'json') res.json(cache.body);
  else if (cache.method === 'send') res.send(cache.body);
};
