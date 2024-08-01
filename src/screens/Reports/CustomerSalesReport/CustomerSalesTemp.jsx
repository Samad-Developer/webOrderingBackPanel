import Title from "antd/lib/typography/Title";
import { useState } from "react";
import { dateformatFunction } from "../../../functions/dateFunctions";

export default function CustomerSalesTemp(props) {
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
          <td colSpan={10}>
            <Title level={4} style={{ textAlign: "center" }}>
              Customer Sales Report
            </Title>
          </td>
        </tr>
        <tr>
          <td colSpan={7}>
            <Title level={5} style={{ textAlign: "left" }}>
              {`Address: ${props.branchAddress}`}
            </Title>
          </td>
          {/* <td colSpan={3}>
            <Title level={5} style={{ textAlign: "left" }}>
              {props.tehsil}
            </Title>
          </td> */}
          <td colSpan={3}>
            <Title level={5} style={{ textAlign: "right" }}>
              {`City: ${props.city}`}
            </Title>
          </td>
        </tr>
        <tr style={{ headRow }}>
          <td style={thCssHead}>Index No</td>
          <td style={thCssHead}>Order No</td>
          <td style={thCssHead}>Date</td>
          <td style={thCssHead}>Name</td>
          <td style={thCssHead}>Cnic No</td>
          <td style={thCssHead}>Product Type</td>
          <td style={thCssHead}>Product Name</td>
          <td style={thCssHead}>Quantity </td>
          <td style={thCssHead}>Price per Unit</td>
          <td style={thCssHead}>Total Amount</td>
          {/* <td style={thCssHead}>Fertilizer Provider Signature</td> */}
        </tr>
        <tbody>
          {props?.list.map((y, index) => (
            <tr style={{ pageBreakInside: "avoid" }}>
              <td style={thCss}>{++index}</td>
              <td style={thCss}>{y.OrderNumber}</td>
              <td style={thCss}>{dateformatFunction(y.OrderDate)}</td>
              <td style={thCss}>{y.CustomerName}</td>
              <td style={thCss}>{y.CNIC}</td>
              <td style={thCss}>{y.CategoryName}</td>
              <td style={thCss}>{y.ProductDetailName}</td>
              <td style={thCss}>{y.Quantity}</td>
              <td style={thCss}>{y.PerItemPrice}</td>
              <td style={thCss}>{y.PriceWithoutGST}</td>
              {/* <td style={thCss}>{y.Signature}</td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
