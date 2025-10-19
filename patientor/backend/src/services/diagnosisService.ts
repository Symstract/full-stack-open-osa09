import diagnosisData from "../../data/diagnoses";
import { Diagnosis } from "../types";

const getEntires = (): Diagnosis[] => diagnosisData;

export default {
  getEntires,
};
