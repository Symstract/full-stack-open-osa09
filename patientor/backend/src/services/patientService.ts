import { v1 as uuid } from "uuid";

import patientData from "../../data/patients";
import {
  Entry,
  NewEntry,
  NewPatient,
  NonSensitivePatient,
  Patient,
} from "../types";

const getNonSensitivePatients = (): NonSensitivePatient[] => {
  return patientData.map(({ id, name, dateOfBirth, gender, occupation }) => {
    return {
      id,
      name,
      dateOfBirth,
      gender,
      occupation,
    };
  });
};

const addPatient = (patient: NewPatient): Patient => {
  const newPatient = {
    id: uuid(),
    entries: [],
    ...patient,
  };

  patientData.push(newPatient);

  return newPatient;
};

const getPatientById = (id: string): Patient | null => {
  const foundPatient = patientData.find((patient) => patient.id === id);

  if (!foundPatient) {
    return null;
  }

  return foundPatient;
};

const addEntry = (patientId: string, entry: NewEntry): Entry => {
  const patient = patientData.find(({ id }) => id === patientId);

  if (!patient) {
    throw new Error("Patient not found");
  }

  const newEntry = {
    id: uuid(),
    ...entry,
  };

  patient.entries.push(newEntry);

  return newEntry;
};

export default {
  addPatient,
  getNonSensitivePatients,
  getPatientById,
  addEntry,
};
