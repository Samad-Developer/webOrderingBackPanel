import Title from "antd/lib/typography/Title";

export default function InventoryItemReportTemplate(props) {
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

  const filteredData = props.list.map((x) => {
    x["Expiry Mandatory"] = x["Expiry Mandatory"] === true ? "true" : "false";
    x["Is Production"] = x["Is Production"] === true ? "true" : "false";
    x["Is Saleable"] = x["Is Saleable"] === true ? "true" : "false";
    return x;
  });

  return (
    <div style={{ border: "1px solid gray", padding: 20 }}>
      <table
        style={{ borderCollapse: "collapse", width: "100%" }}
        id="table-to-xls"
      >
        <tr>
          <td colSpan={15}>
            <Title level={4} style={{ textAlign: "center" }}>
              Inventory Item Report:{props.branch}
            </Title>
          </td>
        </tr>

        <tr style={{ headRow }}>
          {Object.keys(props?.list[0]).map((x) => (
            <td style={thCssHead}>{x}</td>
          ))}
        </tr>

        <tbody>
          {filteredData?.map((y) => (
            <tr style={{ pageBreakInside: "avoid" }}>
              {Object.keys(y).map((x) => (
                <td style={thCss}>{y[x]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
