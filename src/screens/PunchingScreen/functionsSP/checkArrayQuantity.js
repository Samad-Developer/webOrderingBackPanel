export const checkArrayQuantity = (
  array1 = [],
  array2 = [],
  itemId = 0,
  array1ItemName,
  array2ItemName,
  method = "plus",
  productId,
  array,
  productArray = []
) => {
  let response = false;
  if (method === "all") {
    let detailId = array.filter((x) => x.ProductId === productId)[0]
      .ProductDetailId;
    let workingArray = productArray.filter(
      (x) => x.ProductDetailId === detailId
    );
    array1 = array1.filter((x) => x.ProductDetailId === detailId);
    let maxQuantity = workingArray.reduce((prevVal, nextVal) => {
      return prevVal + parseInt(nextVal.MaxQuantity, 0);
    }, 0);
    let minQuantity = workingArray.reduce((prevVal, nextVal) => {
      return prevVal + parseInt(nextVal.Quantity, 0);
    }, 0);
    let submitQuantity = parseInt(
      array2
        // .filter((x) => x.IsTopping && x.IsTopping === false)
        .reduce((prevVal, nextVal) => {
          return prevVal + parseFloat(nextVal.Quantity, 0);
        }, 0)
    );
    if (submitQuantity <= maxQuantity && submitQuantity >= minQuantity)
      response = true;
    else response = false;
    if (response === true) {
      workingArray.forEach((x) => {
        let arr = array2.filter(
          (y) =>
            y.OrderParentId === x.ProductDetailId &&
            y.DealItemId === x.DealItemId
          // &&
          // y.IsTopping &&
          // y.IsTopping === false
        );
        let newQty = arr.reduce((prev, next) => {
          return prev + next.Quantity;
        }, 0);
        if (newQty <= x.MaxQuantity && newQty >= x.Quantity) {
          response = true;
        } else {
          response = false;
          return;
        }
      });
      return response;
    }
  } else {
    let mainObj = array1.filter((x) => x[array1ItemName] === itemId)[0];
    let quantity =
      array2.length > 0 &&
      array2.filter((y) => y[array2ItemName] === itemId).length > 0
        ? array2
            .filter((y) => y[array2ItemName] === itemId)
            .reduce((accumulator, obj) => {
              return accumulator + obj.Quantity;
            }, 0)
        : 0;
    if (method === "plus" && mainObj.MaxQuantity > quantity) response = true;
    if (method === "plus" && mainObj.MaxQuantity === quantity) response = false;
    if (method === "minus" && mainObj.Quantity < quantity) response = true;
    if (method === "minus" && mainObj.Quantity === quantity) response = true;
    return response;
  }
};
