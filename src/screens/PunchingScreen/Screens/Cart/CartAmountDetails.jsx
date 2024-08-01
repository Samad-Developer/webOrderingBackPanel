import { Button, Input } from "antd";
import React from "react";
import { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DELIVERY } from "../../common/SetupMstrEnum";
import { getFloatValue } from "../../functionsSP/generalFunctionsSP";
import { SP_SET_POS_STATE } from "../../redux/reduxConstantsSinglePagePOS";

export const CartAmountDetails = () => {
  const posState = useSelector((state) => state.SinglePagePOSReducers);
  const dispatch = useDispatch();

  const getTotalPayable = () => {
    const totalPayable =
      posState.OrderModeId === DELIVERY
        ? parseFloat(
            parseFloat(posState.prices.withoutGst) +
              parseFloat(posState.prices.gst) -
              parseFloat(posState.prices.discountAmt) +
              posState.deliveryCharges +
              parseFloat(
                posState.extraCharges?.reduce((prev, next) => {
                  return (prev += next.ExtraChargesAmount);
                }, 0)
              )
          ).toFixed(2)
        : parseFloat(
            parseFloat(posState.prices.withoutGst) +
              parseFloat(posState.prices.gst) -
              parseFloat(posState.prices.discountAmt) +
              parseFloat(
                posState.extraCharges?.reduce((prev, next) => {
                  return (prev += next.ExtraChargesAmount);
                }, 0)
              )
          ).toFixed(2);
    return totalPayable;
  };

  const s = {
    display: "flex",
    justifyContent: "space-between",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: 14,

    color: "#414141",
  };
  return (
    <div>
      <div
        style={{
          borderTop: "1px solid #ADADAD",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          bottom: 15,
        }}
      >
        <div style={s}>
          <span>Subtotal</span>
          <span>{getFloatValue(posState.prices.withoutGst)}</span>
        </div>
        <div style={s}>
          <span>Tax</span>
          <span>{posState.prices.gst}</span>
        </div>
        <div style={s}>
          <span>Discount</span>
          <span>
            {posState.prices.discountAmt === ""
              ? ""
              : getFloatValue(posState.prices.discountAmt)}
          </span>
        </div>
        {posState.extraCharges?.map((x) => (
          <div style={s}>
            <span>Extra Charges</span>
            <span>{x.ExtraChargesName}</span>
            <span>{parseFloat(x.ExtraChargesAmount).toFixed(2)}</span>
          </div>
        ))}

        {/* ////////////////// Delivery Charges ///////////////// */}
        {posState.OrderModeId === DELIVERY && (
          <Fragment>
            <div style={s}>
              <span>Delivery Charges</span>
              <span>
                <Input
                  style={{ width: 80, textAlign: "right" }}
                  value={posState.deliveryCharges}
                  type={"number"}
                  min={0}
                  onChange={(e) =>
                    dispatch({
                      type: SP_SET_POS_STATE,
                      payload: {
                        name: "deliveryCharges",
                        value: parseFloat(
                          e.target.value === "" ? 0 : e.target.value
                        ),
                      },
                    })
                  }
                />
              </span>
            </div>
            <div style={s}>
              <span>Delivery Time</span>
              <span>{posState.deliveryTime} min</span>
            </div>
          </Fragment>
        )}
        <div style={s}>
          <span
            style={{
              ...s,
              fontWeight: 600,
              fontSize: 20,
            }}
          >
            Payable
          </span>
          <span
            style={{
              ...s,
              fontWeight: 600,
              fontSize: 20,
            }}
          >
            {getTotalPayable()}
          </span>
        </div>
      </div>
    </div>
  );
};
