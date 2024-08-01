import { CloseOutlined } from "@ant-design/icons";
import { Button, Col, Drawer, message, Radio, Row, Space, Spin } from "antd";
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import FormButton from "../../../components/general/FormButton";
import {
  SET_POS_STATE,
  CLOSE_DRAWERS,
  OPEN_CUSTOMER_TABLE,
  RESET_DEFAULT_POS_STATE,
} from "../../../redux/reduxConstants";
import Cart from "./Cart";
import CategoryList from "./CategoryList";
import MenuList from "./MenuList";
import { BUTTON_SIZE } from "../../../common/ThemeConstants";
import FormTileButton from "../../../components/general/FormTileButton";
import { GiFullPizza, GiTakeMyMoney } from "react-icons/gi";
import { FiClock } from "react-icons/fi";
import { MdMoney } from "react-icons/md";
import AdvanceModal from "./AdvanceModal";
import OrderModal from "./OrderModal";
import ModalComponent from "../../../components/formComponent/ModalComponent";
import RadioSelect from "../../../components/PosComponents/RadioSelect";
import { postRequest } from "../../../services/mainApp.service";
import LoginModal from "./LoginModal";
import { HOLD_ORDER, DELIVERY } from "../../../common/SetupMasterEnum";
import {
  getFloatValue,
  getRandomNumber,
} from "../../../functions/generalFunctions";
import AssignRiderPopUp from "./AssignRiderPopUp";

const popupIntialFormValues = {
  OrderMasterId: null,
  OperationId: null,
  BranchId: null,
  UserId: null,
  TableId: null,
  WaiterId: null,
  RiderId: null,
};

