import Title from "antd/lib/typography/Title";

const DailySaleTemp = (props) => {
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

  const filtereRows = props?.list?.map((rowItem) => {
    // delete rowItem?.Date_ColumnHide1;
    // delete rowItem?.Date_ColumnHide2;
    // delete rowItem?.Date_ColumnHide3;
    // delete rowItem?.Date_ColumnHide4;
    // delete rowItem?.Date_ColumnHide5;
    // rowItem.Date = rowItem?.Date?.split("T")[0];

    rowItem.GSTAmount = parseFloat(rowItem.GSTAmount).toFixed(2);
    rowItem.DiscountAmount = parseFloat(rowItem.DiscountAmount).toFixed(2);
    rowItem.NetSale = parseFloat(rowItem.NetSale).toFixed(2);
    return rowItem;
  });

  const totalAmountWithoutGST = props?.list?.reduce((prev, curr) => {
    return (prev += parseFloat(curr.TotalAmountWithoutGST));
  }, 0);
  const gstAmount = props?.list?.reduce((prev, curr) => {
    return (prev += parseFloat(curr.GSTAmount));
  }, 0);
  const discountAmt = props?.list?.reduce((prev, curr) => {
    return (prev += parseFloat(curr.DiscountAmount));
  }, 0);
  const netSale = props?.list?.reduce((prev, curr) => {
    return (prev += parseFloat(curr.NetSale));
  }, 0);

  return (
    <div>
      <div style={{ width: "100%", overflow: "auto", padding: 20 }}>
        <table style={{ borderCollapse: "collapse" }} id="table-to-xls">
          <tr>
            <td colSpan={16}>
              <Title level={4} style={{ textAlign: "center" }}>
                Daily Sale Report
              </Title>
            </td>
          </tr>
          <tr>
            <td colSpan={16}>
              <Title level={5} style={{ textAlign: "center" }}>
                {props.branchName}
              </Title>
            </td>
          </tr>
          <tr>
            <td colSpan={16}>
              <Title level={5} style={{ textAlign: "center" }}>
                {props.date}
              </Title>
            </td>
          </tr>

          <tr style={{ headRow }}>
            {Object.keys(filtereRows[0]).map((x) => (
              <th style={thCssHead}>{x}</th>
            ))}
          </tr>

          <tbody>
            {filtereRows &&
              filtereRows.map((y) => (
                <tr style={{ pageBreakInside: "avoid" }}>
                  {Object.keys(y).map((x) => (
                    <td style={thCss}>{y[x]}</td>
                  ))}
                </tr>
              ))}
            {/* <tr>
              <td style={{ ...thCss, fontWeight: "bold" }} colSpan={6}>
                Total
              </td>
              <td style={{ ...thCss, fontWeight: "bold" }}>
                {totalAmountWithoutGST}
              </td>
              <td style={{ ...thCss, fontWeight: "bold" }}>
                {gstAmount.toFixed(2)}
              </td>
              <td style={{ ...thCss, fontWeight: "bold" }}>
                {discountAmt.toFixed(2)}
              </td>
              <td style={{ ...thCss, fontWeight: "bold" }}>
                {netSale.toFixed(2)}
              </td>
            </tr> */}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default DailySaleTemp;
