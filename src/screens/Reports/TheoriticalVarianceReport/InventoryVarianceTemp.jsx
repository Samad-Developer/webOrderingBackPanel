import { Tag } from "antd";
import Title from "antd/lib/typography/Title";
import "./style.css";

export const InventoryVarianceTemp = (props) => {
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
    position: "sticky",
    top: "-11px",
  };
  const headRow = {
    display: "table-row",
    fontWeight: "900",
    color: "#ffffff",
  };
  return (
    <div
      style={{
        padding: 10,
        pagebreakinside: "avoid",
        backgroundColor: "white",
      }}
    >
      <div style={{ width: "100%", padding: 20 }}>
        <table
          style={{ position: "relative", borderCollapse: "collapse" }}
          id="table-to-xls"
        >
          <thead>
            <tr>
              <th colSpan={21}>
                <Title level={4} style={{ textAlign: "center" }}>
                  Theoritical Variance Report
                </Title>
              </th>
            </tr>
            <tr>
              <th colSpan={21}>
                <Title
                  level={4}
                  style={{ fontSize: "14px", textAlign: "center" }}
                >
                  {props.branch}
                </Title>
              </th>
            </tr>
            <tr>
              <th colSpan={21}>
                <Title
                  level={4}
                  style={{ fontSize: "14px", textAlign: "center" }}
                >
                  {props.date}
                </Title>
              </th>
            </tr>
            <tr style={headRow}>
              <th style={thCssHead}>Category</th>
              <th style={thCssHead}>Product</th>
              <th style={thCssHead}>Unit Name</th>
              <th style={thCssHead}>Opening Stock</th>
              <th style={thCssHead}>Total Purchase</th>
              <th style={thCssHead}>Transfer In</th>
              <th style={thCssHead}>Transfer Out</th>
              <th style={thCssHead}>Physical Stock</th>
              <th style={thCssHead}>Rate</th>
              <th style={thCssHead}>Inventory Used Qty</th>
              <th style={thCssHead}>Inventory Used Price</th>
              <th style={thCssHead}>Inventory Sold Qty</th>
              <th style={thCssHead}>Inventory Sold Price</th>
              <th style={thCssHead}>Emp. Meal Qty</th>
              <th style={thCssHead}>Emp. Meal Price</th>
              <th style={thCssHead}>Total Wastage Qty</th>
              <th style={thCssHead}>Total Wastage Price</th>
              <th style={thCssHead}>Varinace Qty</th>
              <th style={thCssHead}>Varinace Price</th>
            </tr>
          </thead>
          <tbody style={{ overflow: "scroll", height: "10rem" }}>
            {props?.reportData?.map((rowItem) => (
              <tr
                style={{
                  pageBreakInside: "avoid",
                  backgroundColor:
                    rowItem?.TotalSold > rowItem?.InventoryUsedQty
                      ? "orange"
                      : "white",
                }}
              >
                <td style={thCss}>{rowItem?.CategoryName}</td>
                <td style={thCss}>{rowItem?.ProductName}</td>
                <td style={thCss}>{rowItem?.UnitName}</td>
                <td style={thCss}>{rowItem?.OpeningStock}</td>
                <td style={thCss}>{rowItem?.TotalPurchase}</td>
                <td style={thCss}>{rowItem?.TotalTransferIn}</td>
                <td style={thCss}>{rowItem?.TotalTransferOut}</td>
                <td style={thCss}>{rowItem?.TotalClosing}</td>
                <td style={thCss}>
                  {rowItem?.Price?.toLocaleString("en-US", {
                    style: "currency",
                    currency: "PKR",
                  })}
                </td>
                <td style={thCss}>{rowItem?.InventoryUsedQty}</td>
                <td style={thCss}>
                  {rowItem?.InventoryUsedPrice?.toLocaleString("en-US", {
                    style: "currency",
                    currency: "PKR",
                  })}
                </td>
                <td style={thCss}>{rowItem?.TotalSold}</td>
                <td style={thCss}>
                  {rowItem?.TotalSoldPrice?.toLocaleString("en-US", {
                    style: "currency",
                    currency: "PKR",
                  })}
                </td>
                <td style={thCss}>{rowItem?.TotalMeal}</td>
                <td style={thCss}>
                  {rowItem?.TotalMealPrice?.toLocaleString("en-US", {
                    style: "currency",
                    currency: "PKR",
                  })}
                </td>
                <td style={thCss}>{rowItem?.TotalWastageOut}</td>
                <td style={thCss}>
                  {rowItem?.TotalWastageOutPrice?.toLocaleString("en-US", {
                    style: "currency",
                    currency: "PKR",
                  })}
                </td>
                <td style={thCss}>{rowItem?.TotalVarinace}</td>
                <td style={thCss}>{rowItem?.TotalVarinaceValue}</td>
              </tr>
            ))}
            <tr className="bold-td">
              <td colSpan="3">Meal %: {props?.total?.MealPer || 0}</td>
              <td colSpan="3">Net Sale: {props?.total?.netsale || 0}</td>
              <td colSpan="3">Sold %: {props?.total?.soldper || 0}</td>
              <td colSpan="3">Usage %: {props?.total?.usageper || 0}</td>
              <td colSpan="3">Variance %: {props?.total?.variancePer || 0}</td>
              <td colSpan="2">Wastage %: {props?.total?.wastageper || 0}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
