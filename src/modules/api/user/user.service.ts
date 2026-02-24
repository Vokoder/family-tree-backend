import { USER_ADMIN_ROLE } from "#app.config.ts"
import { NO_PERMISSIONS, USER_NOT_FOUND } from "#constants/errors.constants.ts"
import { getUserById, updateUser } from "#firebase-client.ts"
import type { JwtAccessTokenPayload } from "#shared/types/jwt.type.ts"
import type { UserOutput } from "#shared/types/user.type.ts"
import { HttpError } from "#utils/http-error.utils.ts"
import { userToUserOutput } from "#utils/user-converter.utils.ts"
import argon2 from "argon2"

export const getUserService = async (uid: string): Promise<UserOutput> => {
  const user = await getUserById(uid);
  if (!user) {
    throw new HttpError(404, USER_NOT_FOUND);
  }

  const userOutput = userToUserOutput(user);
  return userOutput;
}

export const updateUserService = async (jwtPayload: JwtAccessTokenPayload, uid: string, password?: string, personId?: string): Promise<UserOutput> => {
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

    const userOutput = userToUserOutput(user);
    return userOutput;
  }

  throw new HttpError(403, NO_PERMISSIONS);
}

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
}