import { useRef } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";

interface Props {
  onChange?: (file?: File) => void;
}

const InputFile = ({ onChange }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileFromLocal = e.target.files?.[0];
    if (
      fileFromLocal &&
      (fileFromLocal.size >= 1048576 || !fileFromLocal.type.includes("image"))
    ) {
      toast("Dụng lượng file tối đa 1 MB Định dạng: .JPEG, .PNG");
    } else {
      onChange?.(fileFromLocal);
    }
  };
  return (
    <>
      <input
        className="hidden"
        type="file"
        accept=".jpg,.jpeg,.png"
        ref={fileInputRef}
        onChange={onFileChange}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onClick={(e) => ((e.target as any).value = null)}
      />
      <button
        type="button"
        onClick={handleUpload}
        className="flex items-center h-full justify-center w-full rounded-sm border px-6 text-sm  shadow-sm"
      >
        <Plus />
      </button>
    </>
  );
};

export default InputFile;
