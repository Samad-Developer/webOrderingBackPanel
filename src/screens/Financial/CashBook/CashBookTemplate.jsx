import Title from "antd/lib/typography/Title";

export default function CashBookTemplate(props) {
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
    <div style={{ padding: "20px 20px", border: "1px solid gray" }}>
      <div>
        <Title level={2} style={{ textAlign: "center" }}>
          Cash Book
        </Title>
        <Title level={4} style={{ textAlign: "center" }}>
          For the Period of {props.date}
        </Title>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ width: "48%" }}>
          <Title level={3} style={{ textAlign: "center" }}>
            Receipt
          </Title>
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr style={{ headRow }}>
                <th style={thCssHead}>S.No</th>
                <th style={thCssHead}>Description</th>
                <th style={thCssHead}>Voucher Date</th>
                {props.IsCash === null ||
                  (props.IsCash === 1 && <th style={thCssHead}>Cash</th>)}
                {props.IsCash === null ||
                  (props.IsCash === 2 && <th style={thCssHead}>Bank</th>)}
                <th style={thCssHead}>Voucher Number</th>
              </tr>
            </thead>
            <tbody>
              {props?.list?.map((x) => (
                <tr>
                  <td style={thCss}>{x.RowNum}</td>
                  <td style={thCss}>{x.RDescription}</td>
                  <td style={thCss}>{x.RVoucherDate}</td>
                  {props.IsCash === null ||
                    (props.IsCash === 1 && <td style={thCss}>{x.RCash}</td>)}
                  {props.IsCash === null ||
                    (props.IsCash === 2 && <td style={thCss}>{x.RBank}</td>)}
                  <td style={thCss}>{x.RVoucherNumber}</td>
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
                  }}
                  colSpan="3"
                >
                  Total
                </td>
                <td style={thCss}>{parseFloat(152623).toFixed(2)}</td>
              </tr> */}
            </tbody>
          </table>
        </div>
        <div>
          <div style={{ width: "50px" }}></div>
        </div>
        <div style={{ width: "48%" }}>
          <Title level={4} style={{ textAlign: "center" }}>
            Payment
          </Title>
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr style={{ headRow }}>
                <th style={thCssHead}>S.No</th>
                <th style={thCssHead}>Description</th>
                <th style={thCssHead}>Voucher Date</th>
                {props.IsCash === null ||
                  (props.IsCash === 1 && <th style={thCssHead}>Cash</th>)}
                {props.IsCash === null ||
                  (props.IsCash === 2 && <th style={thCssHead}>Bank</th>)}
                <th style={thCssHead}>Voucher Number</th>
              </tr>
            </thead>
            <tbody>
              {props?.list?.map((x) => (
                <tr>
                  <td style={thCss}>{x.RowNum}</td>
                  <td style={thCss}>{x.PDescription}</td>
                  <td style={thCss}>{x.PVoucherDate}</td>
                  {props.IsCash === null ||
                    (props.IsCash === 1 && <td style={thCss}>{x.PCash}</td>)}
                  {props.IsCash === null ||
                    (props.IsCash === 2 && <td style={thCss}>{x.PBank}</td>)}
                  <td style={thCss}>{x.PVoucherNumber}</td>
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
                  }}
                  colSpan="3"
                >
                  Total
                </td>
                <td style={thCss}>{parseFloat(152623).toFixed(2)}</td>
              </tr> */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
