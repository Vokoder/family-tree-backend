import { dateFields, simpleFields, type FirebasePerson, type Person } from "#shared/types/person.type.ts";
import { Timestamp } from "firebase-admin/firestore";

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

}

export const firebasePersonToPerson = (personId: string, firebasePerson: FirebasePerson): Person => {
  const person: Partial<Person> = { id: personId };

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
}
