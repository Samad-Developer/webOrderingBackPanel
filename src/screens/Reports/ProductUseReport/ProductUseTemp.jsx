import Title from "antd/lib/typography/Title";

const ProductUseTemp = (props) => {
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
    <div
      style={{
        border: "1px solid gray",
        padding: 20,
        backgroundColor: "white",
      }}
    >
      <table
        style={{ borderCollapse: "collapse", width: "100%" }}
        id="table-to-xls"
      >
        <tr>
          <td colSpan={10}>
            <Title level={4} style={{ textAlign: "center" }}>
              Product Use Report:{props.branch}
            </Title>
          </td>
        </tr>

        <tr>
          <td colSpan={10}>
            <Title level={5} style={{ textAlign: "center" }}>
              {props.date}
            </Title>
          </td>
        </tr>
        <tr style={headRow}>
          <td style={thCssHead}>
            <b>Department</b>
          </td>

          <td style={thCssHead}>
            <b>Category</b>
          </td>
          <td style={thCssHead}>
            <b>Product</b>
          </td>
          <td style={thCssHead}>
            <b>Size</b>
          </td>
          <td style={thCssHead}>
            <b>Variant</b>
          </td>
          <td style={thCssHead}>
            <b>Separate Quantity</b>
          </td>
          <td style={thCssHead}>
            <b>Separate Amount</b>
          </td>
          <td style={thCssHead}>
            <b>Deal Quantity</b>
          </td>
          <td style={thCssHead}>
            <b>Deal Amount</b>
          </td>
          <td style={thCssHead}>
            <b>Total Quantity</b>
          </td>
        </tr>
        <tbody>
          {props?.list.map((row) => (
            <tr style={{ pageBreakInside: "avoid" }}>
              <td style={thCss}> {row.Department}</td>
              <td style={thCss}> {row.Category} </td>
              <td style={thCss}> {row.Product} </td>
              <td style={thCss}> {row.Size}</td>
              <td style={thCss}> {row.Variant}</td>
              <td style={thCss}>{row.SeparateQuantity}</td>
              <td style={thCss}>{row.SeparateAmount}</td>
              <td style={thCss}> {row.DealQuantity}</td>
              <td style={thCss}> {row.DealAmount}</td>
              <td style={thCss}>{row.Quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default ProductUseTemp;
