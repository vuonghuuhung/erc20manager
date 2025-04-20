import img from "@/assets/images/DAOIcon.png";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FC } from "react";

const AvatarDAO: FC<{
  src?: string;
}> = ({ src }) => {
  
  return (
    <div className="rounded-full p-1 border mx-auto w-full h-full">
      <Avatar className="block rounded-full w-full h-full">
        <AvatarImage src={src} className="block rounded-full w-full h-full"/>
        <AvatarFallback className="block rounded-full w-full h-full">
          <img src={img} alt="Image"/>
        </AvatarFallback>
      </Avatar>
    </div>
  );
};

export default AvatarDAO;
