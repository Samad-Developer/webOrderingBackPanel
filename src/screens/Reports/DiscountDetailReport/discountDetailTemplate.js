import Title from "antd/lib/typography/Title";

export const discountDetailTemplate = (reportData, DateFrom, DateTo) => {
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
    let amount = reportData.reduce((sum, next) => sum + next.Discount, 0);
    return parseFloat(amount).toFixed(2);
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
            <td colSpan={5}>
              <Title level={4} style={{ textAlign: "center" }}>
                Discount Detail Report
              </Title>
            </td>
          </tr>
          <tr>
            <td colSpan={5}>
              <Title
                level={5}
                style={{ fontSize: "18px", textAlign: "center" }}
              >
                {`Period: From ${DateFrom} To ${DateTo}`}
              </Title>
            </td>
          </tr>
          <tr style={headRow}>
            <td style={thCssHead}>Order Number </td>
            <td style={thCssHead}>Order Date</td>
            <td style={thCssHead}>At Counter</td>
            <td style={thCssHead}>Details</td>
            <td style={thCssHead}>Discount</td>
          </tr>
          <tbody>
            {reportData.map((data) => (
              <tr>
                <td style={thCss}>{data.OrderNo}</td>
                <td style={thCss}>{data.Order_Date.split("T")[0]}</td>
                <td style={thCss}>{data.AtCounter}</td>
                <td style={thCss}>{data.Details}</td>
                <td style={thCss}>{data.Discount.toFixed(2)}</td>
              </tr>
            ))}
            <tr>
              <td colSpan={5}>
                <Title
                  level={4}
                  style={{ fontSize: "16px", textAlign: "right" }}
                >
                  {`Net Discount:${totalAmount()}`}
                </Title>
              </td>
            </tr>
          </tbody>
        </table>
      </>
    </div>
  );
};
