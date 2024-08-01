import Title from "antd/lib/typography/Title";

export default function InventoryItemByProductTemplate(props) {
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

  return (
    <div style={{ border: "1px solid gray", padding: 10 }}>
      <table
        style={{ borderCollapse: "collapse", width: "100%" }}
        id="table-to-xls"
      >
        <tr>
          <td colSpan={15}>
            <Title level={4} style={{ textAlign: "center" }}>
              Inventory Item By Product Report
            </Title>
          </td>
        </tr>
        <tr>
          <td colSpan={15}>
            <Title level={5} style={{ textAlign: "center" }}>
              Branch Name: {props.branch}
            </Title>
            <Title level={5} style={{ textAlign: "center" }}>
              {props.date}
            </Title>
          </td>
        </tr>

        <tr style={{ headRow }}>
          {Object.keys(props?.list[0]).map((x) => (
            <td style={thCssHead}>{x}</td>
          ))}
        </tr>

        <tbody>
          {props?.list?.map((y) => (
            <tr style={{ pageBreakInside: "avoid" }}>
              {Object.keys(y).map((x) => (
                <td style={thCss}>{y[x]}</td>
              ))}
            </tr>
          ))}
          <tr style={{ pageBreakInside: "avoid" }}>
            <td colSpan="2">
              <b>Total</b>
            </td>
            <td>
              <b>
                {props?.list?.reduce(
                  (acc, next) => (acc += next["Consumption Quantity"]),
                  0
                )}
              </b>
            </td>
            <td>
              <b>{props?.list[0]["Consumption Unit"]}</b>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
