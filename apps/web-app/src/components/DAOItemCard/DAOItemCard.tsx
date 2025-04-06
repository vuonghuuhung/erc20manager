import IconBank from "@/assets/icons/IconBank";
import IconProposal from "@/assets/icons/IconProposal";
import { FC } from "react";
import AvatarDAO from "../AvatarDAO/AvatarDAO";
import { handleConvertToToken } from "@/utils/convertNumber";

const DAOItemCard: FC<{
  nameDao?: string;
  avatarDao?: string;
  description?: string;
  totalSupply?: bigint;
  totalProposal?: number;
  symbol: string;
}> = ({
  totalProposal,
  totalSupply,
  nameDao,
  description,
  symbol,
  avatarDao,
}) => {
  return (
    <div className="p-4 bg-[#202223] rounded-lg">
      <div>
        <div className="w-20 h-20 mx-auto">
          <AvatarDAO src={avatarDao || ""} />
        </div>
        <div>
          <div className="font-semibold text-white mb-8 text-[16px] text-center mt-1">
            {nameDao}
          </div>
          <div className="text-[#f3f6f8b3] text-[14px] mb-4 truncate">
            {description}
          </div>
        </div>
      </div>
      <div>
        <div className="text-gray-400 text-[12px] my-2 flex -center gap-1">
          <IconBank />
          <span>{handleConvertToToken(totalSupply || 0)}</span>
          <span>{symbol}</span>
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
