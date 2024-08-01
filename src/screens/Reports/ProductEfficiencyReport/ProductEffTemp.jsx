import Title from "antd/lib/typography/Title";

const ProductEffTemplate = (props) => {
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
    <div
      style={{
        border: "1px solid gray",
        padding: 20,
        backgroundColor: "white",
      }}
    >
      <div style={{ width: "100%", overflow: "auto", padding: 20 }}>
        <table style={{ borderCollapse: "collapse" }} id="table-to-xls">
          <tr>
            <td colSpan={19}>
              <Title level={4} style={{ textAlign: "center" }}>
                Product Efficiency Report
              </Title>
            </td>
          </tr>
          <tr>
            <td colSpan={19}>
              <Title level={4} style={{ textAlign: "center" }}>
                {`Branch: ${props.branch}`}
              </Title>
            </td>
          </tr>

          <tr>
            <td colSpan={19}>
              <Title level={5} style={{ textAlign: "center" }}>
                {props.date}
              </Title>
            </td>
          </tr>

          <tr style={{ headRow }}>
            <td style={thCssHead}>Date</td>
            <td style={thCssHead}>Category Name</td>
            <td style={thCssHead}>Product Name</td>
            <td style={thCssHead}>Unit Name</td>
            <td style={thCssHead}>Issue Consume Conversion</td>
            <td style={thCssHead}>Opening Stock</td>
            <td style={thCssHead}>Total Purchase</td>
            <td style={thCssHead}>Total Transfer In</td>
            <td style={thCssHead}>Total Production In</td>
            <td style={thCssHead}>Total Adjusment In</td>
            <td style={thCssHead}>Total Production Out</td>
            <td style={thCssHead}>Total Adjustment Out</td>
            <td style={thCssHead}>Total Issuance Out</td>
            <td style={thCssHead}>Total Closing</td>
            <td style={thCssHead}>Total Sold</td>
            <td style={thCssHead}>Total Wastage</td>
            <td style={thCssHead}>Total Usage</td>
            <td style={thCssHead}>Variance</td>
            <td style={thCssHead}>% Sold</td>
          </tr>

          <tbody>
            {props?.list.map((y, index) => (
              <tr style={{ pageBreakInside: "avoid" }}>
                <td style={thCss}>{y.Date.split("T")[0]}</td>
                <td style={thCss}>{y.CategoryName}</td>
                <td style={thCss}>{y.ProductName}</td>
                <td style={thCss}>{y.UnitName}</td>
                <td style={thCss}>{y.IssueConsumeConversion}</td>
                <td style={thCss}>{y.OpeningStock}</td>
                <td style={thCss}>{y.TotalPurchase}</td>
                <td style={thCss}>{y.TotalTransferIn}</td>
                <td style={thCss}>{y.TotalProductionIn}</td>
                <td style={thCss}>{y.TotalAdjustmentIn}</td>
                <td style={thCss}>{y.TotalProductionOut}</td>
                <td style={thCss}>{y.TotalAdjustmentOut}</td>
                <td style={thCss}>{y.TotalIssuanceOut}</td>
                <td style={thCss}>{y.TotalClosing}</td>
                <td style={thCss}>{y.TotalSold}</td>
                <td style={thCss}>{y.TotalWastage}</td>
                <td style={thCss}>{y.TotalUsage}</td>
                <td style={thCss}>{y.Variance}</td>
                <td style={thCss}>{parseFloat(y["% Sold"]).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductEffTemplate;
