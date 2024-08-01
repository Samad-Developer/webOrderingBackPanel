import { getFloatValue } from "./generalFunctions";

/**
 * Calculate the price using all the conditions for Product Selection Drawer
 * @param {[]} productDetailArray
 * @param {[]} halfNhalfArray
 * @param {[]} dealItemArray
 * @param {Number} productId
 * @param {Number} sizeId
 * @param {Number} flavourId
 * @returns Number
 */
export const menuDetailDrawerCalculation = (
  productDetailArray = [],
  halfNhalfArray = [],
  dealItemArray = [],
  productId = undefined,
  sizeId = undefined,
  flavourId = undefined
) => {
  if (
    sizeId !== undefined &&
    flavourId !== undefined &&
    productId !== undefined
  ) {
    // For Finding Normal Single Product Price
    if (
      productDetailArray.filter(
        (x) =>
          x.SizeId === sizeId &&
          x.FlavourId === flavourId &&
          x.ProductId === productId
      ).length > 0 &&
      dealItemArray.length === 0
    ) {
      let price = productDetailArray.filter(
        (x) =>
          x.SizeId === sizeId &&
          x.FlavourId === flavourId &&
          x.ProductId === productId
      )[0].Price;
      return price;
    }
    // For Finding Total Price with Topping or Deal
    if (
      productDetailArray.filter(
        (x) => x.ProductId === productId && x.ProductDetailPropertyId === null
      ).length > 0 &&
      dealItemArray.filter((x) => x.HalfAndHalf === true).length === 0
    ) {
      if (
        productDetailArray.filter((x) => x.ProductId === productId).length > 0
      ) {
        let priceA = getFloatValue(
          productDetailArray.filter((x) => x.ProductId === productId)[0].Price,
          2
        );
        let priceB = parseFloat(
          dealItemArray.reduce((prevVal, nextVal) => {
            return prevVal + parseInt(nextVal.totalAmount, 10);
          }, 0)
        ).toFixed(2);
        let priceC = parseFloat(priceA) + parseFloat(priceB);
        return priceC;
      }
    }
    // Finding Total Price for Half and Half
    else if (
      productDetailArray.filter(
        (x) =>
          x.SizeId === sizeId &&
          x.FlavourId === flavourId &&
          x.ProductId === productId &&
          x.ProductDetailPropertyId !== null
      ).length > 0
    ) {
      if (dealItemArray.filter((x) => x.HalfAndHalf === true).length === 1) {
        let priceA = getFloatValue(
          productDetailArray.filter(
            (x) =>
              x.SizeId === sizeId &&
              x.FlavourId === flavourId &&
              x.ProductId === productId &&
              x.ProductDetailPropertyId !== null
          )[0].ProductDetailPropertyPrice
        );
        let priceB = getFloatValue(
          dealItemArray.filter(
            (x) => x.HalfAndHalf === true || x.IsTopping === true
          )[0].PriceWithoutGST
        );
        let priceC = 0;
        if (dealItemArray.filter((x) => x.HalfAndHalf === false).length > 0)
          priceC = getFloatValue(
            dealItemArray
              .filter((x) => x.HalfAndHalf === false)
              .reduce((prevVal, nextVal) => {
                return prevVal + parseFloat(nextVal.PriceWithoutGST);
              }, 0)
          );
        let returnPrice =
          parseFloat(priceA) + parseFloat(priceB) + parseFloat(priceC);
        return getFloatValue(returnPrice);
      }
    } else {
      return "0";
    }
  }
  return null;
};
