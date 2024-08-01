import Title from "antd/lib/typography/Title";

export const EstimatedFoodCostSummaryTemp = (props) => {
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
        padding: 20,
        pagebreakinside: "avoid",
      }}
    >
      <>
        <table
          style={{ borderCollapse: "collapse", width: "100%" }}
          id="table-to-xls"
        >
          <tbody>
            <tr>
              <td colSpan={6}>
                <Title level={4} style={{ textAlign: "center" }}>
                  Estimated Food Cost Summery Report
                </Title>
              </td>
            </tr>

            <tr style={headRow}>
              <td style={thCssHead}>Category</td>
              <td style={thCssHead}>Product</td>
              <td style={thCssHead}>Gross Sale Price</td>
              <td style={thCssHead}>NetSale Price</td>
              <td style={thCssHead}>FoodCost</td>
              <td style={thCssHead}>Food Cost Percentage</td>
            </tr>

            {props.reportData.map((rowItem) => (
              <tr style={{ pageBreakInside: "avoid" }}>
                <td style={thCss}>{rowItem.ProductCategory}</td>
                <td style={thCss}>{rowItem.ProductName}</td>
                <td style={thCss}>{rowItem.GrossSalePrice}</td>
                <td style={thCss}>{rowItem.NetSalePrice}</td>
                <td style={thCss}>{rowItem.CombinedCostOfOrderMode}</td>
                <td style={thCss}>{rowItem.NetFoodCostPercentage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    </div>
  );
};
