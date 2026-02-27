import { USER_ADMIN_ROLE } from '#app.config.ts';
import { NO_PERMISSIONS, PERSON_NOT_FOUND } from '#constants/errors.constants.ts';
import { createPerson, deletePerson, getPersonById, getPersons, updatePerson } from '#firebase-client.ts';
import type { JwtAccessTokenPayload } from '#shared/types/jwt.type.ts';
import type { Person, PersonDto, PersonFilters } from '#shared/types/person.type.ts';
import { HttpError } from '#utils/http-error.utils.ts';
import { personFilterToFirebasePersonFilter } from '#utils/person-converter.utils.ts';

export const getPersonService = async (personId: string): Promise<PersonDto> => {
  const person = await getPersonById(personId);
  if (!person) {
    throw new HttpError(404, PERSON_NOT_FOUND);
  }

  return person;
};

export const getPersonsService = async (filters: PersonFilters): Promise<Partial<Person[]> | null> => {
  const firebaseFilter = personFilterToFirebasePersonFilter(filters);
  const persons = await getPersons(firebaseFilter);
  return persons;
};

export const updatePersonService = async (
  jwtPayload: JwtAccessTokenPayload,
  personId: string,
  personDto: PersonDto,
): Promise<PersonDto> => {
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

export const createPersonService = async (jwtPayload: JwtAccessTokenPayload, personDto: PersonDto): Promise<PersonDto> => {
  personDto.ownerId = jwtPayload.uid;
  const person = await createPerson(personDto);
  return person;
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
