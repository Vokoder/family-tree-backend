import type { Person } from './person.type.ts';
import type { Relation } from './relation.type.ts';
import type { TypeOfRelation } from './types-of-relations.type.ts';

export type TreeData = {
  persons: Person[];
  relations: Relation[];
  types: TypeOfRelation[];
  rootId: string;
};
