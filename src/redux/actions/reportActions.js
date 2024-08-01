import { message } from "antd";
import { postRequest } from "../../services/mainApp.service";
import {
  SET_BRANCHES,
  SET_REPORTS_DATA,
  SET_REPORTS_LOADING,
  SET_REPORT_VIEW_DATA,
  SET_REPORT_VIEW_DATA_SUPPORTING_TABLE,
  SET_REPORT_VIEW_LOADING,
  SET_SUPP_TABLE_REPORT
} from "../reduxConstants";

export const setInitialReports =
  (url, requestData, controller, userData) => (dispatch) => {
    dispatch({
      type: SET_REPORTS_LOADING,
      payload: true
    });
    postRequest(url, { ...requestData, UserId: userData.UserId }, controller)
      .then((response) => {
        dispatch({
          type: SET_REPORTS_LOADING,
          payload: false
        });
        if (response.error === true) {
          message.error(response.errorMessage);
          return;
        }
        if (response.data.response === false) {
          message.error(response.DataSet.Table.errorMessage);
          return;
        }
        dispatch({
          type: SET_REPORTS_DATA,
          payload: response.data.DataSet.Table
        });
      })
      .catch((error) => console.error(error));
  };

export const setBranches =
  (url, requestData, controller, userData) => (dispatch) => {
    dispatch({
      type: SET_REPORTS_LOADING,
      payload: true
    });
    postRequest(url, { ...requestData, UserId: userData.UserId }, controller)
      .then((response) => {
        dispatch({
          type: SET_REPORTS_LOADING,
          payload: false
        });
        if (response.error === true) {
          message.error(response.errorMessage);
          return;
        }
        if (response.data.response === false) {
          message.error(response.DataSet.Table.errorMessage);
          return;
        }
        dispatch({
          type: SET_BRANCHES,
          payload: response.data.DataSet.Table
        });
        dispatch({
          type: SET_SUPP_TABLE_REPORT,
          payload: response.data.DataSet
        });
      })
      .catch((error) => console.error(error));
  };

export const getReport =
  (url, requestData, controller, userData, cb) => (dispatch) => {
    dispatch({
      type: SET_REPORT_VIEW_LOADING,
      payload: true
    });
    postRequest(url, { ...requestData, UserId: userData.UserId }, controller)
      .then((response) => {
        dispatch({
          type: SET_REPORT_VIEW_LOADING,
          payload: false
        });
        if (response.error === true) {
          message.error(response.errorMessage);
          return;
        }
        if (response.data.response === false) {
          message.error(response.DataSet.Table.errorMessage);
          return;
        }
        dispatch({
          type: SET_REPORT_VIEW_DATA,
          payload: response.data.DataSet
        });
        cb(response.data.DataSet);
      })
      .catch((error) => console.error(error));
  };

export const getProductReport =
  (url, requestData, controller, userData, cb) => (dispatch) => {
    dispatch({
      type: SET_REPORT_VIEW_LOADING,
      payload: true
    });
    postRequest(url, { ...requestData, UserId: userData.UserId }, controller)
      .then((response) => {
        dispatch({
          type: SET_REPORT_VIEW_LOADING,
          payload: false
        });
        if (response.error === true) {
          message.error(response.errorMessage);
          return;
        }
        if (response.data.response === false) {
          message.error(response.DataSet.Table.errorMessage);
          return;
        }
        dispatch({
          type: SET_REPORT_VIEW_DATA,
          payload: response.data.DataSet
        });
        cb(response.data.DataSet);
      })
      .catch((error) => console.error(error));
  };
