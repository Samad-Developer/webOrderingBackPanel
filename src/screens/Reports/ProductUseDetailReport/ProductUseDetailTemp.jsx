import Title from "antd/lib/typography/Title";

const ProductUseDetailTemp = (props) => {
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
  const objList = Object.keys(props?.list[0]);

  const filteredRows = props?.list?.map((rowItem) => {
    delete rowItem?.OrderMasterId;
    delete rowItem?.CreatedDate;

    return rowItem;
  });

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
              Product Use Detail Report:{props.branch}
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
        <tr>
          {objList.map((x, i) => (
            <td key={i} style={thCssHead}>
              <b>{x}</b>
            </td>
          ))}
        </tr>
        <tbody>
          {filteredRows.map((row, i) => (
            <tr style={{ pageBreakInside: "avoid" }}>
              {objList.map((y, ind) => (
                <td key={ind} style={thCss}>
                  {row[y]}
                </td>
              ))}
            </tr>
          ))}
          <tr>
            <td colSpan="6" style={thCss}>
              <b>Total Quantity</b>
            </td>
            <td colSpan="1" style={thCss}>
              {props?.list?.reduce((prev, next) => {
                return (prev += next.Quantity);
              }, 0)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
export default ProductUseDetailTemp;
