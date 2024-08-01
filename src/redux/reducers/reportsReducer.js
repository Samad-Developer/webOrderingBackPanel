import {
  SET_REPORTS_LOADING,
  SET_REPORTS_DATA,
  SET_BRANCHES,
  SET_REPORT_VIEW_DATA,
  SET_REPORT_VIEW_LOADING,
  SET_SUPP_TABLE_REPORT
} from "../reduxConstants";

const initialState = {
  reportsList: [],
  reportsGridLoading: false,
  branches: [],
  reportViewLoading: false,
  reportData: [],
  supportingTable: {}
};

const reportsReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_REPORTS_LOADING:
      return { ...state, reportsGridLoading: payload };
    case SET_REPORTS_DATA:
      return { ...state, reportsList: payload };
    case SET_REPORT_VIEW_DATA:
      return { ...state, reportData: payload };
    case SET_REPORT_VIEW_LOADING:
      return { ...state, reportViewLoading: payload };
    case SET_BRANCHES:
      return { ...state, branches: payload };
    case SET_SUPP_TABLE_REPORT:
      return { ...state, supportingTable: payload };
    default:
      return state;
  }
};

export default reportsReducer;
