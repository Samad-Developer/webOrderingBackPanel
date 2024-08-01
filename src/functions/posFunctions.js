import { getFloatValue } from "./generalFunctions";

export const calculateDealTotalPrice = (dealPrice, dealItemList) => {
  return getFloatValue(
    parseFloat(dealPrice) +
      parseFloat(
        dealItemList.reduce((sum, next) => {
          return parseFloat(sum) + parseFloat(next.PriceWithGST);
        }, 0),
        2
      )
  );
};
