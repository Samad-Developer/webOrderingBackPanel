import Title from "antd/lib/typography/Title";
import { useEffect, useState } from "react";

export default function PayOffTemplate(props) {
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

  useEffect(() => {
    setHl(props.headList);
    setLs(props.list);
  }, [props.headList, props.list]);

  return (
    <div id="table-to-xls" style={{ border: "1px solid gray", padding: 20 }}>
      <Title level={4} style={{ textAlign: "center" }}>
        Pay Off Report
      </Title>
      <Title level={5} style={{ textAlign: "center" }}>
        {props.date}
      </Title>
      <>
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr style={{ headRow }}>
              <th style={thCssHead}>Payment Section</th>
              <th style={thCssHead}>Tax Payer NTN</th>
              <th style={thCssHead}>Tax Payer CNIC</th>
              <th style={thCssHead}>Tax Payer Name</th>
              <th style={thCssHead}>Tax Payer Address</th>
              <th style={thCssHead}>Tax Payer Status</th>
              <th style={thCssHead}>Tax Amount</th>
              {/* <th style={thCssHead}>Balance</th> */}
            </tr>
          </thead>
          {props.list.length === 0 ? (
            <Title level={3}>No Data Found</Title>
          ) : (
            <tbody>
              {props?.list
                ?.filter((z) => z.COAID === x.COAID)
                .map((y) => (
                  <tr>
                    <td style={thCss}>{y.Date}</td>
                    <td style={thCss}>{y.VF}</td>
                    <td style={thCss}>{y.Particular}</td>
                    <td style={thCss}>{y.Description}</td>
                    <td style={thCss}>{y.VendorName}</td>
                    <td style={thCss}>{y.Debit}</td>
                    <td style={thCss}>{y.Credit}</td>
                    {/* <td style={thCss}>{y.Balance}</td> */}
                  </tr>
                ))}
              {/* <tr>
                <td
                  style={{
                    border: "1px solid black",
                    padding: "6px 12px",
                    display: "table-cell",
                    textAlign: "right",
                    fontWeight: "bold",
                    color: "black",
                  }}
                  colSpan="7"
                >
                  Closing Balance
                </td>
                <td style={thCss}>
                  {parseFloat(
                    props.list
                      ?.filter((z) => z.COAID === x.COAID)
                      .reduce((prev, next) => {
                        return (prev += next.Balance);
                      }, 0)
                  ).toFixed(2)}
                </td>
              </tr> */}
            </tbody>
          )}
        </table>
      </>
    </div>
  );
}
