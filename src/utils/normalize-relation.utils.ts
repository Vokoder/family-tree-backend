import { getTypeOfRelation } from '#firebase-client.ts';
import type { RelationDto } from '#shared/types/relation.type.ts';

export const normalizeRelationDto = async (relationId: string, relationDto: RelationDto): Promise<RelationDto> => {
  const typeOfRelation = await getTypeOfRelation(relationId);
  if (typeOfRelation && typeOfRelation.isInverted) {
    const invertedRelation: RelationDto = {
      ...relationDto,
      ...(typeOfRelation.invertedPairId ? { relationId: typeOfRelation.invertedPairId } : {}),
      ...(relationDto.targetPersonId ? { sourcePersonId: relationDto.targetPersonId } : {}),
      ...(relationDto.sourcePersonId ? { targetPersonId: relationDto.sourcePersonId } : {}),
    };
    return invertedRelation;
  }
  return relationDto;
};
