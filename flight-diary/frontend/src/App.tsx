import { useEffect, useState } from "react";

import type { DiaryEntry, NonSensitiveDiaryEntry } from "./types";
import { getAllEntries } from "./services/diaryService";
import Diary from "./components/Diary";
import EntryForm from "./components/EntryForm";

function App() {
  const [entries, setEntries] = useState<NonSensitiveDiaryEntry[]>([]);

  const addEntry = ({ id, date, visibility, weather }: DiaryEntry) => {
    const newNonSensitiveEntry: NonSensitiveDiaryEntry = {
      id,
      date,
      visibility,
      weather,
    };
    setEntries(entries.concat(newNonSensitiveEntry));
  };

  useEffect(() => {
    getAllEntries().then((response) => {
      if (response.success) {
        setEntries(response.data);
      } else {
        console.log(response.error.message);
      }
    });
  }, []);

  return (
    <div>
      <EntryForm onSuccess={addEntry} />
      <Diary entries={entries} />
    </div>
  );
}

export default App;
