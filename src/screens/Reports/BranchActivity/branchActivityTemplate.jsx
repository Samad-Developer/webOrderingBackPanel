import Title from "antd/lib/typography/Title";

export default function BranchActivityTemplate(props) {
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
      {props.list.length > 0 && (
        <table
          style={{ borderCollapse: "collapse", width: "100%" }}
          id="table-to-xls"
        >
          <tr>
            <td colSpan={15}>
              <Title level={4} style={{ textAlign: "center" }}>
                Branch Activity Report
              </Title>
            </td>
          </tr>
          <tr>
            <td colSpan={15}>
              <Title level={5} style={{ textAlign: "center" }}>
                {props.date}
              </Title>
            </td>
          </tr>

          <tr style={{ headRow }}>
            <td style={thCssHead}>Category</td>
            <td style={thCssHead}>Sub Category</td>
            <td style={thCssHead}>Item Name</td>
            <td style={thCssHead}>Unit</td>
            <td style={thCssHead}>Opening</td>
            <td style={thCssHead}>Direct Purchase</td>
            <td style={thCssHead}>Receiving</td>
            <td style={thCssHead}>Transfer</td>
            <td style={thCssHead}>Wastage</td>
            <td style={thCssHead}>Production</td>
            <td style={thCssHead}>Consumption</td>
            <td style={thCssHead}>Adjustment IN</td>
            <td style={thCssHead}>Adjustment OUT</td>
            <td style={thCssHead}>Stock in hand by system</td>
            <td style={thCssHead}>Physical Stock</td>
          </tr>

          <tbody>
            {props?.list.map((y) => (
              <tr style={{ pageBreakInside: "avoid" }}>
                <td style={thCss}>{y.Category}</td>
                <td style={thCss}>{y.Product}</td>
                <td style={thCss}>{y.Category}</td>
                <td style={thCss}>{y.UnitName}</td>
                <td style={thCss}>{y.Opening}</td>
                <td style={thCss}>{y.DirectPurchase}</td>
                <td style={thCss}>{y.Receiving}</td>
                <td style={thCss}>{y.Transfer}</td>
                <td style={thCss}>{y.Wastage}</td>
                <td style={thCss}>{y.Production}</td>
                <td style={thCss}>{y.Consumption}</td>
                <td style={thCss}>{y.AdjustmentIN}</td>
                <td style={thCss}>{y.AdjustmentOUT}</td>
                <td style={thCss}>{y.StockInHand}</td>
                <td style={thCss}>{y.PhysicalStock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
