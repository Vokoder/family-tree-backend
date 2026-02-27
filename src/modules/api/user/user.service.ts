import { USER_ADMIN_ROLE } from '#app.config.ts';
import { NO_PERMISSIONS, USER_NOT_FOUND } from '#constants/errors.constants.ts';
import { getUserById, updateUser } from '#firebase-client.ts';
import type { JwtAccessTokenPayload } from '#shared/types/jwt.type.ts';
import type { UserDto } from '#shared/types/user.type.ts';
import { HttpError } from '#utils/http-error.utils.ts';
import { userToUserDto } from '#utils/user-converter.utils.ts';
import argon2 from 'argon2';

export const getUserService = async (uid: string): Promise<UserDto> => {
  const user = await getUserById(uid);
  if (!user) {
    throw new HttpError(404, USER_NOT_FOUND);
  }

  const UserDto = userToUserDto(user);
  return UserDto;
};

export const updateUserService = async (
  jwtPayload: JwtAccessTokenPayload,
  uid: string,
  password?: string,
  personId?: string,
): Promise<UserDto> => {
  if (uid === jwtPayload.uid || jwtPayload.roleId === USER_ADMIN_ROLE) {
    const user = await getUserById(uid);
    if (!user) {
      throw new HttpError(404, USER_NOT_FOUND);
    }

    let needsUpdate = false;
    let hashedPassword = undefined;
    if (personId !== undefined && user.personId !== personId) {
      user.personId = personId;
      needsUpdate = true;
    }

    if (password) {
      hashedPassword = await argon2.hash(password);
      user.password = hashedPassword;
      needsUpdate = true;
    }

    if (needsUpdate) {
      await updateUser(uid, personId, hashedPassword);
    }

    const updatedUser = await getUserById(uid);
    if (!updatedUser) {
      throw new HttpError(404, USER_NOT_FOUND);
    }

    const UserDto = userToUserDto(updatedUser);
    return UserDto;
  }

  throw new HttpError(403, NO_PERMISSIONS);
};

export const deleteUserService = async (jwtPayload: JwtAccessTokenPayload, uid: string): Promise<void> => {
  if (uid === jwtPayload.uid || jwtPayload.roleId === USER_ADMIN_ROLE) {
    const user = await getUserById(jwtPayload.uid);
    if (!user) {
      throw new HttpError(404, USER_NOT_FOUND);
    }

    await updateUser(uid, undefined, undefined, false);
    return;
  }

  throw new HttpError(403, NO_PERMISSIONS);
};
