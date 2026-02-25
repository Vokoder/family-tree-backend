import admin from 'firebase-admin';
import { FIREBASE_SERVICE_ACCOUNT, USER_DEFAULT_ROLE } from '#app.config.ts';
import type { FirebaseUser, User } from '#shared/types/user.type.ts';
import { HttpError } from '#utils/http-error.utils.ts';
import { Timestamp, type UpdateData } from 'firebase-admin/firestore';
import type { RefreshToken } from '#shared/types/refresh-token.type.ts';
import {
  ADD_REFRESH_TOKEN_FIREBASE_ERROR,
  CREATE_USER_FIREBASE_ERROR,
  DELETE_REFRESH_TOKEN_FIREBASE_ERROR,
  GET_USER_FIREBASE_ERROR,
  NO_DATA_TO_UPDATE,
  UPDATE_REFRESH_TOKEN_FIREBASE_ERROR,
  UPDATE_USER_FIREBASE_ERROR,
} from '#constants/errors.constants.ts';
import { firebaseUserToUser } from '#utils/user-converter.utils.ts';
import type { FirebasePerson, Person, } from '#shared/types/person.type.ts';
import { firebasePersonToPerson, personToFirebasePerson } from '#utils/person-converter.utils.ts';
import { removeUndefined } from '#utils/remove-undefined.utils.ts';

admin.initializeApp({
  credential: admin.credential.cert(FIREBASE_SERVICE_ACCOUNT),
});

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
  relations: () => dataPoint('relations'),
  typesOfRelations: () => dataPoint('typesOfRelations'),
  refreshTokens: () => dataPoint('refreshTokens'),
};

//  JWT tokens

export const addRefreshToken = async (token: RefreshToken) => {
  try {
    await dataPoints.refreshTokens().add({ token });
  }
  catch (error) {
    throw error instanceof Error ? error : new Error(`${ADD_REFRESH_TOKEN_FIREBASE_ERROR} ${error}`);
  }
}

export const extendRefreshToken = async (oldToken: string, token: RefreshToken) => {
  try {
    const tokenSnapshot = await dataPoints.refreshTokens().where('token', '==', oldToken).where('uid', '==', token.uid).get();
    if (tokenSnapshot.empty || !tokenSnapshot.docs[0]) {
      throw new HttpError(403, 'Invalid refresh token');
    }

    tokenSnapshot.docs[0].ref.delete();
    addRefreshToken(token);
  }
  catch (error) {
    throw error instanceof Error ? error : new Error(`${UPDATE_REFRESH_TOKEN_FIREBASE_ERROR} ${error}`);
  }
}

export const deleteRefreshToken = async (uid: string, token: string) => {
  try {
    const tokenSnapshot = await dataPoints.refreshTokens().where('token', '==', token).where('uid', '==', uid).get();
    if (tokenSnapshot.empty || !tokenSnapshot.docs[0]) {
      throw new HttpError(403, 'Invalid refresh token');
    }

    tokenSnapshot.docs[0].ref.delete();
  }
  catch (error) {
    throw error instanceof Error ? error : new Error(`${DELETE_REFRESH_TOKEN_FIREBASE_ERROR} ${error}`);
  }
}

//  users

export const getUserByLogin = async (login: string): Promise<User | null> => {
  try {
    const snap = await dataPoints.users().where('login', '==', login).where('active', '==', true).get();
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
}

export const createUser = async (login: string, password: string): Promise<User> => {
  try {
    const exists = await getUserByLogin(login);
    if (exists) {
      throw new HttpError(500, 'exists')
    }

    const defaultRoleSnapshot = await dataPoints.roles().where('role', '==', USER_DEFAULT_ROLE).limit(1).get();
    if (defaultRoleSnapshot.empty || !defaultRoleSnapshot.docs[0]) {
      throw new HttpError(403, 'no default role');
    }

    const userData: FirebaseUser = {
      login,
      password,
      roleId: defaultRoleSnapshot.docs[0].id,
      active: true,
      createdAt: Timestamp.fromDate(new Date()),
    };
    const userRef = await dataPoints.users().add(userData);
    const userSnapshot = await userRef.get();
    const firebaseUser = userSnapshot.data() as FirebaseUser;
    const user = firebaseUserToUser(userSnapshot.id, firebaseUser)
    return user;
  } catch (error) {
    throw error instanceof Error ? error : new Error(`${CREATE_USER_FIREBASE_ERROR} ${error}`);
  };
}

export const updateUser = async (uid: string, personId?: string, password?: string, active?: boolean): Promise<void> => {
  if (personId === undefined && !password && active === undefined) {
    throw new HttpError(400, NO_DATA_TO_UPDATE);
  }

  try {
    const updates: UpdateData<Partial<User>> = {
      ...(personId !== undefined ? { personId } : {}),
      ...(password !== undefined ? { password } : {}),
      ...(active !== undefined ? { active } : {})
    };
    await dataPoints.user(uid).update(updates);
  } catch (error) {
    throw error instanceof Error ? error : new Error(`${UPDATE_USER_FIREBASE_ERROR} ${error}`);
  }
}

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
    throw error instanceof Error ? error : new Error(`${UPDATE_USER_FIREBASE_ERROR} ${error}`);
  }
}

export const getPersons = async (): Promise<Person[] | null> => {
  try {

  } catch (error) {
    throw error instanceof Error ? error : new Error(`${UPDATE_USER_FIREBASE_ERROR} ${error}`);
  }
}

export const createPerson = async (person: Person): Promise<Person> => {
  try {
    const firebasePerson = personToFirebasePerson(person);
    const personRef = await dataPoints.persons().add(firebasePerson);
    const createdPersonSnapshot = await personRef.get();
    const createdFirebasePerson = createdPersonSnapshot.data() as FirebasePerson;
    const createdPerson = firebasePersonToPerson(createdPersonSnapshot.id, createdFirebasePerson);
    return createdPerson;
  } catch (error) {
    throw error instanceof Error ? error : new Error(`${UPDATE_USER_FIREBASE_ERROR} ${error}`);
  }
}

export const updatePerson = async (personId: string, personDto: Partial<Person>): Promise<void> => {
  try {
    const clearedFields = removeUndefined(personDto);
    const { id, dateOfBirthday, dateOfDeath, ...otherFields } = clearedFields;
    const updates: UpdateData<Partial<FirebasePerson>> = {
      ...otherFields,
      ...(dateOfBirthday !== undefined ? { dateOfBirthday: Timestamp.fromDate(dateOfBirthday) } : {}),
      ...(dateOfDeath !== undefined ? { dateOfDeath: Timestamp.fromDate(dateOfDeath) } : {}),
    };
    if (Object.keys(updates).length === 0) {
      throw new HttpError(400, NO_DATA_TO_UPDATE);
    }
    
    await dataPoints.person(personId).update(updates);
  } catch (error) {
    throw error instanceof Error ? error : new Error(`${UPDATE_USER_FIREBASE_ERROR} ${error}`);
  }
}

export const deletePerson = async (personId: string): Promise<void> => {
  try {
    await dataPoints.person(personId).delete();
  } catch (error) {
    throw error instanceof Error ? error : new Error(`${UPDATE_USER_FIREBASE_ERROR} ${error}`);
  }
}
