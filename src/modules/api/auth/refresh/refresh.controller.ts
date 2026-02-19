import { HttpError } from "#utils/http-error.utils.ts";
import type { Request, Response } from "express"
import { refreshService } from "./refresh.service.ts";
import { NO_REFRESH_TOKEN } from "#constants/errors.constants.ts";

export const refreshController = async (req: Request, res: Response): Promise<void> => {
  const { body: { jwtRefreshToken } = {} } = req;
  if (!jwtRefreshToken) {
    throw new HttpError(500, NO_REFRESH_TOKEN);
  }

  const jwtOutput = await refreshService(jwtRefreshToken);
  res.json(jwtOutput);
}