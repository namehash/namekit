import { ReactNode } from "react";

type DeveloperSectionIconWrapperProps = {
  children: ReactNode;
};

export const DeveloperSectionIconWrapper = ({
  children,
}: DeveloperSectionIconWrapperProps) => {
  return (
    <div className="w-11 h-11 p-[10px] flex justify-center items-center flex-shrink-0 bg-black rounded-lg">
      {children}
    </div>
  );
};
