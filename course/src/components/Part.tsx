import type { ReactElement } from "react";

import type { CoursePart } from "../types";
import { assertNever } from "../utils";

interface PartProps {
  part: CoursePart;
}

const Part = ({ part }: PartProps) => {
  const title = (
    <span>
      <b>
        {part.name} {part.exerciseCount}
      </b>
      <br />
    </span>
  );
  let content: ReactElement;

  switch (part.kind) {
    case "basic":
      content = (
        <span>
          <i>{part.description}</i>
        </span>
      );
      break;
    case "group":
      content = <span>project exercises {part.groupProjectCount}</span>;
      break;
    case "background":
      content = (
        <>
          <span>
            <i>{part.description}</i>
          </span>
          <br />
          <span>{part.backgroundMaterial}</span>
        </>
      );
      break;
    case "special":
      content = (
        <>
          <span>
            <i>{part.description}</i>
          </span>
          <br />
          <span>required skills: {part.requirements.toString()}</span>
        </>
      );
      break;
    default:
      return assertNever(part);
  }

  return (
    <div>
      <p>
        {title}
        {content}
      </p>
    </div>
  );
};

export default Part;
