import IconBank from "@/assets/icons/IconBank";
import IconProposal from "@/assets/icons/IconProposal";
import { FC } from "react";
import AvatarDAO from "../AvatarDAO/AvatarDAO";

const DAOItemCard: FC<{
  item: {
    image: string;
    name: string;
    description: string;
    totalSupply: string;
    totalProposal: number;
  };
}> = ({ item }) => {
  return (
    <div className="p-4 max-w-[256px] bg-[#202223] rounded-lg">
      <div>
        <div className="w-20 h-20 mx-auto"><AvatarDAO src={item.image} /></div>
        <div>
          <div className="text-lg font-semibold text-white mb-8 text-[16px] text-center mt-1">
            {item.name}
          </div>
          <div className="text-[#f3f6f8b3] text-[14px] mb-4">
            {item.description}
          </div>
        </div>
      </div>
      <div>
        <div className="text-gray-400 text-[12px] my-2 flex items-center gap-1">
          <IconBank />
          <span>{item.totalSupply}</span>
        </div>
        <div className="text-gray-400 text-[12px] flex items-center gap-1">
          <IconProposal />
          <span className="ml-1">{item.totalProposal}</span> Proposals
        </div>
      </div>
    </div>
  );
};

export default DAOItemCard;
