import Title from "antd/lib/typography/Title";
import { useState } from "react";

export default function ClosingReportTemplate(props) {
  const thCss = {
    border: "1px solid black",
    padding: "6px 12px",
    display: "table-cell",
    color: "black",
  };
  const thCssHead = {
    border: "1px solid black",
    padding: "6px 12px",
    display: "table-cell",
    background: "#4561b9",
    color: "white",
    fontWeight: "bold",
  };
  const headRow = {
    display: "table-row",
    fontWeight: "900",
    color: "#ffffff",
  };

  return (
    <div style={{ border: "1px solid gray", padding: 20 }}>
      <table
        style={{ borderCollapse: "collapse", width: "100%" }}
        id="table-to-xls"
      >
        <tr>
          <td colSpan={6}>
            <Title level={4} style={{ textAlign: "center" }}>
              Closing Report
            </Title>
          </td>
        </tr>
        <tr>
          <td colSpan={6}>
            <Title level={5} style={{ textAlign: "center" }}>
              {props.date}
            </Title>
          </td>
        </tr>
        <tr style={{ headRow }}>
          <td style={thCssHead}>Category</td>
          <td style={thCssHead}>Product</td>
          <td style={thCssHead}>Batch Number</td>
          <td style={thCssHead}>Amount</td>
          <td style={thCssHead}>Unit</td>
          <td style={thCssHead}>Closing</td>
        </tr>
        <tbody>
          {props?.list.map((y) => (
            <tr>
              <td style={thCss}>{y.Category}</td>
              <td style={thCss}>{y.Product}</td>
              <td style={thCss}>{y.BatchNumber}</td>
              <td style={thCss}>{y.Amount}</td>
              <td style={thCss}>{y.UnitName}</td>
              <td style={thCss}>{y.Closing}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
