import Title from "antd/lib/typography/Title";

export const ODMSorderDetailTemp = (reportData, DateFrom, DateTo) => {
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
  return (
    <div
      style={{
        padding: 20,
        pagebreakinside: "avoid",
        width: "100%",
        overflow: "scroll"
      }}
    >
      <>
        <table
          style={{ borderCollapse: "collapse", width: "100%" }}
          id="table-to-xls"
        >
          <tr>
            <td colSpan={15}>
              <Title level={4} style={{ textAlign: "center" }}>
                Order Detail Report
              </Title>
            </td>
          </tr>
          <tr>
            <td colSpan={15}>
              <Title
                level={4}
                style={{ fontSize: "16px", textAlign: "center" }}
              >
                {` Period: From ${DateFrom} To ${DateTo}`}
              </Title>
            </td>
          </tr>
          <tr style={headRow}>
            {Object.keys(reportData[0]).map((x) => (
              <td style={thCssHead}>{x}</td>
            ))}
          </tr>

          <tbody>
            {reportData?.map((y) => (
              <tr style={{ pageBreakInside: "avoid" }}>
                {Object.keys(y).map((x) => (
                  <td style={thCss}>{y[x]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </>
    </div>
  );
};
