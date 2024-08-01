import Title from "antd/lib/typography/Title";
import { useState } from "react";

export default function DemandvsIssuenceTemplate(props) {
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
    <div id="table-to-xls" style={{ border: "1px solid gray", padding: 20 }}>
      <Title level={4} style={{ textAlign: "center" }}>
        Demand Vs Issuance Report
      </Title>
      <Title level={5} style={{ textAlign: "center" }}>
        {props.date}
      </Title>

      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr style={{ headRow }}>
            <th style={thCssHead}>Demand Date</th>
            <th style={thCssHead}>Branch</th>
            <th style={thCssHead}>Demand No</th>
            <th style={thCssHead}>Issuance No</th>
            <th style={thCssHead}>Category</th>
            <th style={thCssHead}>Item</th>
            <th style={thCssHead}>Unit</th>
            <th style={thCssHead}>Demand Quantity</th>
            {/* <th style={thCssHead}>Demand Adjustment Quantity</th> */}
            <th style={thCssHead}>Issuance Quantity</th>
            <th style={thCssHead}>Difference</th>
          </tr>
        </thead>
        <tbody>
          {props?.list?.map((y) => (
            <tr>
              <td style={thCss}>{y.DemandDate?.split("T")[0]}</td>
              <td style={thCss}>{y.BranchName}</td>
              <td style={thCss}>{y.DemandNumber}</td>
              <td style={thCss}>{y.IssuanceNumber}</td>
              <td style={thCss}>{y.CategoryName}</td>
              <td style={thCss}>{y.ProductName}</td>
              <td style={thCss}>{y.UnitName}</td>
              <td style={thCss}>{y.DemandQuantityInIssue}</td>
              {/* <td style={thCss}>{y.ReceivedQty}</td> */}
              <td style={thCss}>{y.IssuanceQuantity}</td>
              <td style={thCss}>{y.QtyDifference}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* <Title level={5} style={{ textAlign: "right" }}>
            Issue Quantity :{" "}
            {
              props?.totalList?.filter(
                (e) => e.ProductDetailId === x.ProductDetailId
              )[0]?.IssueQty
            }{" "}
            | Transfer Quantity :{" "}
            {
              props?.totalList?.filter(
                (e) => e.ProductDetailId === x.ProductDetailId
              )[0]?.TransferQty
            }{" "}
            | Branch Receiving Quantity :{" "}
            {
              props?.totalList?.filter(
                (e) => e.ProductDetailId === x.ProductDetailId
              )[0]?.BranchRecevQty
            }
          </Title> */}
      {/* </> */}
    </div>
  );
}
