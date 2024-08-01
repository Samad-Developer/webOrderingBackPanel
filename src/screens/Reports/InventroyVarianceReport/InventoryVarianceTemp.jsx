import Title from "antd/lib/typography/Title";

export const InventoryVarianceTemp = (props) => {
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
        padding: 10,
        pagebreakinside: "avoid",
        backgroundColor: "white",
      }}
    >
      <div style={{ width: "100%", overflow: "auto", padding: 20 }}>
        <table style={{ borderCollapse: "collapse" }} id="table-to-xls">
          <tr>
            <td colSpan={21}>
              <Title level={4} style={{ textAlign: "center" }}>
                Inventory Variance Report
              </Title>
            </td>
          </tr>
          <tr>
            <td colSpan={21}>
              <Title
                level={4}
                style={{ fontSize: "14px", textAlign: "center" }}
              >
                {props.branch}
              </Title>
            </td>
          </tr>
          <tr>
            <td colSpan={21}>
              <Title
                level={4}
                style={{ fontSize: "14px", textAlign: "center" }}
              >
                {props.date}
              </Title>
            </td>
          </tr>
          <tbody>
            <tr style={headRow}>
              <td style={thCssHead}>Product</td>
              <td style={thCssHead}>Category</td>
              <td style={thCssHead}>Opening Stock</td>
              <td style={thCssHead}>Percent Meal</td>
              <td style={thCssHead}>Percent Sold</td>
              <td style={thCssHead}>Percent Variance</td>
              <td style={thCssHead}>Total Adjustment In</td>
              <td style={thCssHead}>Total Adjustment Out</td>
              <td style={thCssHead}>Total Closing</td>
              <td style={thCssHead}>Total Issuance Out</td>
              <td style={thCssHead}>Total Meal</td>
              <td style={thCssHead}>Total Production In</td>
              <td style={thCssHead}>Total Production Out</td>
              <td style={thCssHead}>Total Purchase</td>
              <td style={thCssHead}>Total Sold</td>
              <td style={thCssHead}>TotalTransfer In</td>
              <td style={thCssHead}>TotalTransfer Out</td>
              <td style={thCssHead}>Total Usage</td>
              <td style={thCssHead}>Total Varinace</td>
              <td style={thCssHead}>Total Wastage Out</td>
              <td style={thCssHead}>Unit Name</td>
            </tr>
            {props.reportData.map((rowItem) => (
              <tr style={{ pageBreakInside: "avoid" }}>
                <td style={thCss}>{rowItem.ProductName}</td>
                <td style={thCss}>{rowItem.CategoryName}</td>
                <td style={thCss}>{rowItem.OpeningStock}</td>
                <td style={thCss}>{rowItem.PercentMeal}</td>
                <td style={thCss}>{rowItem.PercentSold}</td>
                <td style={thCss}>{rowItem.PercentVariance}</td>
                <td style={thCss}>{rowItem.TotalAdjustmentIn}</td>
                <td style={thCss}>{rowItem.TotalAdjustmentOut}</td>
                <td style={thCss}>{rowItem.TotalClosing}</td>
                <td style={thCss}>{rowItem.TotalIssuanceOut}</td>
                <td style={thCss}>{rowItem.TotalMeal}</td>
                <td style={thCss}>{rowItem.TotalProductionIn}</td>
                <td style={thCss}>{rowItem.TotalProductionOut}</td>
                <td style={thCss}>{rowItem.TotalPurchase}</td>
                <td style={thCss}>{rowItem.TotalSold}</td>
                <td style={thCss}>{rowItem.TotalTransferIn}</td>
                <td style={thCss}>{rowItem.TotalTransferOut}</td>
                <td style={thCss}>{rowItem.TotalUsage}</td>
                <td style={thCss}>{rowItem.TotalVarinace}</td>
                <td style={thCss}>{rowItem.TotalWastageOut}</td>
                <td style={thCss}>{rowItem.UnitName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
