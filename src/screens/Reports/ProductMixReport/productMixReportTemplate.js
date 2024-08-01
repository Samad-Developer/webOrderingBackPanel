import Title from "antd/lib/typography/Title";

export const productMixReportTemplate = (data) => {
  const headRow = {
    display: "table-row",
    fontWeight: "900",
    color: "#ffffff",
  };
  const thCssHead = {
    border: "1px solid black",
    padding: "6px 12px",
    display: "table-cell",
    background: "#4561b9",
    color: "white",
    fontWeight: "bold",
  };
  const thCss = {
    border: "1px solid black",
    padding: "6px 12px",
    display: "table-cell",
    color: "black",
  };

  return (
    <table
      style={{ backgroundColor: "white", padding: 10, width: "100%" }}
      id="table-to-xls"
    >
      <tr>
        <td style={{ textAlign: "center", fontWeight: "bold" }} colSpan={6}>
          <Title level={4} style={{ textAlign: "center" }}>
            Product Mix Report
          </Title>
        </td>
      </tr>
      <tr>
        <td colSpan={8}>
          <Title level={5} style={{ textAlign: "center" }}>
            Period from <b>{data.DATE_FROM}</b>To<b>{data.DATE_TO}</b>
          </Title>
        </td>
      </tr>
      <tr>
        <td
          style={{
            fontSize: 20,
            textAlign: "center",
            backgroundColor: "white",
          }}
          colSpan={6}
        >
          <Title level={5} style={{ textAlign: "center" }}>
            Branch: <b>{data.branchName} </b>
          </Title>
        </td>
      </tr>

      <tr style={{ width: "100%", display: "table" }}>
        {data.tableItems.map((rowItem) => {
          return (
            <tr>
              <tr>
                <td
                  colSpan={6}
                  style={{ textAlign: "center", fontWeight: "bold" }}
                >
                  {rowItem[0]}
                </td>
              </tr>
              <tr
                style={{
                  marginBottom: 50,
                  width: "100%",
                  display: "table",
                  pageBreakInside: "avoid",
                }}
              >
                <thead style={headRow}>
                  <th style={thCssHead}>
                    <b>Item</b>
                  </th>
                  <th style={thCssHead}>
                    <b>DI TA DEL</b>
                  </th>
                  <th style={thCssHead}>
                    <b>Quantity</b>
                  </th>
                  <th style={thCssHead}>
                    <b>Quantity %</b>
                  </th>
                  <th style={thCssHead}>
                    <b>Sales</b>
                  </th>
                  <th style={thCssHead}>
                    <b>Sales %</b>
                  </th>
                </thead>

                {rowItem[1].map((rowItem) => (
                  <tr
                    style={{
                      border: "1px solid black",
                      pageBreakInside: "avoid",
                    }}
                  >
                    <td style={thCss}>{rowItem.ProductName}</td>
                    <td style={thCss}>
                      {rowItem.DineIn} + {rowItem.TakeAway} + {rowItem.Delivery}
                    </td>
                    <td style={thCss}>{rowItem.Total_Qty}</td>
                    <td style={thCss}>
                      {parseFloat(rowItem.Qty_Percent).toFixed(2)}
                    </td>
                    <td style={thCss}>{rowItem.Total_Sales_Amount}</td>
                    <td style={thCss}>
                      {parseFloat(rowItem.Sales_Percent).toFixed(2)}
                    </td>
                  </tr>
                ))}

                <tr
                  style={{
                    width: "100%",
                    borderTop: "1px solid black",
                    borderRight: "1px solid black",
                    borderLeft: "1px solid black",
                    borderBottom: "5px solid black",
                    padding: 8,
                  }}
                >
                  {/* <td>
                    <b> {rowItem[0]}</b>
                  </td> */}
                  <td></td>
                  <td></td>

                  <td>
                    <b>
                      Total Quantity:
                      {rowItem[1].reduce((sum, item) => {
                        return sum + parseInt(item.Total_Qty);
                      }, 0)}
                    </b>
                  </td>
                  <td>
                    <b>
                      Total Quantity %:
                      {rowItem[1]
                        .reduce((sum, item) => {
                          return sum + parseFloat(item.Qty_Percent);
                        }, 0)
                        .toFixed(2)}
                    </b>
                  </td>
                  <td>
                    <b>
                      Total Sale Amount:
                      {rowItem[1].reduce((sum, item) => {
                        return sum + parseInt(item.Total_Sales_Amount);
                      }, 0)}
                    </b>
                  </td>
                  <td>
                    <b>
                      Total Sales Percent:
                      {(
                        (rowItem[1].reduce((sum, item) => {
                          return sum + parseInt(item.Total_Sales_Amount);
                        }, 0) /
                          data.footerData[0].SubTotalWithoutGST) *
                        100
                      ).toFixed(2)}
                    </b>
                  </td>
                </tr>
              </tr>
            </tr>
          );
        })}
        <tr style={{ width: "100%", display: "table" }}>
          <tr>
            <td>
              <p>
                <b>
                  Sub Total Without GST:
                  {data.footerData[0].SubTotalWithoutGST}
                </b>
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <p>
                <b>Complimentries: {data.footerData[0].Complimentory}</b>
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <p>
                <b>Discount {data.footerData[0].Discount}</b>
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <p>
                <b>GST: {data.footerData[0].GST}</b>
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <p>
                <b>Net Sales: {data.footerData[0].NetSales}</b>
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <p>
                <b>Delivery Charges: {data.footerData[0].DeliveryCharges}</b>
              </p>
            </td>
          </tr>
        </tr>
      </tr>
    </table>
  );
};
