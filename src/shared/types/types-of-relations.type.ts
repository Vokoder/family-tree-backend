export type TypeOfRelation = {
  id: string;
  isInverted: boolean;
  invertedPairId: string;
};

export type TypeOfRelationDto = Partial<TypeOfRelation>;
