import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRandomNumber } from "../../functionsSP/generalFunctionsSP";
import { SP_SET_POS_STATE } from "../../redux/reduxConstantsSinglePagePOS";

export const OpenDrawerOrAddProductToCart = (menu, posState) => {
  // const posState = useSelector((state) => state.SinglePagePOSReducers);
  // const dispatch = useDispatch();

  let productCart = [...posState.productCart];

  let randomNumber = getRandomNumber(1, 10000);
  if (menu.length === 1 && menu[0].IsDeal === false) {
    const foundProduct = productCart.filter(
      (e) =>
        e.ProductDetailId === menu[0].ProductDetailId &&
        e?.IsTopping === false &&
        e?.HalfAndHalf === false &&
        e?.IsDeal === false &&
        e?.SpecialInstruction === ""
    );
    if (foundProduct.length > 0) {
      const index = productCart.findIndex(
        (e) =>
          e.ProductDetailId === foundProduct[0].ProductDetailId &&
          e.IsDeal === false
      );
      productCart[index] = {
        ...foundProduct[0],
        Quantity: foundProduct[0].Quantity + 1,
        totalAmount: getFloatValue(
          getFloatValue(parseFloat(menu[0].Price), 2) *
            (foundProduct[0].Quantity + 1)
        ),
      };
    } else {
      productCart.push({
        ...menu,
        OrderMasterId: null,
        PriceWithoutGST: getFloatValue(menu.Price),
        PriceWithGST: getFloatValue(parseFloat(menu.Price), 2),
        totalAmount: getFloatValue(
          getFloatValue(parseFloat(menu.Price), 2) * 1
        ),
        SpecialInstruction: "",
        OrderParentId: null,
        Quantity: parseInt(1, 0),
        DiscountPercent: 0,
        DiscountAmount: 0,
        RandomId: randomNumber,
        HalfAndHalf: false,
      });
    }
    // dispatch({
    //   type: SP_SET_POS_STATE,
    //   payload: {
    //     name: "productCart",
    //     value: productCart,
    //   },
    // });
    if (posState.OrderMasterId !== null) {
      let addList = {
        OrderMasterId: posState.OrderMasterId,
        ProductDetailId: menu.ProductDetailId,
        Quantity: parseFloat(1),
        PriceWithoutGST: parseFloat(getFloatValue(menu.Price)),
        AmountWithGST: 0,
        ProductDetailName: menu.ProductDetailName,
        type: "Add",
      };
      dispatch({
        type: SP_SET_POS_STATE,
        payload: {
          name: "OrderDetailAdd",
          value: [...posState.OrderDetailAdd, addList],
        },
      });
    }
  } else {
    // dispatch({
    //   type: SP_SET_POS_STATE,
    //   payload: {
    //     name: "selectedProductId",
    //     value: menu.ProductId,
    //   },
    // });
    // dispatch({
    //   type: SP_SET_POS_STATE,
    //   payload: {
    //     name: "IsDealDirectPunch",
    //     value: menu.IsDealDirectPunch,
    //   },
    // });
    return menu[0].ProductId;
    if (menu.IsDeal === true) {
      // dispatch({
      //   type: SP_SET_POS_STATE,
      //   payload: { name: "dealSelection", value: true },
      // });

      if (menu.IsDealDirectPunch) {
        posState.dealItemsList.forEach((item) => {
          item.ProductDetailId === menu.ProductDetailId &&
            productCart.push({
              OrderMasterId: null,
              OrderParentId: item.ProductDetailId,
              ProductDetailId: item.DealDescItemDetailId,
              ProductDetailName: item.DealDescItemName,
              PriceWithoutGST: item.Price,
              GSTId: null,
              GSTPercentage: 0,
              PriceWithGST: item.Price,
              Quantity: item.Quantity,
              SpecialInstruction: "",
              DiscountPercent: 0,
              DiscountAmount: 0,
              DealItemId: item.DealItemId,
              DealDescId: item.DealDescId,
              IsToppingAllowed: false,
              SizeId: item.SizeId,
              SortIndex: item.SortIndex,
              ProductPropertyPrice: 0,
              ProductPropertyName: null,
              ProductPropertyId: null,
              ProductPropertyCount: null,
              totalAmount: item.Price,
              RandomId: randomNumber,
              HalfAndHalf: false,
            });
        });
        productCart.unshift({
          ...menu,
          OrderMasterId: null,
          SpecialInstruction: "",
          OrderParentId: null,
          Quantity: 1,
          ProductCode: menu.ProductCode,
          PriceWithoutGST: parseFloat(menu.Price) * parseFloat(1),
          PriceWithGST: parseFloat(
            parseFloat(menu.Price) * parseFloat(1)
          ).toFixed(2),
          totalAmount: menu.Price * parseFloat(1),
          GSTId: menu.GSTId,
          DiscountPercent: 0,
          DiscountAmount: 0,
          RandomId: randomNumber,
          HalfAndHalf: false,
          IsDeal: true,
        });

        // dispatch({
        //   type: SP_SET_POS_STATE,
        //   payload: {
        //     name: "productCart",
        //     value: productCart,
        //   },
        // });
      }
    }
  }
  return null;
};
