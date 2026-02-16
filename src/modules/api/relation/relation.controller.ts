import { HttpError } from "#utils/http-error.utils.ts";
import type { Request, Response } from "express";

export const getRelationController = async (req: Request, res: Response): Promise<void> => {
  throw new HttpError(501, 'not yet implemented');
}

export const updateRelationController = async (req: Request, res: Response): Promise<void> => {
  throw new HttpError(501, 'not yet implemented');
}

export const createRelationController = async (req: Request, res: Response): Promise<void> => {
  throw new HttpError(501, 'not yet implemented');
}

export const deleteRelationController = async (req: Request, res: Response): Promise<void> => {
  throw new HttpError(501, 'not yet implemented');
}
