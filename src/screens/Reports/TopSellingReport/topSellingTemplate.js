import Title from "antd/lib/typography/Title";
export const TopSellingTemplate = (props) => {
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

  const data = props.reportData.sort(
    (a, b) => b.Total_Quantity - a.Total_Quantity
  );

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
              <td colSpan={3}>
                <Title level={4} style={{ textAlign: "center" }}>
                  Top Selling Report
                </Title>
              </td>
            </tr>
            <tr>
              <td colSpan={3}>
                <Title level={5} style={{ textAlign: "center" }}>
                  Branch:{props.branchName}
                </Title>
              </td>
            </tr>
            <tr>
              <td colSpan={3}>
                <Title
                  level={5}
                  style={{ fontSize: "18px", textAlign: "center" }}
                >
                  {props.date}
                </Title>
              </td>
            </tr>
            <tr style={headRow}>
              <td style={thCssHead}>Product Name</td>
              {/* <td style={thCssHead}>Rank</td> */}
              <td style={thCssHead}>Total Quantity Sold</td>
              <td style={thCssHead}>Total Sale Amount</td>
            </tr>

            {data.map((rowItem) => (
              <tr style={{ pageBreakInside: "avoid" }}>
                <td style={thCss}>{rowItem.ProductName}</td>
                {/* <td style={thCss}>{rowItem.RANK}</td> */}
                <td style={thCss}>{rowItem.Total_Quantity}</td>
                <td style={thCss}>{rowItem.Total_Sales_Amount}</td>
              </tr>
            ))}

            <tr>
              <td colSpan={1} style={thCss}>
                Totals
              </td>

              <td style={thCss}>
                {props.reportData.reduce(
                  (sum, rowItem) => sum + rowItem.Total_Quantity,
                  0
                )}
              </td>
              <td style={thCss}>
                {props.reportData.reduce(
                  (sum, rowItem) => sum + rowItem.Total_Sales_Amount,
                  0
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </>
    </div>
  );
};
