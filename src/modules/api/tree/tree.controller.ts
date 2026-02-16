import { HttpError } from "#utils/http-error.utils.ts";
import type { Request, Response } from "express";

export const getTree = async (req: Request, res: Response): Promise<void> => {
  throw new HttpError(501, 'not yet implemented');
}
