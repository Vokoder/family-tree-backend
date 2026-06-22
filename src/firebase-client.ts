import admin from 'firebase-admin';
import { FIREBASE_SERVICE_ACCOUNT, USER_DEFAULT_ROLE } from '#app.config.ts';
import type { FirebaseUser, User } from '#shared/types/user.type.ts';
import { HttpError } from '#utils/http-error.utils.ts';
import { FieldPath, Query, Timestamp, type UpdateData } from 'firebase-admin/firestore';
import type { RefreshToken } from '#shared/types/refresh-token.type.ts';
import {
  ADD_REFRESH_TOKEN_FIREBASE_ERROR,
  CREATE_PERSON_FIREBASE_ERROR,
  CREATE_RELATION_FIREBASE_ERROR,
  CREATE_USER_FIREBASE_ERROR,
  DELETE_PERSON_FIREBASE_ERROR,
  DELETE_REFRESH_TOKEN_FIREBASE_ERROR,
  DELETE_RELATION_FIREBASE_ERROR,
  GET_PERSON_FIREBASE_ERROR,
  GET_PERSONS_FIREBASE_ERROR,
  GET_RELATION_FIREBASE_ERROR,
  GET_TYPES_OF_RELATIONS_ERROR,
  GET_USER_FIREBASE_ERROR,
  LOGIN_ALREADY_EXISTS,
  NO_DATA_TO_UPDATE,
  NO_DEFAULT_USER_ROLE,
  UPDATE_PERSON_FIREBASE_ERROR,
  UPDATE_REFRESH_TOKEN_FIREBASE_ERROR,
  UPDATE_RELATION_FIREBASE_ERROR,
  UPDATE_USER_FIREBASE_ERROR,
} from '#constants/errors.constants.ts';
import { firebaseUserToUser } from '#utils/user-converter.utils.ts';
import type {
  FirebasePerson,
  FirebasePersonPartial,
  Person,
  PersonDto,
  PersonFilters,
  UpdatePersonDto,
} from '#shared/types/person.type.ts';
import { firebasePersonToPerson, personToFirebasePerson, updatePersonToFirebasePerson } from '#utils/person-converter.utils.ts';
import { removeUndefined } from '#utils/remove-undefined.utils.ts';
import type {
  FirebaseRelation,
  FirebaseRelationFilter,
  PersonWithRelation,
  Relation,
  RelationDto,
} from '#shared/types/relation.type.ts';
import dayjs from 'dayjs';
import type { TypeOfRelation } from '#shared/types/types-of-relations.type.ts';

import { Filter } from 'firebase-admin/firestore';
import type { TreeData } from '#shared/types/tree.type.ts';

admin.initializeApp({
  credential: admin.credential.cert(FIREBASE_SERVICE_ACCOUNT),
});
const db = admin.firestore();

export const firestore = admin.firestore();

type Collections = 'persons' | 'relations' | 'roles' | 'users' | 'typesOfRelations' | 'refreshTokens';

const dataPoint = (collection: Collections) => {
  return firestore.collection(collection);
};

const dataPointForOne = (collection: Collections, doc: string) => {
  return firestore.collection(collection).doc(doc);
};

const dataPoints = {
  user: (doc: string) => dataPointForOne('users', doc),
  users: () => dataPoint('users'),
  person: (doc: string) => dataPointForOne('persons', doc),
  persons: () => dataPoint('persons'),
  roles: () => dataPoint('roles'),
  relation: (doc: string) => dataPointForOne('relations', doc),
  relations: () => dataPoint('relations'),
  typesOfRelations: () => dataPoint('typesOfRelations'),
  typeOfRelation: (doc: string) => dataPointForOne('typesOfRelations', doc),
  refreshTokens: () => dataPoint('refreshTokens'),
};

//  JWT tokens

export const addRefreshToken = async (token: RefreshToken) => {
  try {
    await dataPoints.refreshTokens().add(token);
  } catch (error) {
    throw error instanceof Error ? error : new Error(`${ADD_REFRESH_TOKEN_FIREBASE_ERROR} ${error}`);
  }
};

export const deleteRefreshToken = async (uid: string, token: string) => {
  try {
    const tokenSnapshot = await dataPoints.refreshTokens().where('token', '==', token).where('uid', '==', uid).get();
    if (tokenSnapshot.empty || !tokenSnapshot.docs[0]) {
      throw new HttpError(403, 'Invalid refresh token');
    }

    tokenSnapshot.docs[0].ref.delete();
  } catch (error) {
    console.error(`${DELETE_REFRESH_TOKEN_FIREBASE_ERROR} ${error}`);
  }
};

