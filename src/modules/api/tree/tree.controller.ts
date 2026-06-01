import { MISSING_QUERY_PARAMETERS } from '#constants/errors.constants.ts';
import { HttpError } from '#utils/http-error.utils.ts';
import type { Request, Response } from 'express';
import { getTreeService } from './tree.service.ts';
import { getCache, sendCachedResponse, setCache } from '#utils/cache.utils.ts';
import type { JwtAccessTokenPayload } from '#shared/types/jwt.type.ts';

export const getTreeController = async (req: Request, res: Response): Promise<void> => {
  const jwtPayload: JwtAccessTokenPayload = res.locals.user;
  const uid = jwtPayload.uid;
  const cache = getCache(req, uid);
  if (cache) {
    sendCachedResponse(res, cache);
    return;
  }

  const personId = req.params.personId;
  if (typeof personId !== 'string') {
    throw new HttpError(400, MISSING_QUERY_PARAMETERS);
  }

  const treeData = await getTreeService(personId);
  res.json(treeData);
  setCache(req, uid, treeData, 'json');
};
