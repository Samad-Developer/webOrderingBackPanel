import {
  ADD_COMPANY_LIST,
  ADD_MENU_LIST,
  ADD_USER_BRANCH_LIST,
  CHANGE_COMPANY,
  CHANGE_DATE_TO,
  CHANGE_DATE_FROM,
  CHANGE_ROUTE,
  SET_COLLAPSABLE,
  SET_DAY_SHIFT_TERMINAL,
  SET_DAY_SHIFT_TERMINAL_MODAL,
  SIGN_IN,
  SIGN_OUT,
  TOGGLE_LOADING,
  CHANGE_BRANCH,
} from "../reduxConstants";
import { getDate } from "../../functions/dateFunctions";

const initialState = {
  token: null,
  authLoading: false,
  isAuthenticated: false,
  CompanyId: null,
  CompanyName: null,
  EmailAddress: null,
  Name: "",
  RoleId: null,
  RoleName: "",
  UserIP: "",
  IsPos: false,
  UserId: null,
  companyList: [],
  menuList: [],
  userBranchList: [],
  branchId: null,
  online: false,
  collapsable: false,
  dayShiftTerminal: {
    BusinessDayId: 0,
    Date: Date.now(),
    ShiftDetailId: 0,
    TerminalDetailId: 0,
    TerminalOpeningAmount: 0,
    TerminalClosingAmount: 0,
    ShiftId: 0,
    TerminalId: 0,
    BranchId: 0,
  },
  ShowDayEndReport: true,
  dateFrom: getDate(),
  dateTo: getDate(),
};

const AuthReducer = (state = initialState, action) => {
  switch (action.type) {
    case SIGN_IN:
      return {
        ...state,
        token: action.payload.JWT,
        isAuthenticated: true,
        CompanyId: action.payload.CompanyId,
        CompanyName: action.payload.CompanyName,
        EmailAddress: action.payload.EmailAddress,
        Name: action.payload.Name,
        RoleId: action.payload.RoleId,
        RoleName: action.payload.RoleName,
        UserIP: action.payload.UserIP,
        UserId: action.payload.UserId,
        IsPos: action.payload.IsPos,
        UserName: action.payload.UserName,
      };
    case SIGN_OUT:
      return {
        ...initialState,
      };
    case TOGGLE_LOADING:
      return {
        ...state,
        authLoading: action.payload,
      };
    case CHANGE_ROUTE:
      return {
        ...state,
        selectedRouteId: action.payload,
      };
    case CHANGE_COMPANY:
      return {
        ...state,
        CompanyId: action.payload.CompanyId,
        CompanyName: action.payload.CompanyName,
      };
    case ADD_COMPANY_LIST:
      return { ...state, companyList: action.payload };
    case ADD_USER_BRANCH_LIST:
      return { ...state, userBranchList: action.payload };
    case ADD_MENU_LIST:
      return { ...state, menuList: action.payload };
    case "TOGGLE_NETWORK":
      return { ...state, online: action.payload };
    case "SET_BRANCH_ID":
      return { ...state, branchId: action.payload };
    case SET_COLLAPSABLE:
      return { ...state, collapsable: action.payload };
    case SET_DAY_SHIFT_TERMINAL_MODAL:
      return {
        ...state,
        dayShiftTerminal: { ...state.dayShiftTerminal, ...action.payload },
      };
    case CHANGE_DATE_FROM:
      return {
        ...state,
        dateFrom: action.payload,
      };
    case CHANGE_DATE_TO:
      return {
        ...state,
        dateTo: action.payload,
      };
    case CHANGE_BRANCH:
      return { ...state, branchId: action.payload };
    default: {
      return state; // We return the default state here
    }
  }
};

export default AuthReducer;
