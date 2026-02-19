export interface Relation {
  id?: string;
  sourcePersonId: string;
  targetPersonId: string;
  relationId: string;
  ownerId: string;
}

export interface FirebaseRelation {
  sourcePersonId: string;
  targetPersonId: string;
  relationId: string;
  ownerId: string;
}