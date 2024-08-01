import Title from "antd/lib/typography/Title";

export const cancelOrderTemplate = (
  orderTable,
  productTable,
  DateFrom,
  DateTo
) => {
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
        padding: 20,
        pagebreakinside: "avoid",
      }}
    >
      <>
        <Title level={4} style={{ textAlign: "center" }}>
          Cancel Order Report
        </Title>
        <div style={{ textAlign: "center", fontWeight: "bold" }}>
          {`Period: From ${DateFrom} To ${DateTo}`}
        </div>
        {orderTable.map((item) => (
          <table
            style={{ borderCollapse: "collapse", width: "100%" }}
            id="table-to-xls"
          >
            <tr>
              <td
                colSpan={4}
                style={{ textAlign: "center", fontWeight: "bold" }}
              >
                {`Order no:${item.OrderNumber}`}
              </td>
            </tr>
            <tr style={{ headRow }}>
              <td style={thCssHead}>Product Name</td>
              <td style={thCssHead}>Product Size and Flavour</td>
              <td style={thCssHead}>Quantity</td>
              <td style={thCssHead}>Cancelled Amount</td>
            </tr>

            {productTable &&
              productTable
                .filter((x) => item.OrderMstID === x.OrderMstID)
                .map((data) => (
                  <tbody>
                    <tr style={{ pageBreakInside: "avoid" }}>
                      <td style={thCss}>{data.ProductName}</td>
                      <td style={thCss}>{data.ProductSizeandFlavour}</td>
                      <td style={thCss}>{data.Qty}</td>
                      <td style={thCss}>{data.CancelDtlAmount}</td>
                    </tr>
                  </tbody>
                ))}
            <tr>
              <td colSpan={4}>
                <Title level={4} style={{ textAlign: "right" }}>
                  {`Net Amount:${item.CancelAmount}`}
                </Title>
              </td>
            </tr>
          </table>
        ))}
        {/* <table
          style={{ borderCollapse: "collapse", width: "100%" }}
          id="table-to-xls"
        >
          <tr>
            <td colSpan={4}>
              <Title level={4} style={{ textAlign: "center" }}>
                Cancel Order Report
              </Title>
            </td>
          </tr>
          <tr>
            <td colSpan={4} style={{ textAlign: "center", fontWeight: "bold" }}>
              {`Period: From${DateFrom} To ${DateTo}`}
            </td>
          </tr>
          <tr>
            <td colSpan={4} style={{ textAlign: "center", fontWeight: "bold" }}>
              {`Order no:${orderTable.map((item) => item.OrderNumber)}`}
            </td>
          </tr>
          <tr style={{ headRow }}>
            <td style={thCssHead}>Product Name</td>
            <td style={thCssHead}>Product Size and Flavour</td>
            <td style={thCssHead}>Quantity</td>
            <td style={thCssHead}>Cancelled Amount</td>
          </tr>
          <tbody>
            {productTable.map((data) => (
              <tr style={{ pageBreakInside: "avoid" }}>
                <td style={thCss}>{data.ProductName}</td>
                <td style={thCss}>{data.ProductSizeandFlavour}</td>
                <td style={thCss}>{data.Qty}</td>
                <td style={thCss}>{data.CancelDtlAmount}</td>
              </tr>
            ))}
            <tr>
              <td colSpan={4}>
                <Title level={4} style={{ textAlign: "right" }}>
                  {`Net Amount:${productTable.reduce(
                    (acc, curr) => acc + curr.CancelDtlAmount,
                    0
                  )}`}
                </Title>
              </td>
            </tr>
          </tbody>
        </table> */}
      </>
    </div>
  );
};
