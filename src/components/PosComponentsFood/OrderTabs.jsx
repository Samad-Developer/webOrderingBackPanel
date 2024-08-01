import {
  Col,
  Drawer,
  Tabs,
  Row,
  Table,
  Collapse,
  Button,
  message,
  Input,
  Typography,
} from "antd";
import React, { useState, useEffect, useRef } from "react";
import PosTable from "./PosTable";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { FaReceipt } from "react-icons/fa";
import FormTileButton from "../general/FormTileButton";
import { useDispatch, useSelector } from "react-redux";
import {
  resetState,
  setInitialState,
  submitForm,
} from "../../redux/actions/basicFormAction";
import { INPUT_SIZE, KOTTemp } from "../../common/ThemeConstants";
import FormSelect from "../general/FormSelect";
import {
  SET_HOLD_ORDER,
  SET_POS_STATE,
  SET_SUPPORTING_TABLE,
  SET_TABLE_DATA,
} from "../../redux/reduxConstants";
import {
  getFloatValue,
  isNullValue,
  playNotificationSound,
} from "../../functions/generalFunctions";

import FormTextField from "../../components/general/FormTextField";
import FormButton from "../../components/general/FormButton";
import { DeleteFilled, SearchOutlined } from "@ant-design/icons";
import moment from "moment";
import ComponentToPrint from "../../components/specificComponents/ComponentToPrint";
import ReactToPrint, {
  PrintContextConsumer,
  useReactToPrint,
} from "react-to-print";
import FBRImage from "../../assets/images/pos.png";
import SRBImage from "../../assets/images/srbPOS.png";

import CheckoutDrawer from "./CheckoutDrawer";

import {
  DINE_IN,
  TAKE_AWAY,
  DELIVERY,
  FINISHED_WASTE,
  COMPANY_ADMIN,
  DAY_SHIFT_TERMINAL,
  HOLD_ORDER_TAB,
  HOLD_ORDER,
  PRE_PAYMENT_BILL,
  KOT_TEMPLATE,
  SALE_RECIEPT,
  AGENT,
  DISPATCHER,
} from "../../common/SetupMasterEnum";
import { postRequest } from "../../services/mainApp.service";
import {
  generateAnotherSaleReciept,
  generateBillTemplate,
  generateKotTemplate,
  generateSaleReceipt,
} from "./printHelpers";
const { Title, Text } = Typography;

const { TabPane } = Tabs;

const initialFormValues = {
  BranchId: null,
  AreaId: null,
  OrderNumber: "%%",
  CustomerId: null,
  CustomerName: "%%",
  CustomerPhone: "%%",
  OrderModeId: null,
  OrderSourceId: null,
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
  OrderSourceId: null,
  DateFrom: "",
  DateTo: "",
  StatusId: null,
};

