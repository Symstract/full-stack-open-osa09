import { Entry } from "../../types";
import { assertNever } from "../../utils";

interface EntryDetailsProps {
  entry: Entry;
}

const EntryDetails = ({ entry }: EntryDetailsProps) => {
  switch (entry.type) {
    case "Hospital":
      return (
        <div>
          Discharge: {entry.discharge.date} - {entry.discharge.criteria}
        </div>
      );
    case "OccupationalHealthcare":
      return (
        <div>
          <span>
            Employer: {entry.employerName} <br />
          </span>
          {entry.sickLeave && (
            <span>
              Sick leave: {entry.sickLeave.startDate} -{" "}
              {entry.sickLeave.endDate}
            </span>
          )}
        </div>
      );
    case "HealthCheck":
      return <div>Healt rating: {entry.healthCheckRating}</div>;
    default:
      assertNever(entry);
  }
};

export default EntryDetails;
