import { useState } from "react";

import patientService from "../../services/patients";
import {
  Diagnosis,
  Entry,
  HealthCheckEntry,
  HospitalEntry,
  NewEntry,
  OccupationalHealthcareEntry,
} from "../../types";
import axios from "axios";
import { assertNever } from "../../utils";

interface AddEntryFormFormProps {
  patientId: string;
  diagnosisOptions: Diagnosis[];
  onSuccess: (entry: Entry) => void;
}

interface Option<T> {
  value: T;
  name: string;
}

const typeOptions: Option<Entry["type"]>[] = [
  { value: "HealthCheck", name: "Health check" },
  { value: "OccupationalHealthcare", name: "Occupational Healthcare" },
  { value: "Hospital", name: "Hospital" },
];
const healthCheckRatingOptions: Option<
  HealthCheckEntry["healthCheckRating"]
>[] = [
  { value: 0, name: "Healthy" },
  { value: 1, name: "Low risk" },
  { value: 2, name: "Hight risk" },
  { value: 3, name: "Critical risk" },
];

const AddEntryForm = ({
  patientId,
  diagnosisOptions,
  onSuccess,
}: AddEntryFormFormProps) => {
  const [error, setError] = useState("");

  // Common
  const [type, setType] = useState<Entry["type"]>("HealthCheck");
  const [date, setDate] = useState<Entry["date"]>("");
  const [specialist, setSpecialist] = useState<Entry["specialist"]>("");
  const [description, setDescription] = useState<Entry["description"]>("");
  const [diagnosisCodes, setDiagnosisCodes] = useState<
    Required<Entry>["diagnosisCodes"]
  >([]);

  // Health Check
  const [healthCheckRating, setHealthCheckRating] =
    useState<HealthCheckEntry["healthCheckRating"]>(0);

  // Occupational Healthcare
  const [employerName, setEmployerName] =
    useState<OccupationalHealthcareEntry["employerName"]>("");
  const [sickLeaveStart, setSickLeaveStart] =
    useState<Required<OccupationalHealthcareEntry>["sickLeave"]["startDate"]>(
      ""
    );
  const [sickLeaveEnd, setSickLeaveEnd] =
    useState<Required<OccupationalHealthcareEntry>["sickLeave"]["endDate"]>("");

  // Hospital
  const [dischargeDate, setDischargeDate] =
    useState<HospitalEntry["discharge"]["date"]>("");
  const [dischargeCriteria, setDischargeCriteria] =
    useState<HospitalEntry["discharge"]["criteria"]>("");

  const resetFields = () => {
    setType("HealthCheck");
    setDate("");
    setSpecialist("");
    setDescription("");
    setDiagnosisCodes([]);
    setHealthCheckRating(0);
    setEmployerName("");
    setSickLeaveStart("");
    setSickLeaveEnd("");
    setDischargeDate("");
    setDischargeCriteria("");
    setError("");
  };

  const constructEntry = (): NewEntry => {
    const newEntryCommon = {
      date,
      description,
      specialist,
      diagnosisCodes: diagnosisCodes.length ? diagnosisCodes : undefined,
    };

    switch (type) {
      case "HealthCheck":
        return {
          ...newEntryCommon,
          type: "HealthCheck",
          healthCheckRating,
        };
      case "OccupationalHealthcare":
        return {
          ...newEntryCommon,
          type: "OccupationalHealthcare",
          employerName,
          sickLeave:
            sickLeaveStart && sickLeaveEnd
              ? { startDate: sickLeaveStart, endDate: sickLeaveEnd }
              : undefined,
        };
      case "Hospital":
        return {
          ...newEntryCommon,
          type: "Hospital",
          discharge: { criteria: dischargeCriteria, date: dischargeDate },
        };
      default:
        return assertNever(type);
    }
  };

  const entryCreation = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    try {
      const entry = await patientService.createEntry(
        patientId,
        constructEntry()
      );
      resetFields();
      onSuccess(entry);
    } catch (error) {
      if (
        axios.isAxiosError<{ error: { message: string; path: string }[] }>(
          error
        )
      ) {
        try {
          if (error.response) {
            const firstError = error.response.data.error[0];
            const message = firstError.message;
            const property = firstError.path[firstError.path.length - 1];
            setError(`${property}: ${message}`);
          }
        } catch (error) {
          console.log(error);
          setError("Something went wrong");
        }
      } else {
        console.log(error);
        setError("Something went wrong");
      }
    }
  };

  const onTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const option = typeOptions.find(
      ({ value }) => event.target.value === value
    );

    if (option) setType(option.value);
  };

  const onDiagnosisCodesChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const options = [...event.target.selectedOptions];
    setDiagnosisCodes(options.map((option) => option.value));
  };

  const onHealthCheckRatingChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const option = healthCheckRatingOptions.find(
      ({ value }) => Number(event.target.value) === value
    );

    if (option) setHealthCheckRating(option.value);
  };

  return (
    <div>
      <h3>Add new entry</h3>
      {error && <span style={{ color: "red" }}>{error}</span>}
      <form onSubmit={entryCreation}>
        <div>
          <label>type:</label>
          <br />
          <select value={type} onChange={(e) => onTypeChange(e)}>
            {typeOptions.map(({ value, name }) => (
              <option key={value} value={value}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>date:</label>
          <br />
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </div>

        <div>
          <label>specialist:</label>
          <br />
          <input
            value={specialist}
            onChange={(event) => setSpecialist(event.target.value)}
          />
        </div>

        <div>
          <label>description:</label>
          <br />
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>

        <div>
          <label>diagnosis codes (optional):</label>
          <br />
          <select
            multiple={true}
            value={diagnosisCodes}
            onChange={(e) => onDiagnosisCodesChange(e)}
          >
            {diagnosisOptions.map(({ code, name }) => (
              <option key={code} value={code}>
                {code} - {name}
              </option>
            ))}
          </select>
        </div>

        {type === "HealthCheck" && (
          <div>
            <label>health rating:</label>
            <br />
            <select
              value={healthCheckRating}
              onChange={(e) => onHealthCheckRatingChange(e)}
            >
              {healthCheckRatingOptions.map(({ value, name }) => (
                <option key={value} value={value}>
                  {value} - {name}
                </option>
              ))}
            </select>
          </div>
        )}

        {type === "OccupationalHealthcare" && (
          <>
            <div>
              <label>employer:</label>
              <br />
              <input
                value={employerName}
                onChange={(event) => setEmployerName(event.target.value)}
              />
            </div>

            <div>
              <label>sick leave start (optional):</label>
              <br />
              <input
                type="date"
                value={sickLeaveStart}
                onChange={(event) => setSickLeaveStart(event.target.value)}
              />
            </div>

            <div>
              <label>sick leave end (optional):</label>
              <br />
              <input
                type="date"
                value={sickLeaveEnd}
                onChange={(event) => setSickLeaveEnd(event.target.value)}
              />
            </div>
          </>
        )}

        {type === "Hospital" && (
          <>
            <div>
              <label>discharge date:</label>
              <br />
              <input
                type="date"
                value={dischargeDate}
                onChange={(event) => setDischargeDate(event.target.value)}
              />
            </div>

            <div>
              <label>discharge criteria:</label>
              <br />
              <input
                value={dischargeCriteria}
                onChange={(event) => setDischargeCriteria(event.target.value)}
              />
            </div>
          </>
        )}

        <button type="submit">add</button>
      </form>
    </div>
  );
};
export default AddEntryForm;
