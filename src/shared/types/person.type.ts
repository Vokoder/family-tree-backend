import type { personFilterSchema } from '#shared/schemas/person.schema.ts';
import type { Timestamp } from 'firebase-admin/firestore';
import type z from 'zod';

export interface Person {
  id: string;
  lastName: string;
  firstName: string;
  middleName?: string;
  gender: boolean; // 1 - male, 0 - female
  dateOfBirthday?: Date;
  placeOfBirthday?: string;
  dateOfDeath?: Date;
  placeOfDeath?: string;
  country?: string;
  city?: string;
  ownerId: string;
  biography?: string;
  keywords?: string[];
  contactInformation?: string;
}

export interface FirebasePerson {
  lastName: string;
  firstName: string;
  middleName?: string;
  gender: boolean; // 1 - male, 0 - female
  dateOfBirthday?: Timestamp;
  placeOfBirthday?: string;
  dateOfDeath?: Timestamp;
  placeOfDeath?: string;
  country?: string;
  city?: string;
  ownerId: string;
  biography?: string;
  keywords?: string[];
  contactInformation?: string;
}

export type PersonFilters = z.infer<typeof personFilterSchema>;
export type FirebasePersonFilter = Partial<FirebasePerson>;

export type PersonDto = Partial<Person>;

//  поля, присутствующие во всех интерфейсах
export const personFields: (keyof FirebasePerson)[] = [
  'lastName',
  'firstName',
  'middleName',
  'gender',
  'dateOfBirthday',
  'placeOfBirthday',
  'dateOfDeath',
  'placeOfDeath',
  'country',
  'city',
  'ownerId',
  'biography',
  'keywords',
  'contactInformation',
];

//  минимально необходимые поля для персоны
export const personRequiredFields: (keyof FirebasePerson)[] = ['lastName', 'firstName', 'gender'];

//  поля с идентичными firebase типами данных
export const simpleFields: (keyof FirebasePerson)[] = [
  'lastName',
  'firstName',
  'middleName',
  'gender',
  'placeOfBirthday',
  'placeOfDeath',
  'country',
  'city',
  'ownerId',
  'biography',
  'keywords',
  'contactInformation',
];

//   поля Date - Timestamp
export const dateFields: (keyof FirebasePerson)[] = ['dateOfBirthday', 'dateOfDeath'];
