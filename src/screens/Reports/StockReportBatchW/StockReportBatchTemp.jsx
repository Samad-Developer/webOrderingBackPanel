import Title from "antd/lib/typography/Title";

export default function BranchStockReportTempBw(props) {
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
        style={{
          borderCollapse: "collapse",
          width: "100%",
        }}
        id="table-to-xls"
      >
        <tr>
          <td colSpan={10}>
            <Title level={4} style={{ textAlign: "center" }}>
              Branch Stock Report Batchwise
            </Title>
          </td>
        </tr>
        <tr>
          <td colSpan={10}>
            <Title level={5} style={{ textAlign: "center" }}>
              {`Branch: ${props.branch}`}
            </Title>
          </td>
        </tr>

        <tr>
          <td colSpan={10}>
            <Title level={5} style={{ textAlign: "center" }}>
              {props.date}
            </Title>
          </td>
        </tr>
        <tr>
          <th style={thCssHead}>Category</th>
          <th style={thCssHead}>Purchase Unit</th>
          <th style={thCssHead}>Total Stock (In Purchase Unit)</th>
          <th style={thCssHead}>Unit Price (In Purchase)</th>
          <th style={thCssHead}>Issuance Unit</th>
          <th style={thCssHead}>Total Stock (In Issuance Unit)</th>
          <th style={thCssHead}>Batch Stock Amount (In Issuance)</th>
          <th style={thCssHead}>Unit Price (In Issaunce)</th>
          <th style={thCssHead}>Batch Stock Amount (In Purchase)</th>
        </tr>
        <tbody>
          {props?.list.map((y) => (
            <tr style={{ pageBreakInside: "avoid" }}>
              <th style={thCss}>{y.Category}</th>
              <th style={thCss}>{y["Purchase Unit"]}</th>
              <th style={thCss}>{y["Total Stock (In Purchase Unit)"]}</th>
              <th style={thCss}>{y["Unit Price (In Purchase)"]}</th>
              <th style={thCss}>{y["Issuance Unit"]}</th>
              <th style={thCss}>{y["Total Stock (In Issuance Unit)"]}</th>
              <th style={thCss}>
                {parseFloat(y["Batch Stock Amount (In Issuance)"]).toFixed(2)}
              </th>
              <th style={thCss}>{y["Unit Price (In Issaunce)"]}</th>
              <th style={thCss}>
                {parseFloat(y["Batch Stock Amount (In Purchase)"]).toFixed(2)}
              </th>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
