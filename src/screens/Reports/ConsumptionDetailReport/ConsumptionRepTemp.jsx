import Title from "antd/lib/typography/Title";

const headRow = {
  display: "table-row",
  fontWeight: "900",
  color: "#ffffff",
};

export default function ConsumptionDetailRepTemp(props) {
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

  return (
    <div style={{ border: "1px solid gray", padding: 20 }}>
      <table
        style={{ borderCollapse: "collapse", width: "100%" }}
        id="table-to-xls"
      >
        <tr>
          <td colSpan={8}>
            <Title level={4} style={{ textAlign: "center" }}>
              Consumption Detail Report:{props.branch}
            </Title>
          </td>
        </tr>
        <tr>
          <td colSpan={8}>
            <Title level={5} style={{ textAlign: "center" }}>
              {props.date}
            </Title>
          </td>
        </tr>
        <tr style={{ headRow }}>
          <td style={thCssHead}>Category</td>
          <td style={thCssHead}>Product</td>
          <td style={thCssHead}>Branch Name</td>
          <td style={thCssHead}>Purchase Unit</td>
          <td style={thCssHead}>Issuance Unit</td>
          <td style={thCssHead}>Consume Unit</td>
          <td style={thCssHead}>Total Qonsume Qty</td>
          <td style={thCssHead}>Issuance Qty </td>
        </tr>
        <tbody>
          {props?.list.map((y, index) => (
            <tr style={{ pageBreakInside: "avoid" }}>
              <td style={thCss}>{y.Category}</td>
              <td style={thCss}>{y.Product}</td>
              <td style={thCss}>{y["Branch Name"]}</td>
              <td style={thCss}>{y["Purchase Unit"]}</td>
              <td style={thCss}>{y["Issuance Unit"]}</td>
              <td style={thCss}>{y["Consume Unit"]}</td>
              <td style={thCss}>
                {parseFloat(y["Total Consume Qty"]).toFixed(2)}
              </td>
              <td style={thCss}>{parseFloat(y["Issuance Qty"]).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
