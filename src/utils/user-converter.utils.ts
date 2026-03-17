import { ERROR_CONVERTING_FIREBASE_USER_TO_USER, ERROR_CONVERTING_USER_TO_USER_DTO } from '#constants/errors.constants.ts';
import type { FirebaseUser, User, UserDto } from '#shared/types/user.type.ts';

export const firebaseUserToUser = (uid: string, firebaseUser: FirebaseUser): User => {
  try {
    const user: User = {
      id: uid,
      ...firebaseUser,
      createdAt: firebaseUser.createdAt.toDate(),
    };
    return user;
  } catch (error) {
    throw error instanceof Error ? error : new Error(`${ERROR_CONVERTING_FIREBASE_USER_TO_USER} ${error}`);
  }
};

export const userToUserDto = (user: User): UserDto => {
  try {
    const UserDto: UserDto = {
      id: user.id,
      login: user.login,
      roleId: user.roleId,
      createdAt: user.createdAt,
      ...(user.personId !== undefined && { personId: user.personId }),
    };
    return UserDto;
  } catch (error) {
    throw error instanceof Error ? error : new Error(`${ERROR_CONVERTING_USER_TO_USER_DTO} ${error}`);
  }
};
