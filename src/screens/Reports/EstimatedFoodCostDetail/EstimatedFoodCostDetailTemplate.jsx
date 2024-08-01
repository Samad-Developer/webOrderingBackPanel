import Title from "antd/lib/typography/Title";

const EstimatedFoodCostDetailTemplate = (props) => {
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

  const getTotalEatIn = (recipieProductDetailId, recipieItem) => {
    let eatInTotal = props.Table1.filter(
      (x) =>
        x.ProductDetailId === recipieProductDetailId &&
        x.CategoryName === recipieItem
    )
      .reduce((sum, next) => {
        if (next.OrderMode === "DineIn" || next.OrderMode === null) {
          sum = sum + next.IngredientCost;
        } else {
          sum + 0;
        }
        return sum;
      }, 0)
      .toFixed(2);
    return eatInTotal;
  };
  const getTotalEatOut = (recipieProductDetailId, recipieItem) => {
    let eatOutTotal = props.Table1.filter(
      (x) =>
        x.ProductDetailId === recipieProductDetailId &&
        x.CategoryName === recipieItem
    )
      .reduce((sum, next) => {
        if (next.OrderMode === "EAT OUT" || next.OrderMode === null) {
          sum = sum + next.IngredientCost;
        } else {
          sum + 0;
        }
        return sum;
      }, 0)
      .toFixed(2);
    return eatOutTotal;
  };
  const getTotalPerCost = (recipieProductDetailId, recipieItem) => {
    let total = props.Table1.filter(
      (x) =>
        x.ProductDetailId === recipieProductDetailId &&
        x.CategoryName === recipieItem
    )
      .reduce((sum, next) => {
        return sum + next.PercentOfCost;
      }, 0)
      .toFixed(2);
    return total;
  };
  return (
    <table
      style={{
        padding: 20,
        pagebreakinside: "avoid",
        width: "100%",
      }}
      id="table-to-xls"
    >
      {props.Table.map((recipie) => (
        <>
          <table
            style={{
              borderCollapse: "collapse",
              width: "100%",
            }}
          >
            <tr>
              <td colSpan={9}>
                <Title level={4} style={{ textAlign: "center" }}>
                  Estimated Food Cost Detail Resport
                </Title>
              </td>
            </tr>
            <tr>
              <td colSpan={9}>
                <Title
                  level={4}
                  style={{ fontSize: "15px", textAlign: "center" }}
                >
                  {`Product Category:${recipie.ProductCategory}`}
                </Title>
              </td>
            </tr>
            <tr>
              <td colSpan={9}>
                <Title
                  level={4}
                  style={{ fontSize: "15px", textAlign: "center" }}
                >
                  {`Product Category:${recipie.ProductName}`}
                </Title>
              </td>
            </tr>

            <tbody style={{ border: "1.5px solid black", width: "100%" }}>
              <tr>
                <td colSpan={8}>Gross Sale Price</td>
                <td style={thCss}>{recipie.GrossSalePrice}</td>
              </tr>
              <tr>
                <td colSpan={8}>Tax</td>
                <td style={thCss}>{recipie.TaxAmount}</td>
              </tr>
              <tr>
                <td colSpan={8}>Net Sale Price</td>
                <td style={thCss}>{recipie.NetSalePrice}</td>
              </tr>
            </tbody>
          </table>
          <p> </p>
          {/* table 2///////////////////////////////////////////////////////////////////////////////////// */}
          <table
            style={{
              marginTop: "20px",
              width: "100%",
              border: "1.5px solid black",
            }}
          >
            {/* <thead> */}
            <tr style={headRow}>
              <td style={thCssHead}>item_itemcode</td>
              <td style={thCssHead}>Item</td>
              <td style={thCssHead}>Price</td>
              <td style={thCssHead}>Pricing Unit</td>
              <td style={thCssHead}>Qty Required</td>
              <td style={thCssHead}>Total Cost</td>
              <td style={thCssHead}>Eat In</td>
              <td style={thCssHead}>Eat Out</td>
              <td style={thCssHead}>% of cost</td>
            </tr>
            {/* </thead> */}
            {Array.from(
              new Set(
                props.Table1.filter(
                  (x) => x.ProductDetailId === recipie.ProductDetailId
                ).map((x) => x.CategoryName)
              )
            ).map((recipieItem) => (
              <>
                <tr style={{ pageBreakInside: "avoid" }}>
                  <td
                    colSpan={5}
                    // style={{ borderRight: "1px solid black" }}
                  >
                    <b>{recipieItem}</b>
                  </td>
                  <td
                    colSpan={4}
                    style={{ borderRight: "1px solid black" }}
                  ></td>
                </tr>

                {props.Table1.filter(
                  (product) =>
                    product.ProductDetailId === recipie.ProductDetailId &&
                    product.CategoryName == recipieItem
                ).map((prod) => (
                  <tr style={{ pageBreakInside: "avoid" }}>
                    <td>{prod.ProductDetailId}</td>
                    <td>{prod.IngredientName}</td>
                    <td>{prod.CostPrice.toFixed(2)}</td>
                    <td>{prod.UnitName}</td>
                    <td>{prod.ConsumeQty}</td>
                    <td style={thCss}>{prod.IngredientCost.toFixed(2)}</td>
                    <td style={thCss}>
                      {(prod.OrderMode === null &&
                        prod.IngredientCost.toFixed(2)) ||
                        (prod.OrderMode === "DineIn" &&
                          prod.IngredientCost.toFixed(2)) ||
                        0}
                    </td>
                    <td style={thCss}>
                      {(prod.OrderMode === null &&
                        prod.IngredientCost.toFixed(2)) ||
                        (prod.OrderMode === "EAT OUT" &&
                          prod.IngredientCost.toFixed(2)) ||
                        0}
                    </td>
                    <td style={thCss}>{prod.PercentOfCost.toFixed(2) || 0}</td>
                  </tr>
                ))}

                <tr
                  style={{
                    border: "1px solid black",
                    pageBreakInside: "avoid",
                  }}
                >
                  <td colSpan={5} style={{ fontWeight: "bold" }}>
                    Total
                  </td>
                  <td style={{ border: "1px solid black" }}>-</td>
                  <td style={{ border: "1px solid black", fontWeight: "bold" }}>
                    {getTotalEatIn(recipie.ProductDetailId, recipieItem)}
                  </td>

                  <td style={{ border: "1px solid black", fontWeight: "bold" }}>
                    {getTotalEatOut(recipie.ProductDetailId, recipieItem)}
                  </td>
                  <td style={{ border: "1px solid black" }}>
                    {getTotalPerCost(recipie.ProductDetailId, recipieItem)}
                  </td>
                </tr>
              </>
            ))}
          </table>
          <p> </p>
          {/* Table 3/////////////////////////////////////////////////////////////////////////////////////////// */}
          <table
            style={{
              border: "1.5px solid black",
              width: "100%",
              pageBreakAfter: "always",
              marginTop: "20px",
            }}
          >
            <tr>
              <td colSpan={8}>Eat In %</td>
              <td style={{ textAlign: "right" }}>
                {props.Table2.filter(
                  (eatItem) =>
                    eatItem.ProductDetailId === recipie.ProductDetailId
                )
                  .reduce((sum, next) => {
                    if (
                      next.OrderMode === null ||
                      next.OrderMode === "DineIn"
                    ) {
                      return sum + next.Percent_X_TotalCost;
                    } else {
                      return sum + 0;
                    }
                  }, 0)
                  .toFixed(2)}
              </td>
            </tr>
            <tr>
              <td colSpan={8}>Eat Out %</td>

              <td style={{ textAlign: "right" }}>
                {props.Table2.filter(
                  (eatItem) =>
                    eatItem.ProductDetailId === recipie.ProductDetailId
                )
                  .reduce((sum, next) => {
                    if (next.OrderMode === "EAT OUT") {
                      return sum + next.Percent_X_TotalCost;
                    } else {
                      return (sum = sum + 0);
                    }
                  }, 0)
                  .toFixed(2)}
              </td>
            </tr>
            <tr>
              <td colSpan={8}>Combined Cost of Eat in % out</td>

              <td style={{ textAlign: "right" }}>
                {props.Table2.filter(
                  (item) => item.ProductDetailId === recipie.ProductDetailId
                )[0]?.CombinedCostOfOrderMode?.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td colSpan={7}>Selling Price</td>

              <td></td>
              <td style={{ textAlign: "right" }}>
                {props.Table2.filter(
                  (item) => item.ProductDetailId === recipie.ProductDetailId
                )[0]?.NetSalePrice.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td colSpan={8}>Cost</td>

              <td style={{ textAlign: "right" }}>
                {props.Table2.filter(
                  (item) => item.ProductDetailId === recipie.ProductDetailId
                )[0]?.TotalCost.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td colSpan={8}>Margin</td>

              <td style={{ textAlign: "right" }}>
                {props.Table2.filter(
                  (item) => item.ProductDetailId === recipie.ProductDetailId
                )[0]?.Margin.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td colSpan={8}>Cost % To Sale </td>

              <td style={{ textAlign: "right" }}>
                {props.Table2.filter(
                  (item) => item.ProductDetailId === recipie.ProductDetailId
                )[0]?.CostPercentSale.toFixed(2)}
              </td>
            </tr>

            <tr>
              <td colSpan={8}>Margin % to Sale</td>

              <td style={{ textAlign: "right" }}>
                {props.Table2.filter(
                  (item) => item.ProductDetailId === recipie.ProductDetailId
                )[0]?.MarginPercentSale.toFixed(2)}
              </td>
            </tr>
          </table>
        </>
      ))}
    </table>
  );
};
export default EstimatedFoodCostDetailTemplate;
