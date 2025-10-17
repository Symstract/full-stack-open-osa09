interface calculatorValues {
  target: number;
  dailyHours: number[];
}

const parseArguments = (args: string[]): calculatorValues => {
  if (args.length < 4) throw new Error("Not enough arguments");

  const target = Number(args[2]);
  const dailyHours = args.slice(3).map((h) => Number(h));

  if (isNaN(target)) {
    throw new Error("Target was not a number!");
  }

  dailyHours.forEach((h) => {
    if (isNaN(h)) {
      throw new Error("Provided hours were not numbers!");
    }
  });

  return {
    target,
    dailyHours,
  };
};

interface exerciseCalculatorResult {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

export const calculateExercises = (
  target: number,
  dailyHours: number[]
): exerciseCalculatorResult => {
  const periodLength = dailyHours.length;
  const totalHours = dailyHours.reduce((prev, cur) => prev + cur);
  const average = totalHours / periodLength;
  const HourTargetRatio = average / target;

  let rating: number;
  let ratingDescription: string;

  if (HourTargetRatio >= 1) {
    rating = 3;
    ratingDescription = "Target reached, great effort!";
  } else if (HourTargetRatio >= 0.5) {
    rating = 2;
    ratingDescription = "Not bad but there's' room for improvement.";
  } else {
    rating = 1;
    ratingDescription =
      "Low effort unfortunately... Hopefully next time is better.";
  }

  return {
    periodLength,
    trainingDays: dailyHours.filter((h) => h !== 0).length,
    success: average >= target,
    rating,
    ratingDescription,
    target,
    average,
  };
};

if (require.main === module) {
  try {
    const { target, dailyHours } = parseArguments(process.argv);
    console.log(calculateExercises(target, dailyHours));
  } catch (error: unknown) {
    let errorMessage = "Something bad happened.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }
    console.log(errorMessage);
  }
}
