import Title from "antd/lib/typography/Title";

export default function WaiterRiderPerformanceTemplate(props) {
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
                {`${
                  props.reportType === 2 ? "Rider" : "Waiter"
                } Performance Report`}
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
            {Object.keys(props?.list[0])?.map((x) => (
              <td style={thCssHead}>{x}</td>
            ))}
          </tr>
          <tbody>
            {props?.list.map((y) => (
              <tr style={{ pageBreakInside: "avoid" }}>
                <td style={thCss}>{y.Name}</td>
                <td style={thCss}>{y.TotalOrders}</td>
                <td style={thCss}>{y.BranchName}</td>
                <td style={thCss}>{y.DeliveryCharges}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
