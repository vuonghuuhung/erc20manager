import IconBank from "@/assets/icons/IconBank";
import IconProposal from "@/assets/icons/IconProposal";
import { FC } from "react";
import AvatarDAO from "../AvatarDAO/AvatarDAO";
import imageDao from "@/assets/images/DAOIcon.png";

const DAOItemCard: FC<{
    nameDao?: string;
    description?: string;
    totalSupply?: string;
    totalProposal?: number;
}> = ({ totalProposal,totalSupply="100", nameDao="Cosmos Hub", description }) => {
  return (
    <div className="p-4 max-w-[256px] bg-[#202223] rounded-lg">
      <div>
        <div className="w-20 h-20 mx-auto"><AvatarDAO src={imageDao} /></div>
        <div>
          <div className="text-lg font-semibold text-white mb-8 text-[16px] text-center mt-1">
            {nameDao}
          </div>
          <div className="text-[#f3f6f8b3] text-[14px] mb-4">
            {description}
          </div>
        </div>
      </div>
      <div>
        <div className="text-gray-400 text-[12px] my-2 flex -center gap-1">
          <IconBank />
          <span>{totalSupply}</span>
        </div>
        <div className="text-gray-400 text-[12px] flex -center gap-1">
          <IconProposal />
          <span className="ml-1">{totalProposal}</span> Proposals
        </div>
      </div>
    </div>
  );
};

export default DAOItemCard;
