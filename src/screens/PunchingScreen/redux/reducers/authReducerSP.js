import {
  SP_ADD_COMPANY_LIST,
  SP_ADD_MENU_LIST,
  SP_ADD_USER_BRANCH_LIST,
  SP_CHANGE_COMPANY,
  SP_CHANGE_ROUTE,
  SP_SET_COLLAPSABLE,
  SET_DAY_SHIFT_TERMINAL,
  SP_SET_DAY_SHIFT_TERMINAL_MODAL,
  SP_SIGN_IN,
  SP_SIGN_OUT,
  SP_TOGGLE_LOADING,
  SP_USER_ROLE,
  SP_SET_AUTH_STATE,
} from "../reduxConstantsSinglePagePOS";

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
  UserName: "",
};

const AuthReducerSP = (state = initialState, action) => {
  switch (action.type) {
    case SP_SIGN_IN:
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
    case SP_SIGN_OUT:
      return {
        ...initialState,
      };
    case SP_SET_AUTH_STATE:
      return {
        ...state,
        [action.payload.name]: action.payload.value,
      };
    case SP_TOGGLE_LOADING:
      return {
        ...state,
        authLoading: action.payload,
      };
    case SP_CHANGE_ROUTE:
      return {
        ...state,
        selectedRouteId: action.payload,
      };
    case SP_CHANGE_COMPANY:
      return {
        ...state,
        CompanyId: action.payload.CompanyId,
        CompanyName: action.payload.CompanyName,
      };
    case SP_USER_ROLE:
      return {
        ...state,
        RoleId: action.payload.RoleId,
        RoleName: action.payload.RoleName,
      };

    case SP_ADD_COMPANY_LIST:
      return { ...state, companyList: action.payload };
    case SP_ADD_USER_BRANCH_LIST:
      return { ...state, userBranchList: action.payload };
    case SP_ADD_MENU_LIST:
      return { ...state, menuList: action.payload };
    case "SP_TOGGLE_NETWORK":
      return { ...state, online: action.payload };
    case "SP_SET_BRANCH_ID":
      return { ...state, branchId: action.payload };
    case SP_SET_COLLAPSABLE:
      return { ...state, collapsable: action.payload };
    case SP_SET_DAY_SHIFT_TERMINAL_MODAL:
      return {
        ...state,
        dayShiftTerminal: { ...state.dayShiftTerminal, ...action.payload },
      };
    default: {
      return state; // We return the default state here
    }
  }
};

export default AuthReducerSP;
