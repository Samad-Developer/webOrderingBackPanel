import Title from "antd/lib/typography/Title";

export default function TransferDetailTemplate(props) {
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
      <table
        style={{ borderCollapse: "collapse", width: "100%" }}
        id="table-to-xls"
      >
        <tr>
          <td colSpan={6}>
            <Title level={4} style={{ textAlign: "center" }}>
              Transfer Detail Report
            </Title>
          </td>
        </tr>
        <tr>
          <td colSpan={6}>
            <Title level={5} style={{ textAlign: "center" }}>
              {props.date}
            </Title>
          </td>
        </tr>

        <tr style={{ headRow }}>
          <td style={thCssHead}>Transfer No</td>
          <td style={thCssHead}>Branch From</td>
          <td style={thCssHead}>Branch To</td>
          <td style={thCssHead}>Product</td>
          <td style={thCssHead}> Transfer Quantity</td>
          <td style={thCssHead}> Unit</td>
        </tr>

        <tbody>
          {props?.list.map((y) => (
            <tr>
              <td style={thCss}>{y.TransferNo}</td>
              <td style={thCss}>{y.BranchFrom}</td>
              <td style={thCss}>{y.BranchTo}</td>
              <td style={thCss}>{y.ProductName}</td>
              <td style={thCss}>{y.QtyInLevel2}</td>
              <td style={thCss}>{y.UnitName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
