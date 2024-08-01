import React from "react";
import ReportComponent from "../../../components/formComponent/ReportComponent";

const data = [
  { name: "abcf", age: 23 },
  { name: "abcd", age: 21 },
  { name: "abce", age: 24 },
  { name: "abcf", age: 23 },
  { name: "abcd", age: 21 },
  { name: "abce", age: 24 },
  { name: "abcf", age: 23 },
  { name: "abcd", age: 21 },
  { name: "abce", age: 24 },
  { name: "abcf", age: 23 },
  { name: "abcd", age: 21 },
  { name: "abce", age: 24 },
];

const NewWastageReport = () => {
  return (
    // <iframe
    //   width={"100%"}
    //   height={"99%"}
    //   style={{}}
    //   src="https://app.powerbi.com/view?r=eyJrIjoiOTdhMjliNDctMzk1NS00YTEzLTkyZTktNjAxOTc4MGM5YTEyIiwidCI6Ijg2MzllYzNhLTVkMzAtNGEwYi05Y2FjLWY3YWQ3MzU5NzAxNSIsImMiOjl9"
    // ></iframe>
    <table id="table">
      <tr>
        <td>ABCD</td>
        <td>
          <button
            onClick={() => {
              $("#table").table2excel({
                filename: "file.xls",
              });
            }}
          >
            export
          </button>
        </td>
      </tr>
    </table>
  );
  //   <ReportComponent rows={data} header={["Name", "Age"]} />;
};

export default NewWastageReport;
