import { message } from "antd";
import React from "react";
import { GiTakeMyMoney } from "react-icons/gi";
import { useDispatch, useSelector } from "react-redux";
import TileButton from "../../Components/TileButton";
import { SP_SET_POS_STATE } from "../../redux/reduxConstantsSinglePagePOS";

export const AutoDiscount = () => {
  const posState = useSelector((state) => state.SinglePagePOSReducers);
  const dispatch = useDispatch();

  const applyAutoDiscount = () => {
    posState?.productCart?.map((cartItem) => {
      posState?.punchScreenData?.Table14?.map((dis) => {
        if (cartItem.ProductDetailId === dis.ProductDetailId) {
          cartItem.DiscountPercent = dis.DiscountPercent;
          const initialDAmount =
            dis.IsPercentage === true
              ? (cartItem.PriceWithoutGST * dis.DiscountPercent) / 100
              : dis.DiscountPercent;

          const DAmount = cartItem.Quantity * initialDAmount;

          cartItem.DiscountAmount = DAmount;
        }
      });
    });
    let dAmt = posState?.productCart?.reduce((prev, next) => {
      return prev + next.DiscountAmount;
    }, 0);

    let woGst = posState?.productCart?.reduce((prev, next) => {
      return prev + parseFloat(next.PriceWithoutGST);
    }, 0);

    dispatch({
      type: SP_SET_POS_STATE,
      payload: {
        name: "prices",
        value: {
          ...posState?.prices,
          discountAmt: dAmt,
          // withGst: parseFloat(woGst) + parseFloat(posStore.prices.gst),
        },
      },
    });
    posState?.punchScreenData?.Table14?.length > 0 &&
      message.success("Auto Discount Applied Successfully");
  };
  return (
    <div>
      <TileButton
        margin={"5px"}
        title="Auto Discount"
        height="70px"
        width="75px"
        icon={<GiTakeMyMoney fontSize={26} />}
        className="rightTabsWhiteButton"
        type={posState.selectedDiscount?.length > 0 ? "primary" : ""}
        onClick={applyAutoDiscount}
        disabled={
          posState.productCart.length > 0 && posState.orderSourceId !== null
            ? false
            : true
        }
      />
    </div>
  );
};
