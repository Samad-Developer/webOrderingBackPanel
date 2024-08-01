import { FilterFilled } from "@ant-design/icons";
import Title from "antd/lib/typography/Title";
import { useEffect, useState } from "react";

export default function PNLDetailTemplate(props) {
  const [hl, setHl] = useState([]);
  const [ls, setLs] = useState([]);
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
        Issuance Detail Report
      </Title>
      <Title level={5} style={{ textAlign: "center" }}>
        {props.date}
      </Title>
      {props?.parentList?.map((x) => (
        <>
          <Title level={4} style={{ textAlign: "center" }}>
            {x.CategoryName} - {x.ProductName}
          </Title>
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr style={{ headRow }}>
                <th style={thCssHead}>Issuance Date</th>
                <th style={thCssHead}>Issuance Number</th>
                <th style={thCssHead}>Branch Name</th>
                <th style={thCssHead}>Issuance Quantity</th>
                <th style={thCssHead}>Batch Quantity</th>
                <th style={thCssHead}>Batch Price</th>
                {/* <th style={thCssHead}>Branch Receiving Quantity</th> */}
              </tr>
            </thead>
            <tbody>
              {props?.list
                ?.filter((e) => e.ProductDetailId === x.ProductDetailId)
                ?.map((y) => (
                  <tr>
                    <td style={thCss}>{y.IssuanceDate}</td>
                    <td style={thCss}>{y.IssuanceNumber}</td>
                    <td style={thCss}>{y.BranchName}</td>
                    <td style={thCss}>{y.IssueQty}</td>
                    <td style={thCss}>{y.BatchQuantity}</td>
                    <td style={thCss}>{y.BachPrice}</td>
                    {/* <td style={thCss}>{y.BranchReceivingQty}</td> */}
                  </tr>
                ))}
            </tbody>
          </table>
          <Title level={5} style={{ textAlign: "right" }}>
            Total Issue Quantity :{" "}
            {
              props?.totalList?.filter(
                (e) => e.ProductDetailId === x.ProductDetailId
              )[0]?.TotalIssueQty
            }
          </Title>
          ;
        </>
      ))}
    </div>
  );
}