const OrderTabs = (props) => {
  const {
    updateSearchDate,
    holdOrders,
    setHoldOrders,
    parentKey,
    setParentKey,
    closeDrawerParent,
    setCloseDrawerParent,
    checkOutSelectedOrder,
    setCheckOutSelectedOrder,
    setParentCheckOutOrderModal,
    parentKotPrint,
    setParentKotPrint,
  } = props;
  const controller = new window.AbortController();

  const BillPrintHtmlTemplate = useRef;

  const dispatch = useDispatch();
  const { userBranchList, RoleId, IsPos } = useSelector(
    (state) => state.authReducer
  );
  const posState = useSelector((state) => state.PointOfSaleReducer);
  const [doneCheckOutLoading, setDoneCheckOutLoading] = useState(false);

  const userData = useSelector((state) => state.authReducer);
  const [orderItemsDetail, setOrderItemsDetail] = useState([]);
  const [orderStatus, setOrderStatus] = useState("");
  const [orderToShow, setOrdersToShow] = useState([]);
  const [orderModeId, setOrderModeId] = useState(
    IsPos === true ? DINE_IN : DELIVERY
  );
  const [orderStatusList, setOrderStatusList] = useState([]);
  const [dineInOrders, setDineInOrders] = useState([]);
  const [deliveryOrder, setDeliveryOrders] = useState([]);
  const [takeawayOrders, setTakeawayOrders] = useState([]);
  const [finishwasteOrders, setfinishwasteOrders] = useState([]);
  const [KOTTemplate, setKOTTemplate] = useState(KOTTemp);
  const [filterdOrders, setFilteredOrders] = useState([]);
  const [paymentAmount, setPaymentAmount] = useState(null);
  const [returnAmount, setReturnAmount] = useState(0);
  const [payments, setPayments] = useState([]);
  const [remainingAmount, setRemainingAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  let btnRef = useRef();

  const calcBtnTxt = [
    { id: 1, name: "1" },
    { id: 2, name: "2" },
    { id: 3, name: "3" },
    { id: 4, name: "4" },
    { id: 5, name: "5" },
    { id: 6, name: "6" },
    { id: 7, name: "7" },
    { id: 8, name: "8" },
    { id: 9, name: "9" },
    { id: 10, name: "Clear" },
    { id: 11, name: "0" },
    { id: 12, name: "OK" },
  ];

  const buttonStyle = {
    width: "85px",
    height: "45px",
    borderRadius: "3px",
    fontSize: "16px",
    backgroundColor: "#4561B9",
    color: "white",
  };

  const [selectedTabId, setSelectedTabId] = useState(IsPos === true ? 1 : 2);
  const [searchFields, setSearchFields] = useState({
    BranchId: null,
    AreaId: null,
    OrderNumber: "%%",
    CustomerId: null,
    CustomerName: "%%",
    CustomerPhone: "%%",
    OrderModeId: null,
    OrderSourceId: null,
    DateFrom: new Date(),
    DateTo: new Date(),
    StatusId: null,
  });

  const DateRefFrom = useRef({});
  const DateRefTo = useRef({});
  const componentRef = React.useRef(null);
  const componentRefForSaleRecipt = React.useRef(null);
  const componentRefForBill = React.useRef(null);

  const managePaymentTable = (record) => {
    const copyOfPayments = payments;
    const index = copyOfPayments.findIndex(
      (x) => x.PaymentModeId === record.PaymentModeId
    );
    if (index > -1) {
      copyOfPayments.splice(index, 1);
    }
    setPayments([...copyOfPayments]);
    let pay = 0;
    copyOfPayments.filter((paym, i) => {
      pay = pay + getFloatValue(paym.ReceivedAmount);
    });
    if (pay > parseInt(selectedOrder.TotalAmountWithGST)) {
      setReturnAmount(pay - getFloatValue(selectedOrder.TotalAmountWithGST));
    } else {
      setReturnAmount(0);
    }
  };

  const handlePaymentOptionAdd = (record) => {
    let IsFoc = false;
    const filter = payments.filter((check) => {
      if (check.IsFoc) {
        IsFoc = true;
      }
      return check.PaymentModeId === record.PaymentModeId;
    });

    let pay = 0;
    payments.filter((paym, i) => {
      pay = pay + parseFloat(paym.ReceivedAmount).toFixed();
    });

    let totalAmountOfOrder;
    if (selectedOrder.DeliveryCharges > 0) {
      totalAmountOfOrder =
        selectedOrder.TotalAmountWithoutGST +
        selectedOrder.GSTAmount +
        selectedOrder.DeliveryCharges +
        selectedOrder.AdditionalServiceCharges -
        selectedOrder.DiscountAmount;
    } else {
      totalAmountOfOrder =
        selectedOrder.TotalAmountWithoutGST +
        selectedOrder.GSTAmount +
        selectedOrder.AdditionalServiceCharges -
        selectedOrder.DiscountAmount;
    }

    if (IsFoc) {
      message.error("Bill Waved off!");
    } else if (parseFloat(pay) >= parseFloat(totalAmountOfOrder)) {
      message.error("Payment Balanced");
    } else if (filter.length === 0) {
      if (record.IsFoc) {
        let paymentAmountFoc;
        if (selectedOrder.DeliveryCharges > 0) {
          paymentAmountFoc =
            selectedOrder.TotalAmountWithoutGST +
            selectedOrder.GSTAmount +
            selectedOrder.DeliveryCharges +
            selectedOrder.AdditionalServiceCharges -
            selectedOrder.DiscountAmount;
        } else {
          paymentAmountFoc =
            selectedOrder.TotalAmountWithoutGST +
            selectedOrder.GSTAmount +
            selectedOrder.AdditionalServiceCharges -
            selectedOrder.DiscountAmount;
        }
        setPayments([
          ...payments,
          {
            PaymentModeId: record.PaymentModeId,
            TotalAmount: paymentAmountFoc,
            ReceivedAmount: getFloatValue(paymentAmountFoc),
            PaymentName: record.PaymentMode,
            IsFoc: record.IsFoc,
          },
        ]);
        setPaymentAmount(0);
      } else {
        if (
          paymentAmount !== null &&
          parseFloat(paymentAmount) !== 0 &&
          paymentAmount !== ""
        ) {
          let totalPaymentWithMode;
          if (selectedOrder.DeliveryCharges > 0) {
            totalPaymentWithMode =
              selectedOrder.TotalAmountWithoutGST +
              selectedOrder.GSTAmount +
              selectedOrder.DeliveryCharges +
              selectedOrder.AdditionalServiceCharges -
              selectedOrder.DiscountAmount;
          } else {
            totalPaymentWithMode =
              selectedOrder.TotalAmountWithoutGST +
              selectedOrder.GSTAmount +
              selectedOrder.AdditionalServiceCharges -
              selectedOrder.DiscountAmount;
          }
          setPayments([
            ...payments,
            {
              PaymentModeId: record.PaymentModeId,
              TotalAmount:
                payments.length === 0
                  ? totalPaymentWithMode > paymentAmount
                    ? paymentAmount
                    : totalPaymentWithMode
                  : parseFloat(remainingAmount) < parseFloat(paymentAmount)
                  ? remainingAmount
                  : paymentAmount,
              ReceivedAmount: paymentAmount,
              PaymentName: record.PaymentMode,
              IsFoc: record.IsFoc,
              IsPartyAccount: record.IsPartyAccount,
            },
          ]);
        } else {
          message.error("Please Enter Amount!");
        }
      }
    } else {
      message.error("Payment Type Already Added!");
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
      render: (_, record) => {
        return (
          <FormButton
            type="text"
            icon={<DeleteFilled className="redIcon" />}
            onClick={() => {
              managePaymentTable(record);
            }}
          >
            X
          </FormButton>
        );
      },
    },
  ];

  /**
   * RUN:
   * When change occurs in Payment Table Array (CARD, CASH, FOC etc)
   * WORKING:
   * Set Return Amount of Total Amount Given
   * Perform bill calculation for every change in Payment Array
   */
  useEffect(() => {
    let pay = payments.reduce((pre, next) => {
      return (pre += parseFloat(next.ReceivedAmount));
    }, 0);

    if (
      pay >
      parseFloat(
        selectedOrder.OrderModeId === DELIVERY &&
          selectedOrder.DeliveryCharges > 0 &&
          selectedOrder.DeliveryCharges !== null
          ? selectedOrder.TotalAmountWithoutGST +
              selectedOrder.DeliveryCharges +
              selectedOrder.GSTAmount +
              selectedOrder.AdditionalServiceCharges -
              selectedOrder.DiscountAmount -
              selectedOrder.TotalAdvance
          : selectedOrder.TotalAmountWithoutGST +
              selectedOrder.GSTAmount +
              selectedOrder.AdditionalServiceCharges -
              selectedOrder.DiscountAmount -
              selectedOrder.TotalAdvance
      ).toFixed(2)
    ) {
      setReturnAmount(
        (
          pay -
          parseFloat(
            selectedOrder.OrderModeId === DELIVERY &&
              selectedOrder.DeliveryCharges > 0 &&
              selectedOrder.DeliveryCharges !== null
              ? selectedOrder.TotalAmountWithoutGST +
                  selectedOrder.DeliveryCharges +
                  selectedOrder.GSTAmount +
                  selectedOrder.AdditionalServiceCharges -
                  selectedOrder.DiscountAmount -
                  selectedOrder.TotalAdvance
              : selectedOrder.TotalAmountWithoutGST +
                  selectedOrder.GSTAmount +
                  selectedOrder.AdditionalServiceCharges -
                  selectedOrder.DiscountAmount -
                  selectedOrder.TotalAdvance
          ).toFixed(2)
        ).toFixed(2)
      );
      setPaymentAmount(0.0);
    } else {
      let paymentAmount;
      if (
        selectedOrder.OrderModeId === DELIVERY &&
        selectedOrder.DeliveryCharges > 0 &&
        selectedOrder.DeliveryCharges !== null
      ) {
        paymentAmount = parseFloat(
          selectedOrder.TotalAmountWithoutGST +
            selectedOrder.DeliveryCharges +
            selectedOrder.GSTAmount +
            selectedOrder.AdditionalServiceCharges -
            selectedOrder.DiscountAmount -
            selectedOrder.TotalAdvance -
            pay
        ).toFixed(2);
      } else {
        paymentAmount = parseFloat(
          selectedOrder.TotalAmountWithoutGST +
            selectedOrder.GSTAmount +
            selectedOrder.AdditionalServiceCharges -
            selectedOrder.DiscountAmount -
            selectedOrder.TotalAdvance -
            pay
        ).toFixed(2);
      }
      setRemainingAmount(parseFloat(paymentAmount).toFixed(2));
      setPaymentAmount(parseFloat(paymentAmount).toFixed(2));
    }
  }, [payments]);

  /**
   * This function helps to print Sale Receipt using React to Print Hook
   */
  const handlePrintSaleRecipt = useReactToPrint({
    content: () => componentRefForSaleRecipt.current,
  });

  /**
   * This function helps to print KOT using React to Print Hook
   */
  const handlePrintKot = useReactToPrint({
    content: () => componentRef.current,
  });

  /**
   * RUN: when checkout button is Pressed using HOT KEY
   * WORKING:
   * Call Checkout API for Payment
   * Print Sales Receipt
   */
  useEffect(() => {
    if (checkOutSelectedOrder === true) {
      doneCheckOut(handlePrintSaleRecipt);
      setCheckOutSelectedOrder(false);
    }
  }, [checkOutSelectedOrder]);

  /**
   * RUN: when KOT button in Selected Order Drawer is Pressed using HOT KEY
   * WORKING:
   * Call KOT API
   * Print KOT
   */
  useEffect(() => {
    if (parentKotPrint === true) {
      handlePrinting(handlePrintKot);
      setParentKotPrint(false);
    }
  }, [parentKotPrint]);

  /**
   * Date Ref for Order Searching
   */
  DateRefFrom.current = searchFields.DateFrom;
  DateRefTo.current = searchFields.DateTo;

  const { Panel } = Collapse;

  /**
   * Plays the Order Sound When New Order Arrive according to Order Mode
   */
  const playOrderSound = () => {
    if (
      posState.customerTableDrawer === false &&
      posState.punchDrawer === false &&
      posState.customerDrawer === false &&
      posState.customerEditDrawer === false &&
      posState.productDrawer === false &&
      IsPos === true
    ) {
      playNotificationSound();
    }
  };

  /**
   * RUN: When Checkout Button is pressed for Toggle Checkout Drawer
   * WORKING:
   * Set Payment Amount for the current selected bill
   */
  useEffect(() => {
    if (posState.billPaymentOptionModal === true) {
      setPaymentAmount(
        parseFloat(
          selectedOrder.OrderModeId === DELIVERY &&
            selectedOrder.DeliveryCharges > 0 &&
            selectedOrder.DeliveryCharges !== null
            ? selectedOrder.TotalAmountWithoutGST +
                selectedOrder.DeliveryCharges +
                selectedOrder.GSTAmount +
                selectedOrder.AdditionalServiceCharges -
                selectedOrder.DiscountAmount -
                selectedOrder.TotalAdvance
            : selectedOrder.TotalAmountWithoutGST +
                selectedOrder.GSTAmount +
                selectedOrder.AdditionalServiceCharges -
                selectedOrder.DiscountAmount -
                selectedOrder.TotalAdvance
        ).toFixed(2)
      );
    } else {
      setPaymentAmount(null);
    }
  }, [posState.billPaymentOptionModal]);

  /**
   *
   * Call the API for Order Payment
   * @param {Function} handlePrint Function to invoke printing
   * @param {{}} state Selected Order Master Data object
   */
  const doneCheckOut = (handlePrint, state) => {
    if (
      payments?.length >= 1 &&
      payments.some((x) => x.IsPartyAccount) &&
      !(selectedOrder?.CustomerId > 0)
    ) {
      message.error("Please select a customer first");
      return;
    }

    let pay = 0;
    let totalAmountToBePaid;

    totalAmountToBePaid =
      selectedOrder.OrderModeId === DELIVERY &&
      selectedOrder.DeliveryCharges > 0 &&
      selectedOrder.DeliveryCharges !== null
        ? selectedOrder.TotalAmountWithoutGST +
          selectedOrder.DeliveryCharges +
          selectedOrder.GSTAmount +
          selectedOrder.AdditionalServiceCharges -
          selectedOrder.DiscountAmount -
          selectedOrder.TotalAdvance
        : selectedOrder.TotalAmountWithoutGST +
          selectedOrder.GSTAmount +
          selectedOrder.AdditionalServiceCharges -
          selectedOrder.DiscountAmount -
          selectedOrder.TotalAdvance;

    payments.filter((paym, i) => {
      pay = pay + parseFloat(paym.ReceivedAmount);
    });

    let payParse = parseFloat(pay).toFixed(2);
    let totalAmountToBePaidParse = parseFloat(totalAmountToBePaid).toFixed(2);

    const { TerminalDetailId } = JSON.parse(
      localStorage.getItem(DAY_SHIFT_TERMINAL)
    );

    if (TerminalDetailId > 0) {
      if (
        parseFloat(payParse) > parseFloat(totalAmountToBePaidParse) ||
        parseFloat(payParse) === parseFloat(totalAmountToBePaidParse)
      ) {
        if (btnRef.current) {
          btnRef.current.setAttribute("disabled", "disabled");
        }
        setDoneCheckOutLoading(true);
        /** Order Payemnt Checkout API Call */
        postRequest(
          "/OrderPayment",
          {
            OrderMasterId: selectedOrder.OrderMasterId,
            TerminalDetailId: parseInt(TerminalDetailId),
            OperationId: 2,
            CompanyId: userData.CompanyId,
            UserId: userData.UserId,
            UserIP: "12.1.1.2",
            tblOrderPaymentDetail: payments,
          },
          controller
        ).then((data) => {
          setDoneCheckOutLoading(false);
          const responce = data.data.DataSet.Table[0];
          if (responce.HasError !== 0) {
            message.error("Some Error Occured!");
          } else {
            message.success("Paid Successfully!");
            if (
              data.data.DataSet.Table1?.[0]?.SrbInvoiceId !== null &&
              data.data.DataSet.Table1?.[0]?.SrbInvoiceId !== undefined
            ) {
              dispatch({
                type: SET_POS_STATE,
                payload: {
                  name: "SrbInvoiceNo",
                  value: data.data.DataSet.Table1[0]?.SrbInvoiceId,
                },
              });
            }
            if (
              data.data.DataSet.Table1?.[0]?.FbrInvoiceId !== null &&
              data.data.DataSet.Table1?.[0]?.FbrInvoiceId !== undefined
            ) {
              dispatch({
                type: SET_POS_STATE,
                payload: {
                  name: "FbrInvoiceNo",
                  value: data.data.DataSet.Table1[0]?.FbrInvoiceId,
                },
              });
            }
            setTimeout(() => {
              executeCheckOut(handlePrint, data);
            }, 100);
          }
        });
      } else {
        message.error("Payment amount not balanced!");
      }
    } else {
      message.error("Terminal is closed!");
    }
  };

  const executeCheckOut = (handlePrint, data) => {
    let cloneHTMLTemp = posState?.templateList?.Table?.filter(
      (e) => e.TemplateTypeId == SALE_RECIEPT
    )[0]?.TemplateHtml;

    const orderItems = supportingTable.Table1.filter((item) => {
      if (selectedOrder.OrderMasterId === item.OrderMasterId) {
        return item;
      }
    });

    /** Generate Sales Receipt Template */
    // let CloneTemplate = generateSaleReceipt(
    //   cloneHTMLTemp,
    //   selectedOrder,
    //   orderItems,
    //   payments,
    //   returnAmount,
    //   userData,
    //   posState
    // );

    const FbrInvoiceId = data?.data.DataSet.Table1?.[0]?.FbrInvoiceId;
    const SrbInvoiceId = data.data.DataSet.Table1?.[0]?.SrbInvoiceId;

    let CloneTemplate = generateAnotherSaleReciept(
      orderItems,
      cloneHTMLTemp,
      userData,
      posState,
      payments,
      returnAmount,
      FbrInvoiceId,
      SrbInvoiceId
    );

    //FBR QR
    if (
      data.data.DataSet.Table1?.[0]?.FbrInvoiceId !== null &&
      data.data.DataSet.Table1?.[0]?.FbrInvoiceId !== undefined
    ) {
      let fbrQR = document.getElementById("qr-code-container")?.innerHTML;
      CloneTemplate = CloneTemplate.replace(
        "{fbrIntegration}",
        `<div style="display:flex; justify-content:space-between; align-items:center; margin:20px 5px">
        <div>
          <image style="width:50px; height:auto;" src="${FBRImage}"/></div>
        <div style="display:flex; flex-direction:column; text-align:center">
          <span><p style='color:black;  margin-right:10px;'>FBR Invoice Number</p></span>
          <span><p style='color:black;  margin-right:20px;'>${data.data.DataSet.Table1[0]?.FbrInvoiceId}</p></span>
        </div>
        <div>${fbrQR}</div>

      </div>`
      );
      CloneTemplate = CloneTemplate.replace("{srbIntegration}", "");
    } else {
      CloneTemplate = CloneTemplate.replace("{fbrIntegration}", "");
    }

    //SRB QR
    if (
      data.data.DataSet.Table1?.[0]?.SrbInvoiceId !== null &&
      data.data.DataSet.Table1?.[0]?.SrbInvoiceId !== undefined
    ) {
      let srbQR = document.getElementById("srb-code-container")?.innerHTML;
      CloneTemplate = CloneTemplate.replace(
        "{srbIntegration}",
        `<div style="display:flex; justify-content:space-between; align-items:center; margin:20px 5px">
        <div>
        <image style="width:50px; height:auto;" src="${SRBImage}"/></div>
        <div style="display:flex; flex-direction:column; text-align:center">
        <span><p style='color:black;  margin-right:10px;'>SRB Invoice Number</p></span>
        <span><p style='color:black;  margin-right:20px;'>${data.data.DataSet.Table1[0]?.SrbInvoiceId}</p></span>
        </div>
        <div>${srbQR}</div>
        
        </div>`
      );
      CloneTemplate = CloneTemplate.replace("{fbrIntegration}", "");
    } else {
      CloneTemplate = CloneTemplate.replace("{srbIntegration}", "");
    }

    // {loading ? (
    //   <div
    //     style={{
    //       display: "flex",
    //       justifyContent: "center",
    //       alignItem: "center",
    //     }}
    //   >
    //     <Spin spinning={loading} />
    //   </div>
    // ) : (
    /** Setting Sales Reciept Template using PROMISE */
    const setBillTemp = new Promise((resolutionFunc, rejectionFunc) => {
      dispatch({
        type: SET_POS_STATE,
        payload: {
          name: "SalesReceiptHtmlTemplate",
          value: CloneTemplate,
        },
      });
      resolutionFunc("Resolved");
    });

    /**
     * Reset Selected Order, Checkout Modal and Selected Order Modal
     */
    setBillTemp.then(() => {
      handlePrint();
      setParentCheckOutOrderModal(false);
      dispatch({
        type: SET_POS_STATE,
        payload: {
          name: "billPaymentOptionModal",
          value: false,
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
        payload: {
          name: "selectedOrder",
          value: {},
        },
      });
      setPayments([]);
      dispatch(
        setInitialState(
          "/GetOrder",
          {
            ...initialFormValues,
            BranchId:
              userBranchList.length === 1 ? userBranchList[0].BranchId : null,
            CityId: userBranchList[0]?.CityId,
          },
          initialFormValues,
          initialSearchValues,
          controller,
          userData
        )
      );
    });
  };

  /**
   * Helps to switch the Order Mode Tab and Filter List accordingly
   * @param {Number} key Order Tab Index
   * @param {{}} data Order List Master Data
   */
  const callback = (key, data) => {
    if (parseInt(key, 0) === 1) {
      setOrderModeId(DINE_IN);
      setSelectedTabId(1);
      const foundOrders = data.filter((item) => {
        if (item.OrderModeId === DINE_IN) {
          if (item.OrderStatus === "New") {
            playOrderSound();
          }
          return item;
        }
      });
      setOrdersToShow([...foundOrders]);
      setParentKey(key);
    } else if (parseInt(key, 0) === 2) {
      setSelectedTabId(2);
      setOrderModeId(DELIVERY);
      const foundOrders = data.filter((item) => {
        if (item.OrderModeId === DELIVERY) {
          if (item.OrderStatus === "New") {
            playOrderSound();
          }
          return item;
        }
      });
      setOrdersToShow([...foundOrders]);
      setParentKey(key);
    } else if (parseInt(key, 0) === 3) {
      setSelectedTabId(3);
      setOrderModeId(TAKE_AWAY);
      const foundOrders = data.filter((item) => {
        if (item.OrderModeId === TAKE_AWAY) {
          if (item.OrderStatus === "New") {
            playOrderSound();
          }
          return item;
        }
      });

      setOrdersToShow([...foundOrders]);
      setParentKey(key);
    } else if (parseInt(key, 0) === 4) {
      setSelectedTabId(4);
      setOrderModeId(FINISHED_WASTE);
      const foundOrders = data.filter((item) => {
        if (item.OrderModeId === FINISHED_WASTE) {
          if (item.OrderStatus === "New") {
            playOrderSound();
          }
          return item;
        }
      });
      setOrdersToShow([...foundOrders]);
      setParentKey(key);
    } else if (parseInt(key, 0) === 5) {
      setSelectedTabId(5);
      setOrderModeId(HOLD_ORDER_TAB);
      const holdOrderList = JSON.parse(localStorage.getItem(HOLD_ORDER));
      if (holdOrderList) {
        const listToShow = holdOrderList.filter(
          (e) => e.BusinessTypeId === userData.companyList[0].BusinessTypeId
        );
        setHoldOrders([...listToShow]);
        setOrdersToShow([...listToShow]);
      } else {
        setOrdersToShow([]);
      }
      setParentKey(key);
    }
  };

  const { formFields, itemList, formLoading, tableLoading, supportingTable } =
    useSelector((state) => state.basicFormReducer);

  const { selectedOrder, cancelOrderStatusObj, FromDate, ToDate } = useSelector(
    (state) => state.PointOfSaleReducer
  );

  /**
   * Helps to Switch Tab using HOT KEY
   */
  useEffect(() => {
    if (parentKey !== 0) {
      callback(parentKey, itemList);
    }
  }, [parentKey]);

  /**
   * Helps to close Selected Order Drawer using HOT KEY
   */
  useEffect(() => {
    if (closeDrawerParent === true) {
      closeDrawer();
      setCloseDrawerParent(false);
    }
  }, [closeDrawerParent]);

  /**
   * Setting initial Setup for page
   * Get Order from API
   * Get Printing Template from API
   * Setting GST List, Payment Types List, Template List in Redux Store
   * Set Pre Payment Bill Template in useRef()
   */
  useEffect(() => {
    const Datee = new Date();

    const month =
      new Date().getMonth() + 1 < 10
        ? "0" + (new Date().getMonth() + 1)
        : new Date().getMonth() + 1;
    const day =
      new Date().getDate() + 1 < 10
        ? "0" + new Date().getDate()
        : new Date().getDate();

    const finalDate =
      Datee.getFullYear() + "-" + month + "-" + day + " " + "00:00:00.000";

    setSearchFields({
      ...searchFields,
      DateFrom: finalDate,
      DateTo: finalDate,
    });

    initialFormValues.DateFrom = finalDate;
    initialFormValues.DateTo = finalDate;

    updateSearchDate({ name: "DateFrom", value: finalDate });
    updateSearchDate({ name: "DateTo", value: finalDate });

    const holdOrderList = JSON.parse(localStorage.getItem(HOLD_ORDER));
    if (holdOrderList) {
      const holdOrderListToShow = holdOrderList.filter(
        (e) => e.BusinessTypeId === userData.companyList[0].BusinessTypeId
      );
      setHoldOrders(holdOrderListToShow);
    }

    // dispatch(
    //   setInitialState(
    //     "/GetOrder",
    //     {
    //       ...initialFormValues,
    //       BranchId:
    //         userBranchList.length === 1 ? userBranchList[0].BranchId : null,
    //       CityId: userBranchList[0]?.CityId
    //     },
    //     initialFormValues,
    //     initialSearchValues,
    //     controller,
    //     userData
    //   )
    // );

    postRequest(
      "/GetOrder",
      {
        OperationId: 1,
        CompanyId: userData.CompanyId,
        UserId: userData.UserId,
        UserIP: "12.1.1.2",
        BranchId:
          selectedOrder?.BranchId || userBranchList.length === 1
            ? userBranchList[0].BranchId
            : null,
        AreaId: null,
        OrderNumber: selectedOrder.OrderNumber,
        CustomerId: null,
        CustomerName: "%%",
        CustomerPhone: "%%",
        OrderModeId: null,
        OrderNumber: "%%",
        OrderSourceId: null,
        DateFrom: finalDate,
        DateTo: finalDate,
        StatusId: null,
        CityId: userBranchList[0]?.CityId,
      },
      controller
    ).then((result) => {
      if (result?.error === true) {
        dispatch({
          type: TOGGLE_TABLE_LOADING,
        });
        message.error(result?.errorMessage);
        return;
      }
      if (result?.data?.response === false) {
        message.error(result?.DataSet?.Table?.errorMessage);
        return;
      }
      const { Table, Table8, Table9, Table11 } = result?.data?.DataSet;
      delete result?.data?.DataSet?.Table;

      dispatch({
        type: SET_TABLE_DATA,
        payload: { table: Table },
      });
      dispatch({
        type: SET_SUPPORTING_TABLE,
        payload: result?.data?.DataSet,
      });
      dispatch({
        type: SET_POS_STATE,
        payload: {
          name: "gstList",
          value: Table8,
        },
      });
      dispatch({
        type: SET_POS_STATE,
        payload: {
          name: "paymentTypeList",
          value: Table9,
        },
      });
      dispatch({
        type: SET_POS_STATE,
        payload: {
          name: "punchScreenData",
          value: {
            ...posState.punchScreenData,
            Table10: data.data.DataSet.Table11,
          },
        },
      });

      dispatch({
        type: SET_POS_STATE,
        payload: {
          name: "punchScreenData",
          value: {
            ...posState.punchScreenData,
            Table10: Table11,
          },
        },
      });
    });

    const data = {
      TemplateId: null,
      TemplateTypeId: null,
      TemplateHtml: "",
    };

    postRequest(
      "/CrudPrintTemplate",
      {
        ...data,
        OperationId: 1,
        CompanyId: userData.CompanyId,
        UserId: userData.UserId,
        UserIP: "12.1.1.2",
      },
      controller
    ).then((data) => {
      const responce = data.data.DataSet;
      dispatch({
        type: SET_POS_STATE,
        payload: {
          name: "templateList",
          value: responce,
        },
      });

      const filteredTempalteString =
        responce.Table &&
        responce.Table.filter(
          (str) => str.TemplateTypeId === PRE_PAYMENT_BILL
        )[0];

      if (filteredTempalteString) {
        BillPrintHtmlTemplate.current = filteredTempalteString.TemplateHtml;
      }
    });

    return () => {
      controller.abort();
      dispatch(resetState());
    };
  }, []);

  /**
   * RUN: When Order Item List updated in Redux Store
   * WORKING:
   * Whenever a a new order arrives in any Order mode. Rings Notification Sound
   */
  useEffect(() => {
    const dinIn = [];
    const delivery = [];
    const takeAway = [];
    const finishWaste = [];

    const foundOrder = itemList.filter((item) => {
      if (item.OrderStatus === "New" || item.OrderStatus === "Ready") {
        if (item.OrderModeId === DINE_IN) {
          if (IsPos === true) {
            dinIn.push(item);
          }
        } else if (item.OrderModeId === DELIVERY) {
          delivery.push(item);
        } else if (item.OrderModeId === TAKE_AWAY) {
          takeAway.push(item);
        } else if (item.OrderModeId === FINISHED_WASTE) {
          // if (IsPos === true) {
          finishWaste.push(item);
          // }
        }
      }
      if (item.OrderModeId === orderModeId) {
        if (item.OrderStatus === "New") {
          playOrderSound();
        }
        return item;
      }
    });

    setDineInOrders([...dinIn]);
    setDeliveryOrders([...delivery]);
    setTakeawayOrders([...takeAway]);
    setfinishwasteOrders([...finishWaste]);
    if (selectedTabId !== 5) {
      setOrdersToShow([...foundOrder]);
    } else {
      const holdOrderList = JSON.parse(localStorage.getItem(HOLD_ORDER));
      if (holdOrderList) {
        const listToShowHoldOrders = holdOrderList.filter(
          (e) => e.BusinessTypeId === userData.companyList[0].BusinessTypeId
        );
        setOrdersToShow([...listToShowHoldOrders]);
      }
    }

    /** Play Notification Sound whenever NEW order arrives */
    if (
      (dinIn.length > 0 || delivery.length > 0 || takeAway.length > 0) &&
      IsPos === true
    ) {
      playOrderSound();
    }
  }, [itemList]);

  /**
   * RUN: When Supporting Table2 updates (Order Status List)
   * WORKING:
   * Set Cancel Order object in Redux Store to embed when order is canceled
   * Remove Cancel Status from status List
   */
  useEffect(() => {
    if (Object.keys(supportingTable).length !== 0) {
      const statusArr = [];
      const orderStatusObj = supportingTable.Table2
        ? supportingTable.Table2.filter((table) => {
            if (table.IsCancelable === true) {
              return table;
            } else {
              statusArr.push(table);
            }
          })
        : [{}];
      setOrderStatusList([...statusArr]);
      dispatch({
        type: SET_POS_STATE,
        payload: {
          name: "cancelOrderStatusObj",
          value: orderStatusObj[0],
        },
      });
    }
  }, [supportingTable]);

  /**
   * RUNS: only When Screen Renders
   * WORKING:
   * Makes API call to get latest order list every 30 sec
   */
  useEffect(() => {
    const interval = setInterval(() => {
      var finalDate = DateRefFrom.current;
      var finalDateTo = DateRefTo.current;

      if (finalDate === new Date() && finalDateTo === new Date()) {
        finalDate =
          finalDate.getFullYear() +
          "-" +
          (finalDate.getMonth() + 1) +
          "-" +
          finalDate.getDate() +
          " " +
          "00:00:00.000";

        finalDateTo =
          finalDateTo.getFullYear() +
          "-" +
          (finalDateTo.getMonth() + 1) +
          "-" +
          finalDateTo.getDate() +
          " " +
          "00:00:00.000";
      }

      initialFormValues.DateFrom = finalDate;
      initialFormValues.DateTo = finalDateTo;

      const holdOrderList = JSON.parse(localStorage.getItem(HOLD_ORDER));
      if (holdOrderList) {
        const holdOrderListToShow = holdOrderList.filter(
          (e) => e.BusinessTypeId === userData.companyList[0].BusinessTypeId
        );
        setHoldOrders(holdOrderListToShow);
      }

      dispatch(
        setInitialState(
          "/GetOrder",
          {
            ...initialFormValues,
            BranchId:
              userBranchList.length === 1 ? userBranchList[0].BranchId : null,
            CityId: userBranchList[0]?.CityId,
          },
          initialFormValues,
          initialSearchValues,
          controller,
          userData
        )
      );
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  /**
   * RUN: When Payment Type changed through Payment Modal
   * WORKING:
   * Call the Get Order API to recalculate the calculation
   */
  useEffect(() => {
    if (posState.updateGetOrderList === true) {
      var finalDate = DateRefFrom.current;
      var finalDateTo = DateRefTo.current;

      if (finalDate === new Date() && finalDateTo === new Date()) {
        finalDate =
          finalDate.getFullYear() +
          "-" +
          (finalDate.getMonth() + 1) +
          "-" +
          finalDate.getDate() +
          " " +
          "00:00:00.000";

        finalDateTo =
          finalDateTo.getFullYear() +
          "-" +
          (finalDateTo.getMonth() + 1) +
          "-" +
          finalDateTo.getDate() +
          " " +
          "00:00:00.000";
      }

      initialFormValues.DateFrom = finalDate;
      initialFormValues.DateTo = finalDateTo;

      dispatch(
        setInitialState(
          "/GetOrder",
          {
            ...initialFormValues,
            BranchId:
              userBranchList.length === 0 ? userBranchList[0].BranchId : null,
            CityId: userBranchList[0]?.CityId,
          },
          initialFormValues,
          initialSearchValues,
          controller,
          userData
        )
      );
      dispatch({
        type: SET_POS_STATE,
        payload: {
          name: "updateGetOrderList",
          value: false,
        },
      });
    }
  }, [posState.updateGetOrderList]);

  /**
   * Order Detail Table column for Selected Order Detail Drawer
   */
  const columnForDealOption = [
    {
      title: "Item",
      dataIndex: "ProductDetailName",
      key: "ProductDetailName",
    },
    {
      title: "Amount",
      dataIndex: "PriceWithGST",
      key: "PriceWithGST",
    },
    {
      title: "Quantity",
      dataIndex: "Quantity",
      key: "Quantity",
    },
    {
      title: "Discount",
      dataIndex: "DiscountPercent",
      key: "DiscountPercent",
    },
    {
      title: "Instructions",
      dataIndex: "SpecialInstruction",
      key: "SpecialInstruction",
    },
  ];

  /**
   * Set Selected Order, Rider, Waiter, Table, Filter Order Detail and OrderDetail for Toggle Detail Drawer in Redux Store
   * Create Bill of Pre-Payment
   * Set HTML Bill Template in Redux Store
   * Set State for Filtered Order Detail and Order Status
   * @param {{}}} record Data Record Object
   * @param {Number} index Clicked Row Index
   */
  const handleDrawer = (record, index) => {
    isNullValue(record.FbrInvoiceId)
      ? dispatch({
          type: SET_POS_STATE,
          payload: {
            name: "FbrInvoiceNo",
            value: record.FbrInvoiceId,
          },
        })
      : isNullValue(record.FbrInvoiceId)
      ? dispatch({
          type: SET_POS_STATE,
          payload: {
            name: "SrbInvoiceNo",
            value: record.SrbInvoiceId,
          },
        })
      : null;
    dispatch({
      type: SET_POS_STATE,
      payload: {
        name: "selectedOrder",
        value: record,
      },
    });
    dispatch({
      type: SET_POS_STATE,
      payload: {
        name: "riderId",
        value: record.RiderId,
      },
    });
    dispatch({
      type: SET_POS_STATE,
      payload: {
        name: "riderName",
        value: record.RiderName,
      },
    });
    dispatch({
      type: SET_POS_STATE,
      payload: {
        name: "waiterId",
        value: record.WaiterId,
      },
    });
    dispatch({
      type: SET_POS_STATE,
      payload: {
        name: "waiterName",
        value: record.WaiterName,
      },
    });
    dispatch({
      type: SET_POS_STATE,
      payload: {
        name: "tableId",
        value: record.TableId,
      },
    });
    dispatch({
      type: SET_POS_STATE,
      payload: {
        name: "tableName",
        value: record.TableName,
      },
    });

    let cloneHTMLTemp = BillPrintHtmlTemplate.current;

    const orderItems = supportingTable.Table1.filter((item) => {
      if (record.OrderMasterId === item.OrderMasterId) {
        return item;
      }
    });

    setFilteredOrders([...orderItems]);
    setOrderItemsDetail([...orderItems]);
    setOrderStatus(record.OrderStatusId);

    dispatch({
      type: SET_POS_STATE,
      payload: {
        name: "seletedOrderItems",
        value: orderItems,
      },
    });
    dispatch({
      type: SET_POS_STATE,
      payload: {
        name: "selectedOrderModal",
        value: true,
      },
    });
    cloneHTMLTemp = generateBillTemplate(
      orderItems,
      cloneHTMLTemp,
      record,
      userData,
      selectedOrder
    );

    dispatch({
      type: SET_POS_STATE,
      payload: {
        name: "HTMLBill",
        value: cloneHTMLTemp,
      },
    });
  };

  /**
   * Change the Status of the Order and Reset the supporting table
   * @param {{}} data event value of Status Dropdown
   */
  const handleStatusChange = (data) => {
    setOrderStatus(data.value);
    if (data.value !== null) {
      var finalDate = DateRefFrom.current;
      var finalDateTo = DateRefTo.current;

      if (finalDate === new Date() && finalDateTo === new Date()) {
        finalDate =
          finalDate.getFullYear() +
          "-" +
          (finalDate.getMonth() + 1) +
          "-" +
          finalDate.getDate() +
          " " +
          "00:00:00.000";

        finalDateTo =
          finalDateTo.getFullYear() +
          "-" +
          (finalDateTo.getMonth() + 1) +
          "-" +
          finalDateTo.getDate() +
          " " +
          "00:00:00.000";
      }

      const order = selectedOrder;
      order.DateFrom = finalDate;
      order.DateTo = finalDateTo;
      order.OrderStatusId = data.value;
      order.tblOrderDetail = orderItemsDetail;

      dispatch(
        submitForm(
          "/UpdateOrderStatus",
          order,
          initialFormValues,
          controller,
          userData,
          3,
          (tables) => {
            delete tables.Table;
            const orderMas = tables.Table1.filter((item) => {
              if (order.OrderMasterId === item.OrderMasterId) {
                return item;
              }
            });

            dispatch({
              type: SET_POS_STATE,
              payload: {
                name: "selectedOrder",
                value: orderMas[0],
              },
            });

            const orderItems = tables.Table2.filter((item) => {
              if (order.OrderMasterId === item.OrderMasterId) {
                return item;
              }
            });
            setFilteredOrders([...orderItems]);

            const tablesToSet = {
              Table: tables.Table1,
              Table1: tables.Table2,
              Table2: tables.Table3,
              Table3: tables.Table4,
              Table4: tables.Table5,
              Table5: tables.Table6,
            };

            dispatch({ type: SET_SUPPORTING_TABLE, payload: tablesToSet });
          }
        )
      );
    }
  };

  /**
   * this function call the API to Get Filtered Data
   * @param {{}} e event object
   */
  const handleSearchSubmit = (e) => {
    e.preventDefault();

    const compareDateState = (date1, date2) => {
      if (date1.getTime() <= date2.getTime()) return true;
      else return false;
    };
    const comparedDate = compareDateState(
      new Date(DateRefFrom.current.split(" ")[0]),
      new Date(DateRefTo.current.split(" ")[0])
    );

    if (comparedDate === false) {
      message.error("Invalid Date");
      return;
    }
    dispatch(
      setInitialState(
        "/GetOrder",
        {
          ...searchFields,
          BranchId:
            userBranchList.length === 1 ? userBranchList[0].BranchId : null,
        },
        initialFormValues,
        searchFields,
        controller,
        userData
      )
    );
  };

  /**
   * this function update the state of the Searching Panel
   * @param {{}} data event object of field
   */
  const handleSearchFieldChange = (data) => {
    if (
      data.name === "CustomerName" ||
      data.name === "CustomerPhone" ||
      data.name === "OrderNumber"
    ) {
      data.value = `%${data.value}%`;
    }
    setSearchFields({ ...searchFields, [data.name]: data.value });
  };

  /**
   * This function change the state of Select in Search Field
   * @param {{}} data event object of field
   */
  const handleSelectChange = (data) => {
    if (data.value !== null) {
      setSearchFields({ ...searchFields, [data.name]: data.value });
    } else {
      setSearchFields({ ...searchFields, [data.name]: null });
    }
  };

  /**
   * Close the Drawer
   * Reset Selected Order Modal, Selected Order, KOT Print, Rider in Redux Store
   */
  const closeDrawer = () => {
    dispatch({
      type: SET_POS_STATE,
      payload: {
        name: "selectedOrderModal",
        value: false,
      },
    });
    dispatch({
      type: SET_POS_STATE,
      payload: {
        name: "selectedOrder",
        value: {},
      },
    });
    dispatch({
      type: SET_POS_STATE,
      payload: {
        name: "SrbInvoiceNo",
        value: "00000",
      },
    });
    dispatch({
      type: SET_POS_STATE,
      payload: {
        name: "FbrInvoiceNo",
        value: "00000",
      },
    });
    dispatch({
      type: SET_POS_STATE,
      payload: {
        name: "riderId",
        value: null,
      },
    });
    dispatch({
      type: SET_POS_STATE,
      payload: {
        name: "riderName",
        value: null,
      },
    });
    dispatch({
      type: SET_POS_STATE,
      payload: {
        name: "KOTPrint",
        value: "",
      },
    });
    setKOTTemplate(KOTTemp);
  };

  /**
   * Print the generated HTML of KOT
   * @param {Function} handlePrint helper function to print HTML
   */
  const handlePrinting = (handlePrint) => {
    postRequest(
      "/GenerateKot",
      {
        OrderMasterId: selectedOrder.OrderMasterId,
        OperationId: 2,
        CompanyId: userData.CompanyId,
        UserId: userData.UserId,
      },
      controller
    ).then((data) => {
      const responce = data.data.DataSet;
      if (responce.Table[0].HasError === 0) {
        dispatch({
          type: SET_POS_STATE,
          payload: {
            name: "IsKot",
            value: 1,
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
          payload: {
            name: "selectedOrder",
            value: {},
          },
        });
        dispatch({
          type: SET_POS_STATE,
          payload: {
            name: "selectedRider",
            value: {},
          },
        });
        dispatch({
          type: SET_POS_STATE,
          payload: {
            name: "KOTPrint",
            value: "",
          },
        });
        setKOTTemplate(
          posState?.templateList?.Table?.filter(
            (e) => e.TemplateTypeId === KOT_TEMPLATE
          )[0]?.TemplateHtml
        );
        const cloneHTMLTemp = generateKotTemplate(
          responce.Table1,
          KOTTemplate,
          selectedOrder,
          posState,
          userData
        );

        const setKotTemp = new Promise((resolutionFunc, rejectionFunc) => {
          dispatch({
            type: SET_POS_STATE,
            payload: {
              name: "KOTPrint",
              value: cloneHTMLTemp,
            },
          });
          resolutionFunc("Resolved");
        });

        setKotTemp.then((res) => {
          dispatch({
            type: SET_POS_STATE,
            payload: {
              name: "updateGetOrderList",
              value: true,
            },
          });
          handlePrint();
        });
      }
    });
  };

  /**
   * RUN: When change the Hold Order List
   * WORKING:
   * Get the Hold Order list from Local Storage and set in array list
   */
  useEffect(() => {
    const holdOrderList = JSON.parse(localStorage.getItem(HOLD_ORDER));
    if (holdOrderList) {
      const holdOrderListToShow = holdOrderList.filter(
        (e) => e.BusinessTypeId === userData.companyList[0].BusinessTypeId
      );
      setOrdersToShow([...holdOrderListToShow]);
    }
  }, [holdOrders]);

  /**
   * This function Edit the Hold Order
   * @param {{}} record Hold Order object
   * @param {Number} index Row index of Hold Order List
   */
  const editHoldOrder = (record, index) => {
    let holdOrderList = JSON.parse(localStorage.getItem(HOLD_ORDER));
    if (holdOrderList.length > 0) {
      holdOrderList.splice(index, 1);
      localStorage.setItem(HOLD_ORDER, JSON.stringify([...holdOrderList]));
      dispatch({
        type: SET_HOLD_ORDER,
        payload: record,
      });
      setOrdersToShow([...holdOrderList]);
      setHoldOrders([...holdOrderList]);
    }
  };

  /**
   * This function Delete the Hold Order
   * @param {{}} record Hold Order object to be deleted
   * @param {Number} index Row index of Hold Order List
   */
  const deleteHoldOrder = (record, index) => {
    let holdOrderList = JSON.parse(localStorage.getItem(HOLD_ORDER));
    if (holdOrderList.length > 0) {
      holdOrderList.splice(index, 1);
      localStorage.setItem(HOLD_ORDER, JSON.stringify([...holdOrderList]));
      setOrdersToShow([...holdOrderList]);
      setHoldOrders([...holdOrderList]);
    }
  };

  /**
   * Checkout UI Form Panel Rendering
   */
  const formPanelForCheckOut = (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <Col span={10} style>
        <div className="checkoutLeftDiv">
          <div className="checkoutKeypad">
            <Title level={4} style={{ color: "#336fc4" }}>
              Keypad
            </Title>
            <Row gutter={[6, 6]}>
              {calcBtnTxt.map((item, index) => (
                <Col key={index}>
                  <Button
                    style={buttonStyle}
                    onClick={(e) => {
                      if (e.target.innerText === "Clear") {
                        setPaymentAmount("");
                      } else {
                        setPaymentAmount(
                          parseInt(paymentAmount + e.target.innerText)
                        );
                      }
                    }}
                  >
                    {item.name}
                  </Button>
                </Col>
              ))}
            </Row>
          </div>
          <Row
            style={{
              width: "100%",
              borderTop: "1px solid #ccc",
              paddingTop: "10px",
            }}
          >
            <Col span={24}>
              <Title level={4} style={{ color: "rgb(51, 111, 196)" }}>
                Bill Amount
              </Title>
              <table>
                <tbody>
                  <tr>
                    <td style={{ textAlign: "left" }}>Sub Total</td>
                    <td style={{ textAlign: "right" }}>
                      {getFloatValue(selectedOrder.TotalAmountWithoutGST)}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: "left" }}>Tax</td>
                    <td style={{ textAlign: "right" }}>
                      {" "}
                      {getFloatValue(selectedOrder.GSTAmount)}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: "left" }}>Discount</td>
                    <td style={{ textAlign: "right" }}>
                      {getFloatValue(selectedOrder.DiscountAmount)}
                    </td>
                  </tr>
                  {selectedOrder.OrderModeId === DELIVERY &&
                    selectedOrder.DeliveryCharges > 0 &&
                    selectedOrder.DeliveryCharges !== null && (
                      <tr>
                        <td style={{ textAlign: "left" }}>Delivery Charges</td>
                        <td style={{ textAlign: "right" }}>
                          {getFloatValue(selectedOrder.DeliveryCharges)}
                        </td>
                      </tr>
                    )}

                  <tr>
                    <td style={{ textAlign: "left" }}>Additional Charges</td>
                    <td style={{ textAlign: "right" }}>
                      {getFloatValue(selectedOrder.AdditionalServiceCharges)}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: "left" }}>Advance</td>
                    <td style={{ textAlign: "right" }}>
                      {getFloatValue(selectedOrder.TotalAdvance)}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        textAlign: "left",
                        fontSize: 20,
                        fontWeight: "bold",
                      }}
                    >
                      Payable
                    </td>
                    <td
                      style={{
                        textAlign: "right",
                        // fontSize: 18,
                        // fontWeight: "bold",
                      }}
                    >
                      <Title
                        style={{
                          color: "rgb(51, 111, 196)",
                          margin: 0,
                        }}
                        level={2}
                      >
                        {getFloatValue(
                          selectedOrder.OrderModeId === DELIVERY &&
                            selectedOrder.DeliveryCharges > 0 &&
                            selectedOrder.DeliveryCharges !== null
                            ? selectedOrder.TotalAmountWithoutGST +
                                selectedOrder.DeliveryCharges +
                                selectedOrder.GSTAmount +
                                selectedOrder.AdditionalServiceCharges -
                                selectedOrder.DiscountAmount -
                                selectedOrder.TotalAdvance
                            : selectedOrder.TotalAmountWithoutGST +
                                selectedOrder.GSTAmount +
                                selectedOrder.AdditionalServiceCharges -
                                selectedOrder.DiscountAmount -
                                selectedOrder.TotalAdvance
                        )}
                      </Title>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Col>
          </Row>
        </div>
      </Col>
      <Col span={14}>
        <div className="checkoutRightDiv">
          <div>
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
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  type="number"
                  onKeyPress={(e) => {
                    if (
                      e.code === "Minus" ||
                      e.code === "NumpadSubtract" ||
                      e.code === "NumpadAdd"
                    ) {
                      e.preventDefault();
                    }
                  }}
                  height={10}
                />
              </Row>
              <Row style={{ marginTop: "15px", width: "100%" }} gutter={[8, 8]}>
                {supportingTable.Table7 &&
                  supportingTable.Table7.map((table, i) => {
                    if (selectedOrder.PaymentTypeId === null) {
                      return (
                        <>
                          <FormButton
                            colSpan={8}
                            onClick={() => handlePaymentOptionAdd(table)}
                            title={table.PaymentMode}
                            type="primary"
                            className="newButton"
                          />
                        </>
                      );
                    } else {
                      if (
                        selectedOrder.PaymentTypeId === table.PaymentModeId ||
                        table.IsFoc === true
                      ) {
                        return (
                          <div>
                            <FormButton
                              onClick={() => handlePaymentOptionAdd(table)}
                              title={table.PaymentMode}
                              type="primary"
                            />
                          </div>
                        );
                      }
                    }
                  })}
              </Row>
              <Row style={{ width: "100%" }}>
                <Col span={24}>
                  <Table
                    rowSelection={false}
                    columns={peymentTableCols}
                    dataSource={payments}
                    style={{ marginTop: 16 }}
                    selectable={false}
                  />
                </Col>
              </Row>
            </Row>
          </div>
          <Row>
            <Row
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Row
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Title
                  style={{
                    color: "#707070",
                    margin: 0,
                  }}
                  level={4}
                >
                  Return Amount:
                </Title>
                &nbsp;
                <Title
                  style={{
                    color: "rgb(51, 111, 196)",
                    margin: 0,
                  }}
                  level={2}
                >
                  {parseFloat(returnAmount).toFixed(2)}
                </Title>
              </Row>
            </Row>
          </Row>
        </div>
      </Col>
    </div>
  );

  /**
   * Close the Checkout Drawer
   */
  const closePaymentForm = () => {
    setPayments([]);
    setReturnAmount(0);
    dispatch({
      type: SET_POS_STATE,
      payload: {
        name: "billPaymentOptionModal",
        value: false,
      },
    });
  };

  return (
    <div
      style={{
        position: "relative",
        height: "100%",
        overflow: "hidden",
        textAlign: "center",
        background: "#fafafa",
        backgroundColor: "white",
        borderRadius: 2,
        padding: 10,
      }}
    >
      <Collapse accordion style={{ marginBottom: 10 }}>
        <Panel header="Search Order" key="1">
          <form
            style={{ gap: "10px", alignItems: "flex-end" }}
            onSubmit={handleSearchSubmit}
          >
            <Row
              style={{ gap: "10px", alignItems: "flex-end" }}
              gutter={[10, 10]}
            >
              <FormTextField
                colSpan={6}
                label="Phone No"
                size={INPUT_SIZE}
                name="CustomerPhone"
                onChange={handleSearchFieldChange}
                isNumber="true"
                type="text"
              />
              <FormTextField
                colSpan={6}
                label="Order No"
                size={INPUT_SIZE}
                name="OrderNumber"
                onChange={handleSearchFieldChange}
                isNumber="true"
              />
              <FormTextField
                colSpan={6}
                label="Customer Name"
                size={INPUT_SIZE}
                name="CustomerName"
                onChange={handleSearchFieldChange}
              />
              <FormSelect
                colSpan={5}
                listItem={supportingTable.Table2 || []}
                idName="OrderStatusId"
                valueName="OrderStatus"
                size={INPUT_SIZE}
                name="StatusId"
                label="Status"
                value={searchFields.StatusId || ""}
                onChange={handleSelectChange}
              />
              <FormSelect
                colSpan={5}
                listItem={supportingTable.Table3 || []}
                idName="BranchId"
                valueName="BranchName"
                size={INPUT_SIZE}
                name="BranchId"
                label="Branch"
                value={searchFields.BranchId || ""}
                onChange={handleSelectChange}
              />
              <FormSelect
                colSpan={5}
                listItem={supportingTable.Table4 || []}
                idName="AreaId"
                valueName="AreaName"
                size={INPUT_SIZE}
                name="AreaId"
                label="Area"
                value={searchFields.AreaId || ""}
                onChange={handleSelectChange}
              />
              <FormSelect
                colSpan={5}
                listItem={supportingTable.Table10 || []}
                idName="OrderSourceId"
                valueName="OrderSource"
                size={INPUT_SIZE}
                name="OrderSourceId"
                label="Order Source"
                value={searchFields.OrderSourceId || ""}
                onChange={handleSelectChange}
              />
              <FormTextField
                type="date"
                style={{ width: "100%" }}
                label="Date From"
                defaultValue={moment(new Date(), "YYYY-MM-DD")}
                onChange={(e) => {
                  dispatch({
                    type: SET_POS_STATE,
                    payload: {
                      name: "FromDate",
                      value: e.value + " " + "00:00:00.000",
                    },
                  });
                  DateRefFrom.current = e.value + " " + "00:00:00.000";
                  setSearchFields({
                    ...searchFields,
                    DateFrom: e.value + " " + "00:00:00.000",
                  });
                }}
              />

              <FormTextField
                type="date"
                label="Date To"
                style={{ width: "100%" }}
                defaultValue={moment(new Date(), "YYYY-MM-DD")}
                onChange={(e) => {
                  dispatch({
                    type: SET_POS_STATE,
                    payload: {
                      name: "ToDate",
                      value: e.value + " " + "00:00:00.000",
                    },
                  });
                  DateRefTo.current = e.value + " " + "00:00:00.000";
                  setSearchFields({
                    ...searchFields,
                    DateTo: e.value + " " + "00:00:00.000",
                  });
                }}
              />
              <FormButton
                title="Search"
                type="primary"
                icon={<SearchOutlined />}
                htmlType="submit"
              />
            </Row>
          </form>
        </Panel>
      </Collapse>
      <Tabs
        onChange={(event) => {
          callback(event, itemList);
        }}
        type="card"
        className="ant-tabs-custom"
      >
        {IsPos === true && (
          <TabPane
            tab={
              <>
                <span
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {dineInOrders.length > 0 && (
                    <p
                      style={{
                        color:
                          selectedTabId === 2 ? "#fff" : "rgb(69, 97, 185)",
                        background:
                          selectedTabId === 2 ? "rgb(69, 97, 185)" : "#fff",
                        borderRadius: 50,
                        marginRight: 10,
                        marginBottom: 0,
                        padding: "2px 5px",
                      }}
                    >
                      {dineInOrders.length}
                    </p>
                  )}
                  Dine In
                </span>
                <span
                  style={{
                    fontSize: 10,
                    position: "absolute",
                    right: 0,
                    left: 0,
                    bottom: 0,
                    color:
                      selectedTabId === 1 ? "whitesmoke" : "rgb(69, 97, 185)",
                  }}
                >
                  (Shift + 1)
                </span>
              </>
            }
            key="1"
          ></TabPane>
        )}
        <TabPane
          tab={
            <>
              <span
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {deliveryOrder.length > 0 && (
                  <p
                    style={{
                      color: selectedTabId === 2 ? "rgb(69, 97, 185)" : "#fff",
                      background:
                        selectedTabId === 2 ? "#fff" : "rgb(69, 97, 185)",
                      borderRadius: 50,
                      marginRight: 10,
                      marginBottom: 0,
                      padding: "2px 5px",
                    }}
                  >
                    {deliveryOrder.length}
                  </p>
                )}
                Delivery
              </span>
              <span
                style={{
                  fontSize: 10,
                  position: "absolute",
                  right: 0,
                  left: 0,
                  bottom: 0,
                  color:
                    selectedTabId === 2 ? "whitesmoke" : "rgb(69, 97, 185)",
                }}
              >
                (Shift + 2)
              </span>
            </>
          }
          key="2"
        ></TabPane>
        <TabPane
          tab={
            <>
              <span
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {takeawayOrders.length > 0 && (
                  <p
                    style={{
                      color: selectedTabId === 2 ? "rgb(69, 97, 185)" : "#fff",
                      background:
                        selectedTabId === 2 ? "#fff" : "rgb(69, 97, 185)",
                      borderRadius: 50,
                      marginRight: 10,
                      marginBottom: 0,
                      padding: "2px 5px",
                    }}
                  >
                    {takeawayOrders.length}
                  </p>
                )}
                Take Away
              </span>
              <span
                style={{
                  fontSize: 10,
                  position: "absolute",
                  right: 0,
                  left: 0,
                  bottom: 0,
                  color:
                    selectedTabId === 3 ? "whitesmoke" : "rgb(69, 97, 185)",
                }}
              >
                (Shift + 3)
              </span>
            </>
          }
          key="3"
        ></TabPane>
        <TabPane
          tab={
            <>
              <span
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {finishwasteOrders.length > 0 && (
                  <p
                    style={{
                      color: selectedTabId === 2 ? "rgb(69, 97, 185)" : "#fff",
                      background:
                        selectedTabId === 2 ? "#fff" : "rgb(69, 97, 185)",
                      borderRadius: 50,
                      marginRight: 10,
                      marginBottom: 0,
                      padding: "2px 5px",
                    }}
                  >
                    {finishwasteOrders.length}
                  </p>
                )}
                Finished / Waste
              </span>
            </>
          }
          key="4"
        ></TabPane>

        <TabPane
          tab={
            <>
              <span
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <p
                  style={{
                    color: selectedTabId === 2 ? "rgb(69, 97, 185)" : "#fff",
                    background:
                      selectedTabId === 2 ? "#fff" : "rgb(69, 97, 185)",
                    borderRadius: 50,
                    marginRight: 10,
                    marginBottom: 0,
                    padding: "2px 5px",
                  }}
                >
                  {holdOrders?.length}
                </p>
                Hold Order
              </span>
              <span
                style={{
                  fontSize: 10,
                  position: "absolute",
                  right: 0,
                  left: 0,
                  bottom: 0,
                  color:
                    selectedTabId === 5 ? "whitesmoke" : "rgb(69, 97, 185)",
                }}
              >
                (Shift + 4)
              </span>
            </>
          }
          key="5"
        ></TabPane>
      </Tabs>
      <PosTable
        loading={tableLoading}
        orderData={orderToShow}
        onClick={handleDrawer}
        supportingTable={supportingTable}
        selectedTabId={selectedTabId}
        editHoldOrder={editHoldOrder}
        deleteHoldOrder={deleteHoldOrder}
      />
      <Drawer
        closable={false}
        // title={title}
        placement={"bottom"}
        height="48vh"
        onClose={closeDrawer}
        visible={posState.selectedOrderModal}
        style={{
          position: "absolute",
        }}
        getContainer={false}
        className="orderDetailDrawer"
      >
        <Row>
          <Col span={15} style={{ overflow: "auto", height: 308, padding: 2 }}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignSelf: "flex-start",
                  width: "100%",
                }}
              >
                <h1>
                  {selectedOrder.CustomerName} -&nbsp;{" "}
                  {selectedOrder.OrderModeId === DINE_IN
                    ? "Dine In"
                    : selectedOrder.OrderModeId === DELIVERY
                    ? "Delivery"
                    : selectedOrder.OrderModeId === TAKE_AWAY
                    ? "Take Away"
                    : selectedOrder.OrderModeId === FINISHED_WASTE
                    ? "Finish Waste"
                    : ""}
                  {selectedOrder.IsAdvanceOrder && " | Advance Order"}
                </h1>
              </div>
              <div
                style={{ display: "flex", flexDirection: "row", height: 35 }}
              >
                <AiOutlineShoppingCart
                  style={{
                    display: "flex",
                    alignSelf: "flex-end",
                    marginRight: 15,
                    width: 25,
                  }}
                  size={30}
                />
                <div
                  style={{
                    background: "#4561b9",
                    borderRadius: 50,
                    height: 20,
                    width: 20,
                    position: "absolute",
                    marginLeft: 15,
                  }}
                >
                  <p style={{ color: "#fff" }}>{orderItemsDetail.length}</p>
                </div>
              </div>
            </div>
            <Table
              columns={columnForDealOption}
              rowKey={(record) => record.OrderDetailId}
              dataSource={orderItemsDetail}
              pagination={false}
              className="posOrderDetailTable"
            />
          </Col>
          <Col
            span={9}
            style={{
              padding: "15px 0 0 20px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Col>
              <div style={{ display: "flex", alignSelf: "flex-start" }}>
                Status
              </div>
              <Col>
                <FormSelect
                  colSpan={24}
                  listItem={orderStatusList.filter((e) => {
                    if (selectedTabId === 2) {
                      return e.IsDelivery === true;
                    }
                    if (selectedTabId === 3) {
                      return e.IsTakeAway === true;
                    }
                    if (selectedTabId === 1) {
                      return e.IsDineIn === true;
                    }
                    if (selectedTabId === 4) {
                      return e.IsFinishWaste === true;
                    }
                  })}
                  disabled={
                    userData.RoleId === COMPANY_ADMIN
                      ? true
                      : cancelOrderStatusObj?.OrderStatusId === orderStatus
                      ? true
                      : selectedOrder.IsPaid
                      ? true
                      : selectedOrder.IsRefund
                      ? true
                      : false
                  }
                  idName="OrderStatusId"
                  valueName="OrderStatus"
                  size={INPUT_SIZE}
                  name="OrderStatusId"
                  // label="Status"
                  value={orderStatus || ""}
                  onChange={handleStatusChange}
                />
              </Col>
            </Col>
            <table>
              <tbody>
                {selectedOrder.OrderModeId === DELIVERY && (
                  <>
                    <tr>
                      <td style={{ textAlign: "left" }}>
                        <b>Delivery Time</b>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <b> {selectedOrder.DeliveryTime} </b>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ textAlign: "left" }}>
                        <b>Delivery Charges</b>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <b>
                          {parseFloat(selectedOrder.DeliveryCharges).toFixed(2)}
                        </b>
                      </td>
                    </tr>
                  </>
                )}
                <tr>
                  <td style={{ textAlign: "left" }}>
                    <b>Sub Total</b>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <b>{getFloatValue(selectedOrder.TotalAmountWithoutGST)}</b>
                  </td>
                </tr>
                <tr>
                  <td style={{ textAlign: "left" }}>
                    <b>Tax</b>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <b> {getFloatValue(selectedOrder.GSTAmount)} </b>
                  </td>
                </tr>
                <tr>
                  <td style={{ textAlign: "left" }}>
                    <b>Discount</b>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <b>{getFloatValue(selectedOrder.DiscountAmount)}</b>
                  </td>
                </tr>
                <tr>
                  <td style={{ textAlign: "left" }}>
                    <b>Additional Charges</b>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <b>
                      {getFloatValue(selectedOrder.AdditionalServiceCharges)}
                    </b>
                  </td>
                </tr>
                <tr>
                  <td style={{ textAlign: "left" }}>
                    <b>Advance</b>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <b>{getFloatValue(selectedOrder.TotalAdvance)}</b>
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      textAlign: "left",
                      fontSize: 18,
                      fontWeight: "bold",
                    }}
                  >
                    Payable
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      fontSize: 18,
                      fontWeight: "bold",
                    }}
                  >
                    {getFloatValue(
                      selectedOrder.TotalAmountWithoutGST +
                        selectedOrder.DeliveryCharges +
                        selectedOrder.AdditionalServiceCharges +
                        selectedOrder.GSTAmount -
                        selectedOrder.DiscountAmount -
                        selectedOrder.TotalAdvance
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
            {IsPos === true && (
              <div>
                {userData.RoleId !== COMPANY_ADMIN && (
                  <div>
                    <Row
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        display: "flex",
                        flexDirection: "row",
                      }}
                    >
                      <ReactToPrint content={() => componentRef.current}>
                        <PrintContextConsumer>
                          {({ handlePrint }) => (
                            <Button
                              style={{
                                width: "30%",
                                height: "60px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                // flexDirection: "column",
                                gap: "7px",
                              }}
                              icon={<FaReceipt fontSize={22} />}
                              type="primary"
                              onClick={() => {
                                handlePrinting(handlePrint);
                              }}
                              disabled={
                                selectedOrder.IsPaid === true ||
                                (cancelOrderStatusObj &&
                                  cancelOrderStatusObj.OrderStatusId ===
                                    orderStatus) ||
                                selectedOrder.IsKot === 1 ||
                                userData.RoleId === AGENT ||
                                userData.RoleId === DISPATCHER
                              }
                            >
                              KOT
                            </Button>
                          )}
                        </PrintContextConsumer>
                      </ReactToPrint>
                      <FormTileButton
                        title="CHECKOUT"
                        width="65%"
                        height="60px"
                        margin={"5px"}
                        color="green"
                        gap="5"
                        icon={<AiOutlineShoppingCart fontSize={26} />}
                        type="primary"
                        onClick={() => {
                          // setBillPaymentOptionModal(true);
                          // setParentCheckOutOrderModal(true);
                          if (
                            posState.selectedOrder.OrderModeId === DELIVERY &&
                            !posState.riderId
                          ) {
                            message.error("Please select a rider first!");
                          } else {
                            dispatch({
                              type: SET_POS_STATE,
                              payload: {
                                name: "billPaymentOptionModal",
                                value: true,
                              },
                            });
                          }
                        }}
                        disabled={
                          selectedOrder.IsRefund || selectedOrder.IsFinishWaste
                            ? true
                            : selectedOrder.IsPaid === true ||
                              (cancelOrderStatusObj &&
                                cancelOrderStatusObj.OrderStatusId ===
                                  orderStatus) ||
                              userData.RoleId === AGENT ||
                              userData.RoleId === DISPATCHER
                        }
                      />
                    </Row>
                  </div>
                )}
              </div>
            )}
          </Col>
        </Row>
      </Drawer>
      <div style={{ display: "none" }}>
        {posState.KOTPrint !== "" && (
          <ComponentToPrint ref={componentRef} Bill={posState.KOTPrint} />
        )}
      </div>
      <div style={{ display: "none" }}>
        {posState.HTMLBill !== "" && (
          <ComponentToPrint
            ref={componentRefForBill}
            Bill={posState.HTMLBill}
          />
        )}
      </div>
      <div style={{ display: "none" }}>
        {posState.SalesReceiptHtmlTemplate !== "" && (
          <ComponentToPrint
            ref={componentRefForSaleRecipt}
            Bill={posState.SalesReceiptHtmlTemplate}
          />
        )}
      </div>
      <CheckoutDrawer
        visible={posState.billPaymentOptionModal}
        closeForm={closePaymentForm}
        formWidth={"730px"}
        formPanel={formPanelForCheckOut}
        disableForm={false}
        formLoading={doneCheckOutLoading}
        handleFormSubmit={(e) => {
          e.preventDefault();
          doneCheckOut(handlePrintSaleRecipt);
        }}
        ref={btnRef}
      />
    </div>
  );
};

export default OrderTabs;
