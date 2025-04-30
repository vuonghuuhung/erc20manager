import { FilesIcon } from "lucide-react";
import { toast } from "sonner";

const CopyComponent = ({
  tokenAddress,
  className,
}: {
  tokenAddress?: string;
  className?: string;
}) => {
  const handleCopyAddress = () => {
    navigator.clipboard
      .writeText(tokenAddress || "")
      .then(() => {
        toast.success("Copy successful", {
          position: "top-right",
        });
      })
      .catch((err) => {
        console.error("error", err);
      });
  };
  return (
    <button className={className} onClick={handleCopyAddress}>
      <FilesIcon className="w-4 h-4 text-[#adb5bd]" />
    </button>
  );
};

export default CopyComponent;
