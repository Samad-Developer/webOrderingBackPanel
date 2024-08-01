import { DELIVERY, DINE_IN, TAKE_AWAY } from "../../common/SetupMstrEnum";
import {
  SP_ADD_TO_CART,
  SP_CLOSE_DRAWERS,
  SP_OPEN_CUSTOMER,
  SP_OPEN_CUSTOMER_TABLE,
  SP_OPEN_PRODUCT,
  SP_OPEN_PUNCH,
  SP_RESET_DEFAULT_POS_STATE,
  SP_SET_CART_RANDOM_ID_STATE,
  SP_SET_CUSTOMER_DETAIL,
  SP_SET_CUSTOMER_SUPPORTING_SINGLE_TABLE,
  SP_SET_CUSTOMER_SUPPORTING_TABLE,
  SP_SET_GST,
  SP_SET_GST_AMOUNT,
  SP_SET_HOLD_ORDER,
  SP_SET_POS_STATE,
  SP_SET_RECALL_ORDER,
  SP_TOGGLE_ORDER_DETAIL,
  SP_UPDATE_PRODUCT_CART,
  SP_SALE_RETURN_MODE,
  SP_CLOSE_SALE_RETURN_MODE,
  SP_SET_SALE_RETURN_STATE,
  SP_SET_ORDER_MODE_LIST,
  SP_SET_ORDER_SOURCE_LIST,
  SP_SET_ORDER_SOURCE,
  SP_SET_PRINTING_TEMPLATE,
  SP_SET_ORDER_MODE,
} from "../reduxConstantsSinglePagePOS";

const initialState = {
  OrderMasterId: null,
  customerTableDrawer: false,
  punchDrawer: false,
  customerDrawer: false,
  customerEditDrawer: false,
  productDrawer: false,
  saleReturnMode: false,
  customerSupportingTable: {},
  recallOrder: false,
  GSTId: null,
  GSTPercentage: 0,
  customerDetail: {
    BranchDetailId: null,
    CustomerId: null,
    CustomerAddressId: null,
    PhoneNumber: null,
    PhoneId: null,
    AreaId: null,
    CustomerName: null,
    Address: null,
    CompleteAddress: null,
  },
  OrderModeId: null,
  OrderModeName: "",
  BranchId: null,
  // GSTId: null,
  // GSTPercentage: 0,
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
  extraCharges: [],
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

const SinglePagePOSReducers = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case SP_SALE_RETURN_MODE:
      return {
        ...state,
        saleReturnMode: true,
      };
    case SP_CLOSE_SALE_RETURN_MODE:
      return {
        ...state,
        saleReturnMode: false,
      };
    case SP_OPEN_CUSTOMER_TABLE:
      return {
        ...state,
        orderModeDrawer: false,
        customerTableDrawer: true,
        punchDrawer: false,
        customerDrawer: false,
        productDrawer: false,
      };
    case SP_OPEN_PUNCH:
      return {
        ...state,
        orderModeDrawer: false,
        customerTableDrawer: false,
        punchDrawer: true,
        customerDrawer: false,
        productDrawer: false,
      };
    case SP_OPEN_CUSTOMER:
      return {
        ...state,
        orderModeDrawer: false,
        customerTableDrawer: false,
        punchDrawer: false,
        customerDrawer: true,
        productDrawer: false,
      };
    case SP_OPEN_PRODUCT:
      return {
        ...state,
        orderModeDrawer: false,
        customerTableDrawer: false,
        punchDrawer: false,
        customerDrawer: false,
        productDrawer: true,
      };
    case SP_CLOSE_DRAWERS:
      return {
        ...state,
        orderModeDrawer: false,
        customerTableDrawer: false,
        punchDrawer: false,
        customerDrawer: false,
        productDrawer: false,
      };
    case SP_SET_POS_STATE:
      return {
        ...state,
        [payload.name]: payload.value,
      };
    case SP_SET_SALE_RETURN_STATE:
      return {
        ...state,
        SaleReturnState: {
          ...state.SaleReturnState,
          [payload.name]: payload.value,
        },
      };
    case SP_SET_CUSTOMER_DETAIL:
      return {
        ...state,
        customerDetail: { ...state.customerDetail, ...payload },
      };
    case SP_SET_CUSTOMER_SUPPORTING_TABLE:
      return { ...state, customerSupportingTable: payload };
    case SP_SET_CUSTOMER_SUPPORTING_SINGLE_TABLE:
      return {
        ...state,
        customerSupportingTable: {
          ...state.customerSupportingTable,
          [payload.name]: payload.value,
        },
      };
    case SP_ADD_TO_CART:
      return {
        ...state,
        productCart: payload,
      };
    case SP_RESET_DEFAULT_POS_STATE:
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
        OrderModeId: null,
        OrderModeName: "",
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
      };
    case SP_SET_RECALL_ORDER:
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
    case SP_UPDATE_PRODUCT_CART:
      return {
        ...state,
        productCart: payload,
      };
    case SP_SET_CART_RANDOM_ID_STATE:
      return { ...state, randomId: payload };
    case SP_SET_GST_AMOUNT:
      return { ...state, prices: { ...state.prices, gst: payload } };
    case SP_SET_GST:
      return {
        ...state,
        GSTId: payload.GSTId,
        GSTPercentage: payload.GSTPercentage,
      };
    case SP_TOGGLE_ORDER_DETAIL:
      return { ...state, selectedOrderModal: !state.selectedOrderModal };
    case SP_SET_HOLD_ORDER:
      return {
        ...state,
        OrderMasterId: payload.OrderMasterId,
        customerTableDrawer: payload.customerTableDrawer,
        punchDrawer: payload.punchDrawer,
        customerDrawer: payload.customerDrawer,
        customerEditDrawer: payload.customerEditDrawer,
        productDrawer: payload.productDrawer,
        customerSupportingTable: payload.customerSupportingTable,
        recallOrder: payload.recallOrder,
        GSTId: payload.GSTId,
        GSTPercentage: payload.GSTPercentage,
        customerDetail: payload.customerDetail,
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
    case SP_SET_ORDER_MODE_LIST:
      return {
        ...state,
        orderModeList: payload,
      };
    case SP_SET_ORDER_SOURCE_LIST:
      return {
        ...state,
        orderSourceList: payload,
      };
    case SP_SET_ORDER_SOURCE:
      return {
        ...state,
        orderSourceId: payload.id,
        orderSourceName: payload.name,
      };
    case SP_SET_ORDER_MODE:
      return {
        ...state,
        OrderModeId: payload.id,
        OrderModeName: payload.name,
      };
    case SP_SET_PRINTING_TEMPLATE:
      return {
        ...state,
        printingTemplate: payload,
      };
    default:
      return { ...state };
  }
};

export default SinglePagePOSReducers;
