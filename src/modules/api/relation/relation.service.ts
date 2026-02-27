import { USER_ADMIN_ROLE } from '#app.config.ts';
import { NO_PERMISSIONS, RELATION_ALREADY_EXISTS, RELATION_NOT_FOUND } from '#constants/errors.constants.ts';
import { createRelation, deleteRelation, getRelationById, getRelations, updateRelation } from '#firebase-client.ts';
import type { JwtAccessTokenPayload } from '#shared/types/jwt.type.ts';
import type { FirebaseRelation, Relation, RelationDto, RelationFilters } from '#shared/types/relation.type.ts';
import { HttpError } from '#utils/http-error.utils.ts';
import { relationFilterToFirebaseRelationFilter } from '#utils/relation-converter.utils.ts';

export const getRelationService = async (relationId: string): Promise<Relation> => {
  const relation = await getRelationById(relationId);
  if (!relation) {
    throw new HttpError(404, RELATION_NOT_FOUND);
  }

  return relation;
};

export const getRelationsService = async (filter: RelationFilters): Promise<Relation[] | null> => {
  const firebaseFilter = relationFilterToFirebaseRelationFilter(filter);
  const relations = await getRelations(firebaseFilter);
  return relations;
};

export const updateRelationService = async (
  jwtPayload: JwtAccessTokenPayload,
  relationId: string,
  relationDto: Partial<FirebaseRelation>,
): Promise<Relation> => {
  const relation = await getRelationById(relationId);
  if (!relation) {
    throw new HttpError(404, RELATION_NOT_FOUND);
  }

  if (relation.ownerId !== jwtPayload.uid || jwtPayload.roleId !== USER_ADMIN_ROLE) {
    throw new HttpError(403, NO_PERMISSIONS);
  }

  await updateRelation(relationId, relationDto);
  const updatedRelation = await getRelationById(relationId);
  if (!updatedRelation) {
    throw new HttpError(404, RELATION_NOT_FOUND);
  }

  return updatedRelation;
};

export const createRelationService = async (jwtPayload: JwtAccessTokenPayload, relationDto: RelationDto): Promise<Relation> => {
  const exists = await getRelationsService(relationDto);
  if (!exists || !exists.length) {
    throw new HttpError(400, RELATION_ALREADY_EXISTS);
  }

  const relation = await createRelation(jwtPayload.uid, relationDto as FirebaseRelation);
  return relation;
};

export const deleteRelationService = async (jwtPayload: JwtAccessTokenPayload, relationId: string): Promise<void> => {
  const relation = await getRelationById(relationId);
  if (!relation) {
    throw new HttpError(404, RELATION_NOT_FOUND);
  }

  if (relation.ownerId !== jwtPayload.uid || jwtPayload.roleId !== USER_ADMIN_ROLE) {
    throw new HttpError(403, NO_PERMISSIONS);
  }

  await deleteRelation(relationId);
};
