import type { FirebaseUser, User, UserDto } from "#shared/types/user.type.ts";

export const firebaseUserToUser = (uid: string, firebaseUser: FirebaseUser): User => {
  const user: User = {
    id: uid,
    ...firebaseUser,
    createdAt: firebaseUser.createdAt.toDate(),
  }
  return user;
}

export const userToUserDto = (user: User): UserDto => {
  const UserDto: UserDto = {
    login: user.login,
    roleId: user.roleId,
    createdAt: user.createdAt,
    ...(user.personId !== undefined && { personId: user.personId }),
  };
  return UserDto;
}