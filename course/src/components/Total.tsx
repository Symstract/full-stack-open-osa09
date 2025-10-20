interface TotalProps {
  count: number;
}

const Total = ({ count }: TotalProps) => {
  return <p>Number of exercises {count}</p>;
};

export default Total;
