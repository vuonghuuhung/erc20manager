import { cn } from "@/lib/utils";
import { FC, PropsWithChildren } from "react";

const BoxContent: FC<
  PropsWithChildren<{
    extendClassName?: string;
  }>
> = ({ children, extendClassName }) => {
  return (
    <div
      className={cn(
        "bg-white text-[#223354] shadow-tableShadow transition-shadow duration-300 ease-in-out rounded-[10px] px-[9px] overflow-hidden",
        extendClassName
      )}
    >
      {children}
    </div>
  );
};

export default BoxContent;
