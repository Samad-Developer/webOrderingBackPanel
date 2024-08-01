import React, { Fragment, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Navigate,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { setUserData } from "../redux/actions/authAction";

/** Routing Pages */
import ForgotPassword from "../authentication/ForgotPassword";
import Login from "../authentication/Login";
import SignUp from "../authentication/SignUp";
import MainLayout from "../layout/MainLayout";
import Dashboard from "../screens/Dashboard";
import Users from "../screens/Users";
import ChangePassword from "../screens/ChangePassword";
import Cities from "../screens/Cities";
import Areas from "../screens/Areas";
import OrderMode from "../screens/OrderMode";
import Categories from "../screens/Categories";
import OrderSource from "../screens/OrderSource";
import MenuPage from "../screens/MenuPage";
import Product from "../screens/Product";
import ProductSize from "../screens/ProductSize";
import ProductDetails from "../screens/ProductDetails";
import Branches from "../screens/Branches";
import ComplainCategory from "../screens/ComplainCategory";
import Deal from "../screens/Deal";
import ProductMapping from "../screens/ProductMapping";
import ComplaintManagement from "../screens/ComplaintManagement";
import Department from "../screens/Department";
import DiscountManagement from "../screens/DiscountManagement";
import Country from "../screens/Country";
import Flavour from "../screens/Flavour";
import PointOfSale from "../screens/PointOfSale";
import Province from "../screens/Province";
import Waiter from "../screens/Waiter";
import Table from "../screens/Table";
import Rider from "../screens/Rider";
import Error500 from "../errors/Error500";
import Error404 from "../errors/Error404";
import Gst from "../screens/Gst";
import DiscountDetails from "../screens/DiscountDetails";
import Terminal from "../screens/Terminals";
import Shift from "../screens/Shift";
import BillManagement from "../screens/BillManagement";
import Reports from "../screens/Reports";
import ProductReports from "../screens/Reports/ProductReports/index";
import RiderWaiterPerformanceReport from "../screens/Reports/WaiterRiderPerformance/index";
import RevokeTerminalAccess from "../screens/RevokeTerminalAccess/index";
import Recipe from "../screens/Inventory/Recipe/index";
import Vendor from "../screens/Inventory/Vendors/index";
import Inventory from "../screens/Inventory/inventory";
import Bill from "../screens/Inventory/Bill";
import Batch from "../screens/Inventory/Batch";
import GoodRecieving from "../screens/Inventory/GoodRecieving";
import PurchaseOrder from "../screens/Inventory/PurchaseOrder";
import PurchaseRequisition from "../screens/Inventory/PurchaseRequisition";
import Recipie from "../screens/Inventory/Recipe/index";
import SubRecipieProduction from "../screens/Inventory/SubRecipieProduction";
import Unit from "../screens/Inventory/Unit";
import GRN from "../screens/Inventory/Grn/index";
import ClosingInventory from "../screens/Inventory/ClosingInventory/index";
import Issuance from "../screens/Inventory/Issuance";
import Requisition from "../screens/Inventory/Requisition";
import Demand from "../screens/Inventory/Demand";
import Transfer from "../screens/Inventory/Transfer";
import BranchRecieving from "../screens/Inventory/BranchReceiving";
import Wastage from "../screens/Inventory/Wastage";
import Adjustment from "../screens/Inventory/Adjustment";
import StockReport from "../screens/Inventory/StockReport";
import BulkUpload from "../screens/BulkUpload";
import CompanyProfile from "../screens/CompanyProfile";
import KitchenDisplayScreen from "../screens/KitchenDisplayScreen";
import WastageReport from "../screens/Report/WastageReport";
import NewWastageReport from "../screens/Reports/WastageReport";
import SalesSummaryReport from "../screens/Reports/SalesSummaryReport";
import DiscountDetailReport from "../screens/Reports/DiscountDetailReport";
import ItemVoidReport from "../screens/Reports/ItemVoidReport";
import ExtraCharges from "../screens/ExtraCharges";
import CancelOrderReport from "../screens/Reports/CancelOrderReport";
import ProductMixReport from "../screens/Reports/ProductMixReport";
import TopSellingReport from "../screens/Reports/TopSellingReport";
import Podms from "../screens/ODMS/Podms";
// import BoldReportTest from "../screens/Reports/BoldReportTest";
import ExpenseType from "../screens/Financial/ExpenseType";
import BankSetup from "../screens/Financial/BankSetup";
import Expense from "../screens/Financial/Expense";
import ChartOfAccount from "../screens/Financial/ChartOfAccount";
import CashBook from "../screens/Financial/CashBook";
import GeneralLedger from "../screens/Financial/GeneralLedger";
import PayOff from "../screens/Financial/PayOff";
import CashBankIn from "../screens/Financial/CashBankIn";
import ClosingReport from "../screens/Reports/ClosingReport";
import ItemLedger from "../screens/Reports/ItemLedger";
import IssuenceDetailReport from "../screens/Reports/IssuenceDetailReport";
import BranchRecievingReport from "../screens/Reports/BranchReceiving";
import Barcode from "../screens/Barcode";
import BranchActivityReport from "../screens/Reports/BranchActivity";
import RoleAccess from "../screens/RoleAccess";
import { SET_COLLAPSABLE } from "../redux/reduxConstants";
import TransferDetailReport from "../screens/Reports/TransferDetailReport";
import DemandVsIssuence from "../screens/Reports/DemandvsIssuence/Index";
import InventoryItemReport from "../screens/Reports/InventoryItemReport";
import VarianceReport from "../screens/Reports/Variance";
import CompanyEdit from "../screens/CompanyEdit";
import CommissionDetailReport from "../screens/Reports/CommissionDetailReport";
import BranchStockReport from "../screens/Reports/StockReport";
import BranchStockReportBrWise from "../screens/Reports/StockReportBatchW";
import ConsumtionpDetailReport from "../screens/Reports/ConsumptionDetailReport";
import SalesReturn from "../screens/SalesReturn/Index";
import PNLReport from "../screens/Reports/PNLReport";
import Role from "../screens/Role";
import { InventoryProductRate } from "../screens/Reports/InventoryProductRate";
import EstimatedFoodCostSummary from "../screens/Reports/EstimatedFoodCostSummary";
import EstimatedFoodCostDetail from "../screens/Reports/EstimatedFoodCostDetail";
import PointSetup from "../screens/PointSetup";
import LoyaltyCustomer from "../screens/LoyaltyCustomer";
import LoyaltyTypes from "../screens/LoyaltyTypes";
import { InventroyVarianceReport } from "../screens/Reports/InventroyVarianceReport";
import { ProductEfficiencyReport } from "../screens/Reports/ProductEfficiencyReport";
import EmployeeMeal from "../screens/EmployeeMeal";
import EmployeeMealApproval from "../screens/EmployeeMealApproval";
import PaymentMode from "../screens/PaymentMode";
import ProductUseReport from "../screens/Reports/ProductUseReport";
import DailySaleReport from "../screens/Reports/DailySaleReport";
import HourlySaleReport from "../screens/Reports/HourlySaleReport";
import CustomerSalesReport from "../screens/Reports/CustomerSalesReport";
import CompanySettings from "../screens/CompanySettings";
import { TheoriticalVarianceReport } from "../screens/Reports/TheoriticalVarianceReport";
import WebOrdering from "../screens/WebOrdering";
import ProductCostingReports from "../screens/Reports/ProductCostingReport";
import InventoryItemByProduct from "../screens/Reports/InventoryItemByProduct";
import CustomerReceivable from "../screens/PayableAndReceivable/CustomerReceivable";
import Invoice from "../screens/Inventory/Invoice";
import VendorPayable from "../screens/PayableAndReceivable/VendorPayable";
import ProductInDealReport from "../screens/Reports/ProductInDealReport";
import ProductUseDetailReport from "../screens/Reports/ProductUseDetailReport";
import AgentSalesReport from "../screens/Reports/AgentSalesReport";
import ProductSalesByOrderSourceReport from "../screens/Reports/ProductSalesByOrderSourceReport";
import ODMSorderDetailReport from "../screens/Reports/ODMSorderDetailReport";
import CustomerInformationReport from "../screens/Reports/CustomerInformationReport";
import OrderDeliveryStatusReport from "../screens/Reports/OrderDeliveryStatusReport";
import HourlyProductSaleReport from "../screens/Reports/HourlyProductSaleReport";
import CustomerReceivableNew from "../screens/PayableAndReceivable/CustomerReceivable/indexCr";
import PrinterDepartmentMapping from "../screens/PrinterDepartmentMapping";
import BranchOrderSource from "../screens/BranchOrderSource";
import PunchingScreen from "../screens/PunchingScreen/index";
import GenerateQRMenu from "../screens/GenerateQRMenu";
import CompanyDetailSettings from "../screens/CompanyDetailSettings";
import Reservation from "../screens/Reservation";
import GoodReceivingReturn from "../screens/Inventory/GoodReceivingReturn";
import ExpenseReport from "../screens/Reports/ExpenseReport";
import ReservationGuest from "./../screens/ReservationGuests/index";
import ProductRemoteCode from "../screens/ProductRemoteCode";

const AppRoutes = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.authReducer);
  const location = useLocation();
  const { pathname } = location;

  const UserAuthenticationCheck = ({ children, route = "" }) => {
    if (userInfo.isAuthenticated && userInfo.token !== null) {
      if (route === "forgotpassword" || route === "signup" || route === "login")
        return <Navigate to="/" replace />;
      return children;
    } else {
      if (route === "forgotpassword" || route === "signup" || route === "login")
        return children;
      return <Navigate to="login" replace />;
    }
  };

  const RoleAuthentication = ({ children, url }) => {
    let _auth = userInfo?.menuList?.some(
      (item) => item.Menu_URL?.toLowerCase() == url?.toLowerCase()
    );
    if (!url || _auth || url === "private") {
      return children;
    } else {
      return <Navigate to="pagenotfound" replace />;
    }
  };

  useEffect(() => {
    if (!userInfo.isAuthenticated && userInfo.token === null) {
      dispatch(setUserData(navigate, pathname));
    }
  }, []);

  useEffect(() => {
    if (
      window.location.pathname === "/login/login" ||
      (window.location.pathname === "/login" &&
        userInfo.isAuthenticated &&
        userInfo.token !== null)
    ) {
      navigate("/");
    }
  }, [window.location.pathname]);

  return (
    <Routes>
      {userInfo.isAuthenticated && userInfo.token !== null && (
        <Fragment>
          <Route
            path="punchingscreen"
            element={
              <RoleAuthentication url="private">
                <PunchingScreen />
              </RoleAuthentication>
            }
          />
          <Route
            path="/"
            element={
              <UserAuthenticationCheck>
                <MainLayout />
              </UserAuthenticationCheck>
            }
          >
            {/* GENERAL SETUP & POS | ODMS */}
            <Route
              index
              element={
                <RoleAuthentication url="private">
                  <Dashboard />
                </RoleAuthentication>
              }
            />
            <Route
              path="customerreceivable"
              element={
                <RoleAuthentication url="customerreceivable">
                  <CustomerReceivableNew /> {/* <CustomerReceivable /> */}
                </RoleAuthentication>
              }
            />
            <Route
              path="generateQRMenu"
              element={
                <RoleAuthentication url="generateQRMenu">
                  <GenerateQRMenu />
                </RoleAuthentication>
              }
            />
            <Route
              path="vendorpayable"
              element={
                <RoleAuthentication url="vendorpayable">
                  <VendorPayable />
                </RoleAuthentication>
              }
            />
            <Route
              path="productindealreport"
              element={
                <RoleAuthentication url="productindealreport">
                  <ProductInDealReport />
                </RoleAuthentication>
              }
            />
            <Route
              path="companyDetailSettings"
              element={
                <RoleAuthentication url="companyDetailSettings">
                  <CompanyDetailSettings />
                </RoleAuthentication>
              }
            />
            <Route
              path="users"
              element={
                <RoleAuthentication url="users">
                  <Users />
                </RoleAuthentication>
              }
            />
            <Route
              path="changepassword"
              element={
                <RoleAuthentication url="private">
                  <ChangePassword />
                </RoleAuthentication>
              }
            />

            <Route
              path="cities"
              element={
                <RoleAuthentication url="cities">
                  <Cities />
                </RoleAuthentication>
              }
            />

            <Route
              path="agentsalesreport"
              element={
                <RoleAuthentication url="agentsalesreport">
                  <AgentSalesReport />
                </RoleAuthentication>
              }
            />

            <Route
              path="ProductSalesByOrderSourceReport"
              element={
                <RoleAuthentication url="ProductSalesByOrderSourceReport">
                  <ProductSalesByOrderSourceReport />
                </RoleAuthentication>
              }
            />

            <Route
              path="ODMSorderDetailReport"
              element={
                <RoleAuthentication url="ODMSorderDetailReport">
                  <ODMSorderDetailReport />
                </RoleAuthentication>
              }
            />

            <Route
              path="CustomerInformationReport"
              element={
                <RoleAuthentication url="CustomerInformationReport">
                  <CustomerInformationReport />
                </RoleAuthentication>
              }
            />

            <Route
              path="OrderDeliveryStatusReport"
              element={
                <RoleAuthentication url="OrderDeliveryStatusReport">
                  <OrderDeliveryStatusReport />
                </RoleAuthentication>
              }
            />

            <Route
              path="areas"
              element={
                <RoleAuthentication url="areas">
                  <Areas />
                </RoleAuthentication>
              }
            />
            <Route
              path="salesReturn"
              element={
                <RoleAuthentication url="salesReturn">
                  <SalesReturn />
                </RoleAuthentication>
              }
            />
            <Route
              path="productCategories"
              element={
                <RoleAuthentication url="productCategories">
                  <Categories />
                </RoleAuthentication>
              }
            />
            <Route
              path="orderMode"
              element={
                <RoleAuthentication url="orderMode">
                  <OrderMode />
                </RoleAuthentication>
              }
            />

            <Route
              path="orderSource"
              element={
                <RoleAuthentication url="orderSource">
                  <OrderSource />
                </RoleAuthentication>
              }
            />

            <Route
              path="menuPage"
              element={
                <RoleAuthentication url="menuPage">
                  <MenuPage />
                </RoleAuthentication>
              }
            />
            <Route
              path="product"
              element={
                <RoleAuthentication url="product">
                  <Product />
                </RoleAuthentication>
              }
            />
            <Route
              path="productSize"
              element={
                <RoleAuthentication url="productSize">
                  <ProductSize />
                </RoleAuthentication>
              }
            />
            <Route
              path="productDetails"
              element={
                <RoleAuthentication url="productDetails">
                  <ProductDetails />
                </RoleAuthentication>
              }
            />
            <Route
              path="branches"
              element={
                <RoleAuthentication url="branches">
                  <Branches />
                </RoleAuthentication>
              }
            />
            <Route
              path="complainCategory"
              element={
                <RoleAuthentication url="complainCategory">
                  <ComplainCategory />
                </RoleAuthentication>
              }
            />
            <Route
              path="deal"
              element={
                <RoleAuthentication url="deal">
                  <Deal />
                </RoleAuthentication>
              }
            />

            <Route
              path="productmapping"
              element={
                <RoleAuthentication url="productmapping">
                  <ProductMapping />
                </RoleAuthentication>
              }
            />
            <Route
              path="complaintManagement"
              element={
                <RoleAuthentication url="complaintManagement">
                  <ComplaintManagement />
                </RoleAuthentication>
              }
            />
            <Route
              path="department"
              element={
                <RoleAuthentication url="department">
                  <Department />
                </RoleAuthentication>
              }
            />
            <Route
              path="discountManagement"
              element={
                <RoleAuthentication url="discountManagement">
                  <DiscountManagement />
                </RoleAuthentication>
              }
            />

            <Route
              path="country"
              element={
                <RoleAuthentication url="country">
                  <Country />
                </RoleAuthentication>
              }
            />

            <Route
              path="variants"
              element={
                <RoleAuthentication url="variants">
                  <Flavour />
                </RoleAuthentication>
              }
            />

            <Route
              path="reservationGuest"
              element={
                <RoleAuthentication url="variants">
                  <ReservationGuest />
                </RoleAuthentication>
              }
            />

            <Route
              path="podms"
              element={
                <RoleAuthentication url="podms">
                  <Podms />
                </RoleAuthentication>
              }
            />

            <Route
              path="province"
              element={
                <RoleAuthentication url="province">
                  <Province />
                </RoleAuthentication>
              }
            />
            <Route
              path="tables"
              element={
                <RoleAuthentication url="tables">
                  <Table />
                </RoleAuthentication>
              }
            />
            <Route
              path="riders"
              element={
                <RoleAuthentication url="riders">
                  <Rider />
                </RoleAuthentication>
              }
            />
            <Route
              path="reservation"
              element={
                <RoleAuthentication url="reservation">
                  <Reservation />
                </RoleAuthentication>
              }
            />
            <Route
              path="gst"
              element={
                <RoleAuthentication url="gst">
                  <Gst />
                </RoleAuthentication>
              }
            />
            <Route
              path="billmanagement"
              element={
                <RoleAuthentication url="billmanagement">
                  <BillManagement />
                </RoleAuthentication>
              }
            />
            <Route
              path="waiters"
              element={
                <RoleAuthentication url="waiters">
                  <Waiter />
                </RoleAuthentication>
              }
            />
            <Route
              path="discountDetails"
              element={
                <RoleAuthentication url="discountDetails">
                  <DiscountDetails />
                </RoleAuthentication>
              }
            />
            <Route
              path="terminals"
              element={
                <RoleAuthentication url="terminals">
                  <Terminal />
                </RoleAuthentication>
              }
            />

            <Route
              path="shift"
              element={
                <RoleAuthentication url="shift">
                  <Shift />
                </RoleAuthentication>
              }
            />

            <Route
              path="financialReport"
              element={
                <RoleAuthentication url="financialReport">
                  <Reports />
                </RoleAuthentication>
              }
            />
            <Route
              path="riderWaiterPerformanceReport"
              element={
                <RoleAuthentication url="riderWaiterPerformanceReport">
                  <RiderWaiterPerformanceReport />
                </RoleAuthentication>
              }
            />
            <Route
              path="productreports"
              element={
                <RoleAuthentication url="productreports">
                  <ProductReports />
                </RoleAuthentication>
              }
            />
            <Route
              path="revoketerminalaccess"
              element={
                <RoleAuthentication url="revoketerminalaccess">
                  <RevokeTerminalAccess />
                </RoleAuthentication>
              }
            />
            <Route
              path="unit"
              element={
                <RoleAuthentication url="unit">
                  <Unit />
                </RoleAuthentication>
              }
            />

            <Route
              path="vendors"
              element={
                <RoleAuthentication url="vendors">
                  <Vendor />
                </RoleAuthentication>
              }
            />
            <Route
              path="invoice"
              element={
                <RoleAuthentication url="invoice">
                  <Invoice />
                </RoleAuthentication>
              }
            />
            <Route
              path="recipe"
              element={
                <RoleAuthentication url="recipe">
                  <Recipe />
                </RoleAuthentication>
              }
            />

            <Route
              path="variancereport"
              element={
                <RoleAuthentication url="variancereport">
                  <VarianceReport />
                </RoleAuthentication>
              }
            />

            <Route
              path="productusedetailreport"
              element={
                <RoleAuthentication url="productusedetailreport">
                  <ProductUseDetailReport />
                </RoleAuthentication>
              }
            />

            <Route
              path="companyedit"
              element={
                <RoleAuthentication url="companyedit">
                  <CompanyEdit />
                </RoleAuthentication>
              }
            />

            {/* Inventory routes */}
            <Route
              path="inventory"
              element={
                <RoleAuthentication url="inventory">
                  <Inventory />
                </RoleAuthentication>
              }
            />
            <Route
              path="batch"
              element={
                <RoleAuthentication url="batch">
                  <Batch />
                </RoleAuthentication>
              }
            />
            <Route
              path="bill"
              element={
                <RoleAuthentication url="bill">
                  <Bill />
                </RoleAuthentication>
              }
            />
            <Route
              path="goodRecieving"
              element={
                <RoleAuthentication url="goodRecieving">
                  <GoodRecieving />
                </RoleAuthentication>
              }
            />
            <Route
              path="purchaseOrder"
              element={
                <RoleAuthentication url="purchaseOrder">
                  <PurchaseOrder />
                </RoleAuthentication>
              }
            />
            {/* <Route
            path="purchaseRequisition"
            element={
              <RoleAuthentication url="purchaseRequisition">
                <PurchaseRequisition />
              </RoleAuthentication>
            }
          /> */}
            <Route
              path="recipie"
              element={
                <RoleAuthentication url="recipie">
                  <Recipie />
                </RoleAuthentication>
              }
            />
            <Route
              path="subrecipeproduction"
              element={
                <RoleAuthentication url="subrecipeproduction">
                  <SubRecipieProduction />
                </RoleAuthentication>
              }
            />
            <Route
              path="transfers"
              element={
                <RoleAuthentication url="transfers">
                  <Transfer />
                </RoleAuthentication>
              }
            />
            <Route
              path="grn"
              element={
                <RoleAuthentication url="grn">
                  <GRN />
                </RoleAuthentication>
              }
            />
            <Route
              path="closinginventory"
              element={
                <RoleAuthentication url="closinginventory">
                  <ClosingInventory />
                </RoleAuthentication>
              }
            />
            <Route
              path="issuance"
              element={
                <RoleAuthentication url="issuance">
                  <Issuance />
                </RoleAuthentication>
              }
            />
            <Route
              path="purchaseRequisition"
              element={
                <RoleAuthentication url="purchaseRequisition">
                  <Requisition />
                </RoleAuthentication>
              }
            />
            <Route
              path="demand"
              element={
                <RoleAuthentication url="demand">
                  <Demand />
                </RoleAuthentication>
              }
            />

            <Route
              path="transfer"
              element={
                <RoleAuthentication url="transfer">
                  <Transfer />
                </RoleAuthentication>
              }
            />
            <Route
              path="branchreceiving"
              element={
                <RoleAuthentication url="branchreceiving">
                  <BranchRecieving />
                </RoleAuthentication>
              }
            />
            <Route
              path="transferDetailReport"
              element={
                <RoleAuthentication url="transferDetailReport">
                  <TransferDetailReport />
                </RoleAuthentication>
              }
            />
            <Route
              path="wastage"
              element={
                <RoleAuthentication url="wastage">
                  <Wastage />
                </RoleAuthentication>
              }
            />
            <Route
              path="wastagereport"
              element={
                <RoleAuthentication url="wastagereport">
                  <WastageReport />
                </RoleAuthentication>
              }
            />

            <Route
              path="stockadjustment"
              element={
                <RoleAuthentication url="stockadjustment">
                  <Adjustment />
                </RoleAuthentication>
              }
            />
            <Route
              path="bulkupload"
              element={
                <RoleAuthentication url="bulkupload">
                  <BulkUpload />
                </RoleAuthentication>
              }
            />

            <Route
              path="companyprofile"
              element={
                <RoleAuthentication url="companyprofile">
                  <CompanyProfile />
                </RoleAuthentication>
              }
            />

            <Route
              path="kds"
              element={
                <RoleAuthentication url="kds">
                  <KitchenDisplayScreen />
                </RoleAuthentication>
              }
            />

            <Route
              path="salesummaryreport"
              element={
                <RoleAuthentication url="salesummaryreport">
                  <SalesSummaryReport />
                </RoleAuthentication>
              }
            />
            <Route
              path="discountdetailreport"
              element={
                <RoleAuthentication url="discountdetailreport">
                  <DiscountDetailReport />
                </RoleAuthentication>
              }
            />
            <Route
              path="itemvoidreport"
              element={
                <RoleAuthentication url="itemvoidreport">
                  <ItemVoidReport />
                </RoleAuthentication>
              }
            />
            <Route
              path="extracharges"
              element={
                <RoleAuthentication url="extracharges">
                  <ExtraCharges />
                </RoleAuthentication>
              }
            />
            <Route
              path="cancelorderreport"
              element={
                <RoleAuthentication url="cancelorderreport">
                  <CancelOrderReport />
                </RoleAuthentication>
              }
            />
            <Route
              path="productmixreport"
              element={
                <RoleAuthentication url="productmixreport">
                  <ProductMixReport />
                </RoleAuthentication>
              }
            />

            <Route
              path="topsellingreport"
              element={
                <RoleAuthentication url="topsellingreport">
                  <TopSellingReport />
                </RoleAuthentication>
              }
            />

            <Route
              path="closingreport"
              element={
                <RoleAuthentication url="closingreport">
                  <ClosingReport />
                </RoleAuthentication>
              }
            />

            <Route
              path="InventoryItemReport"
              element={
                <RoleAuthentication url="inventoryitemreport">
                  <InventoryItemReport />
                </RoleAuthentication>
              }
            />

            <Route
              path="branchactivityReport"
              element={
                <RoleAuthentication url="branchactivityReport">
                  <BranchActivityReport />
                </RoleAuthentication>
              }
            />
            <Route
              path="itemledgerreport"
              element={
                <RoleAuthentication url="itemledgerreport">
                  <ItemLedger />
                </RoleAuthentication>
              }
            />

            <Route
              path="CommisionDetailReport"
              element={
                <RoleAuthentication url="CommisionDetailReport">
                  <CommissionDetailReport />
                </RoleAuthentication>
              }
            />

            <Route
              path="branchstockreport"
              element={
                <RoleAuthentication url="branchstockreport">
                  <BranchStockReport />
                </RoleAuthentication>
              }
            />

            <Route
              path="stockreportwise"
              element={
                <RoleAuthentication url="stockreportwise">
                  <BranchStockReportBrWise />
                </RoleAuthentication>
              }
            />
            <Route
              path="consumptiondetailreport"
              element={
                <RoleAuthentication url="consumptiondetailreport">
                  <ConsumtionpDetailReport />
                </RoleAuthentication>
              }
            />
            <Route
              path="financial/expensetype"
              element={
                <RoleAuthentication url="financial/expensetype">
                  <ExpenseType />
                </RoleAuthentication>
              }
            />
            <Route
              path="financial/expense"
              element={
                <RoleAuthentication url="financial/expense">
                  <Expense />
                </RoleAuthentication>
              }
            />
            <Route
              path="financial/coa"
              element={
                <RoleAuthentication url="financial/coa">
                  <ChartOfAccount />
                </RoleAuthentication>
              }
            />
            <Route
              path="financial/banksetup"
              element={
                <RoleAuthentication url="financial/banksetup">
                  <BankSetup />
                </RoleAuthentication>
              }
            />
            <Route
              path="financial/cashbook"
              element={
                <RoleAuthentication url="financial/cashbook">
                  <CashBook />
                </RoleAuthentication>
              }
            />
            <Route
              path="financial/generateLedger"
              element={
                <RoleAuthentication url="financial/generateLedger">
                  <GeneralLedger />
                </RoleAuthentication>
              }
            />
            <Route
              path="financial/payoff"
              element={
                <RoleAuthentication url="financial/payoff">
                  <PayOff />
                </RoleAuthentication>
              }
            />
            <Route
              path="financial/cashbankinout"
              element={
                <RoleAuthentication url="financial/cashbankinout">
                  <CashBankIn />
                </RoleAuthentication>
              }
            />
            <Route
              path="barcode"
              element={
                <RoleAuthentication url="barcode">
                  <Barcode />
                </RoleAuthentication>
              }
            />
            <Route
              path="roleaccess"
              element={
                <RoleAuthentication url="roleaccess">
                  <RoleAccess />
                </RoleAuthentication>
              }
            />
            <Route
              path="issuanceDetailReport"
              element={
                <RoleAuthentication url="issuanceDetailReport">
                  <IssuenceDetailReport />
                </RoleAuthentication>
              }
            />
            <Route
              path="IssuanceTransVsBranchRecvRep"
              element={
                <RoleAuthentication url="IssuanceTransVsBranchRecvRep">
                  <BranchRecievingReport />
                </RoleAuthentication>
              }
            />
            <Route
              path="inventory_product_rate"
              element={
                <RoleAuthentication url="inventory_product_rate">
                  <InventoryProductRate />
                </RoleAuthentication>
              }
            />
            <Route
              path="estimated_foodcost_summary"
              element={
                <RoleAuthentication url="estimated_foodcost_summary">
                  <EstimatedFoodCostSummary />
                </RoleAuthentication>
              }
            />
            <Route
              path="estimated_foodcost_detail"
              element={
                <RoleAuthentication url="estimated_foodcost_detail">
                  <EstimatedFoodCostDetail />
                </RoleAuthentication>
              }
            />
            <Route
              path="product_costing_report"
              element={
                <RoleAuthentication url="product_costing_report">
                  <ProductCostingReports />
                </RoleAuthentication>
              }
            />
            <Route
              path="demandvsissuence"
              element={
                <RoleAuthentication url="demandvsissuence">
                  <DemandVsIssuence />
                </RoleAuthentication>
              }
            />
            <Route
              path="roles"
              element={
                <RoleAuthentication url="private">
                  <Role />
                </RoleAuthentication>
              }
            />
            <Route
              path="inventoryitembyproductreport"
              element={
                <RoleAuthentication url="inventoryitembyproductreport">
                  <InventoryItemByProduct />
                </RoleAuthentication>
              }
            />
            <Route
              path="point_setup"
              element={
                <RoleAuthentication url="point_setup">
                  <PointSetup />
                </RoleAuthentication>
              }
            />
            <Route
              path="loyality_customers"
              element={
                <RoleAuthentication url="loyality_customers">
                  <LoyaltyCustomer />
                </RoleAuthentication>
              }
            />

            <Route
              path="loyality_types"
              element={
                <RoleAuthentication url="loyality_types">
                  <LoyaltyTypes />
                </RoleAuthentication>
              }
            />

            <Route
              path="inventory_variance_report"
              element={
                <RoleAuthentication url="inventory_variance_report">
                  <InventroyVarianceReport />
                </RoleAuthentication>
              }
            />

            <Route
              path="theoretical_variance_report"
              element={
                <RoleAuthentication url="theoretical_variance_report">
                  <TheoriticalVarianceReport />
                </RoleAuthentication>
              }
            />
            <Route
              path="product_efficiency_report"
              element={
                <RoleAuthentication url="product_efficiency_report">
                  <ProductEfficiencyReport />
                </RoleAuthentication>
              }
            />
            <Route
              path="product_use_report"
              element={
                <RoleAuthentication url="product_use_report">
                  <ProductUseReport />
                </RoleAuthentication>
              }
            />

            <Route
              path="dsr"
              element={
                <RoleAuthentication url="dsr">
                  <DailySaleReport />
                </RoleAuthentication>
              }
            />
            <Route
              path="hsr"
              element={
                <RoleAuthentication url="hsr">
                  <HourlySaleReport />
                </RoleAuthentication>
              }
            />
            <Route
              path="customer_sales_report"
              element={
                <RoleAuthentication url="customer_sales_report">
                  <CustomerSalesReport />
                </RoleAuthentication>
              }
            />

            <Route
              path="employee_meal"
              element={
                <RoleAuthentication url="employee_meal">
                  <EmployeeMeal />
                </RoleAuthentication>
              }
            />
            <Route
              path="employee_meal_approval"
              element={
                <RoleAuthentication url="employee_meal_approval">
                  <EmployeeMealApproval />
                </RoleAuthentication>
              }
            />
            <Route
              path="payment_mode"
              element={
                <RoleAuthentication url="payment_mode">
                  <PaymentMode />
                </RoleAuthentication>
              }
            />
            <Route
              path="company_settings"
              element={
                <RoleAuthentication url="company_settings">
                  <CompanySettings />
                </RoleAuthentication>
              }
            />
            <Route
              path="weborderingsetting"
              element={
                <RoleAuthentication url="weborderingsetting">
                  <WebOrdering />
                </RoleAuthentication>
              }
            />
            <Route
              path="productremotecode"
              element={
                <RoleAuthentication url="productremotecode">
                  <ProductRemoteCode />
                </RoleAuthentication>
              }
            />
            <Route
              path="hourlyproductsalereport"
              element={
                <RoleAuthentication url="hourlyproductsalereport">
                  <HourlyProductSaleReport />
                </RoleAuthentication>
              }
            />
            <Route
              path="printerdepartmentmapping"
              element={
                <RoleAuthentication url="printerdepartmentmapping">
                  <PrinterDepartmentMapping />
                </RoleAuthentication>
              }
            />
            <Route
              path="branchordersource"
              element={
                <RoleAuthentication url="branchordersource">
                  <BranchOrderSource />
                </RoleAuthentication>
              }
            />

            {/* !!!!HAVE TO MODIFY URL NAME IN ROLE AUTHENTICATION */}
            <Route
              path="pnlreport"
              element={
                <RoleAuthentication url="pnlreport">
                  <PNLReport />
                </RoleAuthentication>
              }
            />
            <Route
              path="GoodReceivingReturn"
              element={
                <RoleAuthentication url="GoodReceivingReturn">
                  <GoodReceivingReturn />
                </RoleAuthentication>
              }
            />
            <Route
              path="ExpenseReport"
              element={
                <RoleAuthentication url="ExpenseReport">
                  <ExpenseReport />
                </RoleAuthentication>
              }
            />
            <Route path="*" element={<Error404 />} />
          </Route>
        </Fragment>
      )}

      <Route path="pagenotfound" element={<Error404 />} />
      {/* AUTHENTICATION */}
      {!userInfo.isAuthenticated && userInfo.token === null && (
        <Fragment>
          <Route
            path="login"
            element={
              <UserAuthenticationCheck route="login">
                <Login />
              </UserAuthenticationCheck>
            }
          />
          <Route
            path="signup"
            element={
              <UserAuthenticationCheck route="signup">
                <SignUp />
              </UserAuthenticationCheck>
            }
          />
          <Route
            path="forgotpassword"
            element={
              <UserAuthenticationCheck route="forgotpassword">
                <ForgotPassword />
              </UserAuthenticationCheck>
            }
          />
        </Fragment>
      )}
      {/* <Route path="*" element={<Error404 />} /> */}
      <Route path="error500" element={<Error500 />} />
    </Routes>
  );
};

export default AppRoutes;
