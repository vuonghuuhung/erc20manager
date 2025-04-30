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
    <div className="group min-h-[300px] relative overflow-hidden rounded-xl border border-gray-700/50 bg-gradient-to-b from-gray-900/90 to-gray-800/90 p-5 transition-all duration-300 hover:border-gray-600/50 hover:shadow-lg hover:shadow-blue-500/10">
      <div className="relative z-10">
        <div className="w-20 h-20 mx-auto mb-4 transform transition-transform duration-300 group-hover:scale-105">
          <AvatarDAO src={avatarDao || ""} />
        </div>
        <div>
          <h3 className="mb-2 text-center text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            {nameDao}
          </h3>
          <p className="mb-4 text-sm text-gray-400 line-clamp-2 text-center">
            {description}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2 text-sm">
            <div className="flex items-center gap-1.5 rounded-lg bg-blue-500/10 px-2.5 py-1.5 text-blue-400">
              <IconBank />
              <span>
                {handleConvertToToken(totalSupply || 0)} {symbol}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm">
            <div className="flex items-center gap-1.5 rounded-lg bg-purple-500/10 px-2.5 py-1.5 text-purple-400">
              <IconProposal />
              <span>{totalProposal} Proposals</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    </div>
  );
};

export default DAOItemCard;
