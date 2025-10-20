import type { NonSensitiveDiaryEntry } from "../types";

interface EntryProps {
  entry: NonSensitiveDiaryEntry;
}

const Entry = ({ entry }: EntryProps) => {
  return (
    <div>
      <h3>{entry.date}</h3>
      <p>
        visibility: {entry.visibility} <br /> weather: {entry.weather}
      </p>
    </div>
  );
};

export default Entry;
