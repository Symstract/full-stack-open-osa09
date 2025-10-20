import { v1 as uuid } from "uuid";

import patientData from "../../data/patients";
import { Gender, NewPatient, NonSensitivePatient, Patient } from "../types";

const getNonSensitiveEntires = (): NonSensitivePatient[] => {
  return patientData.map(
    ({ id, name, dateOfBirth, gender: genderString, occupation }) => {
      const gender = genderString as Gender;
      return {
        id,
        name,
        dateOfBirth,
        gender,
        occupation,
      };
    }
  );
};

const addPatient = (patient: NewPatient): Patient => {
  const id: string = uuid();
  const newPatient = {
    id,
    ...patient,
  };

  patientData.push(newPatient);

  return newPatient;
};

export default {
  addPatient,
  getNonSensitiveEntires,
};
