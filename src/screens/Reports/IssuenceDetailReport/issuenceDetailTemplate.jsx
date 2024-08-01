import { FilterFilled } from "@ant-design/icons";
import Title from "antd/lib/typography/Title";
import { useEffect, useState } from "react";

export default function IssuenceDetailTemplate(props) {
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
    <div style={{ border: "1px solid gray", padding: 20 }}>
      <>
        <table
          style={{ borderCollapse: "collapse", width: "100%" }}
          id="table-to-xls"
        >
          <tr>
            <td colSpan={10}>
              <Title level={4} style={{ textAlign: "center" }}>
                Issuance Detail Report
              </Title>
            </td>
          </tr>
          {props?.parentList?.map((x) => {
            return (
              <>
                <tr>
                  <td colSpan={7}>
                    <Title level={4} style={{ textAlign: "center" }}>
                      {x.CategoryName} - {x.ProductName}
                    </Title>
                  </td>
                </tr>

                <tr>
                  <td colSpan={7}>
                    <Title level={5} style={{ textAlign: "center" }}>
                      {props.date}
                    </Title>
                  </td>
                </tr>

                <tr style={{ headRow }}>
                  <td style={thCssHead}>Issuance Date</td>
                  <td style={thCssHead}>Issuance Number</td>
                  <td style={thCssHead}>Branch Name</td>
                  {/* <td style={thCssHead}>Batch Number</td> */}
                  <td style={thCssHead}>Item</td>
                  <td style={thCssHead}>Issuance Unit</td>
                  {/* <td style={thCssHead}>Amount</td> */}
                  <td style={thCssHead}>Issuance Quantity</td>
                  {/* <td style={thCssHead}>Batch Quantity</td> */}
                  {/* <td style={thCssHead}>Batch Price</td> */}
                  {/* <th style={thCssHead}>Branch Receiving Quantity</th> */}
                </tr>

                <tbody>
                  {props?.list
                    ?.filter((e) => e.ProductDetailId === x.ProductDetailId)
                    ?.map((y) => (
                      <tr style={{ pageBreakInside: "avoid" }}>
                        <td style={thCss}>{y.IssuanceDate.split("T")[0]}</td>
                        <td style={thCss}>{y.IssuanceNumber}</td>
                        <td style={thCss}>{y.BranchName}</td>
                        {/* <td style={thCss}>{y.BranchName}</td> */}
                        <td style={thCss}>{y.ProductName}</td>
                        <td style={thCss}>{y.IssuanceUnit}</td>
                        {/* <td style={thCss}>{y.Amount}</td> */}
                        <td style={thCss}>{y.IssueQty}</td>
                        {/* <td style={thCss}>{y.BatchQuantity}</td> */}
                        {/* <td style={thCss}>{y.BachPrice}</td> */}
                        {/* <td style={thCss}>{y.BranchReceivingQty}</td> */}
                      </tr>
                    ))}
                </tbody>
                <tr>
                  <td>
                    <Title level={5} style={{ textAlign: "right" }}>
                      Total Issue Quantity :{" "}
                      {
                        props?.totalList?.filter(
                          (e) => e.ProductDetailId === x.ProductDetailId
                        )[0]?.TotalIssueQty
                      }
                    </Title>
                  </td>
                </tr>
              </>
            );
          })}
        </table>
      </>
    </div>
  );
}
