import { EMPTY_REQUEST_BODY, MISSING_QUERY_PARAMETERS, MISSING_REQUIRED_REQUEST_BODY } from '#constants/errors.constants.ts';
import type { JwtAccessTokenPayload } from '#shared/types/jwt.type.ts';
import { HttpError } from '#utils/http-error.utils.ts';
import type { Request, Response } from 'express';
import {
  createRelationService,
  deleteRelationService,
  getRelationService,
  getRelationsService,
  updateRelationService,
} from './relation.service.ts';
import { relationRequiredFields } from '#shared/types/relation.type.ts';
import { relationFilterSchema } from '#shared/schemas/relation.schema.ts';

export const getRelationController = async (req: Request, res: Response): Promise<void> => {
  const relationId = req.params.relationId;
  if (typeof relationId !== 'string') {
    throw new HttpError(400, MISSING_QUERY_PARAMETERS);
  }

  const relation = await getRelationService(relationId);
  res.json(relation);
};

export const getRelationsController = async (req: Request, res: Response): Promise<void> => {
  const filters = relationFilterSchema.parse(req.query);
  const persons = await getRelationsService(filters);
  res.json(persons);
};

export const updateRelationController = async (req: Request, res: Response): Promise<void> => {
  const jwtPayload: JwtAccessTokenPayload = res.locals.user;
  const relationId = req.params.relationId;
  if (typeof relationId !== 'string') {
    throw new HttpError(400, MISSING_QUERY_PARAMETERS);
  }

  const relationDto = req.body;
  const hasAnyField = relationRequiredFields.some((field) => relationDto[field] !== undefined);
  if (!hasAnyField) {
    throw new HttpError(400, `${EMPTY_REQUEST_BODY} one or more of ${relationRequiredFields.toString()}`);
  }

  const relation = await updateRelationService(jwtPayload, relationId, relationDto);
  res.json(relation);
};

export const createRelationController = async (req: Request, res: Response): Promise<void> => {
  const jwtPayload: JwtAccessTokenPayload = res.locals.user;
  const relationDto = req.body;
  const hasRequiredFields = relationRequiredFields.every((field) => relationDto[field] !== undefined);
  if (!hasRequiredFields) {
    throw new HttpError(400, `${MISSING_REQUIRED_REQUEST_BODY} ${relationRequiredFields.toString()}`);
  }

  const relation = await createRelationService(jwtPayload, relationDto);
  res.json(relation);
};

export const deleteRelationController = async (req: Request, res: Response): Promise<void> => {
  const jwtPayload: JwtAccessTokenPayload = res.locals.user;
  const relationId = req.params.relationId;
  if (typeof relationId !== 'string') {
    throw new HttpError(400, MISSING_QUERY_PARAMETERS);
  }

  await deleteRelationService(jwtPayload, relationId);
  res.status(200);
};
