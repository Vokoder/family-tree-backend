import type { Request, Response } from 'express';
import { getTypesOfRelationsService } from './types-of-relations.service.ts';

export const getTypesOfRelationsController = async (req: Request, res: Response): Promise<void> => {
  const typesOfRelations = await getTypesOfRelationsService();
  res.json(typesOfRelations);
};
