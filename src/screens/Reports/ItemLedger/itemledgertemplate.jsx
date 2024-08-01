import Title from "antd/lib/typography/Title";

export default function ItemLedgerTemplate(props) {
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
      <>
        <table
          style={{ borderCollapse: "collapse", width: "100%" }}
          id="table-to-xls"
        >
          <tr>
            <td colSpan={6}>
              <Title level={4} style={{ textAlign: "center" }}>
                Item Ledger Report:{props.branch}
              </Title>
            </td>
          </tr>
          {props.categories.map((CategoryItem) => {
            return (
              <>
                <tr>
                  <td colSpan={6}>
                    <Title level={5} style={{ textAlign: "center" }}>
                      {CategoryItem.CategoryName + " | " + CategoryItem.Product}
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
                  <td style={thCssHead}>Created Date</td>
                  <td style={thCssHead}>Transaction Number</td>
                  <td style={thCssHead}>Qty In</td>
                  <td style={thCssHead}>Qty Out</td>
                  <td style={thCssHead}>Total Stock</td>
                  <td style={thCssHead}>Unit</td>
                </tr>

                <tbody>
                  {props.list
                    .sort((a, b) => a - b)
                    .filter(
                      (productItem) =>
                        CategoryItem.ProductDetailId ===
                        productItem.ProductDetailId
                    )
                    .map((rowItem) => (
                      <tr style={{ pageBreakInside: "avoid" }}>
                        <td style={thCss}>
                          {rowItem?.CreatedDate?.split("T")[0]}
                        </td>
                        <td style={thCss}>{rowItem.TransactionNo}</td>
                        <td style={thCss}>{rowItem.IN}</td>
                        <td style={thCss}>{rowItem.OUT}</td>
                        <td style={thCss}>
                          {rowItem.TotalStockQuantityInConsume}
                        </td>
                        <td style={thCss}>{rowItem.UnitName}</td>
                      </tr>
                    ))}
                </tbody>
                {/* <tr style={{ headRow }}>
                  <td colSpan={6}>
                    <Title style={{ textAlign: "right" }} level={5}>
                      Total Stock Quantity:
                      {CategoryItem.TotalStockQuantityInConsume}
                    </Title>
                  </td>
                </tr> */}
              </>
            );
          })}
        </table>
      </>
    </div>
  );
}
