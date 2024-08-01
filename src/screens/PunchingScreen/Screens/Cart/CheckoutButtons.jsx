import {
  DeleteFilled,
  PlusOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { Button, Col, Input, message, Popconfirm, Row, Table } from "antd";
import Title from "antd/lib/typography/Title";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  DELIVERY,
  DINE_IN,
  TAKE_AWAY,
  BRANCH_ADMIN,
  CASHIER,
  SALE_RECIEPT,
  FINISHED_WASTE,
  AGENT,
  KOT_TEMPLATE,
} from "../../common/SetupMstrEnum";
import { isNullValue } from "../../functionsSP/generalFunctionsSP";
import { orderObjectSetter } from "../../functionsSP/orderObjectSetter";
import {
  SP_RESET_DEFAULT_POS_STATE,
  SP_SET_POS_STATE,
} from "../../redux/reduxConstantsSinglePagePOS";
import { list } from "../../data";
import FormButtonSP from "../../Components/general/FormButtonSP";
import { getDateTime, getTime } from "../../functionsSP/dateFunctions";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import ComponentToPrint from "../../Components/specificComponentsSP/ComponentToPrint";

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

export const CheckoutButtons = () => {
  const dispatch = useDispatch();
  const componentRef = useRef(null);
  const posState = useSelector((state) => state.SinglePagePOSReducers);
  const userData = useSelector((state) => state.AuthReducerSP);
  const [paymentModesTabData, setPaymentModeTabData] = useState([]);
  const [confrimLoading, setConfrimLoading] = useState(false);
  const [paymentModeCash, setPaymentModeCash] = useState(null);
  const [returnAmount, setReturnAmount] = useState(0);
  const { PaymentModeList, TemplatesList } = list;

  const extraCharges = posState.extraCharges.reduce((prev, next) => {
    return (prev += next.ExtraChargesAmount);
  }, 0);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  useEffect(() => {
    let tAmount = paymentModesTabData.reduce((prev, next) => {
      return (prev += parseFloat(next.TotalAmount));
    }, 0);
    setPaymentModeCash(
      parseFloat(getTotalPayable() - parseFloat(tAmount)).toFixed(2)
    );
    dispatch({
      type: SP_SET_POS_STATE,
      payload: {
        name: "templateList",
        value: TemplatesList,
      },
    });
  }, [paymentModesTabData.length]);

  const addPaymentMode = (paymentMode, paymentAmount) => {
    let returningAmount = 0;
    if (paymentModeCash <= 0) {
      message.error("Amount must be greater than Zero (0)");
      return;
    }
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
      parseFloat(posState?.prices?.withGst) -
        parseFloat(posState?.prices?.discountAmt) +
        parseFloat(posState?.deliveryCharges) +
        parseFloat(extraCharges)
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
          IsPartyAccount: paymentMode.IsPartyAccount,
        },
      ]);
    } else message.error("Payemnt Mode Already Added");
    setReturnAmount(returningAmount);
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

  const peymentTableCols = [
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
          <FormButtonSP
            type="text"
            icon={<DeleteFilled className="redIcon" />}
            onClick={() => {
              deletePaymentMode(index);
            }}
          >
            X
          </FormButtonSP>
        );
      },
    },
  ];

  const getTotalPayable = () => {
    const totalPayable =
      posState.OrderModeId === DELIVERY
        ? parseFloat(
            parseFloat(posState.prices.withoutGst) +
              parseFloat(posState.prices.gst) -
              parseFloat(posState.prices.discountAmt) +
              posState.deliveryCharges +
              parseFloat(
                posState.extraCharges.reduce((prev, next) => {
                  return (prev += next.ExtraChargesAmount);
                }, 0)
              )
          ).toFixed(2)
        : parseFloat(
            parseFloat(posState.prices.withoutGst) +
              parseFloat(posState.prices.gst) -
              parseFloat(posState.prices.discountAmt) +
              parseFloat(
                posState.extraCharges.reduce((prev, next) => {
                  return (prev += next.ExtraChargesAmount);
                }, 0)
              )
          ).toFixed(2);
    return totalPayable;
  };

  const confirmOrder = (buttonType) => {
    if (posState.productCart.length === 0) {
      message.warn("Add Product in Cart First");
      return;
    }

    // For Finished Waste Order Mode Remarks
    if (
      buttonType === 2 &&
      posState.OrderModeId === FINISHED_WASTE &&
      !posState.Remarks
    ) {
      message.error("Please Enter Finished Waste Remarks then Try Again");
      return;
    }
    // \ For Finished Waste Remarks

    /**  For Delivery Order Mode Rider Selection */
    if (
      buttonType === 1 &&
      posState.OrderModeId === DELIVERY &&
      !posState.riderId
    ) {
      message.error("Please select a rider first!");
      return;
    }
    /**  For Delivery Order Mode Rider Selection */

    //Customer check on delivery
    if (
      posState.OrderModeId === DELIVERY &&
      posState.customerDetail.CustomerId === null
    ) {
      message.error("Please Select a customer.");
      return;
    }

    /** Order Source Check */
    if (posState.orderSourceId === null) {
      message.warn("Please Select Order Source First");
      return;
    }

    if (buttonType === 1 && paymentModesTabData.length === 0) {
      message.warn("Please add payment first");
      return;
    }

    if (
      buttonType === 1 &&
      paymentModesTabData?.length >= 1 &&
      paymentModesTabData.some((x) => x.IsPartyAccount) &&
      !(posState?.customerDetail?.CustomerId > 0)
    ) {
      message.error("Please select a customer first");
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
      // posState?.prices?.withGst -
      //   parseFloat(posState.prices.discountAmt) +
      //   posState.deliveryCharges
      paymentModesTabData.length > 0
    ) {
      message.warn("Amount is not Balanced");
      return;
    }
    if (confrimLoading === false) {
      setConfrimLoading(true);
      let branchId =
        posState.OrderModeId === TAKE_AWAY
          ? posState.customerDetail.BranchId
          : posState.OrderModeId === DELIVERY
          ? posState.customerDetail.BranchId
          : posState.OrderModeId === DINE_IN
          ? // ? userState.branchId
            posState.customerDetail.BranchId
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
        OrderModeId: posState.OrderModeId,
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
        // ShiftDetailId:
        //   userData?.RoleId === BRANCH_ADMIN || userData?.RoleId === CASHIER
        //     ? dstValue.ShiftDetailId
        //     : 0,
        // CounterDetailId:
        //   userData?.RoleId === BRANCH_ADMIN || userData?.RoleId === CASHIER
        //     ? dstValue.TerminalDetailId
        //     : 0,
        Cover: posState.coverId,
        PaymentTypeId: posState.PaymentTypeId,
        DiscountAmount: posState.prices.discountAmt,
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
        tblOrderPaymentDetail:
          paymentModesTabData.length === 0 ? [] : paymentModesTabData,
      };

      data =
        posState.OrderModeId === DELIVERY
          ? {
              ...data,
              DeliveryCharges: posState.deliveryCharges,
              DeliveryTime: posState.deliveryTime,
            }
          : { ...data };

      // postRequest(
      //   "crudOrder",
      //   {
      //     ...data,
      //     TerminalUniqueId: localStorage.getItem(TERMINAL_UNIQUE_ID),
      //     OperationId: posState.OrderMasterId === null ? 2 : 3,
      //     CompanyId: userData.CompanyId,
      //     UserId: userData.UserId,
      //     UserIP: "1.2.2.1",
      //   },
      //   controller
      // )
      // .then((response) => {
      setConfrimLoading(false);

      message.success("Order Placed Successfully");
      // check if this condition is working or not

      //For Agent button type is 2
      if (buttonType === 2) {
        resetState();
      }

      // For KOT Print
      if (buttonType === 0 && userData.RoleId !== AGENT) {
        let ordersToEmbad = [];
        if (posState.OrderMasterId !== null) {
          [
            ...posState.productCart.filter((x) => x.OrderMasterId === null),
            ...posState.OrderDetailLess,
            ...posState.OrderDetailAdd.filter(
              (x) =>
                x.OrderMasterId !== null &&
                !posState.productCart.some(
                  (y) =>
                    y.ProductDetailId === x.ProductDetailId &&
                    y.OrderMasterId === null
                )
            ),
          ].map((item, index) => {
            ordersToEmbad.push(`<tr  style="line-height:50px">
        <td
          style="
            padding: 2px 10px;
            text-align: left;
            vertical-align: middle;
            color : #000;
            border: 0;
          "
        >
          ${item.Quantity}
        </td>
        <td
          style="
            padding: 2px 10px;
            text-align: left;
            vertical-align: middle;
            color : #000;
            border: 0;
          "
        >
        ${item.ProductDetailName}
        </td>
        <td style="font-weight: bold">
        ${item.type === undefined ? "ADD" : item.type}
        </td>
      </tr>
      ${
        item?.SpecialInstruction === "" ||
        item?.SpecialInstruction === null ||
        item?.SpecialInstruction === undefined
          ? "<tr></tr>"
          : `<tr>
              <td colspan='3' style="color : #000">
                ${item.SpecialInstruction}
              </td>
            </tr>`
      }`);
          });
        } else
          posState.productCart.map((item, index) => {
            ordersToEmbad.push(`<tr>

        <td
          style="
            padding: 2px 10px;
            text-align: left;
            color : #000;
            border: 0;
          "
        >
      ${item.Quantity}
        </td>
        <td
          style="
            padding: 2px 10px;
            color : #000;
            border: 0;
          "
        >
        ${
          item.IsDeal
            ? ""
            : item.DealDescId > 0
            ? " &nbsp;  &nbsp; &nbsp; -"
            : ""
        }
        ${item.IsTopping ? " &nbsp;  &nbsp; &nbsp; -" : ""}

          ${item.ProductDetailName}
        </td>
        <td style="font-weight: 700; color : #000; text-align: right">
        ${item.type === undefined ? "ADD" : item.type}
        </td>
      </tr>

      ${
        item?.SpecialInstruction === "" ||
        item?.SpecialInstruction === null ||
        item?.SpecialInstruction === undefined
          ? "<tr></tr>"
          : `<tr>
              <td colspan='3' style="color : #000">
                ${item.SpecialInstruction}
              </td>
            </tr>`
      }
      `);
          });

        ordersToEmbad = ordersToEmbad.join("");
        let cloneHTMLTemp = posState?.templateList?.find(
          (item) => item.TemplateTypeId == KOT_TEMPLATE
        )?.TemplateHtml;

        cloneHTMLTemp = cloneHTMLTemp.replace("{itemBody}", ordersToEmbad);

        if (posState.OrderModeId === DINE_IN) {
          cloneHTMLTemp = cloneHTMLTemp.replace(
            "{embadFields}",
            `
          <tr>
            <td style="text-align: left; font-weight: 500; border: 0; color: #000">Table:</td>
            <td style="text-align: right; font-weight: 500; border: 0; color: #000">${posState.tableName}</td>
          </tr>
          <tr>
            <td style="text-align: left; font-weight: 500; border: 0; color: #000">Waiter:</td>
            <td style="text-align: right; font-weight: 500; border: 0; color: #000">${posState.waiterName}</td>
          </tr>

          `
          );
          cloneHTMLTemp = cloneHTMLTemp.replace(
            "{orderNumber}",
            // response.data.DataSet.Table2[0].OrderNumber
            //   ? response.data.DataSet.Table2[0].OrderNumber
            //   );
            posState.selectedOrder.OrderNumber
          );
        } else {
          cloneHTMLTemp = cloneHTMLTemp.replace("{embadFields}", "");
        }
        cloneHTMLTemp = cloneHTMLTemp.replace(
          "{orderNumber}",
          // response.data.DataSet.Table2[0].OrderNumber
          //   ? response.data.DataSet.Table2[0].OrderNumber
          //   : posState.selectedOrder.OrderNumber
          posState.selectedOrder.OrderNumber
        );

        cloneHTMLTemp = cloneHTMLTemp.replace(
          "{orderMode}",
          //response.data.DataSet.Table[0].orderSourceName
          posState.OrderModeName
        );
        cloneHTMLTemp = cloneHTMLTemp.replace(
          "{orderDateTime}",
          // response.data.DataSet.Table2[0].OrderDate?.split(".")[0]
          //   ? response.data.DataSet.Table2[0].OrderDate?.split("T")[0] +
          //       " " +
          //       response.data.DataSet.Table2[0].OrderTime.split(".")[0]
          //   : posState.selectedOrder.OrderDate
          ""
        );

        // cloneHTMLTemp = cloneHTMLTemp.replace(
        //   /{orderTable}/g,
        //   posState.OrderTable
        // );
        // cloneHTMLTemp = cloneHTMLTemp.replace(
        //   /{orderWaiter}/g,
        //   posState.WaiterName
        // );
        // cloneHTMLTemp = cloneHTMLTemp.replace(
        //   /{orderCover}/g,
        //   posState.OrderCover
        // );
        cloneHTMLTemp = parseString(cloneHTMLTemp, posState);

        const setKotTemp = new Promise((resolutionFunc, rejectionFunc) => {
          dispatch({
            type: SP_SET_POS_STATE,
            payload: {
              name: "KOTPrint",
              value: cloneHTMLTemp,
            },
          });

          resolutionFunc("Resolved");
        });

        setKotTemp.then((res) => {
          // userData.IsPos && handlePrint();
          handlePrint();
          resetState();
        });
      }

      // For Sale Recipt
      if (buttonType === 1) {
        executeButtonOne();
      }

      if (buttonType === 0 && userData?.RoleId === AGENT) {
        resetState();
      }
    }
  };

  const executeButtonOne = () => {
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

    let saleRecieptTemplate = posState?.templateList?.find(
      (item) => item.TemplateTypeId == SALE_RECIEPT
    )?.TemplateHtml;
    saleRecieptTemplate = saleRecieptTemplate.replace("{itemBody}", rows);
    saleRecieptTemplate = saleRecieptTemplate.replace(
      "{companyName}",
      userData?.CompanyName
    );

    saleRecieptTemplate = saleRecieptTemplate.replace(
      "{username}",
      `<tr><td style="text-align: left; font-weight: 500; border: 0; color: #000">Username: </td>
  <td style="text-align: right; font-weight: 500; border: 0; color: #000">${userData?.UserName}</td></tr>`
    );

    saleRecieptTemplate = saleRecieptTemplate.replace("{itemBody}", rows);

    //some fields
    saleRecieptTemplate = saleRecieptTemplate.replace(
      "{branchAddress}",
      // userData?.userBranchList[0].BranchAddress || ""
      userData?.userBranchList[2].AreaName || ""
    );

    saleRecieptTemplate = saleRecieptTemplate.replace(
      "{gstPercents}",

      `(${posState.GSTPercentage?.toFixed(2)}%)`
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
      <td style="text-align: left; font-weight: 500; border: 0; color: #000">${
        item.PaymentName
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

    if (posState.OrderModeId === DELIVERY) {
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
        isNullValue(posState.customerSupportingTable.Table2[0].CompleteAddress)
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
  <td style="margin: 3px 0; text-align: right; color: #000">${posState.deliveryCharges}</td>
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
    } else if (posState.OrderModeId === DINE_IN) {
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
      saleRecieptTemplate = saleRecieptTemplate.replace("{rider}", "<tr></tr>");
      saleRecieptTemplate = saleRecieptTemplate.replace(
        "{waiter}",
        "<tr></tr>"
      );
      saleRecieptTemplate = saleRecieptTemplate.replace("{table}", "<tr></tr>");
      saleRecieptTemplate = saleRecieptTemplate.replace(
        "{address}",
        "<tr></tr>"
      );
      saleRecieptTemplate = saleRecieptTemplate.replace("{phone}", "<tr></tr>");

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
          <td style="text-align: left; font-weight: 500; border: 0; color: #000">${
            x.ExtraChargesName
          }</td>
          <td style="text-align: right; font-weight: 500; border: 0; color: #000">${parseFloat(
            x.IsPercent
              ? ((x.ChargesValue / 100) * posState.prices.withoutGst).toFixed(2)
              : x.ChargesValue
          ).toFixed(2)}</td>
        </tr>`
          )
          .join("")
        // : "<tr></tr>"
      );
    }

    //end of extra charges

    saleRecieptTemplate = saleRecieptTemplate.replace(
      "{specialInstruction}",
      posState.selectedOrder.SpecialInstruction == null ||
        posState.selectedOrder.SpecialInstruction == ""
        ? ""
        : `<tr><td style="text-align: right; font-weight: 500; border: 0; color: #000">${posState.selectedOrder.SpecialInstruction}</td></tr>`
    );

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

    saleRecieptTemplate = saleRecieptTemplate.replace(
      "{orderNumber}",
      // response.data.DataSet.Table2[0].OrderNumber
      //     ? response.data.DataSet.Table2[0].OrderNumber
      posState.selectedOrder.OrderNumber
    );

    saleRecieptTemplate = saleRecieptTemplate.replace(
      "{orderMode}",
      //response.data.DataSet.Table[0].orderSourceName
      posState.OrderModeName
      // response.data.DataSet.Table2[0].OrderMode
      // ? response.data.DataSet.Table2[0].OrderMode
      // : posState.selectedOrder.OrderMode
    );
    saleRecieptTemplate = saleRecieptTemplate.replace(
      "{orderDateTime}"
      // response.data.DataSet.Table[0].OrderDate?.split(".")[0]
      // ? response.data.DataSet.Table[0].OrderDate?.split(".")[0] +
      //     " " +
      //     response.data.DataSet.Table2[0].OrderTime.split(".")[0]
      // : response.data.DataSet.Table2[0].OrderDate
    );
    // response.data.DataSet.Table[0].OrderDate?.split(".")[0]

    // ? response.data.DataSet.Table[0].OrderDate?.split(".")[0]
    // : posState.selectedOrder.OrderDate
    dispatch({
      type: SP_SET_POS_STATE,
      payload: {
        name: "KOTPrint",
        value: saleRecieptTemplate,
      },
    });
    setTimeout(() => handlePrint(), 500);

    // userData?.IsPos && handlePrint();

    resetState();
  };

  // Reset The State of Point Of Sale Reducer
  const resetState = () => {
    dispatch({
      type: SP_RESET_DEFAULT_POS_STATE,
      payload: {
        RoleId: userData.RoleId,
        BusinessTypeId: userData?.companyList[0]?.BusinessTypeId,
      },
    });
  };

  const checkoutFromCart = () => {
    setPaymentModeTabData([]);
    setPaymentModeCash(getTotalPayable());
    // if (paymentModesTabData.length > 0) {
    //   setPaymentModeCash(parseFloat(paymentModeCash).toFixed(2));
    // } else {
    //   setPaymentModeCash(getTotalPayable());
    // }
  };

  // The Function That Makes A Template Form KOT To PRINT
  const parseString = (value, record) => {
    let cloneTempString = value.replace(
      /{companyName}/g,
      userData?.CompanyName
    );
    cloneTempString = cloneTempString.replace(
      /{address}/g,
      record.CompanyAddress
    );
    cloneTempString = cloneTempString.replace(
      /{orderNumber}/g,
      record.OrderNumber
    );

    // cloneTempString = cloneTempString.replace(
    //   /{orderMode}/g,
    //   record.customerDetail.OrderModeName
    // );
    cloneTempString = cloneTempString.replace(
      /{orderTable}/g,
      record.OrderTable
    );
    cloneTempString = cloneTempString.replace(
      /{orderWaiter}/g,
      record.WaiterName
    );
    cloneTempString = cloneTempString.replace(
      /{orderCover}/g,
      record.OrderCover
    );
    cloneTempString = cloneTempString.replace(
      /{phoneNumber}/g,
      record.CompanyPhoneNumber
    );

    const date =
      new Date().getFullYear() +
      "-" +
      (new Date().getMonth() + 1) +
      "-" +
      new Date().getDate();

    const time = new Date().toLocaleTimeString();

    cloneTempString = cloneTempString.replace(/{billDate}/g, date);
    cloneTempString = cloneTempString.replace(/{billTime}/g, time);

    cloneTempString = cloneTempString.replace(
      /{companyWebsite}/g,
      record.CompanyWebsite
    );
    cloneTempString = cloneTempString.replace(
      /{companyFBPage}/g,
      record.CompanyFBPage
    );
    cloneTempString = cloneTempString.replace(
      /{companyWhatsApp}/g,
      record.CompanyWhatsApp
    );
    cloneTempString = cloneTempString.replace(
      /{gstPercent}/g,
      record.GSTPercent
    );
    cloneTempString = cloneTempString.replace(
      /{productSubtotal}/g,
      record.TotalAmountWithoutGST
    );
    cloneTempString = cloneTempString.replace(
      /{productGst}/g,
      record.GSTAmount
    );

    cloneTempString = cloneTempString.replace(
      /{productNetBill}/g,
      record.TotalAmountWithGST
    );

    cloneTempString = cloneTempString.replace(
      /{companyLogo}/g,
      record.CompanyLogo
    );

    return cloneTempString;
  };

  return (
    <div>
      <div style={{ display: "flex" }}>
        <div style={{ display: "flex", width: "100%" }}>
          {/* <ReactToPrint content={() => componentRef.current}>
              <PrintContextConsumer> */}
          {/* {({ handlePrint }) => ( */}
          <Button
            icon={<PlusOutlined />}
            style={{
              background: "#00954A",
              boxShadow: "2px 2px 8px rgba(0, 0, 0, 0.1)",
              height: 57,
              color: "#FFFFFF",
              borderRadius: "5px",
              marginTop: 10,
              width: "100%",
            }}
            onClick={() => confirmOrder(0)}
            loading={confrimLoading}
            disabled={
              // posState.recallOrder === true
              // ? true
              posState.OrderModeId === FINISHED_WASTE ||
              (posState.OrderMasterId !== null &&
                posState.OrderDetailAdd.length === 0 &&
                posState.OrderDetailLess.length === 0)
            }
          >
            {
              // !userData.IsPos || userData.RoleId === AGENT
              //   ? "Confirm Order"
              //   :
              "KOT"
            }
          </Button>
          {/* )} */}
          {/* </PrintContextConsumer>
            </ReactToPrint> */}
        </div>
        <div style={{ display: "flex", width: "100%" }}>
          {posState.OrderModeId === FINISHED_WASTE ||
          userData?.RoleId === AGENT ? (
            userData?.RoleId === AGENT ? null : (
              <Popconfirm
                placement="top"
                icon={null}
                title="Do you want to confirm this order?"
                okText="Yes"
                onConfirm={() => confirmOrder(2)}
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
                  loading={confrimLoading}
                  disabled={
                    // posState.recallOrder === true
                    // ? true
                    posState.OrderMasterId !== null &&
                    posState.OrderDetailAdd.length === 0 &&
                    posState.OrderDetailLess.length === 0
                  }
                >
                  {"Checkout"}
                </Button>
              </Popconfirm>
            )
          ) : (
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
                          if (event.target.value >= 0)
                            setPaymentModeCash(event.target.value);
                        }}
                      />
                    </Row>
                    <Row
                      gutter={[8, 8]}
                      style={{ marginTop: "15px", width: "100%" }}
                    >
                      {PaymentModeList?.map((paymentMode, index) => (
                        <Col span={8} key={index}>
                          <Button
                            type="primary"
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
                          columns={peymentTableCols}
                          dataSource={paymentModesTabData}
                          style={{ marginTop: 16 }}
                          selectable={false}
                          size="small"
                          pagination={{ pageSize: 2 }}
                        />
                      </Col>
                    </Row>
                  </Row>
                  {/* <Row>
                      <p style={{ color: "#336fc4" }}>
                        Bill Amount: {posState?.prices?.withGst}
                      </p>
                    </Row> */}
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
                            <td style={{ padding: 0 }}>Delivery Charges</td>
                            <td style={{ padding: 0 }}>
                              {posState.deliveryCharges || 0}
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
                loading={confrimLoading}
                disabled={
                  // posState.recallOrder === true
                  // ? true
                  posState.OrderMasterId !== null &&
                  posState.OrderDetailAdd.length === 0 &&
                  posState.OrderDetailLess.length === 0
                }
              >
                {"Checkout"}
              </Button>
            </Popconfirm>
          )}
          {/* <div style={{ display: "none" }}>
            <SaleRecieptToPrint ref={componentRef} displayNone={true} />
          </div> */}
        </div>
      </div>

      <div style={{ display: "none" }}>
        {posState.KOTPrint !== "" && (
          <ComponentToPrint ref={componentRef} Bill={posState.KOTPrint} />
        )}
      </div>
    </div>
  );
};
// const SaleRecieptToPrint = React.forwardRef((props, ref) => {
//   return <div ref={ref}>My cool content here!</div>;
// });
