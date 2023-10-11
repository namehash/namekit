import React from "react";

interface ReportProps {
  name: string;
}

const Report: React.FC<ReportProps> = ({ name }) => (
  <button className="bg-red-500 p-5 text-white">{name}</button>
);

export default Report;
