import {
  dateFields,
  simpleFields,
  type FirebasePerson,
  type FirebasePersonPartial,
  type Person,
  type PersonDto,
  type PersonFilters,
  type UpdatePersonDto,
} from '#shared/types/person.type.ts';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';

export const personToFirebasePerson = (person: PersonDto): FirebasePersonPartial => {
  const firebasePerson: FirebasePersonPartial = {};

  simpleFields.forEach((field) => {
    const value = person[field];
    if (value !== undefined) {
      if (field === 'keywords' && Array.isArray(value)) {
        Object.assign(firebasePerson, {
          [field]: value.map((k) => String(k).toLowerCase().trim()),
        });
      } else {
        Object.assign(firebasePerson, { [field]: value });
      }
    }
  });

  dateFields.forEach((field) => {
    let value = person[field];

    if (!value) {
      return;
    }

    if (typeof value === 'string') {
      const parsedDate = new Date(value);
      if (!isNaN(parsedDate.getTime())) {
        value = parsedDate;
      }
    }
    if (value instanceof Date) {
      Object.assign(firebasePerson, { [field]: Timestamp.fromDate(value) });
    }
  });

  return firebasePerson as FirebasePerson;
};

export const updatePersonToFirebasePerson = (person: UpdatePersonDto): FirebasePersonPartial => {
  const firebasePerson: FirebasePersonPartial = {};

  simpleFields.forEach((field) => {
    const value = person[field];
    if (value === null) {
      Object.assign(firebasePerson, { [field]: FieldValue.delete() });
    } else if (value !== undefined) {
      if (field === 'keywords' && Array.isArray(value)) {
        Object.assign(firebasePerson, {
          [field]: value.map((k) => String(k).toLowerCase().trim()),
        });
      } else {
        Object.assign(firebasePerson, { [field]: value });
      }
    }
  });

  dateFields.forEach((field) => {
    let value = person[field];

    if (value === null) {
      Object.assign(firebasePerson, { [field]: FieldValue.delete() });
      return;
    }
    if (value === undefined) {
      return;
    }

    if (typeof value === 'string') {
      const parsedDate = new Date(value);
      if (!isNaN(parsedDate.getTime())) {
        value = parsedDate;
      }
    }

    if (value instanceof Date) {
      Object.assign(firebasePerson, { [field]: Timestamp.fromDate(value) });
    } else {
      Object.assign(firebasePerson, { [field]: value });
    }
  });

  return firebasePerson;
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

export const personFilterToFirebasePersonPartial = (filters: PersonFilters): FirebasePersonPartial => {
  const result: Partial<FirebasePerson> = {};
  const entries = Object.entries(filters) as [keyof PersonFilters, unknown][];
  for (const [key, value] of entries) {
    if (value === undefined) {
      continue;
    }

    if (key === 'keywords' && Array.isArray(value) && value.length === 0) continue;

    const firebaseKey = key as keyof FirebasePerson;
    if (key === 'dateOfBirthday' || key === 'dateOfDeath') {
      if (value instanceof Date) {
        Object.assign(result, { [firebaseKey]: Timestamp.fromDate(value) });
      }
    } else {
      Object.assign(result, { [firebaseKey]: value });
    }
  }

  return result as FirebasePersonPartial;
};
