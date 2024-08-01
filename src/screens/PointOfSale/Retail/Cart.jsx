import {
  DeleteFilled,
  PaperClipOutlined,
  PlusOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Col,
  Input,
  Popconfirm,
  Row,
  Table,
  Tooltip,
  message,
} from "antd";
import Title from "antd/lib/typography/Title";
import JsBarcode from "jsbarcode";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import FBRImage from "../../../assets/images/pos.png";
import {
  BRANCH_ADMIN,
  CASHIER,
  DAY_SHIFT_TERMINAL,
  DELIVERY,
  DINE_IN,
  SALE_RECIEPT,
  TAKE_AWAY,
  TERMINAL_UNIQUE_ID,
} from "../../../common/SetupMasterEnum";
import FormButton from "../../../components/general/FormButton";
import ComponentToPrint from "../../../components/specificComponents/ComponentToPrint";
import { getDateTime, getTime } from "../../../functions/dateFunctions";
import {
  getFloatValue,
  isNullValue,
} from "../../../functions/generalFunctions";
import { orderObjectSetter } from "../../../functions/orderObjectSetter";
import { setInitialState } from "../../../redux/actions/basicFormAction";
import {
  ADD_TO_CART,
  RESET_DEFAULT_POS_STATE,
  SET_CART_RANDOM_ID_STATE,
  SET_POS_STATE,
} from "../../../redux/reduxConstants";
import { postRequest } from "../../../services/mainApp.service";
import "./style.css";

const initialValues = {
  OperationId: null,
  OrderMasterId: null,
  CompanyId: null,
  BranchId: null,
  AreaId: null,
  CustomerId: null,
  PhoneId: null,
  CustomerAddressId: null,
  RiderId: null,
  OrderStatusId: null,
  IsAdvanceOrder: false,
  SpecialInstruction: "",
  OrderDate: Date.now(),
  OrderTime: "",
  TotalAmountWithoutGST: "",
  GSTId: null,
  TotalAmountWithGST: "",
  UserIP: "",
  AlternateNumber: "",
  AdvanceOrderDate: "",
  DeliveryTime: null,
  CLINumber: "",
  OrderSourceId: null,
  OrderSourceValue: "",
  DiscountId: null,
  DeliveryCharges: null,
  OrderCancelReasonId: null,
  WaiterId: null,
  ShiftDetailId: null,
  CounterDetailId: null,
  OrderModeId: null,
  Cover: 0,
  PaymentTypeId: null,
  DiscountAmount: null,
  GSTAmount: null,
  CareOfId: null,
  BillPrintCount: 0,
  PreviousOrderMasterId: null,
  Remarks: "",
  DiscountPercent: 0,
  GSTPercent: 0,
  FinishWasteRemarks: "",
  FinishWasteReasonId: null,
  UserId: "",
};

const initialFormValues = {
  BranchId: null,
  AreaId: null,
  OrderNumber: "%%",
  CustomerId: null,
  CustomerName: "%%",
  CustomerPhone: "%%",
  OrderModeId: null,
  OrderSourceId: DINE_IN,
  DateFrom: "",
  DateTo: "",
  StatusId: null,
  CityId: null,
};

const initialSearchValues = {
  BranchId: null,
  AreaId: null,
  OrderId: null,
  CustomerId: null,
  CustomerName: "",
  CustomerPhone: "",
  OrderModeId: null,
  OrderSourceId: DINE_IN,
  DateFrom: "",
  DateTo: "",
  StatusId: null,
};

