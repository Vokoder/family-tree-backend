import { getTypesOfRelations } from '#firebase-client.ts';
import type { TypeOfRelation } from '#shared/types/types-of-relations.type.ts';

export const getTypesOfRelationsService = async (): Promise<TypeOfRelation[] | null> => {
  const typesOfRelations = await getTypesOfRelations();
  return typesOfRelations;
};
