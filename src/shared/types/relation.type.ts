import type { relationFilterSchema } from '#shared/schemas/relation.schema.ts';
import type z from 'zod';
import type { Person } from './person.type.ts';

export interface Relation {
  id: string;
  sourcePersonId: string;
  targetPersonId: string;
  relationId: string;
  ownerId: string;
}

export type FirebaseRelation = Omit<Relation, 'id'>;

export type RelationFilters = z.infer<typeof relationFilterSchema>;
export type FirebaseRelationFilter = Partial<FirebaseRelation>;

export type RelationDto = Partial<Relation>;

//  минимально необходимые поля для связи
export const relationRequiredFields: (keyof Relation)[] = ['relationId', 'sourcePersonId', 'targetPersonId'];

//  поля поиска
export const relationSearchFields: (keyof Relation)[] = ['id', 'relationId', 'sourcePersonId', 'targetPersonId'];

export interface PersonWithRelation {
  person: Person;
  relation: Relation;
}
