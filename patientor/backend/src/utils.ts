import * as z from "zod";

import { Gender, NewPatient } from "./types";

export const newPatientSchema = z.object({
  name: z.string(),
  dateOfBirth: z.iso.date(),
  ssn: z.string(),
  gender: z.enum(Gender),
  occupation: z.string(),
});

const newEntryBaseSchema = z.object({
  description: z.string().min(1),
  date: z.iso.date(),
  specialist: z.string().min(5),
  diagnosisCodes: z.array(z.string().min(1)).optional(),
});

const newHealthCheckEntrySchema = newEntryBaseSchema.safeExtend({
  type: z.literal("HealthCheck"),
  healthCheckRating: z.number().min(0).max(3),
});

const newOccupationalHealthcareEntrySchema = newEntryBaseSchema.safeExtend({
  type: z.literal("OccupationalHealthcare"),
  employerName: z.string().min(5),
  sickLeave: z
    .object({
      startDate: z.iso.date(),
      endDate: z.iso.date(),
    })
    .optional(),
});

const newHospitalEntrySchema = newEntryBaseSchema.safeExtend({
  type: z.literal("Hospital"),
  discharge: z.object({
    date: z.iso.date(),
    criteria: z.string().min(1),
  }),
});

export const newentrySchema = z.discriminatedUnion("type", [
  newHealthCheckEntrySchema,
  newOccupationalHealthcareEntrySchema,
  newHospitalEntrySchema,
]);

export const toNewPatient = (object: unknown): NewPatient => {
  return newPatientSchema.parse(object);
};
