import { FC } from "react";

const AvatarDAO: FC<{
  src: string;
}> = ({ src }) => {
  return (
    <div className="rounded-full p-1 border mx-auto w-full h-full">
      <img src={src} alt="DAO" className="block rounded-full w-full h-full" />
    </div>
  );
};

export default AvatarDAO;
