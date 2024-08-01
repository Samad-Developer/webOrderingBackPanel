import Title from "antd/lib/typography/Title";

export const itemVoidTemplate = (reportData, DateFrom, DateTo) => {
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
  const totalAmount = () => {
    let amount = reportData.reduce((sum, next) => sum + next.Amount, 0);
    return amount;
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
          <tr>
            <td colSpan={6}>
              <Title level={4} style={{ textAlign: "center" }}>
                Item Void Report
              </Title>
            </td>
          </tr>
          <tr>
            <td colSpan={6}>
              <Title
                level={4}
                style={{ fontSize: "16px", textAlign: "center" }}
              >
                {` Period: From ${DateFrom} To ${DateTo}`}
              </Title>
            </td>
          </tr>
          <tr style={headRow}>
            <td style={thCssHead}>Order Number</td>
            <td style={thCssHead}>Date</td>
            <td style={thCssHead}>At Counter</td>
            <td style={thCssHead}>Quantity</td>
            <td style={thCssHead}>Details</td>
            <td style={thCssHead}>Amount</td>
          </tr>
          <tbody>
            {reportData.map((rowItem) => (
              <tr style={{ pageBreakInside: "avoid" }}>
                <td style={thCss}>{rowItem.OrderNumber}</td>
                <td style={thCss}>{rowItem.OrderDate.split("T")[0]}</td>
                <td style={thCss}>{rowItem.AtCounter}</td>
                <td style={thCss}>{rowItem.Qty}</td>
                <td style={thCss}>{rowItem.Details}</td>
                <td style={thCss}>{rowItem.Amount}</td>
              </tr>
            ))}
            <tr>
              <td colSpan={6}>
                <Title
                  level={4}
                  style={{ fontSize: "16px", textAlign: "right" }}
                >
                  {`Net Amount:${totalAmount()}`}
                </Title>
              </td>
            </tr>
          </tbody>
        </table>
      </>
    </div>
  );
};
