import { HttpError } from "#utils/http-error.utils.ts"
import type { Request, Response } from "express"

export const getProfileController = async (req: Request, res: Response): Promise<void> => {
  throw new HttpError(501, 'not yet implemented')
}

export const updateProfileController = async (req: Request, res: Response): Promise<void> => {
  throw new HttpError(501, 'not yet implemented')
}

export const deleteProfileController = async (req: Request, res: Response): Promise<void> => {
  throw new HttpError(501, 'not yet implemented')
}
