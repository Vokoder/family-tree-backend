import { EMPTY_REQUEST_BODY, MISSING_QUERY_PARAMETERS, MISSING_REQUIRED_REQUEST_BODY } from '#constants/errors.constants.ts';
import { HttpError } from '#utils/http-error.utils.ts';
import type { Request, Response } from 'express';
import {
  createPersonService,
  deletePersonService,
  getUserPersonsSecvice,
  getPersonService,
  getPersonsService,
  updatePersonService,
} from './person.service.ts';
import { personFields, personRequiredFields, type PersonDto } from '#shared/types/person.type.ts';
import type { JwtAccessTokenPayload } from '#shared/types/jwt.type.ts';
import { getPersonsByIdsSchema, personFilterSchema } from '#shared/schemas/person.schema.ts';

export const getPersonController = async (req: Request, res: Response): Promise<void> => {
  const personId = req.params.personId;
  if (typeof personId !== 'string') {
    throw new HttpError(400, MISSING_QUERY_PARAMETERS);
  }

  const person = await getPersonService(personId);
  res.json(person);
};

export const getPersonsController = async (req: Request, res: Response): Promise<void> => {
  const filters = personFilterSchema.parse(req.query);
  const persons = await getPersonsService(filters);
  res.json(persons);
};

export const getUserPersonsController = async (req: Request, res: Response): Promise<void> => {
  const uid = getPersonsByIdsSchema.parse(req.query).uid;
  const jwtPayload: JwtAccessTokenPayload = res.locals.user;
  console.log(uid, jwtPayload);

  const persons = await getUserPersonsSecvice(uid, jwtPayload);
  res.json(persons);
};

export const updatePersonController = async (req: Request, res: Response): Promise<void> => {
  const jwtPayload: JwtAccessTokenPayload = res.locals.user;
  const personId = req.params.personId;
  if (typeof personId !== 'string') {
    throw new HttpError(400, MISSING_QUERY_PARAMETERS);
  }

  const personDto: PersonDto = req.body;
  const hasAnyField = personFields.some((field) => personDto[field] !== undefined);
  if (!hasAnyField) {
    throw new HttpError(400, `${EMPTY_REQUEST_BODY} one or more of ${personFields.toString()}`);
  }

  const person = await updatePersonService(jwtPayload, personId, personDto);
  res.json(person);
};

export const createPersonController = async (req: Request, res: Response): Promise<void> => {
  const jwtPayload: JwtAccessTokenPayload = res.locals.user;
  const personDto: PersonDto = req.body;
  const hasRequiredFields = personRequiredFields.every((field) => personDto[field] !== undefined);
  if (!hasRequiredFields) {
    throw new HttpError(400, `${MISSING_REQUIRED_REQUEST_BODY} ${personRequiredFields.toString()}`);
  }

  const person = await createPersonService(jwtPayload, personDto);
  res.json(person);
};

export const deletePersonController = async (req: Request, res: Response): Promise<void> => {
  const jwtPayload: JwtAccessTokenPayload = res.locals.user;
  const personId = req.params.personId;
  if (typeof personId !== 'string') {
    throw new HttpError(400, MISSING_QUERY_PARAMETERS);
  }

  await deletePersonService(jwtPayload, personId);
  res.status(200);
};
