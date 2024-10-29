import { ReactNode } from "react";

type DeveloperSectionTitleProps = {
  children: ReactNode;
};

export const DeveloperSectionTitle = ({
  children,
}: DeveloperSectionTitleProps) => {
  return (
    <h3 className="self-stretch not-italic z-10 text-black text-left text-sm leading-6 font-semibold whitespace-nowrap">
      {children}
    </h3>
  );
};
