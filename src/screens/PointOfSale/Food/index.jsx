import React, { useState, useRef, useEffect } from "react";
import { Button, Col, message, Popconfirm, Radio, Row, Space } from "antd";
import { useDispatch, useSelector } from "react-redux";
import QRCode from "react-qr-code";
import FormTileButton from "../../../components/general/FormTileButton";
import OrderTabs from "../../../components/PosComponentsFood/OrderTabs";
import {
  OPEN_CUSTOMER_TABLE,
  SET_DAY_SHIFT_TERMINAL_MODAL,
  SET_GST,
  SET_GST_AMOUNT,
  SET_ORDER_SOURCE_LIST,
  SET_POS_STATE,
  SET_RECALL_ORDER,
  TOGGLE_ORDER_DETAIL,
  UPDATE_PRODUCT_CART,
} from "../../../redux/reduxConstants";
import CustomerTable from "./CustomerTable";
import PunchScreen from "./PunchScreen";
import "./style.css";
import { AiOutlinePlus } from "react-icons/ai";
import { AiOutlineRollback } from "react-icons/ai";
import { AiOutlineClose } from "react-icons/ai";
import { AiOutlineUserSwitch } from "react-icons/ai";
import { CgArrowsExchangeAlt } from "react-icons/cg";
import { GiTable } from "react-icons/gi";
import { RiEBike2Fill } from "react-icons/ri";
import { MdReceipt } from "react-icons/md";
import { FaRegStopCircle } from "react-icons/fa";
import {
  setInitialState,
  submitForm,
} from "../../../redux/actions/basicFormAction";
import ComplaintManagementModal from "./ComplaintManagementModal";
import AddCustomerModal from "./AddCustomerModal";
import { postRequest } from "../../../services/mainApp.service";
import ComponentToPrint from "../../../components/specificComponents/ComponentToPrint";
import ReactToPrint, {
  PrintContextConsumer,
  useReactToPrint,
} from "react-to-print";
import { useNavigate } from "react-router-dom";
import { rewriteRecallData } from "../../../functions/rewriteObject";
import ChangeWaiterPopUp from "./ChangeWaiterPopUp";
import ChangeCoverPopUp from "./ChangeCoverPopUp";
import TableTransferPopUp from "./TableTransferPopUp";
import {
  AGENT,
  BRANCH_ADMIN,
  CASHIER,
  COMPANY_ADMIN,
  CONSOLIDATED_KOT,
  DAY_SHIFT_TERMINAL,
  DELIVERY,
  DINE_IN,
  DISPATCHER,
  DUPLICATE_SALE_RECIEPT,
  KOT_TEMPLATE,
  PRE_PAYMENT_BILL,
  TAKE_AWAY,
} from "../../../common/SetupMasterEnum";
import LoginModal from "./LoginModal";
import DayShiftTerminalModal from "./DayShiftTerminalModal";
import AssignRiderPopUp from "./AssignRiderPopUp";
import ExpenseModal from "./ExpenseModal";
import ChangePaymentTypePopUp from "./ChangePaymentTypePopUp";
import ModalComponent from "../../../components/formComponent/ModalComponent";
import {
  generateDuplicateSaleReceipt,
  prePaymentHelper,
} from "../../../components/PosComponentsFood/printHelpers";
import {
  getDate,
  getFullTime,
  getTime,
} from "../../../functions/dateFunctions";
import { isNullValue } from "../../../functions/generalFunctions";
import FinancialReportModal from "../../../components/PosComponentsFood/FinancialReportModal";
import FBRImage from "../../../assets/images/pos.png";
import SRBImage from "../../../assets/images/srbPOS.png";
// import RadioButtonGroupModal from "../../../.components/PosComponentsFood/RadioButtonGroupModal";

