import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import patientService from "../../services/patients";
import { Diagnosis, Entry, Patient } from "../../types";
import diagnoseService from "../../services/diagnoses";
import EntryDetails from "./EntryDetails";
import AddEntryForm from "./AddEntryForm";

const PatientDetailsPage = () => {
  const [patient, setPatient] = useState<Patient>();
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [error, setError] = useState("");

  const params = useParams();

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const patient = await patientService.getById(params.id as string);
        setPatient(patient);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (
            error?.response?.data &&
            typeof error?.response?.data === "string"
          ) {
            console.error(error.response.data);
            setError(error.response.data);
          }
        }
      }
    };
    fetchPatientDetails();
  }, [params.id]);

  useEffect(() => {
    const fetchDiagnoses = async () => {
      try {
        const diagnoses = await diagnoseService.getAll();
        setDiagnoses(diagnoses);
      } catch (error) {
        console.log(error);
      }
    };
    fetchDiagnoses();
  }, []);

  const addEntry = (entry: Entry) => {
    if (!patient) {
      return;
    }

    const updatedPatient = {
      ...patient,
      entries: patient.entries.concat(entry),
    };
    setPatient(updatedPatient);
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!patient) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{patient.name}</h2>
      <span>
        ssn: {patient.ssn} <br />
        gender: {patient.gender} <br />
        date of birth: {patient.dateOfBirth} <br />
        occupation: {patient.occupation}
      </span>
      <AddEntryForm
        patientId={patient.id}
        diagnosisOptions={diagnoses}
        onSuccess={addEntry}
      />
      <h3>entries</h3>
      {patient.entries.map((entry) => (
        <div key={entry.id} style={{ marginBottom: "16px" }}>
          <span>
            <b>{entry.date}</b> <i>{entry.description}</i>
          </span>
          {entry.diagnosisCodes && (
            <ul>
              {entry.diagnosisCodes.map((code) => (
                <li key={code}>
                  {code} {diagnoses.find((d) => code === d.code)?.name}
                </li>
              ))}
            </ul>
          )}
          <EntryDetails entry={entry} />
          <span>diagnose by {entry.specialist}</span>
        </div>
      ))}
    </div>
  );
};

export default PatientDetailsPage;
