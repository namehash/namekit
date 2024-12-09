import React from "react";

interface IconLabelProps {
  icon: React.ReactElement;
  title: string;
}

export const IconLabel = ({ icon, title }: IconLabelProps) => {
  return (
    <div>
      <div className="gap-2 bg-black inline-flex items-center bg-opacity-5 px-4 py-2 rounded-[20px]">
        {icon}
        <p>{title}</p>
      </div>
    </div>
  );
};

export default IconLabel;
