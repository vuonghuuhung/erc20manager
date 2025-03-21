import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { X } from "lucide-react";

export enum MODAL_STEP {
  PROCESSING = "PROCESSING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
  READY = "READY",
}
interface Props {
  children?: React.ReactNode;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<MODAL_STEP>>;
  statusStep: MODAL_STEP | null;
  contentStep?: string;
}

interface PropsContent {
  content?: string;
  setOpen?: React.Dispatch<React.SetStateAction<MODAL_STEP>>;
}

const SuccessContent = ({ content, setOpen }: PropsContent) => {
  return (
    <div className={`flex items-center justify-center gap-4 flex-col`}>
      <button
        onClick={() => setOpen?.(MODAL_STEP.READY)}
        className="absolute right-4 top-4"
      >
        <X className="h-4 w-4" />
      </button>
      <div className="text-black text-center text-[18px] font-semibold">
        {content || "Transaction successfully!"}
      </div>
    </div>
  );
};

const FailedContent = ({ content, setOpen }: PropsContent) => {
  return (
    <div className={`flex items-center justify-center gap-4 flex-col`}>
      <button
        onClick={() => setOpen?.(MODAL_STEP.READY)}
        className="absolute right-4 top-4"
      >
        <X className="h-4 w-4" />
      </button>
      <div className="text-black text-center text-[18px] font-semibold">
        {content || "Transaction failed!"}
      </div>
    </div>
  );
};

const ProcessingContent = ({ content }: PropsContent) => {
  return (
    <div className={`flex items-center justify-center gap-4 flex-col`}>
      <svg
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 784.37 1277.39"
        clipRule="evenodd"
        fillRule="evenodd"
        imageRendering="optimizeQuality"
        textRendering="geometricPrecision"
        shapeRendering="geometricPrecision"
        version="1.1"
        height="100%"
        width="40"
        xmlSpace="preserve"
        xmlns="http://www.w3.org/2000/svg"
        className="h-[50px] ease-in-out animate-float"
      >
        <g id="Layer_x0020_1">
          <metadata id="CorelCorpID_0Corel-Layer" />
          <g id="_1421394342400">
            <g>
              <polygon
                points="392.07,0 383.5,29.11 383.5,873.74 392.07,882.29 784.13,650.54"
                fillRule="nonzero"
                fill="#343434"
              />
              <polygon
                points="392.07,0 -0,650.54 392.07,882.29 392.07,472.33"
                fillRule="nonzero"
                fill="#8C8C8C"
              />
              <polygon
                points="392.07,956.52 387.24,962.41 387.24,1263.28 392.07,1277.38 784.37,724.89"
                fillRule="nonzero"
                fill="#3C3C3B"
              />
              <polygon
                points="392.07,1277.38 392.07,956.52 -0,724.89"
                fillRule="nonzero"
                fill="#8C8C8C"
              />
              <polygon
                points="392.07,882.29 784.13,650.54 392.07,472.33"
                fillRule="nonzero"
                fill="#141414"
              />
              <polygon
                points="0,650.54 392.07,882.29 392.07,472.33"
                fillRule="nonzero"
                fill="#393939"
              />
            </g>
          </g>
        </g>
      </svg>
      <div className="text-black text-center text-[18px] font-semibold">
        {content || "Transaction processing..."}
      </div>
    </div>
  );
};

const ModalStep = ({
  children,
  open,
  setOpen,
  statusStep,
  contentStep,
}: Props) => {
  return (
    <AlertDialog open={open}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[425px]">
        <div>
          {statusStep === MODAL_STEP.PROCESSING && (
            <ProcessingContent content={contentStep} />
          )}
          {statusStep === MODAL_STEP.SUCCESS && (
            <SuccessContent setOpen={setOpen} content={contentStep} />
          )}
          {statusStep === MODAL_STEP.FAILED && (
            <FailedContent setOpen={setOpen} content={contentStep} />
          )}
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ModalStep;