export const extendRefreshToken = async (oldToken: string, token: RefreshToken) => {
  try {
    deleteRefreshToken(token.uid, oldToken);
    addRefreshToken(token);
  } catch (error) {
    throw error instanceof Error ? error : new Error(`${UPDATE_REFRESH_TOKEN_FIREBASE_ERROR} ${error}`);
  }
};

export const deleteRefreshTokens = async (uid: string) => {
  try {
    const tokenSnapshot = await dataPoints.refreshTokens().where('uid', '==', uid).get();
    if (tokenSnapshot.empty) {
      throw new HttpError(403, 'Invalid refresh token');
    }

    const batch = admin.firestore().batch();

    tokenSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
  } catch (error) {
    throw error instanceof Error ? error : new Error(`${DELETE_REFRESH_TOKEN_FIREBASE_ERROR} ${error}`);
  }
};

//  users

export const getUserByLogin = async (login: string): Promise<User | null> => {
  try {
    const snap = await dataPoints.users().where('login', '==', login).where('active', '==', true).limit(1).get();
    if (snap.empty || !snap.docs[0]) {
      return null;
    }

    const firebaseUser = snap.docs[0].data() as FirebaseUser;
    const user = firebaseUserToUser(snap.docs[0].id, firebaseUser);
    return user;
  } catch (error) {
    throw error instanceof Error ? error : new Error(`${GET_USER_FIREBASE_ERROR} ${error}`);
  }
};

export const getUserById = async (uid: string): Promise<User | null> => {
  try {
    const snap = await dataPoints.user(uid).get();
    if (!snap.exists) {
      return null;
    }

    const firebaseUser = snap.data() as FirebaseUser;
    const user = firebaseUserToUser(snap.id, firebaseUser);
    return user;
  } catch (error) {
    throw error instanceof Error ? error : new Error(`${GET_USER_FIREBASE_ERROR} ${error}`);
  }
};

export const createUser = async (login: string, password: string): Promise<User> => {
  try {
    const user = await db.runTransaction(async (transaction) => {
      const userQuery = dataPoints.users().where('login', '==', login).where('active', '==', true).limit(1);
      const existsCheckSnapshot = await transaction.get(userQuery);
      if (!existsCheckSnapshot.empty) {
        throw new HttpError(400, LOGIN_ALREADY_EXISTS);
      }

      const roleQuery = dataPoints.roles().where('role', '==', USER_DEFAULT_ROLE).limit(1);
      const defaultRoleSnapshot = await transaction.get(roleQuery);
      if (defaultRoleSnapshot.empty || !defaultRoleSnapshot.docs[0]) {
        throw new HttpError(500, NO_DEFAULT_USER_ROLE);
      }

      const roleId = defaultRoleSnapshot.docs[0].id;
      const userRef = dataPoints.users().doc();
      const userData: FirebaseUser = {
        login,
        password,
        roleId,
        active: true,
        createdAt: admin.firestore.Timestamp.fromDate(new Date()),
      };
      transaction.set(userRef, userData);
      return firebaseUserToUser(userRef.id, userData);
    });
    return user;
  } catch (error) {
    throw error instanceof Error ? error : new Error(`${CREATE_USER_FIREBASE_ERROR} ${error}`);
  }
};

export const updateUser = async (uid: string, personId?: string, password?: string, active?: boolean): Promise<void> => {
  if (personId === undefined && !password && active === undefined) {
    throw new HttpError(400, NO_DATA_TO_UPDATE);
  }

  try {
    const updates: UpdateData<Partial<User>> = {
      ...(personId !== undefined ? { personId } : {}),
      ...(password !== undefined ? { password } : {}),
      ...(active !== undefined ? { active } : {}),
    };
    await dataPoints.user(uid).update(updates);
  } catch (error) {
    throw error instanceof Error ? error : new Error(`${UPDATE_USER_FIREBASE_ERROR} ${error}`);
  }
};

//  persons

export const getPersonById = async (personId: string): Promise<Person | null> => {
  try {
    const snap = await dataPoints.person(personId).get();
    if (!snap.exists) {
      return null;
    }

    const firebasePerson = snap.data() as FirebasePerson;
    const person = firebasePersonToPerson(personId, firebasePerson);
    return person;
  } catch (error) {
    throw error instanceof Error ? error : new Error(`${GET_PERSON_FIREBASE_ERROR} ${error}`);
  }
};

