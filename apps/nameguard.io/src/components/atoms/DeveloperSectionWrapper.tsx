import { ReactNode } from "react";

type DeveloperSectionWrapperProps = {
  children: ReactNode;
};

export const DeveloperSectionWrapper = ({
  children,
}: DeveloperSectionWrapperProps) => {
  return (
    <div className="flex flex-row items-center justify-start gap-x-2 gap-y-1 flex-wrap">
      {children}
    </div>
  );
};
