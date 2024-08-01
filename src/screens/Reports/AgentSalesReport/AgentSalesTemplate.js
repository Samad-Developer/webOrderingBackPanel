import Title from "antd/lib/typography/Title";

export const AgentSalesTemplate = (reportData, DateFrom, DateTo) => {
  const thCss = {
    border: "1px solid black",
    padding: "6px 12px",
    display: "table-cell",
    color: "black"
  };
  const thCssHead = {
    border: "1px solid black",
    padding: "6px 12px",
    display: "table-cell",
    background: "#4561b9",
    color: "white",
    fontWeight: "bold"
  };
  const headRow = {
    display: "table-row",
    fontWeight: "900",
    color: "#ffffff"
  };
  // const totalAmount = () => {
  //   let amount = reportData.reduce((sum, next) => sum + next.Amount, 0);
  //   return amount;
  // };

  const totalAmount = () => {
    return reportData.reduce((prev, ass) => {
      return prev + ass.NetSales;
    }, 0);
  };

  return (
    <div
      style={{
        padding: 20,
        pagebreakinside: "avoid"
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
            <td style={thCssHead}>Agent</td>
            <td style={thCssHead}>Order Type</td>
            <td style={thCssHead}>Total Orders</td>
            <td style={thCssHead}>Net Sales </td>
            <td style={thCssHead}>Avg. Net Sales</td>
          </tr>
          <tbody>
            {reportData.map((rowItem) => (
              <tr style={{ pageBreakInside: "avoid" }}>
                <td style={thCss}>{rowItem.Agent}</td>
                <td style={thCss}>{rowItem.OrderSource}</td>
                <td style={thCss}>{rowItem.OrderCount}</td>
                <td style={thCss}>
                  {rowItem.NetSales.toLocaleString("en-US", {
                    style: "currency",
                    currency: "PKR"
                  })}
                </td>
                <td style={thCss}>
                  {rowItem.AvgNetSales.toLocaleString("en-US", {
                    style: "currency",
                    currency: "PKR"
                  })}
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan={5}>
                <Title
                  level={4}
                  style={{ fontSize: "16px", textAlign: "right" }}
                >
                  {`Net Amount:${totalAmount().toLocaleString("en-US", {
                    style: "currency",
                    currency: "PKR"
                  })}`}
                </Title>
              </td>
            </tr>
          </tbody>
        </table>
      </>
    </div>
  );
};
