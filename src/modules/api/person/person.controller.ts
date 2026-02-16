import { HttpError } from "#utils/http-error.utils.ts"
import type { Request, Response } from "express"

export const getPersonController = async (req: Request, res: Response): Promise<void> => {
  throw new HttpError(501, 'not yet implemented');
}

export const updatePersonController = async (req: Request, res: Response): Promise<void> => {
  throw new HttpError(501, 'not yet implemented');
}

export const createPersonController = async (req: Request, res: Response): Promise<void> => {
  throw new HttpError(501, 'not yet implemented');
}

export const deletePersonController = async (req: Request, res: Response): Promise<void> => {
  throw new HttpError(501, 'not yet implemented');
}
