import { message } from "antd";
import { postImageRequest, postRequest } from "../../services/mainApp.service";
import {
  RESET_FORM_FIELD,
  RESET_STATE,
  SET_FORM_FIELD_VALUE,
  SET_INITIAL_STATE,
  SET_SEARCH_FIELD_VALUE,
  SET_SUPPORTING_TABLE,
  SET_TABLE_DATA,
  TOGGLE_FORM_LOADING,
  TOGGLE_TABLE_LOADING,
} from "../reduxConstants";

/**
 * this function is used for setting up a form to its initial stage
 * @param {String} url url for getting the table list
 * @param {Object} requestData data to be append with get call
 * @param {Object} initialState initial state for first render
 */
export const setInitialState =
  (
    url,
    requestData,
    formInitialState,
    searchInitialState,
    controller,
    userData,
    formData
  ) =>
  (dispatch) => {
    dispatch({
      type: SET_INITIAL_STATE,
      payload: {
        formFields: formInitialState,
        searchFields: searchInitialState,
      },
    });
    !formData
      ? postRequest(
          url,
          {
            ...requestData,
            OperationId: 1,
            CompanyId: userData.CompanyId,
            UserId: userData.UserId,
            UserIP: userData.UserIP,
          },
          controller
        )
          .then((response) => {
            if (response?.error === true) {
              dispatch({
                type: TOGGLE_TABLE_LOADING,
              });
              message.error(response?.errorMessage);
              return;
            }
            if (response?.data?.response === false) {
              message.error(response?.DataSet?.Table?.errorMessage);
              return;
            }

            dispatch({
              type: SET_TABLE_DATA,
              payload: {
                table: response?.data?.DataSet?.Table,
              },
            });
            delete response.data.DataSet.Table;
            dispatch({
              type: SET_SUPPORTING_TABLE,
              payload: response?.data?.DataSet,
            });
          })
          .catch((error) => {
            dispatch({
              type: TOGGLE_TABLE_LOADING,
            });
            console.error(error);
          })
      : postImageRequest(url, requestData, controller)
          .then((response) => {
            if (response.error === true) {
              dispatch({
                type: TOGGLE_TABLE_LOADING,
              });
              message.error(response.errorMessage);
              return;
            }
            if (response.data.response === false) {
              message.error(response.DataSet.Table.errorMessage);
              return;
            }
            dispatch({
              type: SET_TABLE_DATA,
              payload: { table: response.data.DataSet.Table },
            });
            delete response.data.DataSet.Table;
            dispatch({
              type: SET_SUPPORTING_TABLE,
              payload: response.data.DataSet,
            });
          })
          .catch((error) => console.error(error));
  };

export const setFormFieldValue = (data) => (dispatch) => {
  // data.value = data.value.trim();
  dispatch({ type: SET_FORM_FIELD_VALUE, payload: data });
};

export const setSearchFieldValue = (data) => (dispatch) => {
  // data.value = data.value.trim();
  dispatch({ type: SET_SEARCH_FIELD_VALUE, payload: data });
};

export const resetState = () => (dispatch) => {
  dispatch({ type: RESET_STATE, payload: null });
};

export const submitForm =
  (
    url,
    data,
    initialValue,
    controller,
    userData,
    id,
    returnFunction,
    formData = false,
    updateTables = true
  ) =>
  (dispatch) => {
    dispatch({ type: TOGGLE_FORM_LOADING });
    !formData
      ? postRequest(
          url,
          {
            ...data,
            OperationId: id,
            CompanyId: userData.CompanyId,
            UserId: userData.UserId,
            UserIP: "12.1.1.2",
          },
          controller
        )
          .then((response) => {
            dispatch({ type: TOGGLE_FORM_LOADING });
            if (response.error === true) {
              message.error(response.errorMessage);
              return;
            }
            if (updateTables === true) {
              dispatch({
                type: RESET_FORM_FIELD,
                payload: {
                  initialValue,
                  listItem: response.data.DataSet.Table1,
                },
              });
            }
            message.success(response.successMessage);
            returnFunction && returnFunction(response.data.DataSet);
          })
          .catch((error) => console.error(error))
      : postImageRequest(url, data, controller)
          .then((response) => {
            if (response.error === true) {
              dispatch({
                type: TOGGLE_FORM_LOADING,
              });
              message.error(response.errorMessage);
              return;
            }
            dispatch({
              type: RESET_FORM_FIELD,
              payload: { initialValue, listItem: response.data.DataSet.Table1 },
            });
            message.success(response.successMessage);
            returnFunction && returnFunction(response.data.DataSet);
            dispatch({ type: TOGGLE_FORM_LOADING });
          })
          .catch((error) => console.error(error));
  };

export const deleteRow =
  (url, data, controller, userData, returnFunction, formData = false) =>
  (dispatch) => {
    dispatch({
      type: TOGGLE_TABLE_LOADING,
    });

    !formData
      ? postRequest(
          url,
          {
            ...data,
            OperationId: 4,
            CompanyId: userData.CompanyId,
            UserId: userData.UserId,
            UserIP: "12.1.1.2",
          },
          controller
        )
          .then((response) => {
            if (response.error === true) {
              dispatch({
                type: TOGGLE_TABLE_LOADING,
              });
              message.error(response.errorMessage);
              return;
            }

            message.success(response.successMessage);
            dispatch({
              type: SET_TABLE_DATA,
              payload: { table: response.data.DataSet.Table1 },
            });
            returnFunction && returnFunction(response.data.DataSet);
          })
          .catch((error) => console.error(error))
      : postImageRequest(url, data, controller)
          .then((response) => {
            if (response.error === true) {
              dispatch({
                type: TOGGLE_TABLE_LOADING,
              });
              message.error(response.errorMessage);
              return;
            }
            if (response.data.response === false) {
              message.error(response.DataSet.Table.errorMessage);
              return;
            }
            message.success(response.successMessage);
            // dispatch({
            //   type: SET_TABLE_DATA,
            //   payload: { table: response.data.DataSet.Table },
            // });
            dispatch({
              type: SET_TABLE_DATA,
              payload: { table: response.data.DataSet.Table1 },
            });
            // delete response.data.DataSet.Table;
            dispatch({
              type: SET_SUPPORTING_TABLE,
              payload: response.data.DataSet,
            });
            returnFunction && returnFunction(response.data.DataSet);
          })
          .catch((error) => console.error(error));
  };


