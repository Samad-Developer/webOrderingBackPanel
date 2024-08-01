import React from "react";
import ReportComponent from "../../../components/formComponent/ReportComponent";

const WastageReport = () => {
  const data = [
    { name: "abcf", age: 23 },
    { name: "abcd", age: 21 },
    { name: "abce", age: 24 },
  ];
  return <ReportComponent rows={data} />;
};

export default WastageReport;
