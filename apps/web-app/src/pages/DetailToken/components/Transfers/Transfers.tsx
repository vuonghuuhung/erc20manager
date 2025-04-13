import { useParams } from "react-router-dom";

const Transfers = () => {
  const { id } = useParams<{ id: `0x${string}` }>();

  return <div>Transfers</div>;
};

export default Transfers;
