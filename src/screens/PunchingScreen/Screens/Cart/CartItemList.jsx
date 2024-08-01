import { DeleteFilled } from "@ant-design/icons";
import { Badge, Button, Input, Popconfirm, Tooltip } from "antd";
import React, { Fragment, useEffect, useState } from "react";
import { useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFloatValue } from "../../functionsSP/generalFunctionsSP";
import {
  SP_ADD_TO_CART,
  SP_SET_CART_RANDOM_ID_STATE,
  SP_SET_POS_STATE,
} from "../../redux/reduxConstantsSinglePagePOS";

export const CartItemList = () => {
  const posState = useSelector((state) => state.SinglePagePOSReducers);
  const dispatch = useDispatch();
  const posStore = useSelector((state) => state.SinglePagePOSReducers);
  const [productSpecialInstructions, setProductSpecialInstructions] =
    useState("");

  useEffect(() => {
    calculateTotal();
  }, [posState.productCart.length, ...posState.productCart]);

  const editProductDetail = (item, index) => {
    dispatch({
      type: SP_SET_CART_RANDOM_ID_STATE,
      payload: item.RandomId,
    });
    if (item.IsDeal === false && item.IsTopping === false) {
      dispatch({
        type: SP_SET_POS_STATE,
        payload: { name: "editCartIndex", value: index },
      });
      dispatch({
        type: SP_SET_POS_STATE,
        payload: { name: "selectedProductId", value: item.ProductId },
      });
      dispatch({
        type: SP_SET_POS_STATE,
        payload: {
          name: "selectedProductIdEdit",
          value: true,
        },
      });
      dispatch({
        type: SP_SET_POS_STATE,
        payload: { name: "selectedSizeId", value: item.SizeId },
      });
      dispatch({
        type: SP_SET_POS_STATE,
        payload: { name: "selectedFlavourId", value: item.FlavourId },
      });
    } else if (item.IsDeal === true) {
      dispatch({
        type: SP_SET_POS_STATE,
        payload: { name: "editCartIndex", value: index },
      });
      dispatch({
        type: SP_SET_POS_STATE,
        payload: { name: "selectedProductId", value: item.ProductId },
      });
      dispatch({
        type: SP_SET_POS_STATE,
        payload: { name: "selectedSizeId", value: item.SizeId },
      });
      dispatch({
        type: SP_SET_POS_STATE,
        payload: { name: "selectedFlavourId", value: item.FlavourId },
      });
      dispatch({
        type: SP_SET_POS_STATE,
        payload: { name: "dealSelection", value: true },
      });
    } else {
      message.warn("Topping cannot be edited");
    }
  };

  const deleteProductDetail = (index, item) => {
    if (item.OrderMaster !== null)
      if (posState.OrderMasterId !== null) {
        let lessList = posState.productCart
          .filter((x) => x.RandomId === item.RandomId)
          .map((y) => ({
            OrderMasterId: y.OrderMasterId,
            ProductDetailId: y.ProductDetailId,
            Quantity: y.Quantity,
            PriceWithoutGST: y.PriceWithoutGST,
            AmountWithoutGST: 0,
            ProductDetailName: y.ProductDetailName,
            type: "Less",
            SpecialInstruction: productSpecialInstructions,
          }));
        dispatch({
          type: SP_SET_POS_STATE,
          payload: {
            name: "OrderDetailLess",
            value: [...posState.OrderDetailLess, ...lessList],
          },
        });
      }
    let cartList = [];
    if (item.OrderParentId === null) {
      cartList = posState.productCart.filter(
        (x) => x.RandomId !== item.RandomId
      );
    } else {
      posState.productCart.splice(index, 1);
      cartList = posState.productCart;
    }
    dispatch({
      type: SP_ADD_TO_CART,
      payload: cartList,
    });
    calculateTotal();
    setProductSpecialInstructions("");
  };

  const addQuantity = (item) => {
    let pState = posState;
    const dAmount = (item.PriceWithoutGST * item.DiscountPercent) / 100;
    if (item.IsTopping === true || item.HalfAndHalf === true) return;

    let index = pState.productCart.findIndex(
      (x) => x.RandomId === item.RandomId && x.OrderParentId === null
    );
    if (item.IsDeal === true) {
    }
    if (pState.OrderMasterId !== null) {
      let addArray = pState.productCart
        .filter((x) => x.RandomId === item.RandomId && x.IsTopping === false)
        .map((y) => ({
          OrderMasterId: y.OrderMasterId,
          ProductDetailId: y.ProductDetailId,
          Quantity: 1,
          PriceWithoutGST: parseFloat(y.PriceWithoutGST),
          AmountWithoutGST: 0,
          ProductDetailName: y.ProductDetailName,
          type: "Add",
        }));
      if (
        posState.OrderDetailLess.some(
          (x) => x.ProductDetailId === addArray[0].ProductDetailId
        )
      ) {
        let index = posState.OrderDetailLess.indexOf(
          addArray[0].ProductDetailId
        );
        pState.OrderDetailLess.splice(index, 1);
        dispatch({
          type: SP_SET_POS_STATE,
          payload: {
            name: "OrderDetailLess",
            value: pState.OrderDetailLess,
          },
        });
      } else {
        dispatch({
          type: SP_SET_POS_STATE,
          payload: {
            name: "OrderDetailAdd",
            value: [...pState.OrderDetailAdd, ...addArray],
          },
        });
      }
    }
    pState.productCart[index].Quantity += 1;
    pState.productCart[index].DiscountAmount += dAmount;
    pState.productCart[index].totalAmount = getFloatValue(
      pState.productCart[index].PriceWithoutGST *
        pState.productCart[index].Quantity
    );
    dispatch({
      type: SP_ADD_TO_CART,
      payload: pState.productCart,
    });
    calculateTotal();
  };

  const minusQuantity = (item, quantity) => {
    let pState = posState;
    const dAmount = (item.PriceWithoutGST * item.DiscountPercent) / 100;
    if (item.IsTopping === true || item.HalfAndHalf === true) return;
    if (quantity !== 1) {
      let index = pState.productCart.findIndex(
        (x) => x.RandomId === item.RandomId && x.OrderParentId === null
      );
      if (pState.OrderMasterId !== null) {
        let addArray = pState.productCart
          .filter((x) => x.RandomId === item.RandomId && x.IsTopping === false)
          .map((y) => ({
            OrderMasterId: y.OrderMasterId,
            ProductDetailId: y.ProductDetailId,
            Quantity: 1,
            PriceWithoutGST: parseFloat(y.PriceWithoutGST),
            AmountWithoutGST: 0,
            ProductDetailName: y.ProductDetailName,
            type: "Less",
            SpecialInstruction: productSpecialInstructions,
          }));
        if (
          posState.OrderDetailAdd.some(
            (x) => x.ProductDetailId === addArray[0].ProductDetailId
          )
        ) {
          let index = posState.OrderDetailAdd.indexOf(
            addArray[0].ProductDetailId
          );
          pState.OrderDetailAdd.splice(index, 1);
          dispatch({
            type: SP_SET_POS_STATE,
            payload: {
              name: "OrderDetailAdd",
              value: pState.OrderDetailAdd,
            },
          });
        } else {
          dispatch({
            type: SP_SET_POS_STATE,
            payload: {
              name: "OrderDetailLess",
              value: [...pState.OrderDetailLess, ...addArray],
            },
          });
        }
      }
      pState.productCart[index].Quantity -= 1;
      pState.productCart[index].DiscountAmount -= dAmount;
      pState.productCart[index].totalAmount = getFloatValue(
        pState.productCart[index].PriceWithoutGST *
          pState.productCart[index].Quantity
      );
      dispatch({
        type: SP_ADD_TO_CART,
        payload: pState.productCart,
      });
      calculateTotal();
    }
    setProductSpecialInstructions("");
  };

  const calculateTotal = () => {
    // Applying Discount
    if (Object.keys(posState?.selectedDiscount)?.length !== 0) {
      posState.productCart
        .filter((x) => x.HalfAndHalf === false)
        .map((cartItem) => {
          posState.selectedDiscount.map((dis) => {
            if (cartItem.ProductDetailId === dis.ProductDetailId) {
              cartItem.DiscountPercent = dis.DiscountPercent;
              const initialDAmount =
                (cartItem.PriceWithoutGST * dis.DiscountPercent) / 100;

              const DAmount = cartItem.Quantity * initialDAmount;

              cartItem.DiscountAmount = DAmount;
            }
          });
        });
    }

    // Calculate Without GST Price
    let hnhFalse = parseFloat(
      posState.productCart
        .filter((x) => x.HalfAndHalf === false)
        .reduce((prev, next) => {
          return (
            prev + parseFloat(next.PriceWithoutGST) * parseFloat(next.Quantity) //-
            // parseFloat(next.DiscountAmount)
          );
        }, 0)
    ).toFixed(2);
    let hnhTrueArr = posState.productCart.filter((x) => x.HalfAndHalf === true);

    let hnhTrue = parseFloat(
      hnhTrueArr.reduce((prev, next) => {
        return prev + parseFloat(next.PriceWithoutGST);
      }, 0)
    ).toFixed(2);
    let woGst = parseFloat(hnhFalse) + parseFloat(hnhTrue);
    // \ Calculate Without GST Price

    let st = posState.GSTPercentage
      ? getFloatValue(
          parseFloat(woGst) * parseFloat(posState.GSTPercentage / 100)
        )
      : parseFloat(0).toFixed(2);
    let wGst = parseFloat(woGst) + parseFloat(st);
    let dAmt = posState.productCart
      // .filter((x) => x.OrderParentId === null)
      .reduce((prev, next) => {
        return prev + next.DiscountAmount;
      }, 0);

    const cloneOfExtraCharges = [...posState?.extraCharges];

    const calculatedExtras = [];

    cloneOfExtraCharges.length &&
      woGst > 0 &&
      cloneOfExtraCharges.forEach((e) => {
        if (e.IsPercent) {
          e.ExtraChargesAmount = (e.ChargesValue / 100) * woGst;
          calculatedExtras.push(e);
        } else {
          calculatedExtras.push(e);
        }
      });
    dispatch({
      type: SP_SET_POS_STATE,
      payload: {
        name: "prices",
        value: {
          ...posState.prices,
          gst: st,
          withoutGst: getFloatValue(woGst),
          withGst: getFloatValue(wGst),
          discountAmt: getFloatValue(dAmt),
        },
      },
    });
    if (calculatedExtras.length > 0) {
      dispatch({
        type: SP_SET_POS_STATE,
        payload: {
          name: "extraCharges",
          value: calculatedExtras,
        },
      });
    }
  };

  const style = {
    // padding: "20px 20px 0px 20px",
    background: "#FFFFFF",
    height: "56vh",
    position: "relative",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "22px",
    lineHeight: "26px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
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
    <div style={style}>
      <div>
        <div
          style={{
            width: "100%",
            height: 32,
            fontStyle: "normal",
            fontWeight: 400,
            fontSize: 20,
            color: "#000000",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 0",
          }}
        >
          <span className="customerCartDetail">
            {/* {posState.customerDetail.CustomerName} -
            {posState.customerDetail.OrderModeName} */}
            Dine-In
          </span>
          <Badge
            count={
              posState.productCart.filter((x) => x.OrderParentId === null)
                .length
            }
            color="rgb(69, 97, 185)"
          >
            <svg
              viewBox="0 0 1024 1024"
              focusable="false"
              data-icon="shopping-cart"
              width="1.3em"
              height="1.3em"
              color="#bfbfbf"
              fill="currentColor"
              aria-hidden="true"
              fontSize={20}
            >
              <path d="M922.9 701.9H327.4l29.9-60.9 496.8-.9c16.8 0 31.2-12 34.2-28.6l68.8-385.1c1.8-10.1-.9-20.5-7.5-28.4a34.99 34.99 0 00-26.6-12.5l-632-2.1-5.4-25.4c-3.4-16.2-18-28-34.6-28H96.5a35.3 35.3 0 100 70.6h125.9L246 312.8l58.1 281.3-74.8 122.1a34.96 34.96 0 00-3 36.8c6 11.9 18.1 19.4 31.5 19.4h62.8a102.43 102.43 0 00-20.6 61.7c0 56.6 46 102.6 102.6 102.6s102.6-46 102.6-102.6c0-22.3-7.4-44-20.6-61.7h161.1a102.43 102.43 0 00-20.6 61.7c0 56.6 46 102.6 102.6 102.6s102.6-46 102.6-102.6c0-22.3-7.4-44-20.6-61.7H923c19.4 0 35.3-15.8 35.3-35.3a35.42 35.42 0 00-35.4-35.2zM305.7 253l575.8 1.9-56.4 315.8-452.3.8L305.7 253zm96.9 612.7c-17.4 0-31.6-14.2-31.6-31.6 0-17.4 14.2-31.6 31.6-31.6s31.6 14.2 31.6 31.6a31.6 31.6 0 01-31.6 31.6zm325.1 0c-17.4 0-31.6-14.2-31.6-31.6 0-17.4 14.2-31.6 31.6-31.6s31.6 14.2 31.6 31.6a31.6 31.6 0 01-31.6 31.6z"></path>
            </svg>
          </Badge>
        </div>
        <div className="cartDiv" style={{ height: "52vh", overflow: "auto" }}>
          <table>
            <thead>
              <tr>
                <th>
                  <b>Items</b>
                </th>
                <th>
                  <b>Amount</b>
                </th>
                <th>
                  <b>Quantity</b>
                </th>
                <th>
                  <b>Discount</b>
                </th>
                <th>
                  <b>T.Amount</b>
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody style={{ overflow: "auto" }}>
              {posState.productCart
                .filter(
                  (x) =>
                    x.OrderParentId === null ||
                    x.IsTopping === true ||
                    x.HalfAndHalf === true
                )
                .map((item, index) => (
                  <Fragment>
                    <tr key={index} style={{ cursor: "pointer" }}>
                      <Tooltip placement="top" title={item.SpecialInstruction}>
                        <td onClick={() => editProductDetail(item, index)}>
                          {item.IsDeal
                            ? item.ProductName
                            : item.ProductDetailName}
                        </td>
                      </Tooltip>
                      <td
                        onClick={() =>
                          item.IsDeal === false &&
                          editProductDetail(item, index)
                        }
                      >
                        {getFloatValue(item.PriceWithoutGST)}
                      </td>
                      <td
                        style={{
                          minWidth: 105,
                          display: "felx",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginTop: "18%",
                        }}
                        align="center"
                        // onClick={() => editProductDetail(item, index)}
                      >
                        {item.IsTopping !== true &&
                          item.HalfAndHalf !== true &&
                          item.IsDeal === false && (
                            <Popconfirm
                              placement="top"
                              icon={null}
                              disabled={
                                posStore.recallOrder === true ? false : true
                              }
                              onConfirm={() =>
                                minusQuantity(item, item.Quantity)
                              }
                              title={
                                <Input
                                  size="middle"
                                  placeholder="Special Instruction"
                                  value={productSpecialInstructions}
                                  onChange={(e) =>
                                    setProductSpecialInstructions(
                                      e.target.value
                                    )
                                  }
                                />
                              }
                            >
                              <button
                                style={{
                                  fontWeight: "bolder",
                                  borderRadius: 50,
                                  height: 30,
                                  padding: "0px 10px",
                                  lineHeight: 1.5,
                                  color: "rgb(69, 97, 185)",
                                  borderColor: "rgb(69, 97, 185)",
                                  backgroundColor: "rgb(244, 249, 255)",
                                  boxShadow: "rgb(69 97 185 / 40%) 0px 0px 3px",
                                  minWidth: 32,
                                }}
                                className="ant-btn ant-btn-default"
                                onClick={() =>
                                  posStore.recallOrder === false
                                    ? minusQuantity(item, item.Quantity)
                                    : null
                                }
                                disabled={item.HalfAndHalf}
                              >
                                -
                              </button>
                            </Popconfirm>
                          )}
                        &nbsp;{item.Quantity}&nbsp;
                        {item.IsTopping !== true &&
                          item.HalfAndHalf !== true &&
                          item.IsDeal === false && (
                            <button
                              style={{
                                fontWeight: "bolder",
                                borderRadius: 50,
                                height: 30,
                                padding: "0px 10px",
                                lineHeight: 1.5,
                                color: "rgb(69, 97, 185)",
                                borderColor: "rgb(69, 97, 185)",
                                backgroundColor: "rgb(244, 249, 255)",
                                boxShadow: "rgb(69 97 185 / 40%) 0px 0px 3px",
                                minWidth: 32,
                              }}
                              className="ant-btn ant-btn-default"
                              onClick={() => addQuantity(item)}
                              disabled={item.HalfAndHalf}
                            >
                              +
                            </button>
                          )}
                      </td>
                      <td
                        onClick={() => editProductDetail(item, index)}
                        style={{ textAlign: "center" }}
                      >
                        {item?.DiscountAmount}
                      </td>
                      <td
                        onClick={() => editProductDetail(item, index)}
                        style={{ textAlign: "center" }}
                      >
                        {item?.totalAmount}
                      </td>
                      {/* <td style={{ textAlign: "right" }}>
                        {getFloatValue(
                          parseFloat(item.Price) * parseFloat(item.Quantity) -
                            parseFloat(item.DiscountAmount)
                        )}
                      </td> */}
                      <td
                        style={{
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Popconfirm
                          placement="top"
                          icon={null}
                          disabled={
                            posStore.recallOrder === true ? false : true
                          }
                          onConfirm={() => deleteProductDetail(index, item)}
                          title={
                            <Input
                              size="middle"
                              placeholder="Special Instruction"
                              value={productSpecialInstructions}
                              onChange={(e) =>
                                setProductSpecialInstructions(e.target.value)
                              }
                            />
                          }
                        >
                          <Button
                            style={{ marginTop: "18%" }}
                            type="text"
                            icon={
                              <DeleteFilled
                                className={
                                  item.IsTopping === true ||
                                  item.HalfAndHalf === true
                                    ? "blueIcon"
                                    : "redIcon"
                                }
                              />
                            }
                            onClick={() =>
                              posStore.recallOrder === false
                                ? deleteProductDetail(index, item)
                                : null
                            }
                          />
                        </Popconfirm>
                        <p className="item-tag">
                          {item.IsTopping === true
                            ? "Topp"
                            : item.HalfAndHalf === true
                            ? "H&H"
                            : null}
                        </p>
                        {/* </td>
                      <td> */}
                        {item.IsDeal && (
                          <button
                            style={{
                              borderRadius: "50%",
                              background: "white",
                              border: "1px solid blue",
                              color: "blue",
                              padding: "5px 7px",
                              lineHeight: "10px",
                            }}
                            onClick={() => {
                              var div = document.getElementById(
                                "newpost" + index
                              );
                              if (div.style.display !== "table-row") {
                                div.style.display = "table-row";
                              } else {
                                div.style.display = "none";
                              }
                            }}
                          >
                            +
                          </button>
                        )}
                      </td>
                    </tr>
                    <tr
                      id={"newpost" + index}
                      style={{ border: "none", display: "none" }}
                    >
                      <td
                        colSpan={6}
                        style={{ paddingLeft: "0", paddingRight: "0px" }}
                      >
                        <table>
                          <thead>
                            <tr>
                              <td>
                                <b>Name</b>
                              </td>
                              <td>
                                <b>Quantity</b>
                              </td>
                              <td>
                                <b>Price</b>
                              </td>
                            </tr>
                          </thead>
                          <tbody>
                            {posState.productCart
                              .filter(
                                (x) =>
                                  x.OrderParentId === item.ProductDetailId &&
                                  x.RandomId === item.RandomId
                              )
                              .map((it) => (
                                <tr>
                                  <td>{it.ProductDetailName}</td>
                                  <td>{it.Quantity}</td>
                                  <td>{getFloatValue(it.PriceWithGST)}</td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </Fragment>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
