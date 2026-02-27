import type { FirebaseRelationFilter, RelationFilters } from '#shared/types/relation.type.ts';
import { removeUndefined } from './remove-undefined.utils.ts';

export const relationFilterToFirebaseRelationFilter = (filter: RelationFilters): FirebaseRelationFilter => {
  const firebaseFilter = removeUndefined(filter) as FirebaseRelationFilter;
  return firebaseFilter;
};
