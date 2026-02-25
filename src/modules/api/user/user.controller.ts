import { HttpError } from "#utils/http-error.utils.ts"
import type { Request, Response } from "express"
import { deleteUserService, getUserService, updateUserService } from "./user.service.ts"
import type { JwtAccessTokenPayload } from "#shared/types/jwt.type.ts"
import { EMPTY_REQUEST_BODY, MISSING_QUERY_PARAMETERS } from "#constants/errors.constants.ts"

export const getMyUserController = async (req: Request, res: Response): Promise<void> => {
  const jwtPayload: JwtAccessTokenPayload = res.locals.user;
  const user = await getUserService(jwtPayload.uid);
  res.json(user);
}

export const getUserController = async (req: Request, res: Response): Promise<void> => {
  const uid = req.params.uid;
  if (typeof uid !== 'string') {
    throw new HttpError(400, MISSING_QUERY_PARAMETERS);
  }

  const user = await getUserService(uid);
  res.json(user);
}

export const updateUserController = async (req: Request, res: Response): Promise<void> => {
  const jwtPayload: JwtAccessTokenPayload = res.locals.user;
  const { body: { uid, password, personId } = {} } = req;
  if (!password && !personId) {
    throw new HttpError(400, `${EMPTY_REQUEST_BODY} password or personId`);
  }

  const user = await updateUserService(jwtPayload, uid ?? jwtPayload.uid, password, personId);
  res.json(user);
}

export const deleteUserController = async (req: Request, res: Response): Promise<void> => {
  const jwtPayload: JwtAccessTokenPayload = res.locals.user;
  const { body: { uid } = {} } = req;
  await deleteUserService(jwtPayload, uid ?? jwtPayload.uid);
  res.status(200).send();
}
