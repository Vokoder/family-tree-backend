import type { DocumentReference, Timestamp } from "firebase-admin/firestore";

export interface Person {
  lastName: string;
  firstName: string;
  middleName?: string;
  gender: boolean;    // 1 - male, 0 - female
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
  gender: boolean;    // 1 - male, 0 - female
  dateOfBirthday?: Timestamp;
  placeOfBirthday?: string;
  dateOfDeath?: Timestamp;
  placeOfDeath?: string;
  country?: string;
  city?: string;
  ownerId: DocumentReference;
  biography?: string;
  keywords?: string[];
  contactInformation?: string;
}