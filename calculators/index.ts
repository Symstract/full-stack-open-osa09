import express from "express";
import { calculateBmi } from "./bmiCalculator";
import { calculateExercises } from "./exerciseCalculator";

const app = express();

app.use(express.json());

app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack!");
});

app.get("/bmi", (req, res) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);

  if (isNaN(Number(height)) || isNaN(Number(weight))) {
    return res.status(400).json({ error: "malformatted parameters" });
  }

  return res.status(200).json({
    weight,
    height,
    bmi: calculateBmi(height, weight),
  });
});

app.post("/exercises", (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body;

  if (daily_exercises === undefined || target === undefined) {
    return res.status(400).json({ error: "parameters missing" });
  }

  if (!Array.isArray(daily_exercises) || !daily_exercises.length) {
    return res.status(400).json({ error: "malformatted parameters" });
  }

  const hoursAreValid = daily_exercises.every((hours): hours is number => {
    return typeof hours === "number" && !isNaN(hours);
  });

  if (!hoursAreValid) {
    return res.status(400).json({ error: "malformatted parameters" });
  }

  if (typeof target !== "number" || isNaN(target)) {
    return res.status(400).json({ error: "malformatted parameters" });
  }

  return res.status(200).json(calculateExercises(target, daily_exercises));
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