const initialFormValues = {
  BranchId: null,
  AreaId: null,
  OrderNumber: "",
  CustomerId: null,
  CustomerName: "%%",
  CustomerPhone: "%%",
  OrderModeId: null,
  OrderSourceId: null,
  DateFrom: "",
  DateTo: "",
  StatusId: null,
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

const popupIntialFormValues = {
  OrderMasterId: null,
  OperationId: null,
  BranchId: null,
  UserId: null,
  TableId: null,
  WaiterId: null,
  RiderId: null,
};

const PointOfSaleFood = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const BillPrintHtmlTemplate = useRef;
  let btnRef = useRef();
  const componentRefForSaleRecipt = useRef(null);

  const handlePrintSaleRecipt = useReactToPrint({
    content: () => componentRefForSaleRecipt.current,
  });

  const [searchDates, setSearchDates] = useState({ DateFrom: "", DateTo: "" });
  const [parentKey, setParentKey] = useState(0);
  const [closeDrawerParent, setCloseDrawerParent] = useState(false);

  const componentRefPrint = useRef();
  // const handlePrint = useReactToPrint({
  //   content: () => componentRefPrint.current,
  // });

  const userData = useSelector((state) => state.authReducer);
  const [discountModel, setDiscountModel] = useState(false);
  const controller = new window.AbortController();
  const { supportingTable } = useSelector((state) => state.basicFormReducer);
  const complaintTypes = supportingTable.Table5 ? supportingTable.Table5 : [];
  const complaintCategories = supportingTable.Table6
    ? supportingTable.Table6
    : [];

  const { selectedOrder, seletedOrderItems, cancelOrderStatusObj, HTMLBill } =
    useSelector((state) => state.PointOfSaleReducer);

  const [discounts, setDiscounts] = useState([]);
  const [supportingDiscounts, setSupportingDiscounts] = useState([]);

  const { IsPos, RoleId } = useSelector((state) => state.authReducer);
  const [saleReturnPrintTemplate, setSaleReturnPrintTemplate] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddCustModalVisible, setIsAddCustModalVisible] = useState(false);
  const [expenseModal, setExpenseModal] = useState(false);
  const [expenseData, setExpenseData] = useState({
    ExpenseAmount: 0,
    ExpenseDate: new Date(Date.now()),
    ExpenseType: "",
  });
  const [dstModal, setDstModal] = useState({
    shiftModal: false,
    terminalModal: false,
    dayModal: false,
  });
  const [modalLoading, setModalLoading] = useState(false);
  const [selectRiderModal, setSelectRiderModal] = useState(false);
  const [riders, setRiders] = useState([]);
  const [supportingRiders, setSupportingRiders] = useState([]);
  const [visibleAuthModal, setVisibleAuthModal] = useState(false);
  const [visibleAuthModal2, setVisibleAuthModal2] = useState(false);
  const [visibleAuthModaRefund, setVisibleAuthModaRefund] = useState(false);
  const [saleReturnModal, setSaleReturnModal] = useState(false);
  const [selectedOrderItemsM, setSelectedOrderItemsM] = useState([]);
  const posState = useSelector((state) => state.PointOfSaleReducer);
  const authState = useSelector((state) => state.authReducer);
  const [isWaiterOpen, setIsWaiterOpen] = useState(false);
  const [isRiderOpen, setIsRiderOpen] = useState(false);
  const [isCoverOpen, setIsCoverOpen] = useState(false);
  const [isTableOpen, setIsTableOpen] = useState(false);
  const [isChangePaymentTypeOpen, setIsChangePaymentTypeOpen] = useState(false);
  const [holdOrders, setHoldOrders] = useState(0);
  const [checkOutSelectedOrder, setCheckOutSelectedOrder] = useState(false);
  const [parentCheckoutOrderModal, setParentCheckOutOrderModal] =
    useState(false);
  const [parentKotPrint, setParentKotPrint] = useState(false);
  const [financialModal, setFinancialModal] = useState(false);
  const [data, setData] = useState([]);

  const [dstDetail, setDstDetail] = useState({
    BusinessDayId: 0,
    ShiftDetailId: 0,
    TerminalDetailId: 0,
  });

  const handlePrint = useReactToPrint({
    content: () => componentRefPrint.current,
  });

  const addCustomer = () => {
    setIsAddCustModalVisible(true);
  };

  const closeAddCustModal = () => {
    setIsAddCustModalVisible(false);
  };

  const launchComplain = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const toggleWaiterPopUp = () => {
    setIsWaiterOpen(!isWaiterOpen);
  };

  const toggleCoverPopUp = () => {
    setIsCoverOpen(!isCoverOpen);
  };
  const toggleTableTransfter = () => {
    setIsTableOpen(!isTableOpen);
  };
  const storeRef = (value, idName) => {
    if (idName === "tableId") setIsTableOpen(false);

    if (idName === "waiterId") setIsWaiterOpen(false);
  };
  const closeModalOnOk = (modalName) => {
    if (modalName === "table") setIsTableOpen(false);
    if (modalName === "waiter") setIsWaiterOpen(false);
  };
  const toggleRiderPopUp = () => {
    setIsRiderOpen(!isRiderOpen);
  };

  const toggleChangePaymentType = () => {
    setIsChangePaymentTypeOpen(!isChangePaymentTypeOpen);
  };

  const setLocalState = (data) => {
    localStorage.setItem(DAY_SHIFT_TERMINAL, JSON.stringify(data));
  };
  const getLocalState = () => {
    return JSON.parse(localStorage.getItem(DAY_SHIFT_TERMINAL));
  };

  const handleKeyDown = (event) => {
    if (event.shiftKey && event.keyCode == 78) {
      if (
        (RoleId === CASHIER || RoleId === AGENT) &&
        dstDetail.TerminalDetailId !== 0
      ) {
        startNewOrder();
        dispatch({ type: TOGGLE_ORDER_DETAIL });
      }
      return;
    }
    if (event.shiftKey && event.keyCode == 67) {
      if (
        userData.RoleId !== COMPANY_ADMIN &&
        Object.keys(selectedOrder).length !== 0 &&
        selectedOrder.IsPaid === false &&
        selectedOrder.OrderStatusId &&
        cancelOrderStatusObj &&
        selectedOrder.OrderStatusId !== cancelOrderStatusObj.OrderStatusId
      ) {
        cancelOrder();
        return;
      }
    }

    if (event.shiftKey && event.keyCode == 81) {
      if (
        userData.RoleId !== COMPANY_ADMIN &&
        Object.keys(selectedOrder).length !== 0 &&
        selectedOrder.IsPaid === false &&
        selectedOrder.OrderStatusId &&
        cancelOrderStatusObj &&
        selectedOrder.OrderStatusId !== cancelOrderStatusObj.OrderStatusId
      ) {
        recallOrder();
        dispatch({ type: TOGGLE_ORDER_DETAIL });
        return;
      }
    }
    if (event.shiftKey && event.keyCode == 76) {
      if (
        userData.RoleId !== COMPANY_ADMIN &&
        Object.keys(selectedOrder).length !== 0 &&
        selectedOrder.IsPaid === false &&
        selectedOrder.OrderStatusId &&
        cancelOrderStatusObj &&
        selectedOrder.OrderStatusId !== cancelOrderStatusObj.OrderStatusId
      ) {
        launchComplain();
        return;
      }
    }

    if (event.shiftKey && event.keyCode == 87) {
      if (
        userData.RoleId !== COMPANY_ADMIN &&
        Object.keys(selectedOrder).length !== 0 &&
        selectedOrder.IsPaid === false &&
        selectedOrder.OrderStatusId &&
        cancelOrderStatusObj &&
        selectedOrder.OrderStatusId !== cancelOrderStatusObj.OrderStatusId &&
        selectedOrder.OrderModeId !== TAKE_AWAY &&
        selectedOrder.OrderModeId !== DELIVERY
      ) {
        toggleWaiterPopUp();
        return;
      }
    }

    if (event.shiftKey && event.keyCode == 79) {
      if (
        userData.RoleId !== COMPANY_ADMIN &&
        Object.keys(selectedOrder).length !== 0 &&
        selectedOrder.IsPaid === false &&
        selectedOrder.OrderStatusId &&
        cancelOrderStatusObj &&
        selectedOrder.OrderStatusId !== cancelOrderStatusObj.OrderStatusId &&
        selectedOrder.OrderModeId !== TAKE_AWAY &&
        selectedOrder.OrderModeId !== DELIVERY
      ) {
        toggleCoverPopUp();
        return;
      }
    }

    if (event.shiftKey && event.keyCode == 84) {
      if (
        userData.RoleId !== COMPANY_ADMIN &&
        Object.keys(selectedOrder).length !== 0 &&
        selectedOrder.IsPaid === false &&
        selectedOrder.OrderStatusId &&
        cancelOrderStatusObj &&
        selectedOrder.OrderStatusId !== cancelOrderStatusObj.OrderStatusId &&
        selectedOrder.OrderModeId !== TAKE_AWAY &&
        selectedOrder.OrderModeId !== DELIVERY
      ) {
        toggleTableTransfter();
        return;
      }
    }

    if (event.shiftKey && event.keyCode == 82) {
      if (
        userData.RoleId !== COMPANY_ADMIN &&
        Object.keys(selectedOrder).length !== 0 &&
        selectedOrder.IsPaid === false &&
        selectedOrder.OrderStatusId &&
        cancelOrderStatusObj &&
        selectedOrder.OrderStatusId !== cancelOrderStatusObj.OrderStatusId &&
        selectedOrder.OrderModeId !== TAKE_AWAY &&
        selectedOrder.OrderModeId !== DINE_IN
      ) {
        toggleRiderPopUp();
        return;
      }
    }
    if (event.shiftKey && event.keyCode == 66) {
      if (
        userData.RoleId !== COMPANY_ADMIN &&
        Object.keys(selectedOrder).length !== 0 &&
        selectedOrder.IsPaid === false &&
        selectedOrder.OrderStatusId &&
        cancelOrderStatusObj &&
        selectedOrder.OrderStatusId !== cancelOrderStatusObj.OrderStatusId
      ) {
        if (selectedOrder.OrderModeId === DELIVERY) {
          if (posState.riderId !== null) {
            handlePrinting(handlePrint, false);
            return;
          }
        } else {
          handlePrinting(handlePrint, false);
          return;
        }
      }
    }

    if (event.shiftKey && event.keyCode == 68) {
      if (selectedOrder.IsPaid === true) {
        handlePrinting(handlePrint, true);
        return;
      }
    }

    if (event.shiftKey && event.keyCode == 80) {
      if (
        userData.RoleId !== COMPANY_ADMIN &&
        Object.keys(selectedOrder).length !== 0 &&
        selectedOrder.IsPaid === false &&
        selectedOrder.OrderStatusId &&
        cancelOrderStatusObj &&
        selectedOrder.OrderStatusId !== cancelOrderStatusObj.OrderStatusId
      ) {
        toggleChangePaymentType();
        return;
      }
    }

    if (event.shiftKey && event.keyCode == 65) {
      if (
        userData.RoleId !== COMPANY_ADMIN &&
        Object.keys(selectedOrder).length !== 0 &&
        selectedOrder.IsPaid === false &&
        selectedOrder.OrderStatusId &&
        cancelOrderStatusObj &&
        selectedOrder.OrderStatusId !== cancelOrderStatusObj.OrderStatusId
      ) {
        applyDiscount();
        return;
      }
    }
    if (event.shiftKey && event.keyCode == 49) {
      setParentKey(1);
      return;
    }
    if (event.shiftKey && event.keyCode == 50) {
      setParentKey(2);
      return;
    }
    if (event.shiftKey && event.keyCode == 51) {
      setParentKey(3);
      return;
    }
    if (event.shiftKey && event.keyCode == 52) {
      setParentKey(5);
      return;
    }
    if (event.shiftKey && event.keyCode == 90) {
      setCloseDrawerParent(true);
      return;
    }

    if (event.ctrlKey && event.shiftKey && event.keyCode == 88) {
      if (
        Object.keys(selectedOrder).length !== 0 &&
        cancelOrderStatusObj.OrderStatusId !== selectedOrder.OrderStatusId &&
        selectedOrder.IsPaid === false
      ) {
        dispatch({
          type: SET_POS_STATE,
          payload: {
            name: "billPaymentOptionModal",
            value: true,
          },
        });
        return;
      }
    }

    if (event.shiftKey && event.keyCode == 75) {
      if (
        Object.keys(selectedOrder).length !== 0 &&
        cancelOrderStatusObj.OrderStatusId !== selectedOrder.OrderStatusId &&
        selectedOrder.IsPaid === false &&
        selectedOrder.IsKot === 0
      ) {
        setParentKotPrint(true);
        return;
      }
    }
    if (event.ctrlKey && event.shiftKey && event.keyCode == 86) {
      if (posState.billPaymentOptionModal === true) {
        setCheckOutSelectedOrder(true);
        return;
      }
    }
    if (event.ctrlKey && event.shiftKey && event.keyCode == 70) {
      if (posState.billPaymentOptionModal === true) {
        dispatch({
          type: SET_POS_STATE,
          payload: {
            name: "billPaymentOptionModal",
            value: false,
          },
        });
        return;
      }
    }
    if (event.shiftKey && event.keyCode == 69) {
      // if (dstDetail.TerminalDetailId > 0) {
      setDstModal({ ...dstModal, terminalModal: true });
      // }
    }
    if (event.altKey && event.shiftKey && event.keyCode == 83) {
      if (
        (RoleId !== BRANCH_ADMIN || RoleId !== CASHIER) &&
        dstDetail.ShiftDetailId === 0 &&
        dstDetail.BusinessDayId !== 0
      ) {
      }
    }
    if (event.altKey && event.shiftKey && event.keyCode == 77) {
      if (
        RoleId === CASHIER &&
        dstDetail.ShiftDetailId !== 0 &&
        dstDetail.TerminalDetailId === 0
      ) {
        setDSTstate(5);
      }
    }
    if (event.altKey && event.shiftKey && event.keyCode == 68) {
      if (
        RoleId === CASHIER &&
        dstDetail.ShiftDetailId === 0 &&
        dstDetail.TerminalDetailId === 0
      ) {
        setDSTstate(3);
      }
    }
    if (event.keyCode === 27) {
      navigate("/");
      return;
    }
  };

  useEffect(() => {
    setSelectedOrderItemsM(
      seletedOrderItems?.map((item) => {
        return {
          ...item,
          ReturnQuantity: 0,
          SalesReturnId: null,
          ReturnAmount: item.PriceWithoutGST,
        };
      })
    );
  }, [selectedOrder]);

  useEffect(() => {
    setDstDetail(getLocalState());
    if (RoleId === AGENT) {
      postRequest("CrudOrderSource", {
        SetupDetailName: "",
        Flex1: "",
        Flex2: "",
        Flex3: "",
        OrderModeId: null,
        OperationId: 6,
        CompanyId: userData.CompanyId,
        UserId: userData.UserId,
        UserIP: "1.1.1.1",
      })
        .then((response) => {
          dispatch({
            type: SET_ORDER_SOURCE_LIST,
            payload: response.data.DataSet.Table,
          });
        })
        .catch((error) => console.error(error));
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedOrder, posState.billPaymentOptionModal, dstDetail]);

  // posState.punchDrawer
  const setDSTstate = (operationId) => {
    postRequest(
      "/BusinessDayShiftTerminal",
      {
        ...getLocalState(),
        BranchId: userData.branchId,
        OperationId: operationId,
        CompanyId: userData.CompanyId,
        UserId: userData.UserId,
        UserIP: "12.1.1.2",
      },
      controller
    )
      .then((response) => {
        setModalLoading(false);
        let data1;
        if (response.data.DataSet.Table[0].HasError === 1) {
          data1 = response.data.DataSet.Table1[0];
          message.error(response.data.DataSet.Table[0].Message);
          return;
        }
        if (operationId === 3) {
          viewReport();
          setFinancialModal(true);
        }
        data1 = response.data.DataSet.Table1[0];
        setLocalState(data1);
        setDstDetail({ ...data1 });
        message.success(response.data.DataSet.Table[0].Message);
        if (userData.ShowDayEndReport === false) {
          gotoDashboard(data1);
        }
      })
      .catch((error) => console.error(error));
  };

  const gotoDashboard = (data1) => {
    if (
      data1.TerminalDetailId === 0 &&
      data1.ShiftDetailId === 0 &&
      data1.BusinessDayId === 0
    ) {
      navigate("/");
    }
  };

  const viewReport = () => {
    postRequest(
      "/PosReports",
      {
        OperationId: 4,
        BranchId: userData.branchId,
        DateFrom: getDate(),
        DateTo: getDate(),
        BusinessDayId: dstDetail.BusinessDayId,
        TerminalDetailId: null,
        ShiftDetailId: null,
        UserId: userData.UserId,
      },
      controller
    ).then((response) => {
      if (response.error === true) {
        message.error("Error");
      }
      if (response.data.response === false) {
        message.error(response.DataSet.Table.errorMessage);
        return;
      }
      setData(response.data.DataSet);
    });
  };

  const handleDayShiftChange = (data) => {
    dispatch({
      type: SET_DAY_SHIFT_TERMINAL_MODAL,
      payload: data,
    });
  };

  const getOrderList = () => {
    postRequest(
      "/GetOrder",
      {
        OperationId: 1,
        CompanyId: userData.CompanyId,
        UserId: userData.UserId,
        UserIP: "12.1.1.2",
        BranchId: selectedOrder.BranchId,
        AreaId: null,
        OrderNumber: selectedOrder.OrderNumber,
        CustomerId: null,
        CustomerName: "%%",
        CustomerPhone: "%%",
        OrderModeId: null,
        OrderSourceId: null,
        DateFrom: "",
        DateTo: "",
        StatusId: null,
        CityId: null,
      },
      controller
    ).then((res) => {
      const responce = res.data.DataSet.Table;
      const orderMas = responce.filter((item) => {
        if (selectedOrder.OrderMasterId === item.OrderMasterId) {
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
    });
  };
  const handlePrinting = (handlePrint, IsDuplicate) => {
    let template = posState?.templateList?.Table?.filter(
      (e) => e.TemplateTypeId == PRE_PAYMENT_BILL
    )[0]?.TemplateHtml; // HTMLBill;

    template = template.replace(
      "{branchAddress}",
      userData?.userBranchList.length > 0
        ? userData?.userBranchList[0]?.BranchAddress
        : ""
    );
    template = template.replace(
      "{gst}",
      posState.selectedOrder.GSTAmount.toFixed(2)
    );

    template = template.replace(
      "{specialInstruction}",
      posState.selectedOrder.SpecialInstruction == null ||
        posState.selectedOrder.SpecialInstruction == ""
        ? ""
        : `<tr><td style="text-align: right; font-weight: 500; border: 0; color: #000">${posState.selectedOrder.SpecialInstruction}</td></tr>`
    );
    template = template.replace(
      "{username}",
      `<tr><td style="text-align: left; font-weight: 500; border: 0; color: #000">Username: </td>
      <td style="text-align: right; font-weight: 500; border: 0; color: #000">${userData.UserName}</td></tr>`
    );
    template = template.replace("{fbrIntegration}", "");
    template = template.replace(
      "{gstPercents}",
      `{${posState.selectedOrder.GSTPercent.toFixed(2)}%}`
    );
    if (selectedOrder.OrderModeId === DELIVERY) {
      template = template.replace(
        "{customerName}",
        isNullValue(posState.selectedOrder.CustomerName) &&
        `<tr>
            <td style="text-align: left; font-weight: 500; border: 0; color: #000">Customer:</td>
            <td style="text-align: right; font-weight: 500; border: 0; color: #000">${posState.selectedOrder.CustomerName}
            </td>
          </tr>`
      );

      template = template.replace(
        "{address}",
        isNullValue(posState.selectedOrder.CompleteAddress)
          ? `<tr>
            <td style="text-align: left; font-weight: 500; border: 0; color: #000">Address:</td>
            <td style="text-align: right; font-weight: 500; border: 0; color: #000">${posState.selectedOrder.CompleteAddress}
            </td>
          </tr>
          
          `
          : `<tr>
            <td style="text-align: left; font-weight: 500; border: 0; color: #000">
              Address:
            </td>
            <td style="text-align: right; font-weight: 500; border: 0; color: #000">
              ${posState.selectedOrder.Address}
            </td>
          </tr>`
      );

      template = template.replace(
        "{phone}",
        isNullValue(posState.selectedOrder.PhoneNumber) &&
        `<tr>
            <td style="text-align: left; font-weight: 500; border: 0; color: #000">Phone #:</td>
            <td style="text-align: right; font-weight: 500; border: 0; color: #000">${posState.selectedOrder.PhoneNumber}
            </td>
          </tr>`
      );

      template = template.replace(
        "{rider}",
        isNullValue(posState.riderName)
          ? `<tr>
            <td style="text-align: left; font-weight: 500; border: 0; color: #000">Rider:</td>
            <td style="text-align: left; font-weight: 500; border: 0; color: #000">${posState.riderName}</td>
          </tr>`
          : `<tr></tr>`
      );
      template = template.replace(
        "{waiter}",

        `<tr></tr>`
      );
      template = template.replace("{table}", `<tr></tr>`);
    } else if (selectedOrder.OrderModeId === DINE_IN) {
      template = template.replace("{customerName}", "<tr></tr>");
      template = template.replace("{address}", "<tr></tr>");
      template = template.replace("{phone}", "<tr></tr>");
      template = template.replace(
        "{rider}",
        `<tr>
    
          </tr>`
      );
      template = template.replace(
        "{waiter}",
        isNullValue(posState.waiterName)
          ? `<tr>
            <td style="text-align: left; font-weight: 500; border: 0; color: #000">Waiter:</td>
            <td style="text-align: right; font-weight: 500; border: 0; color: #000">${posState.waiterName}</td>
          </tr>`
          : `<tr>
          </tr>`
      );
      template = template.replace(
        "{table}",
        isNullValue(posState.tableName)
          ? `<tr>
            <td style="text-align: left; font-weight: 500; border: 0; color: #000">Table:</td>
            <td style="text-align: right; font-weight: 500; border: 0; color: #000">${posState.tableName}</td>
          </tr>`
          : `<tr></tr>`
      );
    } else {
      // template = template.replace("{embadFields}", ``);
      template = template.replace("{customerName}", "<tr></tr>");
      template = template.replace("{address}", "<tr></tr>");
      template = template.replace("{phone}", "<tr></tr>");
      template = template.replace("{rider}", `<tr></tr>`);
      template = template.replace(
        "{waiter}",

        `<tr></tr>`
      );
      template = template.replace(
        "{table}",

        `<tr></tr>`
      );
    }

    if (IsDuplicate) {
      postRequest(
        "/GetOrder",
        {
          OperationId: 2,
          CompanyId: userData.CompanyId,
          UserId: userData.UserId,
          UserIP: "12.1.1.2",
          BranchId: selectedOrder.BranchId,
          AreaId: null,
          OrderNumber: selectedOrder.OrderNumber,
          CustomerId: null,
          CustomerName: "%%",
          CustomerPhone: "%%",
          OrderModeId: null,
          OrderSourceId: null,
          DateFrom: "",
          DateTo: "",
          StatusId: null,
          CityId: null,
        },
        controller
      ).then((e) => {
        const responce = e.data.DataSet.Table;
        template = generateDuplicateSaleReceipt(
          responce,
          posState,
          template,
          userData
        );

        //FBR QR
        if (isNullValue(posState.selectedOrder.FbrInvoiceId)) {
          let fbrQR = document.getElementById("qr-code-container")?.innerHTML;
          template = template.replace(
            "{fbrIntegration}",
            `<div style="display:flex; justify-content:space-between; align-items:center; margin:20px 5px">
        <div>
          <image style="width:50px; height:auto;" src="${FBRImage}"/></div>
        <div style="display:flex; flex-direction:column; text-align:center">
          <span><p style='color:black;  margin-right:10px;'>FBR Invoice Number</p></span>
          <span><p style='color:black;  margin-right:20px;'>${posState.selectedOrder.FbrInvoiceId}</p></span>
        </div>
        <div>${fbrQR}</div>

      </div>`
          );
          template = template.replace("{srbIntegration}", "");
        } else {
          template = template.replace("{fbrIntegration}", "");
        }

        //SRB QR
        if (isNullValue(posState.selectedOrder.SrbInvoiceId)) {
          let srbQR = document.getElementById("srb-code-container")?.innerHTML;
          template = template.replace(
            "{srbIntegration}",
            `<div style="display:flex; justify-content:space-between; align-items:center; margin:20px 5px">
            <div>
            <image style="width:50px; height:auto;" src="${SRBImage}"/></div>
            <div style="display:flex; flex-direction:column; text-align:center">
            <span><p style='color:black;  margin-right:10px;'>SRB Invoice Number</p></span>
            <span><p style='color:black;  margin-right:20px;'>${posState.selectedOrder.SrbInvoiceId}</p></span>
            </div>
            <div>${srbQR}</div>
            
            </div>`
          );
          template = template.replace("{fbrIntegration}", "");
        } else {
          template = template.replace("{srbIntegration}", "");
        }

        const setBillTemp = new Promise((resolutionFunc, rejectionFunc) => {
          dispatch({
            type: SET_POS_STATE,
            payload: {
              name: "HTMLBill",
              value: template,
            },
          });
          resolutionFunc("Resolved");
        });
        setBillTemp.then(() => {
          handlePrint();
        });
      });
    } else {
      const setBillTemp = new Promise((resolutionFunc, rejectionFunc) => {
        let ordersToEmbed = posState.seletedOrderItems
          .map(
            (rowItem) => `<tr>
         <td style="font-weight:bold;color:black;"><p>${rowItem.Quantity}</p></td>
         <td style="font-weight:bold;color:black;"><p>${rowItem.ProductDetailName}</p></td>
         <td style="font-weight:bold;color:black;text-align:right;"><p>${rowItem.PriceWithoutGST}</p></td>

        </tr>`
          )
          .join(" ");
        template = template.replace("{itemBody}", ordersToEmbed);
        let sumOfAllProducts = posState?.seletedOrderItems?.reduce(
          (sum, next) => sum + next?.PriceWithoutGST,
          0
        );

        let discountAmount = posState?.selectedOrder?.DiscountAmount;
        // let discountAmount = posState.seletedOrderItems.reduce(
        //   (sum, next) =>
        //     sum + (next.DiscountPercent / 100) * next.PriceWithoutGST,
        //   0
        // );
        template = template.replace(
          "{productSubtotal}",
          sumOfAllProducts.toFixed(2)
        );
        // template = prePaymentHelper(posState, template);
        template = template.replace("SALE RECEIPT", "Pre Payment Bill::");
        template = template.replace(
          "{orderDateTime}",
          posState.selectedOrder.OrderDateTime.split("T")[0]
        );
        template = template.replace(
          "{orderNumber}",
          posState.selectedOrder.OrderNumber
        );
        template = template.replace(
          "{orderMode}",
          posState.selectedOrder.OrderMode
        );
        template = template.replace("{companyName}", authState.CompanyName);
        // template = template.replace("{billDate}", getDate());
        // template = template.replace("{billTime}", getFullTime(Date.now()));
        template = template.replace(
          "{totalAmount}",
          parseFloat(sumOfAllProducts.toFixed(2)) +
          parseFloat(posState.selectedOrder.GSTAmount.toFixed(2))
        );

        // template = template.replace(
        //   "{totalAmount}",
        //   sumOfAllProducts.toFixed(2)
        // );
        template = template.replace("{discountAmount}", discountAmount);
        template = template.replace(
          "{productNetBill}",
          (
            sumOfAllProducts +
            posState.selectedOrder.DeliveryCharges +
            posState.selectedOrder.AdditionalServiceCharges +
            posState.selectedOrder.GSTAmount -
            discountAmount
          ).toFixed(2)
        );
        if (posState.selectedOrder.GSTPercent === 0) {
          template = template.replace("GST :", "");
          template = template.replace("{productGst}", "");
        } else {
          template = template.replace(
            "{productGst}",
            posState.selectedOrder.GSTAmount.toFixed(2)
          );
        }

        //before bill
        let deliveryChargesStr = ``;
        let additionalChargesStr = ``;
        additionalChargesStr = `<tr>
  //   <td style="vertical-align: middle; font-weight: 300; border: 0; font-weight: 500;
  //   color : #000;">
  //     Service Charges
  //   </td>
  //   <td
  //     style="
  //       text-align: right;
  //       vertical-align: middle;
  //       font-weight: 300;
  //       border: 0;
  //       font-weight: 500;
  //       color : #000;
  //     "
  //   >
  //     ${parseFloat(posState.selectedOrder.AdditionalServiceCharges).toFixed(
          2
        )}
  //   </td>
  // </tr>
  // `;
        //extra charges

        {
          template = template.replace(
            "{beforeBill}",
            posState.selectedOrder.AdditionalServiceCharges > 0
              ? posState?.punchScreenData?.Table10?.filter(
                (x) => x.OrderModeId === posState.selectedOrder.OrderModeId
              )
                ?.map(
                  (x) =>
                    `<tr>
                    <td style="text-align: left; font-weight: 500; border: 0; color: #000">${x.ExtraChargesName
                    }</td>
                    <td style="text-align: right; font-weight: 500; border: 0; color: #000">${x.IsPercent
                      ? (
                        (x.ChargesValue / 100) *
                        posState.selectedOrder.TotalAmountWithoutGST
                      ).toFixed(2)
                      : x.ChargesValue.toFixed(2)
                    }</td>
                  </tr>`
                )
                .join("")
              : "<tr></tr>"
          );
        }

        if (
          posState.selectedOrder.OrderModeId === DELIVERY &&
          posState.selectedOrder.DeliveryCharges > 0 &&
          posState.selectedOrder.DeliveryCharges !== null
        ) {
          template = template.replace("Net Bill", "Total:");
          deliveryChargesStr = `<tr>
          <td style="vertical-align: middle; font-weight: 300; border: 0; font-weight: 500;
          color : #000;">
            Delivery Charges
          </td>
          <td
            style="
              text-align: right;
              vertical-align: middle;
              font-weight: 300;
              border: 0;
              font-weight: 500;
              color : #000;
            "
          >
            ${parseFloat(posState.selectedOrder.DeliveryCharges).toFixed(2)}
          </td>
        </tr>
        `;
        } else {
          deliveryChargesStr = "<tr></tr>";
        }

        template = template.replace("{finalBill}", deliveryChargesStr);

        template = template.replace("{beforeBill}", additionalChargesStr);

        dispatch({
          type: SET_POS_STATE,
          payload: {
            name: "HTMLBill",
            value: template,
          },
        });
        resolutionFunc("Resolved");
      });
      setBillTemp.then(() => {
        handlePrint();
      });
    }
  };

  const saveComplaint = (complaintObj) => {
    postRequest(
      "/CrudComplain",
      {
        ...complaintObj,
        OperationId: 2,
        CompanyId: userData.CompanyId,
        UserId: userData.UserId,
        UserIP: "12.1.1.2",
      },
      controller
    ).then(() => { });
    setIsModalVisible(false);
  };

  const saveCustomer = (data) => {
    postRequest(
      "/CrudCreditCustomer",
      {
        OperationId: 3,
        CompanyId: userData.CompanyId,
        PhoneNumber: data.PhoneNumber,
        CustomerName: "",
        PhoneTypeId: null,
        CustomerId: data.CustomerId,
        UserId: userData.UserId,
        UserIP: "12.1.1.2",
        OrderMasterId: data.OrderMasterId,
      },
      controller
    ).then((res) => {
      setIsAddCustModalVisible(false);

      message.success("Customer added successfully!");

      getOrderListAfterUpdate({
        OperationId: 1,
        CompanyId: userData.CompanyId,
        UserId: userData.UserId,
        UserIP: "12.1.1.2",
        BranchId:
          selectedOrder?.BranchId || userData.userBranchList.length === 1
            ? userData.userBranchList[0].BranchId
            : null,
        AreaId: null,
        OrderNumber: null,
        CustomerId: null,
        CustomerName: "%%",
        CustomerPhone: "%%",
        OrderModeId: null,
        OrderNumber: "%%",
        OrderSourceId: null,
        DateFrom: "",
        DateTo: "",
        StatusId: null,
        CityId: userData.userBranchList[0]?.CityId,
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
    });
  };

  const handleConsolidatedKOTPrint = () => {
    let kotTemplate = posState?.templateList?.Table?.find(
      (item) => item.TemplateTypeId == CONSOLIDATED_KOT
    )?.TemplateHtml;

    let orderItems = posState.seletedOrderItems
      .map(
        (rowItem) => `<tr>
         <td style="font-weight:bold;color:black;"><p>${rowItem.Quantity}</p></td>
         <td style="font-weight:bold;color:black;"><p>${rowItem.ProductDetailName}</p></td>

        </tr>`
      )
      .join(" ");
    kotTemplate = kotTemplate.replace("{itemBody}", orderItems);
    // kotTemplate = kotTemplate.replace("{embadFields}", "");
    kotTemplate = kotTemplate.replace(
      "{billTime}",
      posState.selectedOrder.OrderDateTime.split("T")[0]
    );
    kotTemplate = kotTemplate.replace(
      "{orderNumber}",
      posState.selectedOrder.OrderNumber
    );
    kotTemplate = kotTemplate.replace(
      "{orderMode}",
      posState.selectedOrder.OrderMode
    );
    kotTemplate = kotTemplate.replace(
      "{embadFields}",
      `
  <tr>
    <td style="text-align: left; font-weight: 500; border: 0; color: #000">Table:</td>
    <td style="text-align: right; font-weight: 500; border: 0; color: #000">${posState.tableName}</td>
  </tr>
  `
    );
    // kotTemplate = kotTemplate.replace("{billDate}", getDate());
    // kotTemplate = kotTemplate.replace("{billTime}", getFullTime(Date.now()));

    const setBillTemp = new Promise((resolutionFunc, rejectionFunc) => {
      dispatch({
        type: SET_POS_STATE,
        payload: {
          name: "HTMLBill",
          value: kotTemplate,
        },
      });
      resolutionFunc("Resolved");
    });
    setBillTemp.then(() => {
      handlePrint();
    });
  };

  const startNewOrder = () => {
    dispatch({ type: OPEN_CUSTOMER_TABLE });
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
        name: "waiterId",
        value: null,
      },
    });
    dispatch({
      type: SET_POS_STATE,
      payload: {
        name: "tableId",
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
    window.removeEventListener("keydown", handleKeyDown);
  };

  const updateCancelStatus = () => {
    const order = {};
    order.OrderStatusId = cancelOrderStatusObj.OrderStatusId;
    order.OrderMasterId = selectedOrder.OrderMasterId;
    dispatch(
      submitForm(
        "/UpdateOrderStatus",
        order,
        initialFormValues,
        controller,
        userData,
        3,
        (tables) => {
          dispatch({
            type: SET_POS_STATE,
            payload: {
              name: "updateGetOrderList",
              value: true,
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
        },
        false,
        false
      )
    );
  };

  const refundPaidOrder = () => {
    const order = {
      OrderMasterId: selectedOrder.OrderMasterId,
      OperationId: 1,
      UserId: authState.UserId,
      CompanyId: authState.CompanyId,
    };
    dispatch(
      submitForm(
        "/OrderRefund",
        order,
        initialFormValues,
        controller,
        userData,
        3,
        (tables) => {
          dispatch({
            type: SET_POS_STATE,
            payload: {
              name: "updateGetOrderList",
              value: true,
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
        },
        false,
        false
      )
    );
  };

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
      OrderModeId: selectedOrder.OrderModeId,
      AreaId: selectedOrder.AreaId,
      OrderMasterId: null,
      OrderSourceId: selectedOrder.OrderSourceId,
      BranchId:
        userData.userBranchList.length === 1
          ? userData.userBranchList[0].BranchId
          : selectedOrder.BranchId,
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
        // setSupportingDiscounts(response.data.DataSet.Table1);
      })
      .catch((error) => console.error(error));
    setDiscountModel(true);
  };

  const cancelOrder = () => {
    if (IsPos === true) {
      setVisibleAuthModal(true);
    } else {
      updateCancelStatus();
    }
  };

  const refundOrder = () => {
    if (IsPos === true) {
      setVisibleAuthModaRefund(true);
    } else {
      refundPaidOrder();
    }
  };

  const applyDiscount = () => {
    if (IsPos === true) {
      setVisibleAuthModal2(true);
    }
  };

  const applyOrRemoveDiscountSubmit = (param) => {
    if (param) {
      const data = {
        DiscountId: selectedOrder.DiscountId,
        OperationId: 1,
        OrderMasterId: selectedOrder.OrderMasterId,
        CompanyId: userData.CompanyId,
      };
      postRequest(
        "/ApplyDiscount",
        {
          ...data,
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
          dispatch({
            type: SET_POS_STATE,
            payload: {
              name: "updateGetOrderList",
              value: true,
            },
          });
          message.success("Discount Applied Successfully!");
          setDiscountModel(false);
        })
        .catch((error) => console.error(error));
    } else {
      const data = {
        DiscountId: null,
        OperationId: 2,
        OrderMasterId: selectedOrder.OrderMasterId,
        CompanyId: userData.CompanyId,
      };
      postRequest(
        "/ApplyDiscount",
        {
          ...data,
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
          dispatch({
            type: SET_POS_STATE,
            payload: {
              name: "updateGetOrderList",
              value: true,
            },
          });
          setDiscountModel(false);
        })
        .catch((error) => console.error(error));
    }
  };

  const updateSearchDate = (data) => {
    setSearchDates({ ...searchDates, [data.name]: data.value });
  };

  const getOrderListAfterUpdate = (data) => {
    dispatch(
      setInitialState(
        "/GetOrder",
        {
          ...data,
          BranchId:
            userData.userBranchList.length === 1
              ? userData.userBranchList[0].BranchId
              : null,
          CityId: null,
        },
        initialFormValues,
        initialSearchValues,
        controller,
        userData
      )
    );
  };

  const recallOrder = () => {
    dispatch({
      type: SET_POS_STATE,
      payload: {
        name: "recallOrder",
        value: true,
      },
    });
    postRequest(
      `recallorder?OrderMasterId=${selectedOrder.OrderMasterId}&IsPos=${IsPos}`
    ).then((response) => {
      if (response.error === true) {
        message.error(response.errorMessage);
        return;
      }




      const extraCharges = [];

      response.data.Data.Table12.length &&
        response.data.Data.Table12.forEach((e) => {
          if (e.OrderModeId === response.data.DataSet.Table[0].OrderModeId)
            extraCharges.push({
              ExtraChargesName: e.ExtraChargesName,
              ExtraChargesId: e.ExtraChargesId,
              IsPercent: e.IsPercent,
              ChargesValue: e.ChargesValue,
              ExtraChargesAmount: e.IsPercent ? 0 : e.ChargesValue,
              Percentage: e.IsPercent ? e.ChargesValue : 0,
            });
        });

      const discountObject = response.data.Data.Table15?.find((discount) => discount.DiscountId === response.data.DataSet.Table[0].DiscountId);

      dispatch({
        type: SET_POS_STATE,
        payload: {
          name: "Discount",
          value: discountObject
        },
      });

      dispatch({
        type: SET_POS_STATE,
        payload: {
          name: "extraCharges",
          value: extraCharges,
        },
      });

      let data = rewriteRecallData(response.data.Data);
      dispatch({
        type: SET_POS_STATE,
        payload: {
          name: "punchScreenData",
          value: data,
        },
      });
      dispatch({
        type: UPDATE_PRODUCT_CART,
        payload: response.data.DataSet.Table1,
      });
      dispatch({
        type: SET_RECALL_ORDER,
        payload: response.data.DataSet.Table[0],
      });

      dispatch({
        type: SET_GST_AMOUNT,
        payload: parseFloat(response.data.DataSet.Table[0].GSTAmount).toFixed(
          2
        ),
      });
      dispatch({
        type: SET_POS_STATE,
        payload: {
          name: "selectedDiscount",
          value: response.data.Data.Table15,
        },
      });

      const gst = posState.gstList.filter(
        (e) => e.GSTId === response.data.Data.Table[0].GSTId
      );

      dispatch({
        type: SET_POS_STATE,
        payload: {
          name: "GSTPercentage",
          value: gst[0]?.GSTPercentage,
        },
      });
      dispatch({
        type: SET_POS_STATE,
        payload: {
          name: "orderSourceId",
          value: response.data.DataSet.Table[0].OrderSourceId,
        },
      });
      dispatch({
        type: SET_POS_STATE,
        payload: {
          name: "GSTId",
          value: response.data.DataSet.Table[0],
        },
      });

      dispatch({
        type: SET_GST,
        payload: {
          GSTId: gst[0]?.GSTId,
          GSTPercentage: gst[0]?.GSTPercentage,
        },
      });
    });
  };

  return (
    <>
      <Row>
        <Col
          /*span={18}*/
          // xs={19}
          // sm={19}
          // md={19}
          // lg={19}
          // xl={18}
          // xxl={18}
          className="posLeftDiv"
          style={{ borderRight: "1px solid #eee" }}
        >
          <OrderTabs
            updateSearchDate={updateSearchDate}
            getOrderListAfterUpdate={getOrderListAfterUpdate}
            holdOrders={holdOrders}
            setHoldOrders={setHoldOrders}
            parentKey={parentKey}
            setParentKey={setParentKey}
            closeDrawerParent={closeDrawerParent}
            setCloseDrawerParent={setCloseDrawerParent}
            checkOutSelectedOrder={checkOutSelectedOrder}
            setCheckOutSelectedOrder={setCheckOutSelectedOrder}
            parentCheckoutOrderModal={parentCheckoutOrderModal}
            setParentCheckOutOrderModal={setParentCheckOutOrderModal}
            parentKotPrint={parentKotPrint}
            setParentKotPrint={setParentKotPrint}
          />
        </Col>
        {(RoleId === BRANCH_ADMIN || RoleId === CASHIER) && (
          <DayShiftTerminalModal
            setDstModal={setDstModal}
            dstModal={dstModal}
            modalLoading={modalLoading}
            setModalLoading={setModalLoading}
            setDstDetail={setDstDetail}
            handleDayShiftChange={handleDayShiftChange}
          />
        )}
        {isModalVisible && (
          <ComplaintManagementModal
            selectedOrder={selectedOrder}
            complaintTypes={complaintTypes}
            complaintCategories={complaintCategories}
            isModalVisible={isModalVisible}
            closeModal={closeModal}
            saveComplaint={saveComplaint}
          />
        )}
        {isAddCustModalVisible && (
          <AddCustomerModal
            selectedOrder={selectedOrder}
            complaintTypes={complaintTypes}
            complaintCategories={complaintCategories}
            isModalVisible={isAddCustModalVisible}
            closeModal={closeAddCustModal}
            saveCustomer={saveCustomer}
          />
        )}
        {isWaiterOpen && (
          <ChangeWaiterPopUp
            isModalVisible={isWaiterOpen}
            handleCancel={storeRef}
            userData={userData}
            popupIntialFormValues={popupIntialFormValues}
            closeModalOnOk={closeModalOnOk}
          />
          // <RadioButtonGroupModal
          //   isModalVisible={isWaiterOpen}
          //   handleCancel={storeRef}
          //   userData={userData}
          //   popupIntialFormValues={popupIntialFormValues}
          //   closeModalOnOk={closeModalOnOk}
          //   title="Waiter"
          //   url="/UpdateCoverWaiterRider"
          //   reduxName="waiterId"
          //   OnOkName="waiter"
          //   datasetTable="Table"
          //   value={posState.waiterId}
          //   radioValue="WaiterId"
          //   valueName="WaiterName"
          // />
        )}
        {isCoverOpen && (
          <ChangeCoverPopUp
            isModalVisible={isCoverOpen}
            handleCancel={toggleCoverPopUp}
            userData={userData}
            popupIntialFormValues={popupIntialFormValues}
          />
        )}
        {isTableOpen && (
          <TableTransferPopUp
            isModalVisible={isTableOpen}
            handleCancel={storeRef}
            userData={userData}
            popupIntialFormValues={popupIntialFormValues}
            closeModalOnOk={closeModalOnOk}
          />
          // <RadioButtonGroupModal
          //   isModalVisible={isTableOpen}
          //   handleCancel={storeRef}
          //   userData={userData}
          //   popupIntialFormValues={popupIntialFormValues}
          //   closeModalOnOk={closeModalOnOk}
          //   title="Table"
          //   url="/UpdateCoverWaiterRider"
          //   reduxName="tableId"
          //   OnOkName="table"
          //   datasetTable="Table2"
          //   value={posState.tableId}
          //   radioValue="TableId"
          //   valueName="TableName"
          // />
        )}
        {/* Right Button Section */}
        <Col
          className="posRightDiv"
          // xs={5}
          // sm={5}
          // md={5}
          // lg={5}
          // xl={6}
          // xxl={6}
          align="center"
        >
          <Row className="rightTabs">
            <Col
              lg={14}
              xl={18}
              xsl={18}
              className="rightTabButtons"
              style={{ alignContent: "flex-start" }}
            >
              <FormTileButton
                title="New Order"
                type="primary"
                className="posFormTitleButton"
                width="100px"
                height="100px"
                margin={"5px"}
                color="green"
                gap="5"
                onClick={() => {
                  startNewOrder();
                  dispatch({ type: TOGGLE_ORDER_DETAIL });
                }}
                icon={<AiOutlinePlus fontSize={26} />}
                disabled={
                  !IsPos
                    ? true
                    : RoleId === BRANCH_ADMIN || RoleId === CASHIER
                      ? dstDetail?.TerminalDetailId === 0
                      : RoleId === AGENT
                        ? false
                        : RoleId === DISPATCHER
                          ? true
                          : true || IsPos === false
                            ? true
                            : dstDetail?.TerminalDetailId === 0
                  // IsPos === false ||
                  // (![BRANCH_ADMIN, CASHIER].includes(RoleId) &&
                  //   dstDetail.TerminalDetailId === 0) ||
                  // RoleId === AGENT
                }
                codes="(Shift + N)"
              />
              <FormTileButton
                margin={"5px"}
                title="Cancel Order"
                type="primary"
                color="red"
                width="100px"
                height="100px"
                className="posFormTitleButton"
                icon={<AiOutlineClose fontSize={26} />}
                onClick={cancelOrder}
                disabled={
                  userData.RoleId === COMPANY_ADMIN
                    ? true
                    : Object.keys(selectedOrder).length === 0
                      ? true
                      : selectedOrder.IsPaid
                        ? true
                        : selectedOrder.OrderStatusId &&
                          cancelOrderStatusObj &&
                          selectedOrder.OrderStatusId ===
                          cancelOrderStatusObj.OrderStatusId
                          ? true
                          : selectedOrder.IsRefund || selectedOrder.IsFinishWaste
                            ? true
                            : false
                              ? true
                              : dstDetail?.TerminalDetailId === 0
                }
                codes="(Shift + C)"
              />
              <FormTileButton
                margin={"5px"}
                title="Refund Order"
                type="primary"
                color="yellow"
                width="100px"
                height="100px"
                className="posFormTitleButton"
                icon={<AiOutlineClose fontSize={26} />}
                onClick={refundOrder}
                disabled={
                  userData.RoleId === AGENT || RoleId === DISPATCHER
                    ? true
                    : selectedOrder.IsPaid
                      ? false
                      : true
                }
              // codes="(Shift + C)"
              />
              <FormTileButton
                margin={"5px"}
                title="Recall Order"
                type="primary"
                width="100px"
                height="100px"
                className="posFormTitleButton"
                icon={<AiOutlineRollback fontSize={26} />}
                disabled={
                  !IsPos
                    ? true
                    : userData.RoleId === COMPANY_ADMIN ||
                      userData.RoleId === AGENT ||
                      RoleId === DISPATCHER
                      ? true
                      : Object.keys(selectedOrder).length === 0
                        ? true
                        : selectedOrder.IsPaid
                          ? true
                          : selectedOrder.OrderStatusId &&
                            cancelOrderStatusObj &&
                            selectedOrder.OrderStatusId ===
                            cancelOrderStatusObj.OrderStatusId
                            ? true
                            : selectedOrder.IsRefund || selectedOrder.IsFinishWaste
                              ? true
                              : false
                                ? true
                                : dstDetail?.TerminalDetailId === 0
                }
                onClick={() => {
                  recallOrder();
                  dispatch({ type: TOGGLE_ORDER_DETAIL });
                }}
                codes="(Shift + Q)"
              />
              <FormTileButton
                margin={"5px"}
                title="Launch Complaint"
                type="primary"
                width="100px"
                height="100px"
                className="posFormTitleButton"
                icon={<AiOutlineRollback fontSize={26} />}
                onClick={launchComplain}
                disabled={
                  userData.RoleId === COMPANY_ADMIN || RoleId === DISPATCHER
                    ? true
                    : Object.keys(selectedOrder).length === 0
                      ? true
                      : selectedOrder.OrderStatusId &&
                        cancelOrderStatusObj &&
                        selectedOrder.OrderStatusId ===
                        cancelOrderStatusObj.OrderStatusId
                        ? true
                        : selectedOrder.IsRefund || selectedOrder.IsFinishWaste
                          ? true
                          : false
                }
                codes="(Shift + L)"
              />
              <FormTileButton
                margin={"5px"}
                title="Add Customer"
                type="primary"
                width="100px"
                height="100px"
                className="posFormTitleButton"
                icon={<AiOutlinePlus fontSize={26} />}
                onClick={addCustomer}
                disabled={
                  userData.RoleId === COMPANY_ADMIN || RoleId === DISPATCHER
                    ? true
                    : Object.keys(selectedOrder).length === 0
                      ? true
                      : selectedOrder.OrderStatusId &&
                        cancelOrderStatusObj &&
                        selectedOrder.OrderStatusId ===
                        cancelOrderStatusObj.OrderStatusId
                        ? true
                        : selectedOrder.IsRefund || selectedOrder.IsFinishWaste
                          ? true
                          : selectedOrder.CustomerId
                            ? true
                            : selectedOrder.OrderStatusId === 12
                              ? true
                              : false
                }
              // codes="(Shift + L)"
              />
              {IsPos === true && (
                <FormTileButton
                  margin={"5px"}
                  title="Change Waiter"
                  type="primary"
                  width="100px"
                  height="100px"
                  className="posFormTitleButton"
                  icon={<CgArrowsExchangeAlt fontSize={26} />}
                  disabled={
                    userData.RoleId === COMPANY_ADMIN ||
                      userData.RoleId === AGENT ||
                      RoleId === DISPATCHER
                      ? true
                      : selectedOrder.OrderModeId === TAKE_AWAY
                        ? true
                        : selectedOrder.OrderModeId === DELIVERY
                          ? true
                          : Object.keys(selectedOrder).length === 0
                            ? true
                            : selectedOrder.IsPaid
                              ? true
                              : selectedOrder.OrderStatusId &&
                                cancelOrderStatusObj &&
                                selectedOrder.OrderStatusId ===
                                cancelOrderStatusObj.OrderStatusId
                                ? true
                                : selectedOrder.IsRefund || selectedOrder.IsFinishWaste
                                  ? true
                                  : false
                                    ? true
                                    : dstDetail?.TerminalDetailId === 0
                  }
                  onClick={toggleWaiterPopUp}
                  codes="(Shift + W)"
                />
              )}
              {/* {IsPos === true && (
              <FormTileButton
                margin={"5px"}
                title="Discount"
                type="primary"
                width="100px"
              height="100px"
                icon={<AiOutlineTags fontSize={26} />}
              />
            )} */}
              {/* {IsPos === true && (
              <FormTileButton
                margin={"5px"}
                title="Cancel Discount"
                type="primary"
                width="100px"
              height="100px"
                icon={<AiOutlineTag fontSize={26} />}
              />
            )} */}
              {IsPos === true && (
                <FormTileButton
                  margin={"5px"}
                  title="Change Cover"
                  type="primary"
                  width="100px"
                  height="100px"
                  className="posFormTitleButton"
                  icon={<AiOutlineUserSwitch fontSize={26} />}
                  disabled={
                    userData.RoleId === COMPANY_ADMIN ||
                      userData.RoleId === AGENT ||
                      RoleId === DISPATCHER
                      ? true
                      : selectedOrder.OrderModeId === TAKE_AWAY
                        ? true
                        : selectedOrder.OrderModeId === DELIVERY
                          ? true
                          : Object.keys(selectedOrder).length === 0
                            ? true
                            : selectedOrder.IsPaid
                              ? true
                              : selectedOrder.OrderStatusId &&
                                cancelOrderStatusObj &&
                                selectedOrder.OrderStatusId ===
                                cancelOrderStatusObj.OrderStatusId
                                ? true
                                : selectedOrder.IsRefund || selectedOrder.IsFinishWaste
                                  ? true
                                  : false
                                    ? true
                                    : dstDetail?.TerminalDetailId === 0
                  }
                  onClick={toggleCoverPopUp}
                  codes="(Shift + O)"
                />
              )}
              {IsPos === true && (
                <FormTileButton
                  margin={"5px"}
                  title="Table Transfer"
                  type="primary"
                  width="100px"
                  height="100px"
                  className="posFormTitleButton"
                  icon={<GiTable fontSize={26} />}
                  disabled={
                    userData.RoleId === COMPANY_ADMIN ||
                      userData.RoleId === AGENT ||
                      RoleId === DISPATCHER
                      ? true
                      : selectedOrder.OrderModeId === TAKE_AWAY
                        ? true
                        : selectedOrder.OrderModeId === DELIVERY
                          ? true
                          : Object.keys(selectedOrder).length === 0
                            ? true
                            : selectedOrder.IsPaid === true
                              ? true
                              : selectedOrder.OrderStatusId &&
                                cancelOrderStatusObj &&
                                selectedOrder.OrderStatusId ===
                                cancelOrderStatusObj.OrderStatusId
                                ? true
                                : selectedOrder.IsRefund || selectedOrder.IsFinishWaste
                                  ? true
                                  : false
                                    ? true
                                    : dstDetail?.TerminalDetailId === 0
                  }
                  onClick={toggleTableTransfter}
                  codes="(Shift + T)"
                />
              )}
              {/* {IsPos === true && (
              <FormTileButton
                margin={"5px"}
                title="Table Merge"
                type="primary"
                width="100px"
              height="100px"
                icon={<GiRoundTable fontSize={26} />}
              disabled={
                Object.keys(selectedOrder).length === 0
                  ? true
                  : selectedOrder.OrderStatusId &&
                    cancelOrderStatusObj &&
                    selectedOrder.OrderStatusId ===
                      cancelOrderStatusObj.OrderStatusId
                  ? true
                  : false
              }
              />
            )} */}
              <FormTileButton
                margin={"5px"}
                title="Change / Assign Rider"
                type="primary"
                width="100px"
                height="100px"
                className="posFormTitleButton"
                onClick={toggleRiderPopUp}
                icon={<RiEBike2Fill fontSize={26} />}
                disabled={
                  userData.RoleId === COMPANY_ADMIN || userData.RoleId === AGENT
                    ? true
                    : selectedOrder.OrderModeId === TAKE_AWAY
                      ? true
                      : selectedOrder.OrderModeId === DINE_IN
                        ? true
                        : Object.keys(posState.selectedOrder).length === 0
                          ? true
                          : selectedOrder.IsPaid
                            ? true
                            : selectedOrder.OrderStatusId &&
                              cancelOrderStatusObj &&
                              selectedOrder.OrderStatusId ===
                              cancelOrderStatusObj.OrderStatusId
                              ? true
                              : selectedOrder.IsRefund || selectedOrder.IsFinishWaste
                                ? true
                                : false
                                  ? true
                                  : dstDetail?.TerminalDetailId === 0
                }
                codes="(Shift + R)"
              />
              <ReactToPrint content={() => componentRefPrint.current}>
                <PrintContextConsumer>
                  {({ handlePrint }) => (
                    // <Button
                    //   onClick={() => {
                    //     handlePrinting(handlePrint);
                    //   }}
                    // >
                    //   KOT
                    // </Button>
                    <FormTileButton
                      margin={"5px"}
                      title="Pre Payment Bill"
                      type="primary"
                      width="100px"
                      height="100px"
                      className="posFormTitleButton"
                      icon={<MdReceipt fontSize={26} />}
                      onClick={() => {
                        handlePrinting(handlePrint, false);
                      }}
                      disabled={
                        userData.RoleId === COMPANY_ADMIN ||
                          userData.RoleId === AGENT
                          ? true
                          : selectedOrder.IsPaid
                            ? true
                            : selectedOrder.OrderStatusId &&
                              cancelOrderStatusObj &&
                              selectedOrder.OrderStatusId ===
                              cancelOrderStatusObj.OrderStatusId
                              ? true
                              : Object.keys(posState.selectedOrder).length === 0
                                ? true
                                : selectedOrder.IsRefund ||
                                  selectedOrder.IsFinishWaste
                                  ? true
                                  : false
                                    ? true
                                    : dstDetail?.TerminalDetailId === 0
                      }
                      codes="(Shift + B)"
                    />
                  )}
                </PrintContextConsumer>
              </ReactToPrint>

              {/* Consolidated KOT */}
              <ReactToPrint content={() => componentRefPrint.current}>
                <PrintContextConsumer>
                  {({ handlePrint }) => (
                    // <Button
                    //   onClick={() => {
                    //     handlePrinting(handlePrint);
                    //   }}
                    // >
                    //   KOT
                    // </Button>
                    <FormTileButton
                      margin={"5px"}
                      title="Consolidated KOT"
                      type="primary"
                      width="100px"
                      height="100px"
                      className="posFormTitleButton"
                      icon={<MdReceipt fontSize={26} />}
                      onClick={() => {
                        handleConsolidatedKOTPrint(handlePrint);
                      }}
                      disabled={
                        userData.RoleId === COMPANY_ADMIN ||
                          userData.RoleId === AGENT
                          ? true
                          : selectedOrder.IsPaid
                            ? true
                            : selectedOrder.OrderStatusId &&
                              cancelOrderStatusObj &&
                              selectedOrder.OrderStatusId ===
                              cancelOrderStatusObj.OrderStatusId
                              ? true
                              : Object.keys(posState.selectedOrder).length === 0
                                ? true
                                : selectedOrder.IsRefund ||
                                  selectedOrder.IsFinishWaste
                                  ? true
                                  : false
                                    ? true
                                    : dstDetail?.TerminalDetailId === 0
                      }
                    />
                  )}
                </PrintContextConsumer>
              </ReactToPrint>

              <ReactToPrint content={() => componentRefPrint.current}>
                <PrintContextConsumer>
                  {({ handlePrint }) => (
                    // <Button
                    //   onClick={() => {
                    //     handlePrinting(handlePrint);
                    //   }}
                    // >
                    //   KOT
                    // </Button>
                    <FormTileButton
                      margin={"5px"}
                      title="Duplicate Bill"
                      type="primary"
                      width="100px"
                      height="100px"
                      className="posFormTitleButton"
                      icon={<MdReceipt fontSize={26} />}
                      onClick={() => {
                        handlePrinting(handlePrint, true);
                      }}
                      disabled={
                        userData.RoleId === AGENT || RoleId === DISPATCHER
                          ? true
                          : selectedOrder.IsPaid
                            ? false
                            : true
                      }
                      codes="(Shift + D)"
                    />
                  )}
                </PrintContextConsumer>
              </ReactToPrint>
              <FormTileButton
                margin={"5px"}
                title="Change Payment Type"
                type="primary"
                width="100px"
                height="100px"
                className="posFormTitleButton"
                onClick={toggleChangePaymentType}
                icon={<MdReceipt fontSize={26} />}
                disabled={
                  userData.RoleId === COMPANY_ADMIN ||
                    userData.RoleId === AGENT ||
                    RoleId === DISPATCHER
                    ? true
                    : Object.keys(posState.selectedOrder).length === 0
                      ? true
                      : selectedOrder.IsPaid
                        ? true
                        : selectedOrder.OrderStatusId &&
                          cancelOrderStatusObj &&
                          selectedOrder.OrderStatusId ===
                          cancelOrderStatusObj.OrderStatusId
                          ? true
                          : selectedOrder.IsRefund || selectedOrder.IsFinishWaste
                            ? true
                            : false
                }
                codes="(Shift + P)"
              />
              <FormTileButton
                margin={"5px"}
                title="Apply Discount"
                type="primary"
                width="100px"
                height="100px"
                className="posFormTitleButton"
                onClick={applyDiscount}
                icon={<MdReceipt fontSize={26} />}
                disabled={
                  userData.RoleId === COMPANY_ADMIN ||
                    userData.RoleId === AGENT ||
                    RoleId === DISPATCHER
                    ? true
                    : Object.keys(posState.selectedOrder).length === 0
                      ? true
                      : selectedOrder.IsPaid
                        ? true
                        : selectedOrder.OrderStatusId &&
                          cancelOrderStatusObj &&
                          selectedOrder.OrderStatusId ===
                          cancelOrderStatusObj.OrderStatusId
                          ? true
                          : selectedOrder.IsRefund || selectedOrder.IsFinishWaste
                            ? true
                            : false
                              ? true
                              : dstDetail?.TerminalDetailId === 0
                }
                codes="(Shift + A)"
              />
              {/* <FormTileButton
              margin={"5px"}
              title="Sale Return"
              type="primary"
              width="100px"
              height="100px"
              className="posFormTitleButton"
              disabled={
                selectedOrder.OrderStatus != "Paid" && userData.RoleId != 1
              }
              onClick={saleReturn}
              icon={<MdReceipt fontSize={26} />}
              codes="(Shift + Z)"
            /> */}
              {/* {IsPos === true && (
              <FormTileButton
                margin={"5px"}
                title="Add Expense"
                type="primary"
                width="100px"
              height="100px"
                icon={<GiCash fontSize={26} />}
                onClick={() => setExpenseModal(true)}
                // disabled={
                //   Object.keys(selectedOrder).length === 0
                //     ? true
                //     : selectedOrder.OrderStatusId &&
                //       cancelOrderStatusObj &&
                //       selectedOrder.OrderStatusId ===
                //         cancelOrderStatusObj.OrderStatusId
                //     ? true
                //     : false
                // }
              />
            )} */}
              {/* {IsPos === true && (
              <FormTileButton
                margin={"5px"}
                title="Apply / Cancel Delivery Charges"
                type="primary"
                width="100px"
              height="100px"
                icon={<MdDeliveryDining fontSize={26} />}
              disabled={
                Object.keys(selectedOrder).length === 0
                  ? true
                  : selectedOrder.OrderStatusId &&
                    cancelOrderStatusObj &&
                    selectedOrder.OrderStatusId ===
                      cancelOrderStatusObj.OrderStatusId
                  ? true
                  : false
              }
              />
            )} */}
            </Col>
            {IsPos === true && (
              <Col span={6}>
                {/* <FormTileButton
                margin={"5px"}
                title="Open Drawer"
                height="70px"
                width="75px"
                className="rightTabsWhiteButton"
                icon={<FaCashRegister fontSize={26} />}
                disabled={userData.RoleId === COMPANY_ADMIN ? true : false}
              />
              <FormTileButton
                margin={"5px"}
                title="Cash Pull"
                height="70px"
                width="75px"
                className="rightTabsWhiteButton"
                icon={<GiTakeMyMoney fontSize={26} />}
                disabled={userData.RoleId === COMPANY_ADMIN ? true : false}
              />
              <FormTileButton
                margin={"5px"}
                title="Petty Cash"
                height="70px"
                width="75px"
                className="rightTabsWhiteButton"
                icon={<MdMoney fontSize={26} />}
                disabled={userData.RoleId === COMPANY_ADMIN ? true : false}
              />
              <FormTileButton
                margin={"5px"}
                title="Close Counter"
                height="70px"
                width="75px"
                className="rightTabsWhiteButton"
                icon={<MdPointOfSale fontSize={26} />}
                disabled={true}
              /> */}
                {/* <FormTileButton
                margin={"5px"}
                title="Start Counter"
                height="70px"
                width="75px"
                className="rightTabsWhiteButton"
                icon={<FaRegStopCircle fontSize={26} />}
                disabled={dstDetail.TerminalDetailId > 0}
                onClick={() =>
                  setDstModal({ ...dstModal, terminalModal: true })
                }
              /> */}
                <FormTileButton
                  margin={"8px 5px"}
                  title="End Counter"
                  height="65px"
                  width="65px"
                  className="rightTabsWhiteButton"
                  icon={<FaRegStopCircle fontSize={26} />}
                  onClick={() =>
                    setDstModal({ ...dstModal, terminalModal: true })
                  }
                  disabled={
                    RoleId === BRANCH_ADMIN || RoleId === CASHIER
                      ? dstDetail?.TerminalDetailId === 0
                      : true
                  }
                />
                <FormTileButton
                  margin={"8px 5px"}
                  title="Start Shift"
                  height="65px"
                  width="65px"
                  className="rightTabsWhiteButton"
                  icon={<FaRegStopCircle fontSize={26} />}
                  disabled={
                    RoleId === BRANCH_ADMIN || RoleId === CASHIER
                      ? dstDetail.ShiftDetailId > 0 ||
                      dstDetail.BusinessDayId === 0
                      : true
                  }
                // onClick={openShiftModal}
                />
                <Popconfirm
                  title="Are you surely want to End the Shift?"
                  onConfirm={() => setDSTstate(5)}
                  okText="Yes"
                  cancelText="No"
                >
                  <FormTileButton
                    margin={"8px 5px"}
                    title="End Shift"
                    height="65px"
                    width="65px"
                    className="rightTabsWhiteButton"
                    icon={<FaRegStopCircle fontSize={26} />}
                    disabled={
                      RoleId === BRANCH_ADMIN || RoleId === CASHIER
                        ? dstDetail.ShiftDetailId === 0 ||
                        dstDetail?.TerminalDetailId > 0
                        : true
                    }
                  />
                </Popconfirm>
                <Popconfirm
                  title="Are you surely want to End the Day?"
                  onConfirm={() => setDSTstate(3)}
                  okText="Yes"
                  cancelText="No"
                >
                  <FormTileButton
                    margin={"8px 5px"}
                    title="End Day"
                    height="65px"
                    width="65px"
                    className="rightTabsWhiteButton"
                    icon={<FaRegStopCircle fontSize={26} />}
                    disabled={
                      RoleId === BRANCH_ADMIN || RoleId === CASHIER
                        ? dstDetail?.TerminalDetailId > 0 ||
                        dstDetail.ShiftDetailId > 0 ||
                        dstDetail.BusinessDayId === 0
                        : true
                    }
                  />
                </Popconfirm>
              </Col>
            )}
          </Row>
        </Col>
        <ExpenseModal
          visible={expenseModal}
          value={expenseData}
          changeValue={(e) =>
            setExpenseData({ ...expenseData, [e.target.name]: e.target.value })
          }
          onSubmit={() => setExpenseModal(false)}
          onClose={() => setExpenseModal(false)}
        />
        {posState.customerTableDrawer && <CustomerTable />}
        <PunchScreen holdOrders={holdOrders} setHoldOrders={setHoldOrders} />
        <div style={{ display: "none" }}>
          <ComponentToPrint ref={componentRefPrint} Bill={HTMLBill} />
        </div>
        {isRiderOpen && (
          <AssignRiderPopUp
            isModalVisible={isRiderOpen}
            handleCancel={toggleRiderPopUp}
            userData={userData}
            popupIntialFormValues={popupIntialFormValues}
          />
        )}
        {isChangePaymentTypeOpen && (
          <ChangePaymentTypePopUp
            isModalVisible={isChangePaymentTypeOpen}
            handleCancel={toggleChangePaymentType}
            userData={userData}
            getOrderList={getOrderList}
          />
        )}
        {/* {isRiderOpen && (
        <AssignRiderPopUp
          isModalVisible={isRiderOpen}
          handleCancel={toggleRiderPopUp}
          userData={userData}
          popupIntialFormValues={popupIntialFormValues}
        />
      )} */}
        <LoginModal
          setVisible={setVisibleAuthModal}
          visible={visibleAuthModal}
          performActionAfterAuth={updateCancelStatus}
        />
        <LoginModal
          setVisible={setVisibleAuthModal2}
          visible={visibleAuthModal2}
          performActionAfterAuth={openDiscountModel}
        />
        <LoginModal
          setVisible={setVisibleAuthModaRefund}
          visible={visibleAuthModaRefund}
          performActionAfterAuth={refundPaidOrder}
        />
        <ModalComponent
          title="Apply Discount"
          isModalVisible={discountModel}
          handleOk={() => applyOrRemoveDiscountSubmit(true)}
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
                value={selectedOrder.DiscountId}
              >
                <Space direction="vertical">
                  {discounts.map((item, index) => (
                    <Radio
                      key={index}
                      onChange={() => {
                        dispatch({
                          type: SET_POS_STATE,
                          payload: {
                            name: "selectedOrder",
                            value: {
                              ...selectedOrder,
                              DiscountId: item.DiscountId,
                            },
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
            <Button onClick={() => applyOrRemoveDiscountSubmit(false)}>
              Remove Discount
            </Button>
          </Col>
        </ModalComponent>
        {/* <ModalComponent
        width={750}
        title="Sale Return"
        isModalVisible={saleReturnModal}
        // handleOk={() => handleSaleReturnSubmit()}
        // handleCancel={() => setSaleReturnModal(false)}
        footer={[
          <Button
            onClick={() => {
              setSaleReturnModal(false);
            }}
          >
            Cancel
          </Button>,
          <ReactToPrint content={() => componentRefForSaleRecipt.current}>
            <PrintContextConsumer>
              {({ handlePrint }) => (
                <Button
                  type="primary"
                  onClick={() => {
                    handleSaleReturnSubmit(handlePrint);
                  }}
                  // disabled={doneCheckOutLoading}
                  // loading={doneCheckOutLoading}
                  ref={btnRef}
                >
                  Done
                </Button>
              )}
            </PrintContextConsumer>
          </ReactToPrint>,
          // <Button onClick={doneCheckOut}>Done</Button>,
        ]}
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
          <Table
            style={{ width: "100%" }}
            columns={columnForDealOption}
            rowKey={(record) => record.OrderDetailId}
            dataSource={selectedOrderItemsM}
            pagination={false}
            className="posOrderDetailTable"
          />
        </Col>
      </ModalComponent> */}

        <div style={{ display: "none" }}>
          {posState.HTMLBill !== "" && (
            <ComponentToPrint
              ref={componentRefForSaleRecipt}
              Bill={saleReturnPrintTemplate}
            />
          )}
        </div>
        <div id="qr-code-container" style={{ display: "none" }}>
          <QRCode size={50} value={posState?.FbrInvoiceNo} />
        </div>
        <div id="srb-code-container" style={{ display: "none" }}>
          <QRCode size={50} value={posState?.SrbInvoiceNo} />
        </div>
      </Row>
      <FinancialReportModal
        financialModal={financialModal}
        setFinancialModal={setFinancialModal}
        record={data}
        operationId={4}
      />
    </>
  );
};
export default PointOfSaleFood;
