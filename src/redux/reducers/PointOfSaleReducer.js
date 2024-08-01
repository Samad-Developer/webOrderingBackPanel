import { DELIVERY, DINE_IN, TAKE_AWAY } from "../../common/SetupMasterEnum";
import {
  ADD_TO_CART,
  CLOSE_DRAWERS,
  OPEN_CUSTOMER,
  OPEN_CUSTOMER_TABLE,
  OPEN_PRODUCT,
  OPEN_PUNCH,
  RESET_DEFAULT_POS_STATE,
  SET_CART_RANDOM_ID_STATE,
  SET_CUSTOMER_DETAIL,
  SET_RESERVATION_DETAIL,
  SET_CUSTOMER_SUPPORTING_SINGLE_TABLE,
  SET_CUSTOMER_SUPPORTING_TABLE,
  SET_RESERVATION_SUPPORTING_TABLE,
  SET_GST,
  SET_GST_AMOUNT,
  SET_HOLD_ORDER,
  SET_POS_STATE,
  SET_RECALL_ORDER,
  TOGGLE_ORDER_DETAIL,
  UPDATE_PRODUCT_CART,
  SALE_RETURN_MODE,
  CLOSE_SALE_RETURN_MODE,
  SET_SALE_RETURN_STATE,
  SET_ORDER_MODE_LIST,
  SET_ORDER_SOURCE_LIST,
  SET_ORDER_SOURCE,
  SET_PRINTING_TEMPLATE,
} from "../reduxConstants";

const initialState = {
  OrderMasterId: null,
  customerTableDrawer: false,
  punchDrawer: false,
  customerDrawer: false,
  customerEditDrawer: false,
  productDrawer: false,
  saleReturnMode: false,
  customerSupportingTable: {},
  reservationSupportingTable: {},
  recallOrder: false,
  GSTId: null,
  GSTPercentage: 0,
  customerDetail: {
    OrderMode: null,
    OrderModeName: "",
    BranchId: null,
    BranchDetailId: null,
    CustomerId: null,
    CustomerAddressId: null,
    PhoneNumber: null,
    PhoneId: null,
    AreaId: null,
    CustomerName: null,
    Address: null,
    CompleteAddress: null,
    GSTId: null,
    GSTPercentage: 0,
  },
  reservationDetail: {
    ReservationId: null,
    ReservationDate: null,
    Email: null,
    CNIC: null,
    Event: null,
    NoOfAdults: null,
    NoOfChildren: null,
    TotalAdvance: null,
    Comments: null,
    ReservationStatusId: null,
    CustomerId: null,
    PhoneId: null,
    CustomerAddressId: null,
    BranchId: null,
    PhoneNumber: null,
    ReservationNumber: null,
    ReservationDetail: [],
    TableId: null,
  },
  selectedCategory: null,
  punchScreenData: {},
  selectedProductId: null,
  IsDealDirectPunch: false,
  dealItemsList: [],
  selectedSizeId: null,
  selectedFlavourId: null,
  editCartIndex: null,
  productCart: [],
  netAmount: null,
  waiterId: null,
  waiterName: "",
  tableId: null,
  tableName: "",
  riderId: null,
  ridersList: [],
  riderName: "",
  coverId: 0,
  deliveryCharges: 0,
  deliveryTime: null,
  deliveryTimeList: [],
  selectedOrder: {},
  cancelOrderStatusObj: {},
  IsAdvanceOrder: false,
  AdvanceOrderDate: null,
  FromDate: new Date(),
  ToDate: new Date(),
  selectedDiscount: [],
  billPaymentOptionModal: false,
  prices: {
    withoutGst: "",
    withGst: "",
    gst: "",
    discountAmt: "",
  },
  orderSourceId: null,
  orderSourceName: "",
  seletedOrderItems: [],
  HTMLToPrint: "",
  SalesReceiptHtmlTemplate: "",
  HTMLBill: "",
  KOTPrint: "",
  dealSelection: false,
  AlternateNumber: "",
  CLINumber: "",
  CareOfId: null,
  PaymentTypeId: null,
  FinishWasteReasonId: null,
  FinishWasteRemarks: "",
  BillPrintCount: 0,
  Remarks: "",
  OrderDetailAdd: [],
  OrderDetailLess: [],
  selectedRider: {},
  OrderStatusId: null,
  randomId: null,
  BranchId: null,
  BranchName: "",
  selectedOrderModal: false,
  gstList: [],
  paymentTypeList: [],
  updateGetOrderList: false,
  DiscountId: null,
  DiscountPercent: 0,
  Discount: {},
  SaleReturnState: {
    scannedProducts: [],
    ProductCodesState: [],
  },
  templateList: [],
  orderModeList: [],
  orderSourceList: [],
  printingTemplate: "",
  paymentModeList: [],
  FbrInvoiceNo: "0000000",
  SrbInvoiceNo: "0000000",
};

const PointOfSaleReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case SALE_RETURN_MODE:
      return {
        ...state,
        saleReturnMode: true,
      };
    case CLOSE_SALE_RETURN_MODE:
      return {
        ...state,
        saleReturnMode: false,
      };
    case OPEN_CUSTOMER_TABLE:
      return {
        ...state,
        orderModeDrawer: false,
        customerTableDrawer: true,
        punchDrawer: false,
        customerDrawer: false,
        productDrawer: false,
      };
    case OPEN_PUNCH:
      return {
        ...state,
        orderModeDrawer: false,
        customerTableDrawer: false,
        punchDrawer: true,
        customerDrawer: false,
        productDrawer: false,
      };
    case OPEN_CUSTOMER:
      return {
        ...state,
        orderModeDrawer: false,
        customerTableDrawer: false,
        punchDrawer: false,
        customerDrawer: true,
        productDrawer: false,
      };
    case OPEN_PRODUCT:
      return {
        ...state,
        orderModeDrawer: false,
        customerTableDrawer: false,
        punchDrawer: false,
        customerDrawer: false,
        productDrawer: true,
      };
    case CLOSE_DRAWERS:
      return {
        ...state,
        orderModeDrawer: false,
        customerTableDrawer: false,
        punchDrawer: false,
        customerDrawer: false,
        productDrawer: false,
      };
    case SET_POS_STATE:
      return {
        ...state,
        [payload.name]: payload.value,
      };
    case SET_SALE_RETURN_STATE:
      return {
        ...state,
        SaleReturnState: {
          ...state.SaleReturnState,
          [payload.name]: payload.value,
        },
      };
    case SET_CUSTOMER_DETAIL:
      return {
        ...state,
        customerDetail: { ...state.customerDetail, ...payload },
      };
    case SET_RESERVATION_DETAIL:
      return {
        ...state,
        reservationDetail: { ...state.reservationDetail, ...payload },
      };
    case SET_CUSTOMER_SUPPORTING_TABLE:
      return { ...state, customerSupportingTable: payload };
    case SET_RESERVATION_SUPPORTING_TABLE:
      return { ...state, reservationSupportingTable: payload };
    case SET_CUSTOMER_SUPPORTING_SINGLE_TABLE:
      return {
        ...state,
        customerSupportingTable: {
          ...state.customerSupportingTable,
          [payload.name]: payload.value,
        },
      };
    case ADD_TO_CART:
      return {
        ...state,
        productCart: payload,
      };
    case RESET_DEFAULT_POS_STATE:
      return {
        ...state,
        OrderMasterId: null,
        customerTableDrawer: false,
        punchDrawer: false,
        customerDrawer: false,
        customerEditDrawer: false,
        productDrawer: false,
        GSTId: null,
        GSTPercentage: null,
        customerDetail: {
          OrderMode:
            payload.BusinessTypeId === 1
              ? payload.RoleId === 3
                ? DELIVERY
                : DINE_IN
              : payload.RoleId === 3
              ? DELIVERY
              : TAKE_AWAY,
          OrderModeName:
            payload.BusinessTypeId === 1
              ? payload.RoleId === 3
                ? "Delivery"
                : "Dine-In"
              : payload.RoleId === 3
              ? "Delivery"
              : "Take Away",
          BranchId: null,
          BranchDetailId: null,
          CustomerId: null,
          CustomerAddressId: null,
          PhoneNumber: null,
          PhoneId: null,
          AreaId: null,
          CustomerName: null,
          Address: null,
          GSTId: null,
          GSTPercentage: 0,
        },
        reservationDetail: {
          ReservationId: null,
          ReservationDate: null,
          Email: null,
          CNIC: null,
          Event: null,
          NoOfAdults: null,
          NoOfChildren: null,
          TotalAdvance: null,
          Comments: null,
          ReservationStatusId: null,
          CustomerId: null,
          PhoneId: null,
          CustomerAddressId: null,
          BranchId: null,
          PhoneNumber: null,
          ReservationNumber: null,
          ReservationDetail: [],
          TableId: null,
        },
        selectedCategory: null,
        selectedProductId: null,
        IsDealDirectPunch: false,
        dealItemsList: [],
        selectedProductIdEdit: false,
        selectedSizeId: null,
        selectedFlavourId: null,
        editCartIndex: null,
        productCart: [],
        netAmount: null,
        waiterId: null,
        waiterName: "",
        tableId: null,
        tableName: "",
        riderId: null,
        ridersList: [],
        coverId: 0,
        deliveryCharges: 0,
        deliveryTime: null,
        deliveryTimeList: [],
        selectedOrder: {},
        cancelOrderStatusObj: {},
        IsAdvanceOrder: false,
        AdvanceOrderDate: null,
        FromDate: new Date(),
        ToDate: new Date(),
        selectedDiscount: [],
        prices: {
          withoutGst: "",
          withGst: "",
          gst: "",
          discountAmt: "",
        },
        extraCharges: [],
        dealSelection: false,
        KOTPrint: "",
        orderSourceId: null,
        orderSourceName: "",
        seletedOrderItems: [],
        AlternateNumber: "",
        CLINumber: "",
        CareOfId: null,
        PaymentTypeId: null,
        BillPrintCount: 0,
        Remarks: "",
        OrderDetailAdd: [],
        OrderDetailLess: [],
        selectedRider: {},
        randomId: null,
        BranchId: null,
        BranchName: "",
        selectedOrderModal: false,
        DiscountId: null,
        DiscountPercent: 0,
        Discount: {},
      };
    case SET_RECALL_ORDER:
      return {
        ...state,
        OrderMasterId: payload.OrderMasterId,
        punchDrawer: true,
        customerDetail: {
          OrderMode: payload.OrderModeId,
          OrderModeName: payload.OrderMode,
          BranchId: payload.BranchId,
          BranchDetailId: payload.null,
          CustomerId: payload.CustomerId,
          CustomerAddressId: payload.CustomerAddressId,
          PhoneNumber: payload.PhoneNumber,
          PhoneId: payload.PhoneId,
          AreaId: payload.AreaId,
          CustomerName: payload.null,
          Address: payload.null,
          GSTId: payload.GSTId,
          GSTPercentage: payload.GSTPercent,
        },
        GSTId: payload.GSTId,
        netAmount: null,
        waiterId: payload.WaiterId,
        waiterName: payload.WaiterName,
        tableId: payload.TableId,
        tableName: payload.TableName,
        riderId: payload.RiderId,
        coverId: payload.Cover,
        deliveryCharges: payload.DeliveryCharges,
        deliveryTime: payload.DeliveryTime,
        selectedOrder: {
          ...state.selectedOrder,
          DiscountId: payload.DiscountId,
          DiscountPercent: payload.DiscountPercent,
        },
        IsAdvanceOrder: payload.IsAdvanceOrder,
        AdvanceOrderDate: payload.AdvanceOrderDate,
        prices: {
          withoutGst: payload.TotalAmountWithoutGST,
          withGst: payload.TotalAmountWithGST,
          gst: payload.GSTAmount,
          discountAmt: payload.DiscountAmount,
        },
        orderSourceId: payload.OrderSourceId,
        orderSourceName: payload.OrderSourceName,
        AlternateNumber: payload.AlternateNumber,
        CLINumber: payload.CLINumber,
        CareOfId: payload.CareOfId,
        PaymentTypeId: payload.PaymentTypeId,
        FinishWasteReasonId: payload.FinishWasteReasonId,
        FinishWasteRemarks: payload.FinishWasteRemarks,
        BillPrintCount: payload.BillPrintCount,
        Remarks: payload.SpecialInstruction,
        OrderStatusId: payload.OrderStatusId,
        BranchId: payload.BranchId,
        BranchName: payload.BranchName,
        selectedOrderModal: false,
        DiscountId: payload.DiscountId,
        DiscountPercent: payload.DiscountPercent,
      };
    case UPDATE_PRODUCT_CART:
      return {
        ...state,
        productCart: payload,
      };
    case SET_CART_RANDOM_ID_STATE:
      return { ...state, randomId: payload };
    case SET_GST_AMOUNT:
      return { ...state, prices: { ...state.prices, gst: payload } };
    case SET_GST:
      return {
        ...state,
        GSTId: payload.GSTId,
        GSTPercentage: payload.GSTPercentage,
      };
    case TOGGLE_ORDER_DETAIL:
      return { ...state, selectedOrderModal: !state.selectedOrderModal };
    case SET_HOLD_ORDER:
      return {
        ...state,
        OrderMasterId: payload.OrderMasterId,
        customerTableDrawer: payload.customerTableDrawer,
        punchDrawer: payload.punchDrawer,
        customerDrawer: payload.customerDrawer,
        customerEditDrawer: payload.customerEditDrawer,
        productDrawer: payload.productDrawer,
        customerSupportingTable: payload.customerSupportingTable,
        reservationSupportingTable: payload.reservationSupportingTable,
        recallOrder: payload.recallOrder,
        GSTId: payload.GSTId,
        GSTPercentage: payload.GSTPercentage,
        customerDetail: payload.customerDetail,
        reservationDetail: payload.reservationDetail,
        selectedCategory: payload.selectedCategory,
        punchScreenData: payload.punchScreenData,
        selectedProductId: payload.selectedProductId,
        selectedSizeId: payload.selectedSizeId,
        selectedFlavourId: payload.selectedFlavourId,
        editCartIndex: payload.editCartIndex,
        productCart: payload.productCart,
        netAmount: payload.netAmount,
        waiterId: payload.waiterId,
        waiterName: payload.waiterName,
        tableId: payload.tableId,
        tableName: payload.tableName,
        riderId: payload.riderId,
        riderName: payload.riderName,
        coverId: payload.coverId,
        deliveryCharges: payload.deliveryCharges,
        deliveryTime: payload.deliveryTime,
        deliveryTimeList: payload.deliveryTimeList,
        selectedOrder: payload.selectedOrder,
        cancelOrderStatusObj: payload.cancelOrderStatusObj,
        IsAdvanceOrder: payload.IsAdvanceOrder,
        AdvanceOrderDate: payload.AdvanceOrderDate,
        FromDate: payload.FromDate,
        ToDate: payload.ToDate,
        selectedDiscount: payload.selectedDiscount,
        prices: payload.prices,
        orderSourceId: payload.orderSourceId,
        orderSourceName: payload.orderSourceName,
        seletedOrderItems: payload.seletedOrderItems,
        HTMLToPrint: payload.HTMLToPrint,
        SalesReceiptHtmlTemplate: payload.SalesReceiptHtmlTemplate,
        HTMLBill: payload.HTMLBill,
        KOTPrint: payload.KOTPrint,
        dealSelection: payload.dealSelection,
        AlternateNumber: payload.AlternateNumber,
        CLINumber: payload.CLINumber,
        CareOfId: payload.CareOfId,
        PaymentTypeId: payload.PaymentTypeId,
        FinishWasteReasonId: payload.FinishWasteReasonId,
        FinishWasteRemarks: payload.FinishWasteRemarks,
        BillPrintCount: payload.BillPrintCount,
        Remarks: payload.Remarks,
        OrderDetailAdd: payload.OrderDetailAdd,
        OrderDetailLess: payload.OrderDetailLess,
        selectedRider: payload.selectedRider,
        OrderStatusId: payload.OrderStatusId,
        randomId: payload.randomId,
        BranchId: payload.BranchId,
        BranchName: payload.BranchName,
        selectedOrderModal: payload.selectedOrderModal,
        gstList: payload.gstList,
        paymentTypeList: payload.paymentTypeList,
        updateGetOrderList: payload.updateGetOrderList,
        orderModeDrawer: payload.orderModeDrawer,
        extraCharges: payload.extraCharges,
        selectedProductIdEdit: payload.selectedProductIdEdit,
      };
    case SET_ORDER_MODE_LIST:
      return {
        ...state,
        orderModeList: payload,
      };
    case SET_ORDER_SOURCE_LIST:
      return {
        ...state,
        orderSourceList: payload,
      };
    case SET_ORDER_SOURCE:
      return {
        ...state,
        orderSourceId: payload.id,
        orderSourceName: payload.name,
      };
    case SET_PRINTING_TEMPLATE:
      return {
        ...state,
        printingTemplate: payload,
      };
    default:
      return { ...state };
  }
};

export default PointOfSaleReducer;
