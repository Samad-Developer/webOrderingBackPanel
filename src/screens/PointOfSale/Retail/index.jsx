import {
  Button,
  Col,
  Input,
  Popconfirm,
  Radio,
  Row,
  Space,
  Spin,
  Table,
  message,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineClose, AiOutlinePlus, AiOutlineRollback } from "react-icons/ai";
import { FaRegStopCircle } from "react-icons/fa";
import { MdReceipt } from "react-icons/md";
import { RiEBike2Fill } from "react-icons/ri";
import QRCode from "react-qr-code";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ReactToPrint, {
  PrintContextConsumer,
  useReactToPrint,
} from "react-to-print";
import {
  AGENT,
  BRANCH_ADMIN,
  CASHIER,
  COMPANY_ADMIN,
  DAY_SHIFT_TERMINAL,
  DELIVERY,
  DINE_IN,
  PRE_PAYMENT_BILL,
  TAKE_AWAY,
} from "../../../common/SetupMasterEnum";
import OrderTabs from "../../../components/PosComponents/OrderTabs";
import { generateDuplicateSaleReceipt } from "../../../components/PosComponentsFood/printHelpers";
import ModalComponent from "../../../components/formComponent/ModalComponent";
import FormTextField from "../../../components/general/FormTextField";
import FormTileButton from "../../../components/general/FormTileButton";
import ComponentToPrint from "../../../components/specificComponents/ComponentToPrint";
import { getDate } from "../../../functions/dateFunctions";
import { isNullValue } from "../../../functions/generalFunctions";
import { rewriteRecallData } from "../../../functions/rewriteObject";
import { saleReturnPromise } from "../../../functions/saleReturnPromise";
import {
  setInitialState,
  submitForm,
} from "../../../redux/actions/basicFormAction";
import {
  OPEN_CUSTOMER_TABLE,
  SET_DAY_SHIFT_TERMINAL_MODAL,
  SET_GST,
  SET_GST_AMOUNT,
  SET_POS_STATE,
  SET_RECALL_ORDER,
  SET_SALE_RETURN_STATE,
  TOGGLE_ORDER_DETAIL,
  UPDATE_PRODUCT_CART
} from "../../../redux/reduxConstants";
import { postRequest } from "../../../services/mainApp.service";
import AssignRiderPopUp from "./AssignRiderPopUp";
import ChangeCoverPopUp from "./ChangeCoverPopUp";
import ChangePaymentTypePopUp from "./ChangePaymentTypePopUp";
import ChangeWaiterPopUp from "./ChangeWaiterPopUp";
import ComplaintManagementModal from "./ComplaintManagementModal";
import CustomerTable from "./CustomerTable";
import DayShiftTerminalModal from "./DayShiftTerminalModal";
import ExpenseModal from "./ExpenseModal";
import LoginModal from "./LoginModal";
import PunchScreen from "./PunchScreen";
import TableTransferPopUp from "./TableTransferPopUp";
import "./style.css";

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

const PointOfSaleRetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchDates, setSearchDates] = useState({ DateFrom: "", DateTo: "" });
  const [parentKey, setParentKey] = useState(1);
  const [closeDrawerParent, setCloseDrawerParent] = useState(false);

  const componentRefPrint = useRef();
  const BillPrintHtmlTemplate = useRef;
  let btnRef = useRef();
  const barcodeInputRef = useRef();
  const componentRefForSaleRecipt = useRef(null);

  const handlePrintSaleRecipt = useReactToPrint({
    content: () => componentRefForSaleRecipt.current,
  });

  const [barcodeValue, setBarcodeValue] = useState("");
  const [saleReturnLoading, setSaleReturnLoading] = useState(false);
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

  const [isModalVisible, setIsModalVisible] = useState(false);
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

  const posState = useSelector((state) => state.PointOfSaleReducer);

  const [isWaiterOpen, setIsWaiterOpen] = useState(false);
  const [isRiderOpen, setIsRiderOpen] = useState(false);
  const [isCoverOpen, setIsCoverOpen] = useState(false);
  const [isTableOpen, setIsTableOpen] = useState(false);
  const [saleReturnModal, setSaleReturnModal] = useState(false);
  const [selectedOrderItemsM, setSelectedOrderItemsM] = useState([]);
  const [updatedProducts, setUpdatedProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [saleReturnPrintTemplate, setSaleReturnPrintTemplate] = useState("");
  const [isChangePaymentTypeOpen, setIsChangePaymentTypeOpen] = useState(false);
  const [holdOrders, setHoldOrders] = useState(0);
  const [checkOutSelectedOrder, setCheckOutSelectedOrder] = useState(false);
  const [parentCheckoutOrderModal, setParentCheckOutOrderModal] =
    useState(false);
  const [parentKotPrint, setParentKotPrint] = useState(false);

  const [dstDetail, setDstDetail] = useState({
    BusinessDayId: 0,
    ShiftDetailId: 0,
    TerminalDetailId: 0,
  });

  const saleReturn = () => {
    if (IsPos === true) {
      setSaleReturnLoading(true);
      postRequest(
        "/CrudSaleReturn",
        {
          OperationId: 8,
          SalesReturnId: null,
          SalesReturnNumber: null,
          UserId: userData.UserId,
          Date: new Date(),
          BranchId: userData.branchId,
          UserIP: "1.0.0.1",
          OrderMasterId: selectedOrder.OrderMasterId,
          NetAmount: null,
          CompanyId: userData.CompanyId,
          SalesReturnDetail: [],
          DiscountPercent: 0,
        },
        controller
      ).then((response) => {
        setUpdatedProducts(response?.data?.DataSet?.Table)
      })

      postRequest(
        "/CrudSaleReturn",
        {
          OperationId: 6,
          SalesReturnId: null,
          SalesReturnNumber: null,
          UserId: userData.UserId,
          Date: new Date(),
          BranchId: userData.branchId,
          UserIP: "1.0.0.1",
          OrderMasterId: selectedOrder.OrderMasterId,
          NetAmount: null,
          CompanyId: userData.CompanyId,
          SalesReturnDetail: [],
          DiscountPercent: 0,
        },
        controller
      ).then((response) => {
        if (response.error === true) {
          message.error(response.errorMessage);
          return;
        }
        const table = response.data.DataSet.Table;
        dispatch({
          type: SET_SALE_RETURN_STATE,
          payload: {
            name: "ProductCodesState",
            value: table,
          },
        });
        setSaleReturnLoading(false);
      });
      dispatch({
        type: SET_POS_STATE,
        payload: {
          name: "saleReturnMode",
          value: true,
        },
      });
      setSaleReturnModal(true);
    }
  };

  const handleSaleReturnSubmit = (handlePrint) => {
    const month =
      new Date().getMonth() + 1 < 10
        ? "0" + (new Date().getMonth() + 1)
        : new Date().getMonth() + 1;
    const day =
      new Date().getDate() + 1 < 10
        ? "0" + new Date().getDate()
        : new Date().getDate();
    const returnQuantityCheck = updatedProducts.every(
      (item, index) => item.ReturnQuantity === 0
    );
    if (returnQuantityCheck) {
      return message.error("Please increase the return quantity");
    }
    let SalesReturnDetail = [...updatedProducts];
    SalesReturnDetail = SalesReturnDetail.filter(
      (item) => item.ReturnQuantity !== undefined && item.ReturnQuantity !== 0 && item.ReturnQuantity !== null
    );

    postRequest(
      "/CrudSaleReturn",
      {
        OperationId: 2,
        SalesReturnId: null,
        SalesReturnNumber: null,
        UserId: userData.UserId,
        Date: new Date().getFullYear() + "-" + month + "-" + day,
        BranchId: userData.branchId,
        UserIP: "1.0.0.1",
        OrderMasterId: selectedOrder.OrderMasterId,
        NetAmount: null,
        CompanyId: userData.CompanyId,
        SalesReturnDetail,
        DiscountPercent: selectedOrder.DiscountPercent,
      },
      controller
    )
      .then((response) => {
        if (response.error === true) {
          message.error(response.errorMessage);
          return;
        }
        setSaleReturnModal(false);
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
          const filteredTempalteString =
            responce.Table &&
            responce.Table?.filter(
              (str) => str.TemplateTypeId === PRE_PAYMENT_BILL
            );

          if (filteredTempalteString.length > 0) {
            BillPrintHtmlTemplate.current =
              filteredTempalteString[0].TemplateHtml;
            let cloneHTMLTemp = BillPrintHtmlTemplate.current;
            cloneHTMLTemp = cloneHTMLTemp.replace(
              /PRE-PAYMENT BILL/g,
              "Sale Return Recipt"
            );
            let d = new Date(
              response.data.DataSet.Table1[0].CreatedDate.toString()
            );
            let date = d.getDate() + "-" + d.getMonth() + "-" + d.getFullYear();
            let time =
              d.getHours() + "-" + d.getMinutes() + "-" + d.getSeconds();
            cloneHTMLTemp = cloneHTMLTemp.replace(
              "{companyName}",
              userData.CompanyName
            );
            cloneHTMLTemp = cloneHTMLTemp.replace("{billDate}", date);
            cloneHTMLTemp = cloneHTMLTemp.replace("{billTime}", time);
            cloneHTMLTemp = cloneHTMLTemp.replace(
              "{orderMode}",
              selectedOrder.OrderMode
            );
            cloneHTMLTemp = cloneHTMLTemp.replace(
              "{orderNumber}",
              selectedOrder.OrderNumber
            );
            cloneHTMLTemp = cloneHTMLTemp.replace(
              "{orderDateTime}",
              getDate(selectedOrder.OrderDate)
            );
            cloneHTMLTemp = cloneHTMLTemp.replace(
              `<tr><td style="vertical-align: middle; font-weight: 300; border: 0;font-weight: 500;color : #000;">Subtotal:</td><td style="text-align: right;vertical-align: middle;font-weight: 300;border: 0;font-weight: 500;color : #000;">{productSubtotal}</td></tr>`,
              ""
            );
            cloneHTMLTemp = cloneHTMLTemp.replace(
              `<tr><td style="vertical-align: middle; font-weight: 300; border: 0;font-weight: 500;color : #000;">GST ({gstPercent}):</td><td style="text-align: right;vertical-align: middle;font-weight: 300;border: 0;font-weight: 500;color : #000;">{productGst}</td></tr>`,
              ""
            );
            cloneHTMLTemp = cloneHTMLTemp.replace(
              `<tr><td style="vertical-align: middle; font-weight: 300; border: 0;font-weight: 500;color : #000;">Discount</td><td style="text-align: right;vertical-align: middle;font-weight: 300; border: 0;font-weight: 500;color : #000;">{discountAmount}</td></tr>`,
              ""
            );
            cloneHTMLTemp = cloneHTMLTemp.replace(
              `<tr><td style="vertical-align: middle; font-weight: 300; border: 0;font-weight: 500;color : #000;">Net Bill:</td><td style="text-align: right;vertical-align: middle;font-weight: 500;color : #000;border: 0;">{productNetBill}</td></tr>`,
              ""
            );

            cloneHTMLTemp = cloneHTMLTemp.replace("{finalBill}", "");
            cloneHTMLTemp = cloneHTMLTemp.replace("Qty", "ITEM");
            cloneHTMLTemp = cloneHTMLTemp.replace("Item", "QTY");
            cloneHTMLTemp = cloneHTMLTemp.replace("{itemBody}", "");
            cloneHTMLTemp = cloneHTMLTemp.replace("Price", "AMT");
            cloneHTMLTemp = cloneHTMLTemp.replace(
              "{embadFields}",
              `<div style="display: flex; justify-content: space-between">
            <p style="margin: 3px 0; text-align: left">SALE RTN #</p>
            <p style="margin: 3px 0; text-align: right">${response.data.DataSet.Table1[0].SalesReturnNumber.toString()}</p>
          </div>`
            );
            setBarcodeValue(
              response.data.DataSet.Table1[0].SalesReturnNumber.toString()
            );
            let qr = document.getElementById("qr-code-container").innerHTML;
            const ReturnAmountArray = response.data.DataSet.Table2.map(
              (item, index) => {
                if (item.ReturnQuantity > 0 && item) {
                  return item.ReturnAmount;
                }
              }
            );
            let ordersHTML = response.data.DataSet.Table2.map((item, index) => {
              if (item.ReturnQuantity > 0 && item) {
                return `<tr>
              <td
                style="
                padding: 2px 10px;
                text-align: left;
                vertical-align: middle;
                font-weight: 500;
                border: 0;
                color : #000;
                font-size: 10px;
                "
              >
                ${item.ProductDetailName}
              </td>
              <td
              style="
              padding: 2px 10px;
              text-align: left;
              vertical-align: middle;
              font-weight: 500;
              border: 0;
              color : #000;
              font-size: 10px;
              "
            >
              ${item.ReturnQuantity}
            </td>
              <td
                style="
                padding: 2px 10px;
                text-align: right;
                vertical-align: middle;
                font-weight: 500;
                border: 0;
                color : #000;
                font-size: 10px;
                "
              >
                ${parseFloat(item.ReturnAmount).toFixed(2)}
              </td>
            </tr>`;
              }
            });
            ordersHTML += `<tr>
            <td
            colspan="2"
              style="
              padding: 2px 10px;
              text-align: left;
              vertical-align: middle;
              font-weight: 500;
              border: 0;
              color : #000;
              font-size: 10px;
              "
            >
              SALE RTN AMT
            </td>
            <td
              style="
              padding: 2px 10px;
              text-align: right;
              vertical-align: middle;
              font-weight: 500;
              border: 0;
              color : #000;
              font-size: 10px;
              "
            >
              ${parseFloat(
              ReturnAmountArray.reduce((a, b) => a + b, 0)
            ).toFixed(2)}
            </td>
          </tr>`;
            cloneHTMLTemp = cloneHTMLTemp.replace("{beforeBill}", ordersHTML);
            cloneHTMLTemp = cloneHTMLTemp.replace(
              "{fbrIntegration}",
              `<br><div style="display:flex; justify-content:center; align-items:center; margin:20px 5px">
                <div>${qr}</div>
              </div>`
            );
            setSaleReturnPrintTemplate(cloneHTMLTemp);
            handlePrint();
          }
        });
        message.success("Sale was returned and updated successfully");
        dispatch({
          type: SET_POS_STATE,
          payload: {
            name: "saleReturnMode",
            value: false,
          },
        });
        dispatch({
          type: SET_SALE_RETURN_STATE,
          payload: {
            name: "scannedProducts",
            value: [],
          },
        });
      })
      .catch((error) => console.error(error));
  };

  const columnForDealOption = [
    {
      title: "Item",
      dataIndex: "Product",
      key: "Product",
    },
    {
      title: "Price",
      dataIndex: "Price",
      key: "Price",
    },
    {
      title: "Amount",
      dataIndex: "Amount",
      key: "Amount",
    },
    {
      title: "Quantity",
      dataIndex: "Quantity",
      key: "Quantity",
    },
    {
      title: "Sale Return Quantity",
      dataIndex: "ReturnQuantity",
      key: "ReturnQuantity",
      render: (_, item, index) => (
        <Input
          type={"number"}
          min={0}
          max={item.Quantity}
          value={item.ReturnQuantity}
          onChange={(e) => {
            if (e.target.value <= item.Quantity) {
              let arr = [...updatedProducts];
              arr[index].ReturnQuantity = +e.target.value;
              arr[index].ReturnAmount = e.target.value * item.Price;
              setUpdatedProducts([...arr]);
            }
          }}
        />
      ),
    },
    {
      title: "Sale Return Amount",
      dataIndex: "ReturnAmount",
      key: "ReturnAmount",
      render: (_, item, index) => (
        item.ReturnAmount ?? 0
      ),
    },
  ];

  useEffect(() => {
    if (posState?.SaleReturnState?.ProductCodesState.length > 0) {
      setUpdatedProducts(posState?.SaleReturnState?.ProductCodesState);
    }
  }, [posState?.SaleReturnState?.ProductCodesState]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      setBarcodeValue("");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [posState]);

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

  const handlePrint = useReactToPrint({
    content: () => componentRefPrint.current,
  });

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

  function handleKeyDown(event) {
    if (event.keyCode == 13) {
      const _barcodeValue = document.getElementById("barcode-input").value;
      const response = saleReturnPromise(_barcodeValue, updatedProducts);

      barcodeInputRef.current.select();

      if (typeof response === "object") {
        setUpdatedProducts([...response]);
      } else {
        message.error(response);
      }

      if (typeof response != "string" && allow) {
        dispatch({
          type: SET_SALE_RETURN_STATE,
          payload: {
            name: "scannedProducts",
            value: [...response],
          },
        });

        document.getElementById("barcode-input").value = "";
      } else {
        console.error(response, "Error in promise");
      }
    }
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

    if (event.ctrlKey && event.shiftKey && event.keyCode == 88) {
      if (
        Object.keys(selectedOrder).length !== 0 &&
        cancelOrderStatusObj.OrderStatusId !== selectedOrder.OrderStatusId &&
        selectedOrder.IsPaid === false
      ) {
        // (true);
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
      setDstModal({ ...dstModal, terminalModal: true });
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
  }

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
    // else if (RoleId === BRANCH_ADMIN || RoleId === CASHIER) {
    //   if (dstDetail.TerminalDetailId > 0) {
    //     NewOrderOnClick();
    //   }
    // }
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
        if (response.data.DataSet.Table[0].HasError > 0) {
          data1 = response.data.DataSet.Table1[0];
          message.error(response.data.DataSet.Table[0].Message);
          return;
        }
        data1 = response.data.DataSet.Table1[0];
        setLocalState(data1);
        setDstDetail({ ...data1 });
        message.success(response.data.DataSet.Table[0].Message);
        if (
          data1.TerminalDetailId === 0 &&
          data1.ShiftDetailId === 0 &&
          data1.BusinessDayId === 0
        ) {
          navigate("/");
        }
      })
      .catch((error) => console.error(error));
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
      const orderMas = responce?.filter((item) => {
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
    template = template.replace("{companyName}", userData.CompanyName);

    template = template.replace(
      "{productNetBill}",
      (
        posState.selectedOrder.TotalAmountWithoutGST +
        posState.selectedOrder.DeliveryCharges +
        posState.selectedOrder.AdditionalServiceCharges +
        posState.selectedOrder.GSTAmount -
        posState.selectedOrder.DiscountAmount
      ).toFixed(2)
    );

    template = template.replace(
      "{totalAmount}",
      parseFloat(posState.selectedOrder.TotalAmountWithoutGST.toFixed(2)) +
      parseFloat(posState.selectedOrder.GSTAmount.toFixed(2))
    );
    template = template.replace(
      "{discountAmount}",
      posState.selectedOrder.DiscountAmount
    );
    template = template.replace("{productNetBill}");
    //Extra Charges

    {
      template = template.replace(
        "{beforeBill}",

        posState?.punchScreenData?.Table10?.filter(
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
      );
    }

    template = template.replace(
      "{branchAddress}",
      userData?.userBranchList.length > 0
        ? userData?.userBranchList[0]?.BranchAddress
        : ""
    );
    template = template.replace(
      "{orderDateTime}",
      posState.selectedOrder.OrderDate.split("T")[0]
    );

    template = template.replace(
      "{productGst}",
      posState?.selectedOrder.GSTAmount.toFixed(2)
    );
    template = template.replace(
      "{gstPercent}",
      `${posState?.selectedOrder?.GSTPercent}%`
    );
    template = template.replace("{fbrIntegration}", "");
    template = template.replace(
      "{productSubtotal}",
      posState?.selectedOrder?.TotalAmountWithoutGST
    );
    template = template.replace(
      "{orderMode}",
      posState?.customerDetail?.OrderModeName
    );
    template = template.replace(
      "{orderNumber}",
      posState?.selectedOrder?.OrderNumber
    );
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
    if (selectedOrder.OrderModeId === DELIVERY) {
      template = template.replace(
        "{finalBill}",
        `<tr>
            <td style="text-align: left; font-weight: 500; border: 0; color: #000">Delivery Charges:</td>
            <td style="text-align: right; font-weight: 500; border: 0; color: #000">${posState.selectedOrder.DeliveryCharges}
            </td>
          </tr>`
      );
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
            <td style="text-align: right; font-weight: 500; border: 0; color: #000">${posState.riderName}</td>
          </tr>`
          : `<tr></tr>`
      );
      template = template.replace(
        "{waiter}",

        `<tr></tr>`
      );
      template = template.replace("{table}", `<tr></tr>`);
    } else {
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
      template = template.replace("{finalBill}", "<tr><tr>");
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
    }

    const setPrePaymentTemplate = new Promise(
      (resolutionFunc, rejectionFunc) => {
        dispatch({
          type: SET_POS_STATE,
          payload: {
            name: "HTMLBill",
            value: template,
          },
        });
        resolutionFunc("Resolved");
      }
    );

    setPrePaymentTemplate.then((res) => {
      handlePrint();
    });
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

  const NewOrderOnClick = () => {
    startNewOrder();
    dispatch({ type: TOGGLE_ORDER_DETAIL });
    dispatch({
      type: SET_POS_STATE,
      payload: {
        name: "BranchId",
        value:
          supportingTable && supportingTable?.Table3
            ? supportingTable?.Table3[0]?.BranchId
            : null,
      },
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

      const gst = posState.gstList?.filter(
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
    <Row>
      <Col
        xs={19}
        sm={19}
        md={19}
        lg={19}
        xl={18}
        xxl={18}
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
      {isWaiterOpen && (
        <ChangeWaiterPopUp
          isModalVisible={isWaiterOpen}
          handleCancel={storeRef}
          userData={userData}
          popupIntialFormValues={popupIntialFormValues}
          closeModalOnOk={closeModalOnOk}
        />
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
      )}
      {/* Right Button Section */}
      <Col
        className="posRightDiv"
        xs={5}
        sm={5}
        md={5}
        lg={5}
        xl={6}
        xxl={6}
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
              width="110px"
              height="110px"
              className="posFormTitleButton"
              margin={"5px"}
              color="green"
              gap="5"
              onClick={() => {
                NewOrderOnClick();
              }}
              icon={<AiOutlinePlus fontSize={26} />}
              disabled={
                RoleId === BRANCH_ADMIN || RoleId === CASHIER
                  ? dstDetail.TerminalDetailId === 0
                  : RoleId === AGENT
                    ? false
                    : true
              }
              codes="(Shift + N)"
            />
            <FormTileButton
              margin={"5px"}
              title="Cancel Order"
              type="primary"
              color="red"
              width="110px"
              height="110px"
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
                        : false
              }
              codes="(Shift + C)"
            />
            <FormTileButton
              margin={"5px"}
              title="Recall Order"
              type="primary"
              width="110px"
              height="110px"
              className="posFormTitleButton"
              icon={<AiOutlineRollback fontSize={26} />}
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
                        : false
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
              width="110px"
              height="110px"
              className="posFormTitleButton"
              icon={<AiOutlineRollback fontSize={26} />}
              onClick={launchComplain}
              disabled={
                userData.RoleId === COMPANY_ADMIN
                  ? true
                  : Object.keys(selectedOrder).length === 0
                    ? true
                    : selectedOrder.OrderStatusId &&
                      cancelOrderStatusObj &&
                      selectedOrder.OrderStatusId ===
                      cancelOrderStatusObj.OrderStatusId
                      ? true
                      : false
              }
              codes="(Shift + L)"
            />
            <FormTileButton
              margin={"5px"}
              title="Change / Assign Rider"
              type="primary"
              width="110px"
              height="110px"
              className="posFormTitleButton"
              onClick={toggleRiderPopUp}
              icon={<RiEBike2Fill fontSize={26} />}
              disabled={
                userData.RoleId === COMPANY_ADMIN
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
                            : false
              }
              codes="(Shift + R)"
            />
            <ReactToPrint content={() => componentRefPrint.current}>
              <PrintContextConsumer>
                {({ handlePrint }) => (
                  <FormTileButton
                    margin={"5px"}
                    title="Pre Payment Bill"
                    type="primary"
                    width="110px"
                    height="110px"
                    className="posFormTitleButton"
                    icon={<MdReceipt fontSize={26} />}
                    onClick={() => {
                      handlePrinting(handlePrint, false);
                    }}
                    disabled={
                      userData.RoleId === COMPANY_ADMIN
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
                              : selectedOrder.OrderModeId === DELIVERY
                                ? posState.riderId === null
                                  ? true
                                  : false
                                : false
                    }
                    codes="(Shift + B)"
                  />
                )}
              </PrintContextConsumer>
            </ReactToPrint>
            <ReactToPrint content={() => componentRefPrint.current}>
              <PrintContextConsumer>
                {({ handlePrint }) => (
                  <FormTileButton
                    margin={"5px"}
                    title="Duplicate Bill"
                    type="primary"
                    width="110px"
                    height="110px"
                    className="posFormTitleButton"
                    icon={<MdReceipt fontSize={26} />}
                    onClick={() => {
                      handlePrinting(handlePrint, true);
                    }}
                    disabled={selectedOrder.IsPaid ? false : true}
                    codes="(Shift + D)"
                  />
                )}
              </PrintContextConsumer>
            </ReactToPrint>
            <FormTileButton
              margin={"5px"}
              title="Change Payment Type"
              type="primary"
              width="110px"
              height="110px"
              className="posFormTitleButton"
              onClick={toggleChangePaymentType}
              icon={<MdReceipt fontSize={26} />}
              disabled={
                userData.RoleId === COMPANY_ADMIN
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
                        : false
              }
              codes="(Shift + P)"
            />
            <FormTileButton
              margin={"5px"}
              title="Apply Discount"
              type="primary"
              width="110px"
              height="110px"
              className="posFormTitleButton"
              onClick={applyDiscount}
              icon={<MdReceipt fontSize={26} />}
              disabled={
                userData.RoleId === COMPANY_ADMIN
                  ? true
                  : Object.keys(posState.selectedOrder).length === 0
                    ? true
                    : selectedOrder.IsPaid
                      ? true
                      : selectedOrder.OrderStatusId &&
                        cancelOrderStatusaleReturuseEsObj &&
                        selectedOrder.OrderStatusId ===
                        cancelOrderStatusObj.OrderStatusId
                        ? true
                        : false
              }
              codes="(Shift + A)"
            />
            <FormTileButton
              margin={"5px"}
              title="Sale Return"
              type="primary"
              width="110px"
              height="110px"
              className="posFormTitleButton"
              disabled={
                selectedOrder.OrderStatus != "Paid" && userData.RoleId != 1
              }
              onClick={saleReturn}
              icon={<MdReceipt fontSize={26} />}
              codes="(Shift + Z)"
            />
          </Col>
          {IsPos === true && (
            <Col span={6}>
              <FormTileButton
                margin={"5px"}
                title="End Counter"
                height="70px"
                width="75px"
                className="rightTabsWhiteButton"
                icon={<FaRegStopCircle fontSize={26} />}
                onClick={() =>
                  setDstModal({ ...dstModal, terminalModal: true })
                }
                disabled={
                  RoleId === BRANCH_ADMIN || RoleId === CASHIER
                    ? dstDetail.TerminalDetailId === 0
                    : true
                }
              />
              <FormTileButton
                margin={"5px"}
                title="Start Shift"
                height="70px"
                width="75px"
                className="rightTabsWhiteButton"
                icon={<FaRegStopCircle fontSize={26} />}
                disabled={
                  RoleId === BRANCH_ADMIN || RoleId === CASHIER
                    ? dstDetail.ShiftDetailId > 0 ||
                    dstDetail.BusinessDayId === 0
                    : true
                }
              />
              <Popconfirm
                title="Are you surely want to End the Shift?"
                onConfirm={() => setDSTstate(5)}
                okText="Yes"
                cancelText="No"
              >
                <FormTileButton
                  margin={"5px"}
                  title="End Shift"
                  height="70px"
                  width="75px"
                  className="rightTabsWhiteButton"
                  icon={<FaRegStopCircle fontSize={26} />}
                  disabled={
                    RoleId === BRANCH_ADMIN || RoleId === CASHIER
                      ? dstDetail.ShiftDetailId === 0 ||
                      dstDetail.TerminalDetailId > 0
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
                  margin={"5px"}
                  title="End Day"
                  height="70px"
                  width="75px"
                  className="rightTabsWhiteButton"
                  icon={<FaRegStopCircle fontSize={26} />}
                  disabled={
                    RoleId === BRANCH_ADMIN || RoleId === CASHIER
                      ? dstDetail.TerminalDetailId > 0 ||
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
      <ModalComponent
        width={"70vw"}
        title="Sale Return"
        isModalVisible={saleReturnModal}
        footer={[
          <Button
            onClick={() => {
              dispatch({
                type: SET_POS_STATE,
                payload: {
                  name: "saleReturnMode",
                  value: false,
                },
              });
              setSaleReturnModal(false);
              dispatch({
                type: SET_SALE_RETURN_STATE,
                payload: {
                  name: "scannedProducts",
                  value: [],
                },
              });
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
                  ref={btnRef}
                >
                  Done
                </Button>
              )}
            </PrintContextConsumer>
          </ReactToPrint>,
        ]}
      >
        <Spin spinning={saleReturnLoading} tip="Loading...">
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
            <FormTextField
              colSpan={12}
              label="Add product with barcode"
              name="barcode-input"
              type="text"
              ref={barcodeInputRef}
              id="barcode-input"
              style={{ margin: "0 0 15px" }}
              onChange={() => true}
            />
            <FormTextField
              colSpan={12}
              label="Search"
              name="search"
              type="text"
              id="search"
              value={search}
              onChange={(e) => setSearch(e.value)}
              style={{ margin: "0 0 15px" }}
            />
            <Table
              style={{ width: "100%" }}
              columns={columnForDealOption}
              rowKey={(record) => record.OrderDetailId}
              dataSource={updatedProducts.filter((item) =>
                item.Product.toLowerCase().includes(
                  search.toLowerCase()
                )
              )
              }
              pagination={false}
              className="posOrderDetailTable"
            />
          </Col>
        </Spin>
      </ModalComponent>
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
  );
};
export default PointOfSaleRetail;