export const getUserPersons = async (uid: string): Promise<Person[]> => {
  try {
    const snap = await dataPoints.persons().where('ownerId', '==', uid).get();
    const persons: Person[] = [];
    snap.forEach((doc) => {
      const person = doc.data() as FirebasePerson;
      persons.push(firebasePersonToPerson(doc.id, person));
    });

    return persons;
  } catch (error) {
    throw error instanceof Error ? error : new Error(`${GET_PERSONS_FIREBASE_ERROR} ${error}`);
  }
};

export const getPersons = async (
  filters: FirebasePersonPartial,
  page: number,
  pageSize: number,
): Promise<{ data: Person[]; total: number }> => {
  try {
    let baseQuery: Query = dataPoints.persons();
    Object.entries(filters).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        return;
      }

      if (key.startsWith('date') && value instanceof Timestamp) {
        const startOfDay = dayjs(value.toDate()).startOf('day').toDate();
        const endOfDay = dayjs(value.toDate()).endOf('day').toDate();
        baseQuery = baseQuery.where(key, '>=', startOfDay).where(key, '<=', endOfDay);
      } else if (key === 'keywords' && Array.isArray(value)) {
        if (value.length === 1) {
          baseQuery = baseQuery.where(key, 'array-contains', value[0]);
        } else if (value.length > 1) {
          baseQuery = baseQuery.where(key, 'array-contains-any', value);
        }
      } else {
        baseQuery = baseQuery.where(key, '==', value);
      }
    });

    let pagedQuery = baseQuery.orderBy('__name__');

    const totalSnapshot = await baseQuery.count().get();
    const total = totalSnapshot.data().count;

    if (page > 1) {
      const skipCount = (page - 1) * pageSize;
      const offsetSnapshot = await baseQuery.orderBy('__name__').limit(skipCount).get();
      if (!offsetSnapshot.empty) {
        const lastVisibleDoc = offsetSnapshot.docs[offsetSnapshot.docs.length - 1];
        pagedQuery = pagedQuery.startAfter(lastVisibleDoc);
      }
    }

    const snapshot = await pagedQuery.limit(pageSize).get();

    const persons: Person[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data() as FirebasePerson;
      persons.push(firebasePersonToPerson(doc.id, data));
    });

    return { data: persons, total };
  } catch (error) {
    throw error instanceof Error ? error : new Error(`${GET_PERSON_FIREBASE_ERROR} ${error}`);
  }
};

export const createPerson = async (personDto: PersonDto, uid: string, relationDto?: RelationDto): Promise<Person> => {
  const personRef = await dataPoints.persons().doc();
  const relationRef = await dataPoints.relations().doc();
  const person: Person = { ...personDto, id: personRef.id } as Person;
  try {
    await db.runTransaction(async (transaction) => {
      const firebasePerson = personToFirebasePerson(person);
      transaction.set(personRef, firebasePerson);

      if (relationDto) {
        const firebaseRelation: FirebaseRelation = {
          ...relationDto,
          targetPersonId: personRef.id,
          ownerId: uid,
        } as FirebaseRelation;

        transaction.set(relationRef, firebaseRelation);
      }
    });
    return { ...personDto, id: personRef.id } as Person;
  } catch (error) {
    throw error instanceof Error ? error : new Error(`${CREATE_PERSON_FIREBASE_ERROR} ${error}`);
  }
};

export const createMyPerson = async (personDto: PersonDto, uid: string): Promise<Person> => {
  const personRef = await dataPoints.persons().doc();
  const userRef = await dataPoints.users().doc(uid);
  const person: Person = { ...personDto, id: personRef.id } as Person;
  try {
    await db.runTransaction(async (transaction) => {
      const firebasePerson = personToFirebasePerson(person);
      transaction.set(personRef, firebasePerson);
      transaction.update(userRef, { personId: personRef.id });
    });

    return { ...personDto, id: personRef.id } as Person;
  } catch (error) {
    throw error instanceof Error ? error : new Error(`${CREATE_PERSON_FIREBASE_ERROR} ${error}`);
  }
};

export const updatePerson = async (personId: string, personDto: UpdatePersonDto): Promise<void> => {
  try {
    const { ownerId, lastName, firstName, gender, ...firebaseData } = updatePersonToFirebasePerson(personDto);
    const updates: UpdateData<FirebasePersonPartial> = {
      ...firebaseData,
      ...(lastName ? { lastName } : {}),
      ...(firstName ? { firstName } : {}),
      ...(gender ? { gender } : {}),
    };

    if (Object.keys(updates).length === 0) {
      throw new HttpError(400, NO_DATA_TO_UPDATE);
    }

    await dataPoints.person(personId).update(updates);
  } catch (error) {
    throw error instanceof Error ? error : new Error(`${UPDATE_PERSON_FIREBASE_ERROR} ${error}`);
  }
};

