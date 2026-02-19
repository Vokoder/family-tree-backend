import admin from 'firebase-admin';
import { FIREBASE_SERVICE_ACCOUNT, USER_DEFAULT_ROLE } from '#app.config.ts';
import type { FirebaseUser, User } from '#shared/types/user.type.ts';
import { HttpError } from '#utils/http-error.utils.ts';
import { Timestamp } from 'firebase-admin/firestore';
import type { RefreshToken } from '#shared/types/refreshToken.type.ts';
import {
  ADD_REFRESH_TOKEN_FIREBASE_ERROR,
  CREATE_USER_FIREBASE_ERROR,
  DELETE_REFRESH_TOKEN_FIREBASE_ERROR,
  GET_USER_FIREBASE_ERROR,
  UPDATE_REFRESH_TOKEN_FIREBASE_ERROR
} from '#constants/errors.constants.ts';

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

// JWT tokens

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

// users

export const getUserByLogin = async (login: string): Promise<User | null> => {
  try {
    const snap = await dataPoints.users().where('login', '==', login).where('active', '==', true).get();
    if (snap.empty || !snap.docs[0]) {
      return null;
    }

    const firebaseUser = snap.docs[0].data() as FirebaseUser;
    const user: User = {
      id: snap.docs[0].id,
      ...firebaseUser,
      createdAt: firebaseUser.createdAt.toDate(),
    }
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
    const user: User = {
      id: snap.id,
      ...firebaseUser,
      createdAt: firebaseUser.createdAt.toDate(),
    }
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
      password: password,
      roleId: defaultRoleSnapshot.docs[0].id,
      active: true,
      createdAt: Timestamp.fromDate(new Date()),
    };

    const userRef = await dataPoints.users().add(userData);
    const userSnapshot = await userRef.get();
    const data: FirebaseUser = userSnapshot.data() as FirebaseUser;
    const user: User = {
      id: userSnapshot.id,
      ...data,
      createdAt: data.createdAt.toDate(),
    }

    return user;
  } catch (error) {
    throw error instanceof Error ? error : new Error(`${CREATE_USER_FIREBASE_ERROR} ${error}`);
  };
}
