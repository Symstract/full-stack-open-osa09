import { useState } from "react";

import { createEntry } from "../services/diaryService";
import type { DiaryEntry, Visibility, Weather } from "../types";

interface EntryFormProps {
  onSuccess: { (newEntry: DiaryEntry): void };
}

const EntryForm = ({ onSuccess }: EntryFormProps) => {
  const [date, setDate] = useState("");
  const [visibility, setVisibility] = useState<Visibility>("great");
  const [weather, setWeather] = useState<Weather>("sunny");
  const [comment, setComment] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const visibilityOptions: Visibility[] = ["great", "good", "ok", "poor"];
  const weatherOptions: Weather[] = [
    "sunny",
    "rainy",
    "cloudy",
    "windy",
    "stormy",
  ];

  const entryCreation = (event: React.SyntheticEvent) => {
    event.preventDefault();

    createEntry({ date, visibility, weather, comment }).then((response) => {
      if (!response.success) {
        setErrorMessage(response.error.message);
        return;
      }

      setErrorMessage("");
      onSuccess(response.data);
      setDate("");
      setVisibility("great");
      setWeather("sunny");
      setComment("");
    });
  };

  return (
    <div>
      <h2>Add new entry</h2>
      {errorMessage && <span style={{ color: "red" }}>{errorMessage}</span>}
      <form onSubmit={entryCreation}>
        <div>
          <label>date:</label>
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </div>
        <div>
          <label>visibility:</label>
          {visibilityOptions.map((option) => (
            <span key={option}>
              <label>{option}</label>
              <input
                type="radio"
                name="visibility"
                onChange={() => setVisibility(option)}
              />
            </span>
          ))}
        </div>
        <div>
          <label>weather:</label>
          {weatherOptions.map((option) => (
            <span key={option}>
              <label>{option}</label>
              <input
                type="radio"
                name="weather"
                onChange={() => setWeather(option)}
              />
            </span>
          ))}
        </div>
        <div>
          <label>Comment:</label>
          <textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
          />
        </div>
        <button type="submit">add</button>
      </form>
    </div>
  );
};
export default EntryForm;
