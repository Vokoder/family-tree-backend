import { USER_ADMIN_ROLE } from '#app.config.ts';
import { NO_PERMISSIONS, PERSON_NOT_FOUND } from '#constants/errors.constants.ts';
import {
  createMyPerson,
  createPerson,
  deletePerson,
  getPersonById,
  getPersons,
  getRelatedPersons,
  getUserPersons,
  updatePerson,
} from '#firebase-client.ts';
import type { JwtAccessTokenPayload } from '#shared/types/jwt.type.ts';
import type { CreatePersonDto, Person, PersonDto, PersonFilters, UpdatePersonDto } from '#shared/types/person.type.ts';
import type { PersonWithRelation } from '#shared/types/relation.type.ts';
import { HttpError } from '#utils/http-error.utils.ts';
import { personFilterToFirebasePersonPartial } from '#utils/person-converter.utils.ts';

export const getPersonService = async (personId: string): Promise<PersonDto> => {
  const person = await getPersonById(personId);
  if (!person) {
    throw new HttpError(404, PERSON_NOT_FOUND);
  }

  return person;
};

export const getPersonsService = async (filters: PersonFilters): Promise<Partial<Person[]> | null> => {
  const firebaseFilter = personFilterToFirebasePersonPartial(filters);
  const persons = await getPersons(firebaseFilter);
  return persons;
};

export const getUserPersonsSecvice = async (uid: string, jwtPayload: JwtAccessTokenPayload): Promise<Person[]> => {
  if (uid !== jwtPayload.uid && jwtPayload.roleId !== USER_ADMIN_ROLE) {
    throw new HttpError(403, NO_PERMISSIONS);
  }

  const persons = await getUserPersons(uid);
  return persons;
};

export const getRelatedPersonsService = async (personId: string): Promise<PersonWithRelation[]> => {
  return await getRelatedPersons(personId);
};

export const updatePersonService = async (
  jwtPayload: JwtAccessTokenPayload,
  personId: string,
  personDto: UpdatePersonDto,
): Promise<Person> => {
  const person = await getPersonById(personId);
  if (!person) {
    throw new HttpError(404, PERSON_NOT_FOUND);
  }

  if (person.ownerId !== jwtPayload.uid && jwtPayload.roleId !== USER_ADMIN_ROLE) {
    throw new HttpError(403, NO_PERMISSIONS);
  }

  await updatePerson(personId, personDto);
  const updatedPerson = await getPersonById(personId);
  if (!updatedPerson) {
    throw new HttpError(404, PERSON_NOT_FOUND);
  }

  return updatedPerson;
};

export const createPersonService = async (
  jwtPayload: JwtAccessTokenPayload,
  createPersonDto: CreatePersonDto,
): Promise<Person> => {
  createPersonDto.person.ownerId = jwtPayload.uid;
  const { isForSelf, person, relation } = createPersonDto;
  if (isForSelf) {
    return await createMyPerson(person, jwtPayload.uid);
  }

  return await createPerson(person, jwtPayload.uid, relation);
};

export const deletePersonService = async (jwtPayload: JwtAccessTokenPayload, personId: string): Promise<void> => {
  const person = await getPersonById(personId);
  if (!person) {
    throw new HttpError(404, PERSON_NOT_FOUND);
  }

  if (person.ownerId !== jwtPayload.uid && jwtPayload.roleId !== USER_ADMIN_ROLE) {
    throw new HttpError(403, NO_PERMISSIONS);
  }

  await deletePerson(personId);
};