const PunchScreen = (props) => {
  const { holdOrders, setHoldOrders } = props;
  const posStore = useSelector((state) => state.PointOfSaleReducer);
  const userData = useSelector((state) => state.authReducer);

  const { userBranchList, RoleId, IsPos } = useSelector(
    (state) => state.authReducer
  );
  const dispatch = useDispatch();
  const controller = new window.AbortController();

  const [discountModel, setDiscountModel] = useState(false);
  const [advanceOrderModel, setAdvanceOrderModel] = useState(false);
  const [orderSourceModal, setOrderSourceModal] = useState(false);
  const [discounts, setDiscounts] = useState([]);
  const [supportingDiscounts, setSupportingDiscounts] = useState([]);
  const [defaultOrderSourceValue, setDafaultOrderSourceValue] = useState(null);
  const [visibleAuthModal, setVisibleAuthModal] = useState(false);
  const barcodeRef = useRef(null);
  const [barcodeDisplayState, setBarcodeDisplayState] = useState("none");
  const [isRiderOpen, setIsRiderOpen] = useState(false);

  const toggleRiderPopUp = () => {
    setIsRiderOpen(!isRiderOpen);
  };

  const toggleAdvanceModal = () => {
    setAdvanceOrderModel(!advanceOrderModel);
  };

  const openDrawerOrAddProductToCart = (menu) => {
    let tempCart = [...posStore.productCart];
    let randomNumber = getRandomNumber(1, 10000);
    const foundProduct = posStore?.punchScreenData?.Table?.filter(
      (e) => e.ProductDetailId === menu.ProductDetailId
    );
    tempCart.push({
      ...foundProduct[0],
      OrderMasterId: null,
      PriceWithoutGST: getFloatValue(foundProduct[0].Price),
      PriceWithGST: getFloatValue(parseFloat(foundProduct[0].Price), 2),
      totalAmount: getFloatValue(
        getFloatValue(parseFloat(foundProduct[0].Price), 2) * 1
      ),
      SpecialInstruction: "",
      OrderParentId: null,
      Quantity: parseInt(1, 0),
      DiscountPercent: 0,
      DiscountAmount: 0,
      RandomId: randomNumber,
    });
    // }
    dispatch({
      type: SET_POS_STATE,
      payload: {
        name: "productCart",
        value: tempCart,
      },
    });
    if (posStore.OrderMasterId !== null) {
      let addList = {
        OrderMasterId: posStore.OrderMasterId,
        ProductDetailId: foundProduct[0].ProductDetailId,
        Quantity: parseFloat(1),
        PriceWithoutGST: parseFloat(getFloatValue(foundProduct[0].Price)),
        AmountWithGST: 0,
        ProductDetailName: foundProduct[0].ProductDetailName,
        type: "Add",
      };
      dispatch({
        type: SET_POS_STATE,
        payload: {
          name: "OrderDetailAdd",
          value: [...posStore.OrderDetailAdd, addList],
        },
      });
    }
  };

  // useEffect(() => {
  //   window.addEventListener("keydown", handleKeyDown);
  //   return () => {
  //     window.removeEventListener("keydown", handleKeyDown);
  //   };
  // }, [posStore]);

  // const handleKeyDown = (event) => {
  //   if (event.shiftKey && event.keyCode == 32) {
  //     setBarcodeDisplayState("initial");
  //     barcodeRef.current.focus();
  //   }
  //   if (event.keyCode == 13) {
  //     if (posStore.saleReturnMode) return;
  //     const barcode = barcodeRef.current.value.trim();
  //     const _product = posStore.punchScreenData.Table12.filter(
  //       (item, index) => item.ProductCode == barcode
  //     );
  //     if (!_product[0]) {
  //       message.error("Product does not exists");
  //     } else {
  //       openDrawerOrAddProductToCart(_product[0]);
  //       barcodeRef.current.value = "";
  //     }
  //   }
  // };

  const holdOrder = () => {
    const holdOrderList = JSON.parse(localStorage.getItem(HOLD_ORDER));
    let holdOrders = [];
    if (holdOrderList === null) {
      let state = posStore;
      state.BusinessTypeId = userData.companyList[0].BusinessTypeId;
      holdOrders.push(state);
      localStorage.setItem(HOLD_ORDER, JSON.stringify([...holdOrders]));
      dispatch({
        type: RESET_DEFAULT_POS_STATE,
        payload: userData.RoleName === "Cashier",
        payload: {
          RoleId: userData.RoleId,
          BusinessTypeId: userData?.companyList[0]?.BusinessTypeId,
        },
      });
      setHoldOrders(holdOrders);
    } else {
      if (holdOrderList.length <= 35) {
        holdOrders = holdOrderList;
        let state = posStore;
        state.BusinessTypeId = userData.companyList[0].BusinessTypeId;
        holdOrders.push(state);
        localStorage.setItem(HOLD_ORDER, JSON.stringify([...holdOrders]));
        dispatch({
          type: RESET_DEFAULT_POS_STATE,
          payload: userData.RoleName === "Cashier",
          payload: {
            RoleId: userData.RoleId,
            BusinessTypeId: userData?.companyList[0]?.BusinessTypeId,
          },
        });
        setHoldOrders(holdOrders);
        dispatch({
          type: SET_POS_STATE,
          payload: {
            name: "updateGetOrderList",
            value: true,
          },
        });
      } else {
        message.error("Hold Order Limit Reached (Limit : 35)");
      }
    }
  };
  const toggleOrderModal = () => {
    setOrderSourceModal(!orderSourceModal);
  };

  const removeDiscount = () => {
    dispatch({
      type: SET_POS_STATE,
      payload: {
        name: "selectedDiscount",
        value: [],
      },
    });
    dispatch({
      type: SET_POS_STATE,
      payload: {
        name: "DiscountId",
        value: null,
      },
    });
    dispatch({
      type: SET_POS_STATE,
      payload: {
        name: "DiscountPercent",
        value: 0,
      },
    });
    posStore.productCart.map((cartItem) => {
      cartItem.DiscountPercent = 0;
      cartItem.DiscountAmount = 0;
    });
  };

  const applyDiscountSubmit = () => {
    posStore.productCart.map((cartItem) => {
      posStore.selectedDiscount.map((dis) => {
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
    let dAmt = posStore.productCart.reduce((prev, next) => {
      return prev + next.DiscountAmount;
    }, 0);

    let woGst = posStore.productCart.reduce((prev, next) => {
      return prev + parseFloat(next.PriceWithoutGST);
    }, 0);

    dispatch({
      type: SET_POS_STATE,
      payload: {
        name: "prices",
        value: {
          ...posStore.prices,
          discountAmt: dAmt,
        },
      },
    });

    setDiscountModel(false);
  };

  const applyAutoDiscount = () => {
    posStore?.productCart?.map((cartItem) => {
      posStore?.punchScreenData?.Table14?.map((dis) => {
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
    let dAmt = posStore?.productCart?.reduce((prev, next) => {
      return prev + next.DiscountAmount;
    }, 0);

    let woGst = posStore?.productCart?.reduce((prev, next) => {
      return prev + parseFloat(next.PriceWithoutGST);
    }, 0);

    dispatch({
      type: SET_POS_STATE,
      payload: {
        name: "prices",
        value: {
          ...posStore?.prices,
          discountAmt: dAmt,
          // withGst: parseFloat(woGst) + parseFloat(posStore.prices.gst),
        },
      },
    });
    posStore?.punchScreenData?.Table14?.length > 0 &&
      message.success("Auto Discount Applied Successfully");
  };

  useEffect(() => {
    if (posStore.punchDrawer === false) return;

    if (IsPos && posStore?.punchScreenData?.Table8) {
      dispatch({
        type: SET_POS_STATE,
        payload: {
          name: "orderSourceName",
          value: posStore?.punchScreenData?.Table8?.filter(
            (source) => source.IsPos === 1
          )[0]?.OrderSource,
        },
      });
      // dispatch({
      //   type: SET_POS_STATE,
      //   payload: {
      //     name: "orderSourceId",
      //     value: posStore?.punchScreenData?.Table8?.filter(
      //       (source) => source.IsPos === 1
      //     )[0]?.OrderSourceId,
      //   },
      // });
    }
  }, [posStore?.punchScreenData?.Table8?.length, posStore.punchDrawer]);

  const openDiscountModel = () => {
    const month =
      new Date().getMonth() + 1 < 10
        ? "0" + (new Date().getMonth() + 1)
        : new Date().getMonth() + 1;
    const day =
      new Date().getDate() + 1 < 10
        ? "0" + new Date().getDate()
        : new Date().getDate();
    setVisibleAuthModal(false);
    const dataToSend = {
      OrderModeId: posStore.customerDetail.OrderMode,
      AreaId: posStore.customerDetail.AreaId,
      OrderMasterId: null,
      OrderSourceId: posStore.orderSourceId,
      BranchId:
        userBranchList.length === 1
          ? userBranchList[0].BranchId
          : posStore.customerDetail.BranchId,
      Date: new Date().getFullYear() + "-" + month + "-" + day,
      IsActiveInWeb: false,
      IsActiveInPOS: IsPos ? true : false,
      IsActiveInODMS: IsPos ? false : true,
      IsActiveInMobile: false,
    };

    postRequest(
      "/GetDiscount",
      {
        ...dataToSend,
      },
      controller
    )
      .then((response) => {
        if (response.error === true) {
          console.error("Show Error");
        }
        if (response.data.response === false) {
          message.error(response.DataSet.Table.errorMessage);
          return;
        }
        setDiscounts(response.data.DataSet.Table);
        setSupportingDiscounts(response.data.DataSet.Table1);
      })
      .catch((error) => console.error(error));
    setDiscountModel(true);
  };

  return (
    <Drawer
      width="100vw"
      className="drawerStyles"
      visible={posStore.punchDrawer}
      onClose={() => {
        dispatch({
          type: SET_POS_STATE,
          payload: { name: "punchDrawer", value: false },
        });
        dispatch({
          type: SET_POS_STATE,
          payload: { name: "customerDrawer", value: true },
        });
      }}
      closable={false}
      destroyOnClose={true}
    >
      {isRiderOpen && (
        <AssignRiderPopUp
          isModalVisible={isRiderOpen}
          handleCancel={toggleRiderPopUp}
          userData={userData}
          popupIntialFormValues={popupIntialFormValues}
        />
      )}

      <div className="formDrawerHeader">
        <Row
          align="right"
          style={{
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <h2>
            {/* New Order {` | ` + posStore.BranchName} */}
            New Order |{" "}
            {RoleId === 3
              ? "Agent"
              : userBranchList.length > 0 && userBranchList[0].BranchName
              ? userBranchList[0].BranchName
              : ""}
            {posStore.IsAdvanceOrder && ` | Advance Order`}{" "}
            {posStore.orderSourceId && ` | ${posStore.orderSourceName}`}{" "}
          </h2>
          <Space>
            {/* <FormButton
              title="Go Back"
              size={BUTTON_SIZE}
              color="gray"
              type="primary"
              icon={<CloseOutlined />}
              onClick={() => {
                dispatch({
                  type: OPEN_CUSTOMER_TABLE,
                });
                dispatch({
                  type: SET_POS_STATE,
                  payload: {
                    name: "recallOrder",
                    value: false,
                  },
                });
              }}
            /> */}

            <FormButton
              title="Go Back"
              size={BUTTON_SIZE}
              color="gray"
              type="primary"
              icon={<CloseOutlined />}
              onClick={() => {
                dispatch({
                  type: OPEN_CUSTOMER_TABLE,
                });
                dispatch({
                  type: SET_POS_STATE,
                  payload: {
                    name: "recallOrder",
                    value: false,
                  },
                });

                dispatch({
                  type: CLOSE_DRAWERS,
                });
                dispatch({
                  type: "RESET_DEFAULT_POS_STATE",
                  payload: {
                    RoleId: userData.RoleId,
                    BusinessTypeId: userData?.companyList[0]?.BusinessTypeId,
                  },
                });

                // dispatch({
                //   type: "AUTO_NEW_ORDER",
                //   payload: {
                //     AutoNewOrder: false,
                //   },
                // });
              }}
            />
          </Space>
        </Row>
      </div>
      <div
        className="formDrawerBody punchScreenDrawerBody"
        style={{ padding: 0 }}
      >
        <Col span={7}>
          <Cart />
        </Col>
        <Col
          /*span={11}*/ xs={10}
          sm={10}
          md={10}
          lg={10}
          xl={11}
          xxl={11}
          style={{ overflow: "auto" }}
        >
          <MenuList />
        </Col>
        {/* <Col xs={5} sm={5} md={5} lg={5} xl={4} xxl={4}> */}
        <Col xs={6} sm={6} md={6} lg={6} xl={5} xxl={5}>
          <CategoryList />
        </Col>
        <Col
          // xs={2}
          // sm={2}
          // md={2}
          // lg={2}
          // xl={2}
          // xxl={2}
          xs={1}
          sm={1}
          md={1}
          lg={1}
          xl={1}
          xxl={1}
          align="center"
          style={{ padding: "15px 20px 20px 5px" }}
        >
          <FormTileButton
            margin={"5px"}
            title="Advance Order"
            height="70px"
            width="75px"
            type={posStore.IsAdvanceOrder === true ? "primary" : ""}
            className="rightTabsWhiteButton"
            icon={<FiClock fontSize={26} />}
            onClick={toggleAdvanceModal}
          />
          <FormTileButton
            margin={"5px"}
            title="Discount"
            height="70px"
            width="75px"
            type={posStore?.selectedDiscount?.length > 0 ? "primary" : ""}
            className="rightTabsWhiteButton"
            icon={<GiTakeMyMoney fontSize={26} />}
            onClick={() => {
              if (IsPos === true) {
                setVisibleAuthModal(true);
              } else {
                openDiscountModel();
              }
            }}
            disabled={
              posStore.productCart.length > 0 && posStore.orderSourceId !== null
                ? false
                : true
            }
          />
          <FormTileButton
            margin={"5px"}
            title="Auto Discount"
            height="70px"
            width="75px"
            type={posStore.selectedDiscount?.length > 0 ? "primary" : ""}
            className="rightTabsWhiteButton"
            icon={<GiTakeMyMoney fontSize={26} />}
            onClick={applyAutoDiscount}
            disabled={
              posStore.productCart.length > 0 && posStore.orderSourceId !== null
                ? false
                : true
            }
          />
          {/* <FormTileButton
            margin={"5px"}
            title="Order Source"
            height="70px"
            width="75px"
            type={posStore.orderSourceId !== null ? "primary" : ""}
            className="rightTabsWhiteButton"
            icon={<MdMoney fontSize={26} />}
            onClick={toggleOrderModal}
          /> */}
          <FormTileButton
            margin={"5px"}
            title="Hold Order"
            height="70px"
            width="75px"
            type={posStore.IsAdvanceOrder === true ? "primary" : ""}
            className="rightTabsWhiteButton"
            icon={<GiTakeMyMoney fontSize={26} />}
            onClick={holdOrder}
            disabled={
              posStore.recallOrder === true
                ? true
                : posStore.productCart.length > 0 &&
                  posStore.orderSourceId !== null
                ? false
                : true
            }
          />
          {posStore.customerDetail.OrderMode === DELIVERY && (
            <FormTileButton
              margin={"5px"}
              title="Change/Assign Rider"
              height="70px"
              width="75px"
              type={""}
              className="rightTabsWhiteButton"
              icon={<GiFullPizza fontSize={26} />}
              onClick={toggleRiderPopUp}
            />
          )}
          <input
            id="barcodeInputField"
            type={"text"}
            style={{
              width: "20px",
              borderRadius: "50%",
              height: "20px",
              background: "green",
              borderColor: "green",
              color: "green",
              border: "none",
              display: barcodeDisplayState,
            }}
            ref={barcodeRef}
            // value={barcodeState}
            // onChange={(e) => setBarcodeState(e.target.value)}
          />
          {/* <FormTileButton
            margin={"5px"}
            title="Close Counter"
            height="70px"
            width="75px"
            className="rightTabsWhiteButton"
            icon={<MdPointOfSale fontSize={26} />}
          />
          <FormTileButton
            margin={"5px"}
            title="Start Shift"
            height="70px"
            width="75px"
            className="rightTabsWhiteButton"
            icon={<FaRegStopCircle fontSize={26} />}
          />
          <FormTileButton
            margin={"5px"}
            title="End Shift"
            height="70px"
            width="75px"
            className="rightTabsWhiteButton"
            icon={<FaRegStopCircle fontSize={26} />}
          /> */}
        </Col>
      </div>
      <AdvanceModal
        visible={advanceOrderModel}
        toggleModal={toggleAdvanceModal}
      />
      <OrderModal
        visible={orderSourceModal}
        toggleModal={toggleOrderModal}
        defaultOrderSource={IsPos}
      />

      <ModalComponent
        title="Apply Discount"
        isModalVisible={discountModel}
        handleOk={applyDiscountSubmit}
        handleCancel={() => setDiscountModel(false)}
      >
        <Col
          style={{
            display: "flex",
            flexDirection: "Row",
            alignItems: "center",
            flexWrap: "wrap",
            alignSelf: "flex-start",
            padding: "10px 0px",
          }}
        >
          {discounts.length > 0 ? (
            <Radio.Group
              optionType="button"
              buttonStyle="solid"
              value={posStore.DiscountId}
            >
              <Space direction="vertical">
                {discounts.map((item, index) => (
                  <Radio
                    key={index}
                    onChange={() => {
                      const foundDiscount = supportingDiscounts.filter(
                        (discount) => {
                          return (
                            discount.DiscountId === item.DiscountId && discount
                          );
                        }
                      );
                      dispatch({
                        type: SET_POS_STATE,
                        payload: {
                          name: "selectedDiscount",
                          value: foundDiscount,
                        },
                      });
                      dispatch({
                        type: SET_POS_STATE,
                        payload: {
                          name: "DiscountId",
                          value: item.DiscountId,
                        },
                      });
                      dispatch({
                        type: SET_POS_STATE,
                        payload: {
                          name: "DiscountPercent",
                          value: foundDiscount[0].DiscountPercent,
                        },
                      });
                    }}
                    value={item.DiscountId}
                  >
                    {item.DiscountName}
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
          ) : (
            <div></div>
          )}
        </Col>
        <Col>
          <Button onClick={removeDiscount}>Remove Discount</Button>
        </Col>
      </ModalComponent>
      <LoginModal
        setVisible={setVisibleAuthModal}
        visible={visibleAuthModal}
        performActionAfterAuth={openDiscountModel}
      />
    </Drawer>
  );
};
export default PunchScreen;
