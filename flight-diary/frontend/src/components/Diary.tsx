import type { NonSensitiveDiaryEntry } from "../types";
import Entry from "./Entry";

interface DiaryProps {
  entries: NonSensitiveDiaryEntry[];
}

const Diary = ({ entries }: DiaryProps) => {
  return (
    <div>
      <h2>Diary entries</h2>
      {entries.map((entry) => (
        <Entry key={entry.id} entry={entry} />
      ))}
    </div>
  );
};

export default Diary;
