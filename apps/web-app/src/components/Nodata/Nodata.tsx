import NoData from "@/assets/icons/NoData";
import { FC } from "react";

interface NodataProps {
  title?: string;
  description?: string;
}

const Nodata: FC<NodataProps> = ({
  title = "No Data Found",
  description = "There is no data to display at the moment",
}) => {
  return (
    <div className="flex items-center justify-center flex-col min-h-[200px]">
      <div className="rounded-full bg-gray-800/50 p-6 mb-4">
        <NoData />
      </div>
      <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
        {title}
      </h3>
      <p className="mt-2 text-sm text-gray-400">{description}</p>
    </div>
  );
};

export default Nodata;
