import Title from "antd/lib/typography/Title";

const HourlyProductSaleReportTemp = (props) => {
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

  const colSpan = () => {
    return Object.keys(props?.list[0]).length;
  };

  return (
    <div>
      <div style={{ width: "100%", overflow: "auto", padding: 20 }}>
        <table style={{ borderCollapse: "collapse" }} id="table-to-xls">
          <tr>
            <td colSpan={colSpan()}>
              <Title level={4} style={{ textAlign: "center" }}>
                Hourly Product Sale Report
              </Title>
            </td>
          </tr>
          <tr>
            <td colSpan={colSpan()}>
              <Title level={5} style={{ textAlign: "center" }}>
                {`Branch: ${props.branch}`}
              </Title>
            </td>
          </tr>
          <tr>
            <td colSpan={colSpan()}>
              <Title level={5} style={{ textAlign: "center" }}>
                {props.date}
              </Title>
            </td>
          </tr>

          <tr style={{ headRow }}>
            {Object.keys(props?.list[0]).map((x) => (
              <th style={thCssHead}>{x}</th>
            ))}
          </tr>

          <tbody>
            {props?.list &&
              props?.list?.map((y) => (
                <tr style={{ pageBreakInside: "avoid" }}>
                  {Object.keys(y).map((x) => (
                    <td style={thCss}>{y[x]}</td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default HourlyProductSaleReportTemp;
