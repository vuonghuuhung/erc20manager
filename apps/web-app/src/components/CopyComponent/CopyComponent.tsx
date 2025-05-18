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
    if (!tokenAddress) {
      toast.error("Some things went wrong", {
        position: "top-right",
      });
      return;
    }
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
      <FilesIcon className="w-4 h-4 text-[#adb5bd] hover:text-blue-600 transition-all duration-300" />
    </button>
  );
};

export default CopyComponent;