export default function Cart() {

  // Redux
  const dispatch = useDispatch();
  const posState = useSelector((state) => state.PointOfSaleReducer);
  const userData = useSelector((state) => state.authReducer);
  const userState = useSelector((state) => state.authReducer);

  // Ref and Controller
  const componentRef = React.useRef(null);
  const controller = new window.AbortController();

  // State Variables
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [generateSlipLoader, setGenerateSlipLoader] = useState(false);
  const [paymentModesTabData, setPaymentModeTabData] = useState([]);
  const [paymentModeCash, setPaymentModeCash] = useState(null);
  const [dstValue, setDstValue] = useState({});
  const [returnAmount, setReturnAmount] = useState(0);
  const [saveButton, setSaveButton] = useState(false);

  const extraCharges = posState.extraCharges.reduce((prev, next) => {
    return (prev += next.ExtraChargesAmount);
  }, 0);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const paymentTableCols = [
    {
      title: "Amount",
      dataIndex: "ReceivedAmount",
      key: "ReceivedAmount",
    },
    {
      title: "Payment Type",
      dataIndex: "PaymentName",
      key: "PaymentName",
    },
    {
      title: "Delete",
      dataIndex: "delete",
      render: (index, record) => {
        return (
          <FormButton
            type="text"
            icon={<DeleteFilled className="redIcon" />}
            onClick={() => {
              deletePaymentMode(index);
            }}
          >
            X
          </FormButton>
        );
      },
    },
  ];
  useEffect(() => {
    let tAmount = paymentModesTabData.reduce((prev, next) => {
      return (prev += parseFloat(next.TotalAmount));
    }, 0);
    setPaymentModeCash(
      parseFloat(getTotalPayable() - parseFloat(tAmount)).toFixed(2)
    );
  }, [paymentModesTabData.length]);

  useEffect(() => {
    setDstValue(JSON.parse(localStorage.getItem(DAY_SHIFT_TERMINAL)));
  }, []);

  const editProductDetail = (item, index) => {
    dispatch({
      type: SET_CART_RANDOM_ID_STATE,
      payload: item.RandomId,
    });
    if (item.IsDeal === false && item.IsTopping === false) {
      dispatch({
        type: SET_POS_STATE,
        payload: { name: "editCartIndex", value: index },
      });
      dispatch({
        type: SET_POS_STATE,
        payload: { name: "selectedProductId", value: item.ProductId },
      });
      dispatch({
        type: SET_POS_STATE,
        payload: {
          name: "selectedProductIdEdit",
          value: true,
        },
      });
      dispatch({
        type: SET_POS_STATE,
        payload: { name: "selectedSizeId", value: item.SizeId },
      });
      dispatch({
        type: SET_POS_STATE,
        payload: { name: "selectedFlavourId", value: item.FlavourId },
      });
    } else if (item.IsDeal === true) {
      dispatch({
        type: SET_POS_STATE,
        payload: { name: "editCartIndex", value: index },
      });
      dispatch({
        type: SET_POS_STATE,
        payload: { name: "selectedProductId", value: item.ProductId },
      });
      dispatch({
        type: SET_POS_STATE,
        payload: { name: "selectedSizeId", value: item.SizeId },
      });
      dispatch({
        type: SET_POS_STATE,
        payload: { name: "selectedFlavourId", value: item.FlavourId },
      });
      dispatch({
        type: SET_POS_STATE,
        payload: { name: "dealSelection", value: true },
      });
    } else {
      message.warn("Topping cannot be edited");
    }
  };

  // Delete Product From The CART Of TOPPINGS, HALFandHALF And DEAL ITEMS
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
          }));
        dispatch({
          type: SET_POS_STATE,
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
      type: ADD_TO_CART,
      payload: cartList,
    });
    calculateTotal();
  };

  const addQuantity = (item) => {
    let pState = posState;
    const dAmount = (item.PriceWithoutGST * item.DiscountPercent) / 100;
    if (item.IsTopping === true || item.HalfAndHalf === true) return;

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
          type: "Add",
        }));
      dispatch({
        type: SET_POS_STATE,
        payload: {
          name: "OrderDetailAdd",
          value: [...pState.OrderDetailLess, ...addArray],
        },
      });
    }
    pState.productCart[index].Quantity += 1;
    pState.productCart[index].DiscountAmount += dAmount;
    pState.productCart[index].totalAmount = getFloatValue(
      pState.productCart[index].PriceWithoutGST *
      pState.productCart[index].Quantity
    );
    dispatch({
      type: ADD_TO_CART,
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
          }));
        dispatch({
          type: SET_POS_STATE,
          payload: {
            name: "OrderDetailLess",
            value: [...pState.OrderDetailLess, ...addArray],
          },
        });
      }
      pState.productCart[index].Quantity -= 1;
      pState.productCart[index].DiscountAmount -= dAmount;
      pState.productCart[index].totalAmount = getFloatValue(
        pState.productCart[index].PriceWithoutGST *
        pState.productCart[index].Quantity
      );
      dispatch({
        type: ADD_TO_CART,
        payload: pState.productCart,
      });
      calculateTotal();
    }
  };

  const calculateTotal = () => {
    if (Object.keys(posState.selectedDiscount).length !== 0) {
      posState.productCart.map((cartItem) => {
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
    let woGst = posState.productCart
      // .filter((x) => x.OrderParentId === null)
      .reduce((prev, next) => {
        return prev + next.PriceWithoutGST * next.Quantity;
      }, 0);

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

    const cloneOfExtraCharges = [...posState.extraCharges];

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
      type: SET_POS_STATE,
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
        type: SET_POS_STATE,
        payload: {
          name: "extraCharges",
          value: calculatedExtras,
        },
      });
    }
  };

  const deletePaymentMode = (index) => {
    let paymentModeList = [...paymentModesTabData];
    paymentModeList.splice(index, 1);
    setPaymentModeTabData(paymentModeList);
    let totalPayment = parseFloat(
      paymentModesTabData.reduce((prev, next) => {
        return (prev += parseFloat(next.ReceivedAmount));
      }, 0)
    ).toFixed(2);
    if (totalPayment > getTotalPayable()) {
      setReturnAmount(totalPayment - parseFloat(getTotalPayable()));
    } else {
      setReturnAmount(0);
    }
  };
  //add paymentMode

  const addPaymentMode = (paymentMode, paymentAmount) => {
    if (paymentModeCash <= 0) {
      message.error("Amount must be greater than Zero(0)");
      return;
    }

    let returningAmount = 0;
    let paymentListTotal = parseFloat(
      paymentModesTabData.reduce((prev, next) => {
        return (prev += parseFloat(next.TotalAmount));
      }, 0)
    ).toFixed(2);

    let totalAmount = parseFloat(
      parseFloat(paymentListTotal) + parseFloat(paymentAmount)
    ).toFixed(2);

    let extraCharges = parseFloat(
      posState?.extraCharges?.reduce((prev, next) => {
        return (prev += next.ExtraChargesAmount);
      }, 0)
    ).toFixed(2);

    let netAmount = parseFloat(
      parseFloat(posState?.prices?.withGst) +
      parseFloat(posState?.deliveryCharges) +
      parseFloat(extraCharges) -
      parseFloat(posState?.prices?.discountAmt)
    ).toFixed(2);

    if (parseFloat(paymentListTotal) == getTotalPayable()) {
      message.error("Amount is already balanced");
      return;
    } else if (
      !paymentModesTabData.some(
        (x) => x.PaymentModeId === paymentMode.PaymentModeId
      )
    ) {
      if (parseFloat(totalAmount) > parseFloat(netAmount))
        returningAmount = parseFloat(
          parseFloat(totalAmount) - parseFloat(netAmount)
        ).toFixed(2);

      setPaymentModeTabData([
        ...paymentModesTabData,
        {
          PaymentModeId: paymentMode.PaymentModeId,
          TotalAmount: paymentAmount - returningAmount,
          ReceivedAmount: paymentAmount - returningAmount,
          PaymentName: paymentMode.PaymentMode,
          IsFoc: paymentMode.IsFoc,
        },
      ]);
    } else message.error("Payment Mode Already Added");
    setReturnAmount(returningAmount);
  };

  const checkoutFromCart = () => {
    setPaymentModeTabData([]);
    setPaymentModeCash(getTotalPayable());
  };

  const getTotalPayable = () => {
    const totalPayable =
      posState.customerDetail.OrderMode === DELIVERY
        ? parseFloat(
          parseFloat(posState.prices.withoutGst) +
          parseFloat(posState.prices.gst) -
          parseFloat(posState.prices.discountAmt) +
          posState.deliveryCharges +
          parseFloat(
            posState.extraCharges.reduce((prev, next) => {
              return (prev += next.ExtraChargesAmount);
            }, 0)
          ) -
          parseFloat(posState.reservationDetail.TotalAdvance ?? 0)
        ).toFixed(2)
        : parseFloat(
          parseFloat(posState.prices.withoutGst) +
          parseFloat(posState.prices.gst) -
          parseFloat(posState.prices.discountAmt) +
          parseFloat(
            posState.extraCharges.reduce((prev, next) => {
              return (prev += next.ExtraChargesAmount);
            }, 0)
          ) -
          parseFloat(posState.reservationDetail.TotalAdvance ?? 0)
        ).toFixed(2);
    return totalPayable;
  };

  useEffect(() => {
    var elem = document.getElementById("cartList");
    elem.scrollTop = elem.scrollHeight;
    calculateTotal();
  }, [posState.productCart.length, ...posState.productCart]);

  // Reset The State of Point Of Sale Reducer
  const resetState = () => {
    dispatch({
      type: RESET_DEFAULT_POS_STATE,
      payload: userData.RoleName === "Cashier",
      payload: {
        RoleId: userData.RoleId,
        BusinessTypeId: userData?.companyList[0]?.BusinessTypeId,
      },
    });
  };

  /**
   * This Function Makes The Object For The Post Request And Make The Post Request
   */
  const confirmOrder = (buttonType) => {
    let saleRecieptTemplate = posState?.templateList?.Table?.find(
      (item) => item.TemplateTypeId == SALE_RECIEPT
    )?.TemplateHtml;

    if (posState.productCart.length === 0) {
      message.warn("Add Product in Cart First");
      return;
    }
    if (posState.orderSourceId === null) {
      message.warn("Please Select Order Source First");
      return;
    }
    /**  For Delivery Order Mode Rider Selection */
    if (
      buttonType === 1 &&
      posState.customerDetail.OrderMode === DELIVERY &&
      !posState.riderId
    ) {
      message.error("Please select a rider first!");
      return;
    }
    /**  For Delivery Order Mode Rider Selection */
    if (buttonType === 1 && paymentModesTabData.length === 0) {
      message.warn("Please add payment first");
      return;
    }
    let sumAmount =
      paymentModesTabData.length > 0
        ? paymentModesTabData?.reduce((prev, next) => {
          return (prev += parseFloat(next.ReceivedAmount));
        }, 0)
        : 0;

    let payableAmt = getTotalPayable();
    if (
      parseInt(sumAmount) < parseInt(payableAmt) &&
      paymentModesTabData.length > 0
    ) {
      message.warn("Amount is not Balanced");
      return;
    }
    setConfirmLoading(true);
    let branchId =
      posState.customerDetail.OrderMode === TAKE_AWAY
        ? posState.BranchId
        : posState.customerDetail.OrderMode === DELIVERY
          ? posState.customerDetail.BranchId
          : posState.customerDetail.OrderMode === DINE_IN
            ? userState.branchId
            : null;
    let data = {
      ...initialValues,
      OrderMasterId: posState.OrderMasterId,
      BranchId: branchId,
      AreaId: posState.customerDetail.AreaId || null,
      CustomerId: posState.customerDetail.CustomerId,
      PhoneId: posState.customerDetail.PhoneId,
      CustomerAddressId: posState.customerDetail.CustomerAddressId,
      IsAdvanceOrder: posState.IsAdvanceOrder,
      OrderDate: getDateTime(Date.now()),
      TotalAmountWithoutGST: posState.prices.withoutGst,
      GSTId: posState.GSTId || null,
      TotalAmountWithGST: posState.prices.withGst,
      AdvanceOrderDate: posState.AdvanceOrderDate,
      OrderModeId: posState.customerDetail.OrderMode,
      tblOrderDetail: orderObjectSetter(posState.productCart),
      SpecialInstruction: posState.Remarks,
      RiderId: posState.riderId,
      OrderStatusId: null,
      OrderTime: getTime(Date.now()),
      AlternateNumber: posState.AlternateNumber,
      CLINumber: posState.CLINumber.toString(),
      OrderSourceId: posState.orderSourceId,
      OrderSourceValue: posState.orderSourceName,
      DiscountId: posState.DiscountId,
      OrderCancelReasonId: null,
      WaiterId: posState.waiterId,
      TableId: posState.tableId,
      ShiftDetailId:
        userData.RoleId === BRANCH_ADMIN || userData.RoleId === CASHIER
          ? dstValue.ShiftDetailId
          : 0,
      CounterDetailId:
        userData.RoleId === BRANCH_ADMIN || userData.RoleId === CASHIER
          ? dstValue.TerminalDetailId
          : 0,
      Cover: posState.coverId,
      PaymentTypeId: posState.PaymentTypeId,
      DiscountAmount: posState.prices.discountAmt,
      ReservationId: posState.reservationDetail?.ReservationId || null,
      GSTAmount: posState.prices.gst,
      CareOfId: posState.CareOfId,
      BillPrintCount: 0,
      PreviousOrderMasterId: null,
      Remarks: "",
      DiscountPercent: posState.DiscountPercent,
      GSTPercent: posState.GSTPercentage,
      FinishWasteRemarks: posState.FinishWasteRemarks,
      FinishWasteReasonId: posState.FinishWasteReasonId,
      tblOrderDetailAdd: posState.OrderDetailAdd,
      tblOrderDetailLess: posState.OrderDetailLess,
      tblOrderExtraCharges: posState.extraCharges,
      tblOrderPaymentDetail: paymentModesTabData,
    };

    data =
      posState.customerDetail.OrderMode === DELIVERY
        ? {
          ...data,
          DeliveryCharges: posState.deliveryCharges,
          DeliveryTime: posState.deliveryTime,
        }
        : { ...data };
    postRequest(
      "crudOrder",
      {
        ...data,
        TerminalUniqueId: localStorage.getItem(TERMINAL_UNIQUE_ID),
        OperationId: posState.OrderMasterId === null ? 2 : 3,
        CompanyId: userData.CompanyId,
        UserId: userData.UserId,
        UserIP: "1.2.2.1",
      },
      controller
    )
      .then((response) => {
        setConfirmLoading(false);

        if (response.error === true) {
          message.error(response.errorMessage);
          return;
        }
        if (response.data.response === false) {
          message.error(response.DataSet.Table.errorMessage);
          return;
        }
        if (buttonType === 1) {
          let rows = posState?.productCart
            ?.map(
              (item) =>
                `<tr>
            <td style="text-align: left; font-weight: 500; border: 0; color: #000">${item.Quantity}</td>
            <td style="text-align: left; font-weight: 500; border: 0; color: #000">${item.ProductDetailName}</td>
            <td style="font-weight: 500; border: 0; color: #000;text-align:right">${item.PriceWithGST}</td>
          </tr>`
            )
            .join("");

          let saleRecieptTemplate = posState?.templateList?.Table?.find(
            (item) => item.TemplateTypeId == SALE_RECIEPT
          )?.TemplateHtml;
          saleRecieptTemplate = saleRecieptTemplate.replace("{itemBody}", rows);
          saleRecieptTemplate = saleRecieptTemplate.replace(
            "{companyName}",
            userData.CompanyName
          );

          saleRecieptTemplate = saleRecieptTemplate.replace(
            "{username}",
            `<tr><td style="text-align: left; font-weight: 500; border: 0; color: #000">Username: </td>
          <td style="text-align: right; font-weight: 500; border: 0; color: #000">${userData.UserName}</td></tr>`
          );

          saleRecieptTemplate = saleRecieptTemplate.replace("{itemBody}", rows);

          //some fields
          saleRecieptTemplate = saleRecieptTemplate.replace(
            "{branchAddress}",
            userData?.userBranchList[0].BranchAddress || ""
          );

          if (
            response.data.DataSet.Table?.[0]?.FbrInvoiceId !== null &&
            response.data.DataSet.Table?.[0]?.FbrInvoiceId !== undefined
          ) {
            let fbrQR = document.getElementById("qr-code-container")?.innerHTML;
            saleRecieptTemplate = saleRecieptTemplate.replace(
              "{fbrIntegration}",
              `<div style="display:flex; justify-content:space-between; align-items:center; margin:20px 5px">
            <div>
              <image style="width:50px; height:auto;" src="${FBRImage}"/></div>
            <div style="display:flex; flex-direction:column; text-align:center">
              <span><p style='color:black; margin-right:10px;'>FBR Invoice Number</p></span>
              <span><p style='color:black; margin-right:20px;'>${response.data.DataSet.Table[0]?.FbrInvoiceId}</p></span>
            </div>
            <div>${fbrQR}</div>
      
          </div>`
            );
            saleRecieptTemplate = saleRecieptTemplate.replace(
              "{srbIntegration}",
              ""
            );
          } else {
            saleRecieptTemplate = saleRecieptTemplate.replace(
              "{fbrIntegration}",
              ""
            );
          }

          saleRecieptTemplate = saleRecieptTemplate.replace(
            "{gstPercents}",

            `(${posState.GSTPercentage.toFixed(2)}%)`
          );
          saleRecieptTemplate = saleRecieptTemplate.replace(
            "{gst}",

            parseFloat(
              (posState.prices.withoutGst * posState.GSTPercentage) / 100
            ).toFixed(2)
          );
          saleRecieptTemplate = saleRecieptTemplate.replace(
            "{paymentMode}",
            paymentModesTabData
              .map(
                (item) => `<tr>
              <td style="text-align: left; font-weight: 500; border: 0; color: #000">${item.PaymentName
                  }</td>
              <td style="text-align: right; font-weight: 500; border: 0; color: #000">${item.ReceivedAmount.toFixed(
                    2
                  )}</td>
              </tr>`
              )
              .join(" ")
          );
          saleRecieptTemplate = saleRecieptTemplate.replace(
            "{returnAmount}",
            ` <tr> <td style="text-align: left; font-weight: 500; border: 0; color: #000">Return Amount:</td>
          <td style="text-align: right; font-weight: 500; border: 0; color: #000">${returnAmount}</td> </tr>`
          );

          if (posState.customerDetail.OrderMode === DELIVERY) {
            saleRecieptTemplate = saleRecieptTemplate.replace(
              "{customerName}",
              isNullValue(posState.customerDetail.CustomerName) &&
              `<tr>
          <td style="text-align: left; font-weight: 500; border: 0; color: #000">Customer:</td>
          <td style="text-align: right; font-weight: 500; border: 0; color: #000">${posState.customerDetail.CustomerName}
          </td>
        </tr>`
            );

            saleRecieptTemplate = saleRecieptTemplate.replace(
              "{address}",
              isNullValue(
                posState.customerSupportingTable.Table2[0].CompleteAddress
              )
                ? `<tr>
          <td style="text-align: left; font-weight: 500; border: 0; color: #000">Address:</td>
          <td style="text-align: right; font-weight: 500; border: 0; color: #000">${posState.customerSupportingTable?.Table2[0].CompleteAddress}
          </td>
        </tr>`
                : `<tr>
          <td style="text-align: left; font-weight: 500; border: 0; color: #000">Address:</td>
          <td style="text-align: right; font-weight: 500; border: 0; color: #000">${posState.customerDetail.Address}
          </td>
        </tr>`
            );

            saleRecieptTemplate = saleRecieptTemplate.replace(
              "{phone}",
              isNullValue(posState.customerDetail.PhoneNumber) &&
              `<tr>
          <td style="text-align: left; font-weight: 500; border: 0; color: #000">Phone #:</td>
          <td style="text-align: right; font-weight: 500; border: 0; color: #000">${posState.customerDetail.PhoneNumber}
          </td>
        </tr>`
            );

            saleRecieptTemplate = saleRecieptTemplate.replace(
              "{finalBill}",

              `<tr>
          <td style="text-align: left; font-weight: 500; border: 0; color: #000">Delivery Charges:</td>
          <td style="margin: 3px 0; text-align: right">${posState.deliveryCharges}</td>
        </tr>`
            );

            saleRecieptTemplate = saleRecieptTemplate.replace(
              "{rider}",
              isNullValue(posState.riderName)
                ? `<tr>
          <td style="text-align: left; font-weight: 500; border: 0; color: #000">Rider:</td>
          <td style="text-align: right; font-weight: 500; border: 0; color: #000">${posState.riderName}</td>
        </tr>`
                : "<tr>"
            );
            saleRecieptTemplate = saleRecieptTemplate.replace(
              "{waiter}",

              "<tr></tr>"
            );
            saleRecieptTemplate = saleRecieptTemplate.replace(
              "{table}",

              "<tr></tr>"
            );
          } else if (posState.customerDetail.OrderMode === DINE_IN) {
            saleRecieptTemplate = saleRecieptTemplate.replace(
              "{customerName}",
              "<tr></tr>"
            );
            saleRecieptTemplate = saleRecieptTemplate.replace("{address}", "");
            saleRecieptTemplate = saleRecieptTemplate.replace("{phone}", "");

            saleRecieptTemplate = saleRecieptTemplate.replace(
              "{finalBill}",

              "<tr></tr>"
            );
            saleRecieptTemplate = saleRecieptTemplate.replace("{rider}", "");
            saleRecieptTemplate = saleRecieptTemplate.replace(
              "{waiter}",
              isNullValue(posState.waiterName)
                ? `<tr>
          <td style="text-align: left; font-weight: 500; border: 0; color: #000">Waiter:</td>
          <td style="text-align: right; font-weight: 500; border: 0; color: #000">${posState.waiterName}</td>
        </tr>`
                : `<tr>
          <td style="text-align: left; font-weight: 500; border: 0; color: #000">Waiter:</td>
          <td style="text-align: right; font-weight: 500; border: 0; color: #000">
            Not Assigned
          </td>
        </tr>`
            );
            saleRecieptTemplate = saleRecieptTemplate.replace(
              "{table}",
              isNullValue(posState.tableName)
                ? `<tr>
          <td style="text-align: left; font-weight: 500; border: 0; color: #000"s>Table:</td>
          <td style="text-align: right; font-weight: 500; border: 0; color: #000">${posState.tableName}</td>
        </tr>`
                : `<tr>
          <td style="text-align: left; font-weight: 500; border: 0; color: #000">Table:</td>
          <td style="text-align: right; font-weight: 500; border: 0; color: #000">Not Assigned</td>
        </tr>`
            );
          } else {
            saleRecieptTemplate = saleRecieptTemplate.replace(
              "{customerName}",
              "<tr></tr>"
            );
            saleRecieptTemplate = saleRecieptTemplate.replace(
              "{rider}",
              "<tr></tr>"
            );
            saleRecieptTemplate = saleRecieptTemplate.replace(
              "{waiter}",
              "<tr></tr>"
            );
            saleRecieptTemplate = saleRecieptTemplate.replace(
              "{table}",
              "<tr></tr>"
            );
            saleRecieptTemplate = saleRecieptTemplate.replace(
              "{address}",
              "<tr></tr>"
            );
            saleRecieptTemplate = saleRecieptTemplate.replace(
              "{phone}",
              "<tr></tr>"
            );

            saleRecieptTemplate = saleRecieptTemplate.replace(
              "{finalBill}",
              "<tr></tr>"
            );
          }

          //Extra charges
          {
            saleRecieptTemplate = saleRecieptTemplate.replace(
              "{beforeBill}",
              posState?.punchScreenData?.Table10?.filter(
                (x) => x.OrderModeId === posState?.customerDetail?.OrderMode
                // response?.data?.DataSet?.Table2[0]?.OrderMode
              )
                ?.map(
                  (x) =>
                    `<tr>
                  <td style="text-align: left; font-weight: 500; border: 0; color: #000">${x.ExtraChargesName
                    }</td>
                  <td style="text-align: right; font-weight: 500; border: 0; color: #000">${parseFloat(
                      x.IsPercent
                        ? (
                          (x.ChargesValue / 100) *
                          posState.prices.withoutGst
                        ).toFixed(2)
                        : x.ChargesValue
                    ).toFixed(2)}</td>
                </tr>`
                )
                .join("")
            );
          }

          //end of extra charges

          saleRecieptTemplate = saleRecieptTemplate.replace(
            "{productSubtotal}",
            posState.prices.withoutGst
          );
          saleRecieptTemplate = saleRecieptTemplate.replace(
            "{totalAmount}",
            posState.prices.withGst
          );
          saleRecieptTemplate = saleRecieptTemplate.replace(
            "{discountAmount}",
            posState.prices.discountAmt
          );
          saleRecieptTemplate = saleRecieptTemplate.replace(
            "{productNetBill}",
            (
              parseFloat(posState?.prices.withGst) +
              parseFloat(
                posState.deliveryCharges ? posState.deliveryCharges : 0
              ) +
              parseFloat(extraCharges) -
              parseFloat(posState?.prices.discountAmt)
            ).toFixed(2)
          );

          saleRecieptTemplate = saleRecieptTemplate.replace(
            "{orderNumber}",
            response.data.DataSet.Table2[0].OrderNumber
          );

          saleRecieptTemplate = saleRecieptTemplate.replace(
            "{orderMode}",

            response.data.DataSet.Table2[0].OrderMode
          );
          saleRecieptTemplate = saleRecieptTemplate.replace(
            "{orderDateTime}",
            response.data.DataSet.Table[0].OrderDate
              ? response.data.DataSet.Table[0].OrderDate?.split(".")[0]
              : response.data.DataSet.Table2[0].OrderDate
          );

          dispatch({
            type: SET_POS_STATE,
            payload: {
              name: "KOTPrint",
              value: saleRecieptTemplate,
            },
          });
          dispatch({
            type: SET_POS_STATE,
            payload: {
              name: "selectedOrderModal",
              value: false,
            },
          });
          dispatch({
            type: SET_POS_STATE,
            payload: { name: "punchDrawer", value: false },
          });
          dispatch({
            type: SET_POS_STATE,
            payload: { name: "customerDrawer", value: true },
          });
          userData?.IsPos && handlePrint();

          resetState();

          dispatch(
            setInitialState(
              "/GetOrder",
              {
                ...initialFormValues,
                BranchId:
                  userData.userBranchList.length === 1
                    ? userData.userBranchList[0].BranchId
                    : null,
              },
              initialFormValues,
              initialSearchValues,
              controller,
              userData
            )
          );
        }

        if (buttonType === 0) {
          dispatch({
            type: SET_POS_STATE,
            payload: {
              name: "updateGetOrderList",
              value: true,
            },
          });
        }
        resetState();

        message.success("Order Placed Successfully");
      })
      .catch((error) => {
        setConfirmLoading(false);
        console.error(error);
      });
  };

  const generateSlip = () => {
    setGenerateSlipLoader(true);

    let rows = posState?.productCart
      ?.map(
        (item) =>
          `<tr>
        <td style="text-align: left; font-weight: 500; border: 0; color: #000">${item.Quantity}</td>
        <td style="text-align: left; font-weight: 500; border: 0; color: #000">${item.ProductDetailName}</td>
        <td style="font-weight: 500; border: 0; color: #000;text-align:right">${item.PriceWithGST}</td>
      </tr>`
      )
      .join("");

    let saleRecieptTemplate = posState?.templateList?.Table?.find(
      (item) => item.TemplateTypeId == SALE_RECIEPT
    )?.TemplateHtml;

    const tempOrderDetailList = posState?.productCart.map((product) => {
      return {
        TempOrderDetailId: null,
        TempOrderMasterId: null, //posState.OrderMasterId,
        ProductDetailId: product.ProductDetailId,
        Quantity: product.Quantity,
        TempOrderParentId: null,
        DealItemId: null, //product.IsDeal ? product?.DealItemId : null,
        SpecialInstruction: product.SpecialInstruction,
        UserId: userData.UserId,
        UserIP: "1.2.2.1",
      };
    });

    const data = {
      OperationId: posState.OrderMasterId === null ? 2 : 3,
      TempOrderMasterId: null,
      CompanyId: userData.CompanyId,
      OrderNumber: "",
      BranchId: userData.branchId,
      OrderDate: "",
      OrderTime: "",
      UserIP: "1.2.2.1",
      UserId: userData.UserId,
      isUse: 0,
      BusinessDayId: userData.dayShiftTerminal.BusinessDayId,
      ShiftDetailId:
        userData.RoleId === BRANCH_ADMIN || userData.RoleId === CASHIER
          ? dstValue.ShiftDetailId
          : 0,
      TerminalDetailId: dstValue.TerminalDetailId,
      TempOrderDetail: tempOrderDetailList,
    };

    saleRecieptTemplate = saleRecieptTemplate.replace(
      "{companyName}",
      userData.CompanyName
    );

    saleRecieptTemplate = saleRecieptTemplate.replace(
      "{username}",
      `<tr><td style="text-align: left; font-weight: 500; border: 0; color: #000">Username: </td>
      <td style="text-align: right; font-weight: 500; border: 0; color: #000">${userData.UserName}</td></tr>`
    );

    saleRecieptTemplate = saleRecieptTemplate.replace("{itemBody}", rows);

    saleRecieptTemplate = saleRecieptTemplate.replace(
      "{branchAddress}",
      userData?.userBranchList[0].BranchAddress || ""
    );

    saleRecieptTemplate = saleRecieptTemplate.replace("{rider}", "");

    saleRecieptTemplate = saleRecieptTemplate.replace("{customerName}", "");

    saleRecieptTemplate = saleRecieptTemplate.replace("{address}", "");

    saleRecieptTemplate = saleRecieptTemplate.replace("{phone}", "");

    saleRecieptTemplate = saleRecieptTemplate.replace("{username}", "");

    saleRecieptTemplate = saleRecieptTemplate.replace("{orderMode}", "");

    saleRecieptTemplate = saleRecieptTemplate.replace("{fbrIntegration}", "");

    saleRecieptTemplate = saleRecieptTemplate.replace("{finalBill}", "");

    saleRecieptTemplate = saleRecieptTemplate.replace(
      "{gstPercents}",

      `(${posState.GSTPercentage.toFixed(2)}%)`
    );
    saleRecieptTemplate = saleRecieptTemplate.replace(
      "{gst}",

      parseFloat(
        (posState.prices.withoutGst * posState.GSTPercentage) / 100
      ).toFixed(2)
    );
    saleRecieptTemplate = saleRecieptTemplate.replace(
      "{paymentMode}",
      paymentModesTabData
        .map(
          (item) => `<tr>
          <td style="text-align: left; font-weight: 500; border: 0; color: #000">${item.PaymentName
            }</td>
          <td style="text-align: right; font-weight: 500; border: 0; color: #000">${item.ReceivedAmount.toFixed(
              2
            )}</td>
          </tr>`
        )
        .join(" ")
    );
    saleRecieptTemplate = saleRecieptTemplate.replace(
      "{returnAmount}",
      ` <tr> <td style="text-align: left; font-weight: 500; border: 0; color: #000">Return Amount:</td>
      <td style="text-align: right; font-weight: 500; border: 0; color: #000">${returnAmount}</td> </tr>`
    );

    {
      saleRecieptTemplate = saleRecieptTemplate.replace(
        "{beforeBill}",
        posState?.punchScreenData?.Table10?.filter(
          (x) => x.OrderModeId === posState?.customerDetail?.OrderMode
        )
          ?.map(
            (x) =>
              `<tr>
              <td style="text-align: left; font-weight: 500; border: 0; color: #000">${x.ExtraChargesName
              }</td>
              <td style="text-align: right; font-weight: 500; border: 0; color: #000">${parseFloat(
                x.IsPercent
                  ? (
                    (x.ChargesValue / 100) *
                    posState.prices.withoutGst
                  ).toFixed(2)
                  : x.ChargesValue
              ).toFixed(2)}</td>
            </tr>`
          )
          .join("")
      );
    }

    saleRecieptTemplate = saleRecieptTemplate.replace(
      "{productSubtotal}",
      posState.prices.withoutGst
    );
    saleRecieptTemplate = saleRecieptTemplate.replace(
      "{totalAmount}",
      posState.prices.withGst
    );
    saleRecieptTemplate = saleRecieptTemplate.replace(
      "{discountAmount}",
      posState.prices.discountAmt
    );
    saleRecieptTemplate = saleRecieptTemplate.replace(
      "{productNetBill}",
      (
        parseFloat(posState?.prices.withGst) +
        parseFloat(posState.deliveryCharges ? posState.deliveryCharges : 0) +
        parseFloat(extraCharges) -
        parseFloat(posState?.prices.discountAmt)
      ).toFixed(2)
    );

    postRequest("CrudTempOrder", data, controller)
      .then((res) => {

        const orderData = res.data.DataSet.Table1[0];

        saleRecieptTemplate = saleRecieptTemplate.replace(
          "{orderNumber}",
          orderData.OrderNumber
        );

        saleRecieptTemplate = saleRecieptTemplate.replace(
          "{orderDateTime}",
          `${new Date(
            orderData.OrderDate
          ).toDateString()} ${orderData.OrderTime.slice(0, 5)}`
        );

        let canvas = document.createElement("canvas");
        JsBarcode(canvas, orderData.OrderNumber, { width: 1, height: 60 });
        const barcodeString = canvas.toDataURL();

        saleRecieptTemplate = saleRecieptTemplate.replace(
          "{srbIntegration}",
          `<div style="width:50%;text-align:center;"><img style="text-align:center" src="${barcodeString}"></img></div>`
        );

        dispatch({
          type: SET_POS_STATE,
          payload: {
            name: "KOTPrint",
            value: saleRecieptTemplate,
          },
        });

        userData?.IsPos && handlePrint();
      })
      .finally(() => {
        setGenerateSlipLoader(false);
        dispatch({
          type: SET_POS_STATE,
          payload: {
            name: "productCart",
            value: [],
          },
        });
      });
  };

  const style = {
    padding: "20px 20px 0px 20px",
    background: "#FFFFFF",
    height: "90vh",
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
            {posState.customerDetail.CustomerName} -
            {posState.customerDetail.OrderModeName}
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
        <div className="cartDiv" style={{ height: "48vh", overflow: "auto" }}>
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
                  <b>T.Amount</b>
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody id="cartList" style={{ overflow: "auto" }}>
              {posState.productCart
                // .reverse()
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
                      <td onClick={() => editProductDetail(item, index)}>
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
                      >
                        {item.IsTopping !== true &&
                          item.HalfAndHalf !== true && (
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
                              onClick={() => minusQuantity(item, item.Quantity)}
                            >
                              -
                            </button>
                          )}
                        &nbsp;{item.Quantity}&nbsp;
                        {item.IsTopping !== true &&
                          item.HalfAndHalf !== true && (
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
                            >
                              +
                            </button>
                          )}
                      </td>
                      <td
                        onClick={() => editProductDetail(item, index)}
                        style={{ textAlign: "center" }}
                      >
                        {item?.totalAmount}
                      </td>

                      <td
                        style={{
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
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
                          onClick={() => deleteProductDetail(index, item)}
                        />
                        <p className="item-tag">
                          {item.IsTopping === true
                            ? "Topp"
                            : item.HalfAndHalf === true
                              ? "H&H"
                              : null}
                        </p>

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
      {/* cart bottom section */}
      <Input
        size="middle"
        placeholder="Special Instruction"
        value={posState.Remarks}
        onChange={(e) =>
          dispatch({
            type: SET_POS_STATE,
            payload: { name: "Remarks", value: e.target.value },
          })
        }
      />
      <div
        style={{
          borderTop: "1px solid #ADADAD",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          bottom: 15,
        }}
      >

        {
          posState?.reservationDetail.Comments &&
          <div style={s}>
            <span>Comments</span>
            <span>{posState?.reservationDetail.Comments}</span>
          </div>
        }
        {
          posState?.reservationDetail.CommentsManagement &&
          <div style={s}>
            <span>Comments By Management</span>
            <span>{posState?.reservationDetail.CommentsManagement}</span>
          </div>
        }



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
        {posState.extraCharges.map((x) => (
          <div style={s}>
            <span>{x.ExtraChargesName}</span>
            <span>{parseFloat(x.ExtraChargesAmount).toFixed(2)}</span>
          </div>
        ))}
        {posState.customerDetail.OrderMode === DELIVERY && (
          <Fragment>
            <div style={s}>
              <span>Delivery Charges</span>
              <span>{posState.deliveryCharges}</span>
            </div>
            <div style={s}>
              <span>Delivery Time</span>
              <span>{posState.deliveryTime} min</span>
            </div>
          </Fragment>
        )}

        {posState.reservationDetail.TotalAdvance && (
          <div style={s}>
            <span>Advance</span>
            <span>
              {posState?.reservationDetail?.TotalAdvance?.toFixed(2)}
            </span>
          </div>
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

        <div style={{ display: "flex" }}>
          <div style={{ display: "flex", width: "100%" }}>
            {saveButton ? (
              <Button
                icon={<PlusOutlined />}
                style={{
                  background: "#00954A",
                  boxShadow: "2px 2px 8px rgba(0, 0, 0, 0.1)",
                  width: "100%",
                  height: 57,
                  color: "#FFFFFF",
                  borderRadius: "5px",
                  marginTop: 10,
                }}
                onClick={() => confirmOrder()}
                loading={confirmLoading}
                disabled={
                  posState.OrderMasterId !== null &&
                  posState.OrderDetailAdd.length === 0 &&
                  posState.OrderDetailLess.length === 0
                }
              >
                Save Order
              </Button>
            ) : (
              <Button
                icon={<PaperClipOutlined />}
                style={{
                  background: "#00954A",
                  boxShadow: "2px 2px 8px rgba(0, 0, 0, 0.1)",
                  width: "100%",
                  height: 57,
                  color: "#FFFFFF",
                  borderRadius: "5px",
                  marginTop: 10,
                }}
                onClick={() => generateSlip()}
                loading={generateSlipLoader}
                disabled={
                  posState.OrderMasterId !== null &&
                  posState.OrderDetailAdd.length === 0 &&
                  posState.OrderDetailLess.length === 0
                }
              >
                Generate Slip
              </Button>
            )}
          </div>
          <div style={{ display: "flex", width: "100%" }}>
            <Popconfirm
              placement="rightBottom"
              icon={null}
              title={
                <div
                  style={{ width: "25vw", overflowY: "auto" }}
                  className="abc"
                >
                  <Row style={{ padding: "0 10px", width: "100%" }}>
                    <Row gutter={[6, 6]}>
                      <Title level={4} style={{ color: "#336fc4" }}>
                        Amount Received
                      </Title>
                    </Row>
                    <Row style={{ width: "100%" }}>
                      <Input
                        style={{
                          textAlign: "right",
                          fontSize: 28,
                          fontWeight: "bold",
                        }}
                        size="large"
                        type="number"
                        height={10}
                        value={paymentModeCash}
                        onChange={(event) => {
                          setPaymentModeCash(event.target.value);
                        }}
                      />
                    </Row>
                    <Row
                      gutter={[8, 8]}
                      style={{ marginTop: "15px", width: "100%" }}
                    >
                      {posState?.paymentModeList.map((paymentMode, index) => (
                        <Col span={8} key={index}>
                          <Button
                            type="primary"
                            // className="newButton"
                            // size="small"
                            style={{
                              width: "100%",
                            }}
                            onClick={() =>
                              addPaymentMode(paymentMode, paymentModeCash)
                            }
                          >
                            {paymentMode.PaymentMode}
                          </Button>
                        </Col>
                      ))}
                    </Row>

                    <Row style={{ width: "100%" }}>
                      <Col span={24}>
                        <Table
                          rowSelection={false}
                          columns={paymentTableCols}
                          dataSource={paymentModesTabData}
                          style={{ marginTop: 16 }}
                          selectable={false}
                          size="small"
                          pagination={{ pageSize: 2 }}
                        />
                      </Col>
                    </Row>
                  </Row>
                  <Row>
                    <Title level={4} style={{ color: "#336fc4" }}>
                      Bill Amount:
                    </Title>

                    <span style={{ marginLeft: 10, marginTop: 5 }}>
                      {posState?.prices?.withGst}
                    </span>
                  </Row>
                  <Row>
                    <Col span={24}>
                      <table style={{ width: "100%", tableLayout: "auto" }}>
                        <tbody className="ant-table-tbody">
                          <tr>
                            <td style={{ padding: 0 }}>Subtotal</td>{" "}
                            <td style={{ padding: 0 }}>
                              {posState?.prices?.withoutGst}
                            </td>
                          </tr>
                          <tr>
                            <td style={{ padding: 0 }}>Tax</td>
                            <td style={{ padding: 0 }}>
                              {posState?.prices?.gst}
                            </td>
                          </tr>
                          <tr>
                            <td style={{ padding: 0 }}>Discount</td>{" "}
                            <td style={{ padding: 0 }}>
                              {posState?.prices?.discountAmt}
                            </td>
                          </tr>
                          <tr>
                            <td style={{ padding: 0 }}>Additional Charges</td>
                            <td style={{ padding: 0 }}>
                              {extraCharges.toFixed(2)}
                            </td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                padding: 0,
                                color: "#336fc4",
                                fontWeight: "bold",
                              }}
                            >
                              Total Payable
                            </td>
                            <td style={{ padding: 0, fontWeight: "bold" }}>
                              {getTotalPayable()}
                            </td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                padding: 0,
                                color: "#336fc4",
                                fontWeight: "bold",
                              }}
                            >
                              Returned Amount
                            </td>
                            <td style={{ padding: 0, fontWeight: "bold" }}>
                              {returnAmount}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </Col>
                  </Row>
                </div>
              }
              okText="Checkout"
              onConfirm={() => confirmOrder(1)}
              // cancelText="No"
              onCancel={() => {
                setPaymentModeTabData([]);
              }}
            >
              <Button
                icon={<ShoppingCartOutlined />}
                style={{
                  margin: "10px 5px",
                  height: 57,
                  width: "100%",
                  borderRadius: "5px",
                  boxShadow: "2px 2px 8px rgba(0, 0, 0, 0.1)",
                }}
                type="primary"
                onClick={checkoutFromCart}
                loading={confirmLoading}
                disabled={
                  // posStore.recallOrder === true
                  // ? true
                  posState.OrderMasterId !== null &&
                  posState.OrderDetailAdd.length === 0 &&
                  posState.OrderDetailLess.length === 0
                }
              >
                {"Checkout"}
              </Button>
            </Popconfirm>
          </div>
        </div>
      </div>
      <div style={{ display: "none" }}>
        {posState.KOTPrint !== "" && (
          <ComponentToPrint ref={componentRef} Bill={posState.KOTPrint} />
        )}
      </div>
    </div>
  );
}
