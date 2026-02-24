import type { FirebaseUser, User, UserOutput } from "#shared/types/user.type.ts";

export const firebaseUserToUser = (uid: string, firebaseUser: FirebaseUser): User => {
  const user: User = {
    id: uid,
    ...firebaseUser,
    createdAt: firebaseUser.createdAt.toDate(),
  }
  return user;
}

export const userToUserOutput = (user: User): UserOutput => {
  const userOutput: UserOutput = {
    login: user.login,
    roleId: user.roleId,
    createdAt: user.createdAt,
    ...(user.personId !== undefined && { personId: user.personId }),
  };
  return userOutput;
}