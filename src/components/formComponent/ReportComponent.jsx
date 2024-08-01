import { Button } from "antd";
import React from "react";
import { CSVLink } from "react-csv";

const ReportComponent = ({
  rows = [],
  fileName = "report",
  csvButtonName = "Export To Excel",
  pdfButtonName = "Export To PDF",
  renderCsvButton = null,
  target = "_blank",
  header = [],
  showPdf = false,
  pdfFunction = () => {},
  customTable = false,
  table,
  disableExcel,
  testItem,
}) => {
  return (
    <div style={{ margin: 10 }}>
      <div style={{ marginBottom: 10, display: "flex" }}>
        <CSVLink
          data={rows}
          fileName={`${fileName}.csv`}
          target={target}
          asyncOnClick={true}
          onClick={(event, done) => {
            if (rows === []) {
              return;
            }
            done(true);
          }}
        >
          {renderCsvButton === null ? (
            <Button
              type="primary"
              onClick={pdfFunction}
              disabled={disableExcel}
            >
              {csvButtonName}
            </Button>
          ) : (
            renderCsvButton
          )}
        </CSVLink>
        {showPdf && <Button type="primary">{pdfButtonName}</Button>}
      </div>
      {customTable === true && rows.length > 0 ? (
        table
      ) : (
        <div className="ant-table">
          <table id="printable" style={{ tableLayout: "auto" }}>
            <thead className="ant-table-thead">
              <tr className="ant-table-row ant-table-row-level-0">
                {header.map((x) => (
                  <td
                    className="ant-table-cell"
                    style={{ padding: "10px 15px" }}
                  >
                    <b>{x}</b>
                  </td>
                ))}
              </tr>
            </thead>
            <tbody className="ant-table-tbody">
              {rows.map((x) => (
                <tr>
                  {Object.keys(x).map((y) => (
                    <td className="ant-table-cell">{x[y]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReportComponent;