export const deletePerson = async (personId: string): Promise<void> => {
  try {
    await dataPoints.person(personId).delete();
  } catch (error) {
    throw error instanceof Error ? error : new Error(`${DELETE_PERSON_FIREBASE_ERROR} ${error}`);
  }
};

//  relations
export const getRelationById = async (relationId: string): Promise<Relation | null> => {
  try {
    const relationSnap = await dataPoints.relation(relationId).get();
    if (!relationSnap.exists) {
      return null;
    }

    const firebaseRelation = relationSnap.data() as FirebaseRelation;
    const relation: Relation = { id: relationSnap.id, ...firebaseRelation };
    return relation;
  } catch (error) {
    throw error instanceof Error ? error : new Error(`${GET_RELATION_FIREBASE_ERROR} ${error}`);
  }
};

const asSource = (res: Relation[] | null) => res || [];

export const getRelations = async (filter: FirebaseRelationFilter): Promise<Relation[]> => {
  try {
    const { sourcePersonId, targetPersonId, ...otherFilters } = filter;

    if (sourcePersonId && targetPersonId) {
      const [pathAB, pathBA] = await Promise.all([
        fetchRelationsWithFilter(filter),
        fetchRelationsWithFilter({ ...otherFilters, sourcePersonId: targetPersonId, targetPersonId: sourcePersonId }),
      ]);

      const merged = [...asSource(pathAB), ...asSource(pathBA)];
      return merged.length > 0 ? merged : [];
    }

    if (sourcePersonId && !targetPersonId) {
      const [asSource, asTarget] = await Promise.all([
        fetchRelationsWithFilter({ ...otherFilters, sourcePersonId }),
        fetchRelationsWithFilter({ ...otherFilters, targetPersonId: sourcePersonId }),
      ]);

      const merged = [...(asSource || []), ...(asTarget || [])];
      return merged.length > 0 ? merged : [];
    }

    return await fetchRelationsWithFilter(filter);
  } catch (error) {
    throw error instanceof Error ? error : new Error(`${GET_RELATION_FIREBASE_ERROR} ${error}`);
  }
};

const fetchRelationsWithFilter = async (filter: FirebaseRelationFilter): Promise<Relation[]> => {
  let query: Query = dataPoints.relations();

  Object.entries(filter).forEach(([key, value]) => {
    if (value !== undefined) {
      query = query.where(key, '==', value);
    }
  });

  const snapshot = await query.get();
  if (snapshot.empty) return [];

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as FirebaseRelation),
  }));
};

export const createRelation = async (firebaseRelation: FirebaseRelation): Promise<Relation> => {
  try {
    const relationRef = await dataPoints.relations().doc();
    await relationRef.set(firebaseRelation);
    const relation: Relation = { ...firebaseRelation, id: relationRef.id };
    return relation;
  } catch (error) {
    throw error instanceof Error ? error : new Error(`${CREATE_RELATION_FIREBASE_ERROR} ${error}`);
  }
};

export const updateRelation = async (relationId: string, relationDto: Partial<FirebaseRelation>): Promise<void> => {
  try {
    const updates: UpdateData<Partial<FirebaseRelation>> = removeUndefined(relationDto);
    if (Object.keys(updates).length === 0) {
      throw new HttpError(400, NO_DATA_TO_UPDATE);
    }

    await dataPoints.relation(relationId).update(updates);
  } catch (error) {
    throw error instanceof Error ? error : new Error(`${UPDATE_RELATION_FIREBASE_ERROR} ${error}`);
  }
};

export const deleteRelation = async (relationId: string): Promise<void> => {
  try {
    await dataPoints.relation(relationId).delete();
  } catch (error) {
    throw error instanceof Error ? error : new Error(`${DELETE_RELATION_FIREBASE_ERROR} ${error}`);
  }
};

export const getTypesOfRelations = async (): Promise<TypeOfRelation[]> => {
  try {
    const snap = await dataPoints.typesOfRelations().get();
    if (snap.empty) {
      return [];
    }

    const typesOfRelations: TypeOfRelation[] = [];
    snap.forEach((doc) => {
      const data = doc.data() as TypeOfRelation;
      typesOfRelations.push(data);
    });
    return typesOfRelations;
  } catch (error) {
    throw error instanceof Error ? error : new Error(`${GET_TYPES_OF_RELATIONS_ERROR} ${error}`);
  }
};

