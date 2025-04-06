import { FC } from "react";
import img from "@/assets/images/DAOIcon.png";
const AvatarDAO: FC<{
  src: string;
}> = ({ src }) => {
  return (
    <div className="rounded-full p-1 border mx-auto w-full h-full">
      <img
        src={src || img}
        alt="DAO"
        className="block rounded-full w-full h-full"
      />
    </div>
  );
};

export default AvatarDAO;
