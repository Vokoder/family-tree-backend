import {
  dateFields,
  simpleFields,
  type FirebasePerson,
  type FirebasePersonFilter,
  type Person,
  type PersonDto,
  type PersonFilters,
} from '#shared/types/person.type.ts';
import { Timestamp } from 'firebase-admin/firestore';

export const personToFirebasePerson = (person: Person): FirebasePerson => {
  const firebasePerson: Partial<FirebasePerson> = {};

  simpleFields.forEach((field) => {
    const value = person[field];
    if (value !== undefined) {
      Object.assign(firebasePerson, { [field]: value });
    }
  });

  dateFields.forEach((field) => {
    const value = person[field];
    if (value instanceof Date) {
      Object.assign(firebasePerson, { [field]: Timestamp.fromDate(value) });
    }
  });

  return firebasePerson as FirebasePerson;
};

export const firebasePersonToPerson = (personId: string, firebasePerson: FirebasePerson): Person => {
  const person: PersonDto = { id: personId };

  simpleFields.forEach((field) => {
    const value = firebasePerson[field];
    if (value !== undefined) {
      Object.assign(person, { [field]: value });
    }
  });

  dateFields.forEach((field) => {
    const timestamp = firebasePerson[field];
    if (timestamp instanceof Timestamp) {
      Object.assign(person, { [field]: timestamp.toDate() });
    }
  });

  return person as Person;
};

export const personFilterToFirebasePersonFilter = (filters: PersonFilters): FirebasePersonFilter => {
  const result: Partial<FirebasePerson> = {};
  const entries = Object.entries(filters) as [keyof PersonFilters, unknown][];
  for (const [key, value] of entries) {
    if (value === undefined) {
      continue;
    }

    const firebaseKey = key as keyof FirebasePerson;
    if (key === 'dateOfBirthday' || key === 'dateOfDeath') {
      if (value instanceof Date) {
        Object.assign(result, { [firebaseKey]: Timestamp.fromDate(value) });
      }
    } else {
      Object.assign(result, { [firebaseKey]: value });
    }
  }

  return result as FirebasePersonFilter;
};
