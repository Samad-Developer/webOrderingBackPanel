import { DeleteFilled } from "@ant-design/icons";
import { Button, Card, Col, Drawer, Input, message, Row, Space } from "antd";
import Meta from "antd/lib/card/Meta";
import Title from "antd/lib/typography/Title";
import React, { Fragment } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import KeypadSP from "../../Components/KeypadSP";
import RadioSelectSP from "../../Components/RadioSelectSP";
import { checkArrayQuantity } from "../../functionsSP/checkArrayQuantity";
import {
  getFloatValue,
  getRandomNumber,
} from "../../functionsSP/generalFunctionsSP";
import { menuDetailDrawerCalculation } from "../../functionsSP/posPriceCalculation";
import {
  SP_ADD_TO_CART,
  SP_SET_CART_RANDOM_ID_STATE,
  SP_SET_POS_STATE,
} from "../../redux/reduxConstantsSinglePagePOS";
import DealHalfNHalfModalSP from "./DealHalfNHalfModalSP";

const MenuDetailDrawer = () => {
  const posState = useSelector((state) => state.SinglePagePOSReducers);
  const dispatch = useDispatch();

  const [specialInstruction, setSpecialInstruction] = useState("");
  const [quantity, setQuantity] = useState("");
  const [selectedDealOption, setSelectedDealOption] = useState({});
  const [dealItemList, setDealItemList] = useState([]);
  const [toppingsModal, setToppingsModal] = useState(false);
  const [halfAndHalfModal, setHalfAndHalfModal] = useState(false);
  const [itemPrice, setItemPrice] = useState("");
  const [openHNHModal, setOpenHNHModal] = useState(false);
  const [hNHItem, setHNHItem] = useState({});

  const {
    punchScreenData: { Table4, Table9 },
  } = useSelector((state) => state.SinglePagePOSReducers);

  useEffect(() => {
    let netAmt = posState.netAmount;
    if (posState.productCart.length > 0) {
      posState.productCart.forEach((element) => {
        netAmt += element.totalAmount;
      });
    }
    dispatch({
      type: SP_SET_POS_STATE,
      payload: { name: "netAmount", value: netAmt },
    });
    if (posState.editCartIndex !== null) {
      let productDetailId = posState.productCart.filter(
        (x) =>
          (x.OrderParentId === null ||
            (x.OrderParentId !== null && x.IsTopping === true) ||
            (x.OrderParentId !== null && x.ProductDetailPropertyId !== null)) &&
          x.RandomId === posState.randomId
      )[0].ProductDetailId;
      let productDetailPropertyId =
        posState.productCart[posState.editCartIndex].ProductDetailPropertyId;
      if (posState.dealSelection === true) {
        setDealItemList([
          ...posState.productCart.filter(
            (x) =>
              x.OrderParentId === productDetailId &&
              x.RandomId === posState.randomId
          ),
        ]);
      } else {
        setDealItemList([
          ...posState.productCart.filter(
            (x) => x.RandomId === posState.randomId && x.OrderParentId !== null
          ),
        ]);
      }
    }
    posState.editCartIndex !== null &&
      setQuantity(posState.productCart[posState.editCartIndex].Quantity);
  }, [posState.productCart.length, posState.editCartIndex]);

  useEffect(() => {
    setItemPrice(
      menuDetailDrawerCalculation(
        posState.punchScreenData.Table,
        posState.punchScreenData.Table7,
        dealItemList,
        posState.selectedProductId,
        posState.selectedSizeId,
        posState.selectedFlavourId
      )
    );
  }, [
    posState.selectedFlavourId,
    posState.selectedSizeId,
    posState.selectedProductId,
    dealItemList.length,
  ]);

  const handleSize = (id) => {
    if (posState.selectedSizeId === id) {
      dispatch({
        type: SP_SET_POS_STATE,
        payload: { name: "selectedSizeId", value: null },
      });
      return;
    }
    dispatch({
      type: SP_SET_POS_STATE,
      payload: { name: "selectedSizeId", value: id },
    });
  };

  const handleFlavour = (id) => {
    if (posState.selectedFlavourId === id) {
      dispatch({
        type: SP_SET_POS_STATE,
        payload: { name: "selectedFlavourId", value: null },
      });
      return;
    }
    dispatch({
      type: SP_SET_POS_STATE,
      payload: { name: "selectedFlavourId", value: id },
    });
  };

  const onClose = () => {
    setQuantity("");
    setDealItemList([]);
    setSelectedDealOption({});
    dispatch({
      type: SP_SET_POS_STATE,
      payload: { name: "selectedProductId", value: null },
    });
    dispatch({
      type: SP_SET_POS_STATE,
      payload: { name: "selectedSizeId", value: null },
    });
    dispatch({
      type: SP_SET_POS_STATE,
      payload: { name: "selectedFlavourId", value: null },
    });
    dispatch({
      type: SP_SET_POS_STATE,
      payload: { name: "editCartIndex", value: null },
    });
    dispatch({
      type: SP_SET_POS_STATE,
      payload: { name: "dealSelection", value: false },
    });
    dispatch({
      type: SP_SET_CART_RANDOM_ID_STATE,
      payload: null,
    });
    dispatch({
      type: SP_SET_POS_STATE,
      payload: {
        name: "selectedProductIdEdit",
        value: false,
      },
    });
    setSpecialInstruction("");
  };

  const onConfirm = () => {
    let qty = quantity;
    if (qty === "" || qty < 1) qty = 1;
    let obj = posState.punchScreenData.Table?.filter(
      (x) =>
        x.SizeId === posState.selectedSizeId &&
        x.FlavourId === posState.selectedFlavourId &&
        x.ProductId === posState.selectedProductId
    )[0];

    let prices =
      dealItemList.filter((x) => x.ProductDetailPropertyId !== null).length > 0
        ? obj.ProductDetailPropertyPrice
        : obj.Price;
    let cartList = posState.productCart;
    dealItemList.unshift({
      ...obj,
      OrderMasterId: null,
      ProductCode: obj.ProductCode,
      PriceWithoutGST: getFloatValue(prices),
      PriceWithGST: getFloatValue(parseFloat(prices), 2),
      totalAmount: getFloatValue(getFloatValue(parseFloat(prices), 2) * qty),
      GSTId: obj.GSTId,
      SpecialInstruction: specialInstruction,
      OrderParentId: null,
      Quantity: parseInt(qty, 0),
      DiscountPercent: 0,
      DiscountAmount: 0,
      HalfAndHalf: false,
    });
    let randomNumber = getRandomNumber(1, 10000);
    let dealItems = dealItemList.map((item, index) =>
      item.IsTopping === false
        ? {
            ...item,
            RandomId: randomNumber,
            SortNumber: index + 1,
          }
        : {
            ...item,
            OrderParentId: obj.ProductDetailId,
            RandomId: randomNumber,
            SortNumber: index + 1,
          }
    );
    if (posState.OrderMasterId !== null) {
      let addList = dealItemList.map((y) => ({
        OrderMasterId: y.OrderMasterId,
        ProductDetailId: y.ProductDetailId,
        Quantity: parseFloat(y.Quantity),
        PriceWithoutGST: parseFloat(y.PriceWithoutGST),
        AmountWithGST: 0,
        ProductDetailName: y.ProductDetailName,
        type: "Add",
      }));
      dispatch({
        type: SP_SET_POS_STATE,
        payload: {
          name: "OrderDetailAdd",
          value: [...posState.OrderDetailAdd, ...addList],
        },
      });
    }
    if (posState.editCartIndex === null) {
      cartList = [...cartList, ...dealItems];
    } else {
      cartList.splice(posState.editCartIndex, 1);
      cartList.splice(posState.editCartIndex, 0, ...dealItems);
    }

    dispatch({
      type: SP_ADD_TO_CART,
      payload: cartList,
    });
    dispatch({
      type: SP_SET_POS_STATE,
      payload: {
        name: "selectedProductIdEdit",
        value: false,
      },
    });
    message.success("Product added to Cart", 2);
    onClose();
  };

  const onConfirmDeal = () => {
    let qty = quantity;
    if (qty === "") qty = 1;
    let randomNumber = getRandomNumber(1, 10000);
    let cartList = posState.productCart;
    let obj = posState.punchScreenData.Table.filter(
      (x) => x.ProductId === posState.selectedProductId
    )[0];
    dealItemList.unshift({
      ...obj,
      OrderMasterId: null,
      SpecialInstruction: specialInstruction,
      OrderParentId: null,
      Quantity: 1,
      ProductCode: obj.ProductCode,
      PriceWithoutGST: parseFloat(obj.Price) * parseFloat(qty),
      PriceWithGST: parseFloat(parseFloat(obj.Price) * parseFloat(qty)).toFixed(
        2
      ),
      totalAmount: obj.Price * parseFloat(qty),
      GSTId: obj.GSTId,
      DiscountPercent: 0,
      DiscountAmount: 0,
      HalfAndHalf: false,
      IsDeal: true,
    });
    let dealItems = dealItemList.map((item, index) => ({
      ...item,
      RandomId: randomNumber,
      IsDeal: true,
      SortIndex: index,
    }));
    if (posState.editCartIndex === null) {
      cartList = [...cartList, ...dealItems];
    } else {
      cartList = cartList.filter((x) => x.RandomId !== posState.randomId);
      cartList.splice(posState.editCartIndex, 0, ...dealItems);
    }
    if (posState.OrderMasterId !== null) {
      let addList = dealItemList.map((y) => ({
        OrderMasterId: y.OrderMasterId,
        ProductDetailId: y.ProductDetailId,
        Quantity: getFloatValue(y.Quantity),
        PriceWithoutGST: getFloatValue(y.PriceWithoutGST),
        AmountWithoutGST: 0,
        ProductDetailName: y.ProductDetailName,
        type: "Add",
      }));
      dispatch({
        type: SP_SET_POS_STATE,
        payload: {
          name: "OrderDetailAdd",
          value: [...posState.OrderDetailAdd, ...addList],
        },
      });
    }
    dispatch({
      type: SP_ADD_TO_CART,
      payload: cartList,
    });
    message.success("Deal added to cart", 2);
    onClose();
  };

  return (
    <div>
      {/* PRODUCT DRAWER */}
      <Drawer
        visible={
          posState.selectedProductId !== null &&
          posState.dealSelection === false
        }
        width="40vw"
        closable={false}
        destroyOnClose={true}
      >
        <KeypadSP
          title="Quantity"
          hideOk={true}
          result={quantity}
          setResult={setQuantity}
          onChange={(e) => setQuantity(e.value)}
          disabled={posState.selectedProductIdEdit === true && true}
        />
        <RadioSelectSP
          list={posState.punchScreenData.Table5?.filter(
            (x) => x.ProductId === posState.selectedProductId
          )}
          styles={{ marginBottom: 10 }}
          listId="SizeId"
          listName="SizeName"
          onClick={handleSize}
          title="Size"
          selected="selectedSizeId"
          disabled={
            dealItemList.filter((x) => x.ProductDetailPropertyId !== null)
              .length > 0
          }
        />
        <RadioSelectSP
          list={posState.punchScreenData.Table6?.filter(
            (x) =>
              x.ProductId === posState.selectedProductId &&
              x.SizeId === posState.selectedSizeId
          )}
          styles={{ marginBottom: 10 }}
          listId="FlavourId"
          listName="FlavourName"
          onClick={handleFlavour}
          title="Variants"
          selected="selectedFlavourId"
          disabled={
            dealItemList.filter(
              (x) => x.ProductDetailPropertyId !== null || x.IsTopping
            ).length > 0
          }
        />
        <div style={{ marginBottom: 10 }}>
          <Title level={4}>Extras</Title>
          <Space>
            {posState.selectedSizeId !== null &&
              posState.selectedFlavourId !== null &&
              posState.punchScreenData.Table7?.filter(
                (x) => x.SizeId === posState.selectedSizeId
              ).length > 0 && (
                <button
                  className="ant-btn ant-btn-primary ant-btn-lg"
                  // onClick={toggleToppingModal}
                >
                  Toppings
                </button>
              )}
          </Space>
          <table styles={{ marginBottom: 10 }}>
            <thead>
              <tr>
                <td>Topping Item</td>
                <td style={{ textAlign: "center" }}>Price</td>
                <td style={{ textAlign: "center" }}>Quantity</td>
                <td style={{ textAlign: "center" }}>Total Price</td>
              </tr>
            </thead>
            <tbody>
              {dealItemList.map((item, index) => (
                <tr key={index}>
                  <td>{item.ProductDetailName}</td>
                  <td style={{ textAlign: "center" }}>{item.PriceWithGST}</td>
                  <td style={{ textAlign: "center" }}>{item.Quantity}</td>
                  <td style={{ textAlign: "center" }}>
                    {getFloatValue(item.PriceWithGST * item.Quantity)}
                  </td>
                  <td>
                    <Space>
                      {item.IsToppingAllowed === true && (
                        <button
                          style={{
                            background: "darkblue",
                            boxShadow: "0 0 5px",
                            border: "none",
                            color: "white",
                          }}
                          // onClick={() => {
                          //   dispatch({
                          //     type: SET_POS_STATE,
                          //     payload: {
                          //       name: "selectedSizeId",
                          //       value: item.SizeId,
                          //     },
                          //   });
                          //   toggleToppingModal();
                          // }}
                          disabled={
                            posState.punchScreenData.Table7?.filter(
                              (x) => x.SizeId === posState.selectedSizeId
                            ).length === 0
                          }
                        >
                          Toppings
                        </button>
                      )}
                      <Button
                        type="text"
                        icon={<DeleteFilled className="redIcon" />}
                        onClick={() => {
                          dealItemList.splice(index, 1);
                          setDealItemList([...dealItemList]);
                        }}
                      />
                    </Space>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <br />
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <span style={{ color: "#707070" }}>Price (PKR):</span>&nbsp;
            <h2>{getFloatValue(itemPrice)}</h2>
          </div>

          <Input
            placeholder="Special Instruction"
            value={specialInstruction}
            onChange={(e) => setSpecialInstruction(e.target.value)}
          />
          <div className="productSelectionButton">
            <Button onClick={onClose} size="large">
              Close
            </Button>
            <Button
              onClick={onConfirm}
              type="primary"
              size="large"
              color="green"
              className="green"
              disabled={
                posState.selectedSizeId === null ||
                posState.selectedFlavourId === null
              }
            >
              Confirm
            </Button>
          </div>
        </div>
      </Drawer>
      {/* DEAL DRAWER */}
      <Drawer
        visible={
          !posState.IsDealDirectPunch &&
          posState.selectedProductId !== null &&
          posState.dealSelection === true
        }
        className="checkoutDealModal"
        width="85vw"
        closable={false}
        destroyOnClose={true}
      >
        <Row gutter={[8, 8]} style={{ gap: "8px", marginBottom: 10 }}>
          {posState.punchScreenData.Table?.filter(
            (x) =>
              x.ProductId === posState.selectedProductId &&
              x.orderSourceId === posState.orderSourceId
          ).map((product) =>
            posState.punchScreenData.Table3?.filter(
              (x) => x.ProductDetailId === product.ProductDetailId
            ).map((menu, index) => (
              <button
                style={{
                  height: 40,
                  color: "rgb(69, 97, 185)",
                  borderColor: "rgb(69, 97, 185)",
                  gap: 3,
                  backgroundColor: "rgb(244, 249, 255)",
                  boxShadow: "rgb(69 97 185 / 40%) 0px 0px 3px",
                }}
                className="ant-btn ant-btn-default"
                key={index}
                onClick={() => setSelectedDealOption(menu)}
              >
                {menu.DealOptionName +
                  " ( " +
                  menu.Quantity +
                  " / " +
                  menu.MaxQuantity +
                  " ) "}
              </button>
            ))
          )}
        </Row>
        <Row gutter={[8, 8]} style={{ marginBottom: 10 }}>
          {posState.punchScreenData.Table4?.filter(
            (x) => x.DealItemId === selectedDealOption.DealItemId
          ).map((menu, index) => (
            <Col key={index}>
              <Card
                className="rightSideDrawer"
                style={{
                  borderRadius: "5px",
                  border: "1px solid rgba(0, 0, 0, 0.2)",
                }}
                hoverable
                cover={
                  <img
                    alt="example"
                    src={
                      menu.ProductImage != null
                        ? process.env.REACT_APP_BASEURL + menu.ProductImage
                        : burgerImg
                    }
                    style={{
                      borderRight: "1px solid #bbb",
                      borderBottom: "1px solid #bbb",
                      borderLeft: "1px solid #bbb",
                      // borderRadius: "5px 5px 0 0",
                      resizeMode: "cover",
                    }}
                  />
                }
                onClick={() => {
                  if (
                    !checkArrayQuantity(
                      posState.punchScreenData.Table3,
                      dealItemList,
                      menu.DealItemId,
                      "DealItemId",
                      "DealItemId",
                      "plus"
                    )
                  )
                    return;
                  if (
                    dealItemList.filter(
                      (x) =>
                        x.DealItemId === menu.DealItemId &&
                        x.DealDescId === menu.DealDescId
                    ).length === 0
                  )
                    setDealItemList([
                      ...dealItemList,
                      {
                        OrderMasterId: null,
                        ProductDetailId: menu.ProductDetailId,
                        ProductDetailName: menu.ProductDetailName,
                        PriceWithoutGST: menu.Price,
                        GSTId: null,
                        GSTPercentage: parseFloat(menu.GSTPercentage),
                        PriceWithGST: getFloatValue(
                          // menu.Price +
                          //   (parseFloat(menu.Price) *
                          //     parseFloat(menu.GSTPercentage)) /
                          //     100
                          menu.Price
                        ),
                        OrderParentId: posState.punchScreenData.Table.filter(
                          (x) => x.ProductId === posState.selectedProductId
                        )[0].ProductDetailId,
                        Quantity: selectedDealOption.Quantity,
                        SpecialInstruction: null,
                        DiscountPercent: menu.DiscountPercent || null,
                        DiscountAmount: 0,
                        DealItemId: menu.DealItemId,
                        DealDescId: menu.DealDescId,
                        IsToppingAllowed: menu.IsToppingAllowed,
                        SizeId: menu.SizeId,
                        ProductPropertyPrice: menu.ProductPropertyPrice,
                        ProductPropertyName: menu.ProductPropertyName,
                        ProductPropertyId: menu.ProductPropertyId,
                        ProductPropertyCount: menu.ProductPropertyCount,
                        totalAmount: menu.Price,
                        HalfAndHalf: false,
                      },
                    ]);
                  else
                    message.error("You can't add same product multiple times");
                }}
              >
                <Meta
                  title={menu.ProductDetailName}
                  style={{
                    fontWeight: 400,
                    fontSize: 8,
                    overflow: "auto",
                    textAlign: "center",
                    whiteSpace: "normal",
                  }}
                />
              </Card>
            </Col>
          ))}
        </Row>
        <div className="checkoutTableDiv">
          <table style={{ marginBottom: 10 }}>
            <thead>
              <tr>
                <th>Items</th>
                <th style={{ textAlign: "center" }}>Additional Price</th>
                <th style={{ textAlign: "center" }}>Quantity</th>
                <th style={{ textAlign: "center" }}>Total Additional Price</th>
                <th style={{ textAlign: "center" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {dealItemList.map((item, index) => (
                <tr key={index}>
                  <td>{item.ProductDetailName}</td>
                  <td style={{ textAlign: "center" }}>{item.PriceWithGST}</td>
                  <td style={{ textAlign: "center" }}>
                    {item.Quantity >= 1 && (
                      <button
                        style={{
                          height: 30,
                          padding: "4px 12px",
                          lineHeight: 1.5,
                          color: "rgb(69, 97, 185)",
                          borderColor: "rgb(69, 97, 185)",
                          backgroundColor: "rgb(244, 249, 255)",
                          boxShadow: "rgb(69 97 185 / 40%) 0px 0px 3px",
                        }}
                        className="ant-btn ant-btn-default"
                        onClick={() => {
                          if (
                            !checkArrayQuantity(
                              posState.punchScreenData.Table3,
                              dealItemList,
                              dealItemList[index].DealItemId,
                              "DealItemId",
                              "DealItemId",
                              "minus"
                            )
                          )
                            return;
                          let array = dealItemList;
                          if (array[index].Quantity !== 1)
                            array[index] = {
                              ...array[index],
                              Quantity: parseInt(array[index].Quantity, 0) - 1,
                            };
                          setDealItemList([...array]);
                        }}
                      >
                        -
                      </button>
                    )}
                    &nbsp;&nbsp;{item.Quantity}&nbsp;&nbsp;
                    {item.Quantity >= 1 && (
                      <button
                        style={{
                          height: 30,
                          padding: "4px 12px",
                          lineHeight: 1.5,
                          color: "rgb(69, 97, 185)",
                          borderColor: "rgb(69, 97, 185)",
                          backgroundColor: "rgb(244, 249, 255)",
                          boxShadow: "rgb(69 97 185 / 40%) 0px 0px 3px",
                        }}
                        className="ant-btn ant-btn-default"
                        onClick={() => {
                          if (
                            !checkArrayQuantity(
                              posState.punchScreenData.Table3,
                              dealItemList,
                              dealItemList[index].DealItemId,
                              "DealItemId",
                              "DealItemId",
                              "plus"
                            )
                          )
                            return;
                          let array = dealItemList;
                          array[index] = {
                            ...array[index],
                            Quantity: parseInt(array[index].Quantity, 0) + 1,
                          };
                          setDealItemList([...array]);
                        }}
                      >
                        +
                      </button>
                    )}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {getFloatValue(item.PriceWithGST * item.Quantity)}
                  </td>
                  <td>
                    <Space>
                      {item.IsToppingAllowed === true && (
                        <button
                          style={{
                            background: "darkblue",
                            boxShadow: "0 0 5px",
                            border: "none",
                            color: "white",
                          }}
                          onClick={() => {
                            dispatch({
                              type: SET_POS_STATE,
                              payload: {
                                name: "selectedSizeId",
                                value: item.SizeId,
                              },
                            });
                            toggleToppingModal();
                          }}
                          disabled={
                            posState.punchScreenData.Table7.filter(
                              (x) => x.SizeId === item.SizeId
                            ).length === 0
                          }
                        >
                          Top
                        </button>
                      )}
                      {item.ProductPropertyId > 0 && item.Quantity >= 1 && (
                        <button
                          style={{
                            background: "green",
                            boxShadow: "0 0 5px",
                            border: "none",
                            color: "white",
                          }}
                          onClick={() => {
                            setOpenHNHModal(true);
                            setHNHItem(item);
                          }}
                        >
                          H&amp;H
                        </button>
                      )}
                      <Button
                        type="text"
                        icon={<DeleteFilled className="redIcon" />}
                        onClick={() => {
                          dealItemList.splice(index, 1);
                          setDealItemList([...dealItemList]);
                        }}
                      />
                    </Space>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <DealHalfNHalfModalSP
          isModalVisible={openHNHModal}
          handleOk={setOpenHNHModal}
          handleCancel={setOpenHNHModal}
          title="Half and Half Modal"
          okText="Okay"
          cancelText="Cancel"
          closable={true}
          destroyOnClose={true}
          hNHItem={hNHItem}
          dealItemList={dealItemList}
          setDealItemList={setDealItemList}
          filteredList={Table9?.filter((x) => {
            return (
              x.SizeId == hNHItem.SizeId
              // &&
              // x.ProductDetailPropertyCount == hNHItem.ProductPropertyCount
            );
          })}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <span style={{ color: "#707070" }}>Total Price (PKR):</span>
          &nbsp;
          <h2>
            <strong>{parseFloat(itemPrice).toFixed(2)}</strong>
          </h2>
        </div>
        <Input
          placeholder="Special Instruction"
          value={specialInstruction}
          onChange={(e) => setSpecialInstruction(e.target.value)}
        />
        <div className="productSelectionButton">
          <Button onClick={onClose} size="large">
            Close
          </Button>
          <Button
            onClick={() => {
              if (
                !checkArrayQuantity(
                  posState.punchScreenData.Table3,
                  dealItemList.filter((item) => item.IsTopping !== true),
                  null,
                  "DealItemId",
                  "DealItemId",
                  "all",
                  posState.selectedProductId,
                  posState.punchScreenData.Table,
                  posState.punchScreenData.Table3
                )
              ) {
                message.warn(
                  "Please select all the items of the selected Deal"
                );
              } else {
                onConfirmDeal();
              }
            }}
            type="primary"
            size="large"
            color="green"
            className="green"
          >
            Confirm
          </Button>
        </div>
      </Drawer>
    </div>
  );
};

export default MenuDetailDrawer;