export const getTypeOfRelation = async (relationId: string): Promise<TypeOfRelation | null> => {
  try {
    const typeOfRelationSnap = await dataPoints.typeOfRelation(relationId).get();
    if (!typeOfRelationSnap.exists) {
      return null;
    }

    const typeOfRelation = typeOfRelationSnap.data() as TypeOfRelation;
    return typeOfRelation;
  } catch (error) {
    throw error instanceof Error ? error : new Error(`${GET_TYPES_OF_RELATIONS_ERROR} ${error}`);
  }
};

export const getRelatedPersons = async (personId: string): Promise<PersonWithRelation[]> => {
  const relationsSnapshot = await dataPoints
    .relations()
    .where(Filter.or(Filter.where('sourcePersonId', '==', personId), Filter.where('targetPersonId', '==', personId)))
    .get();

  const relations = relationsSnapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      }) as Relation,
  );

  if (relations.length === 0) return [];

  const allTargetIds = relations.map((rel) => (rel.sourcePersonId === personId ? rel.targetPersonId : rel.sourcePersonId));
  const uniqueTargetIds = [...new Set(allTargetIds)];

  const chunkSize = 30;
  const chunks = [];
  for (let i = 0; i < uniqueTargetIds.length; i += chunkSize) {
    chunks.push(uniqueTargetIds.slice(i, i + chunkSize));
  }

  const personSnapshots = await Promise.all(
    chunks.map((chunk) => dataPoints.persons().where(FieldPath.documentId(), 'in', chunk).get()),
  );

  const personsMap = new Map<string, Person>();
  personSnapshots.forEach((snap) => {
    snap.docs.forEach((doc) => {
      const firebaseData = doc.data() as FirebasePerson;
      personsMap.set(doc.id, firebasePersonToPerson(doc.id, firebaseData));
    });
  });

  const result: PersonWithRelation[] = relations
    .map((relation) => {
      const relatedId = relation.sourcePersonId === personId ? relation.targetPersonId : relation.sourcePersonId;

      const personData = personsMap.get(relatedId);

      if (!personData) return null;

      return {
        relation: relation,
        person: personData as Person,
      };
    })
    .filter((item): item is PersonWithRelation => item !== null);

  return result;
};

const fetchPersonsByIds = async (ids: string[]): Promise<Person[]> => {
  if (ids.length === 0) return [];

  const chunks: string[][] = [];
  for (let i = 0; i < ids.length; i += 30) {
    chunks.push(ids.slice(i, i + 30));
  }

  const fetchPromises = chunks.map((chunk) => dataPoints.persons().where('__name__', 'in', chunk).get());
  const snapshots = await Promise.all(fetchPromises);

  return snapshots.flatMap((snap) => snap.docs.map((doc) => firebasePersonToPerson(doc.id, doc.data() as FirebasePerson)));
};

export const getTreeData = async (rootId: string, depth: number = 5): Promise<TreeData> => {
  const personIds = new Set<string>([rootId]);
  const relations: Relation[] = [];
  let currentLevelIds = [rootId];

  for (let i = 0; i < depth; i++) {
    if (currentLevelIds.length === 0 || !currentLevelIds) break;

    const [asSource, asTarget] = await Promise.all([
      dataPoints.relations().where('sourcePersonId', 'in', currentLevelIds).get(),
      dataPoints.relations().where('targetPersonId', 'in', currentLevelIds).get(),
    ]);

    const nextLevelIds = new Set<string>();
    const combinedDocs = [...asSource.docs, ...asTarget.docs];

    combinedDocs.forEach((doc) => {
      const rel = { id: doc.id, ...doc.data() } as Relation;

      if (!relations.find((r) => r.id === rel.id)) {
        relations.push(rel);

        [rel.sourcePersonId, rel.targetPersonId].forEach((id) => {
          if (!personIds.has(id)) {
            personIds.add(id);
            nextLevelIds.add(id);
          }
        });
      }
    });
    currentLevelIds = Array.from(nextLevelIds);
  }

  const persons = await fetchPersonsByIds(Array.from(personIds));
  const typesSnap = await dataPoints.typesOfRelations().get();
  const types = typesSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as TypeOfRelation);

  return {
    persons,
    relations,
    types,
    rootId,
  };
};
