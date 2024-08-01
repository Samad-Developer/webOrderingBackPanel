import { FilterFilled } from "@ant-design/icons";
import Title from "antd/lib/typography/Title";
import { useEffect, useState } from "react";

export default function GeneralLedgerTemplate(props) {
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
        General Ledger
      </Title>
      <Title level={5} style={{ textAlign: "center" }}>
        {props.date}
      </Title>

      {props?.headList?.map((x) => (
        <>
          <Title level={5} style={{ textAlign: "center", marginTop: 10 }}>
            {x.AccountName}
          </Title>
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr style={{ headRow }}>
                <th style={thCssHead}>Date</th>
                <th style={thCssHead}>Voucher #</th>
                <th style={thCssHead}>Particulars</th>
                <th style={thCssHead}>Description</th>
                <th style={thCssHead}>Vendor</th>
                <th style={thCssHead}>IN</th>
                <th style={thCssHead}>OUT</th>
                <th style={thCssHead}>Balance</th>
              </tr>
            </thead>
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
                    <td style={thCss}>{y.Balance}</td>
                  </tr>
                ))}
              <tr>
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
              </tr>
            </tbody>
          </table>
        </>
      ))}
    </div>
  );
}
