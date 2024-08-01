import Title from "antd/lib/typography/Title";

export const InventoryProdRepTemplate = (props) => {
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
        <table
          style={{ borderCollapse: "collapse", width: "100%" }}
          id="table-to-xls"
        >
          <tr>
            <td colSpan={8}>
              <Title level={4} style={{ textAlign: "center" }}>
                Inventory Product Rate Report
              </Title>
            </td>
          </tr>
          <tr style={{ headRow }}>
            <td style={thCssHead}>Date</td>
            <td style={thCssHead}>Category</td>
            <td style={thCssHead}>Product</td>
            <td style={thCssHead}>Unit</td>
            <td style={thCssHead}>Purchase Unit Price</td>
            <td style={thCssHead}>Vendor</td>
            {/* <td style={thCssHead}>Batch Number</td> */}
            <td style={thCssHead}>Mfg Date</td>
            <td style={thCssHead}>Exp Date</td>
          </tr>

          <tbody>
            {props.reportData.map((rowItem) => (
              <tr style={{ pageBreakInside: "avoid" }}>
                <td style={thCss}>{rowItem.Date.split("T")[0]}</td>
                <td style={thCss}>{rowItem.CategoryName}</td>
                <td style={thCss}>{rowItem.ProductName}</td>
                <td style={thCss}>{rowItem.UnitName}</td>
                <td style={thCss}>{rowItem.PurchaseUnitPrice}</td>
                <td style={thCss}>{rowItem.VendorName}</td>
                {/* <td style={thCss}>{rowItem.BatchNumber}</td> */}
                <td style={thCss}>
                  {rowItem.ManufactureDate
                    ? rowItem.ManufactureDate.split("T")[0]
                    : "No Date"}
                </td>
                <td style={thCss}>
                  {rowItem.ExpiryDate
                    ? rowItem.ExpiryDate.split("T")[0]
                    : "No Date"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    </div>
  );
};
