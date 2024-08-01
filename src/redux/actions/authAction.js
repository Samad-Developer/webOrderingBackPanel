import addDataToIDB from "../../functions/storage/addDataToIDB";
import {
  SIGN_IN,
  SIGN_OUT,
  TOGGLE_LOADING,
  CHANGE_ROUTE,
  CHANGE_COMPANY,
  ADD_COMPANY_LIST,
  ADD_MENU_LIST,
  ADD_USER_BRANCH_LIST,
  SET_POS_STATE,
  CHANGE_DATE_FROM,
  CHANGE_DATE_TO,
} from "../reduxConstants";
import { postRequest } from "../../services/mainApp.service";
import { message } from "antd";
import {
  addObjectToDatabase,
  clearStoreDataFromDatabase,
  getAllObjectFromDatabase,
} from "../../functions/db";
import {
  BRANCH_ADMIN,
  CASHIER,
  DAY_SHIFT_TERMINAL,
  DISPATCHER,
  POS_TOKEN,
} from "../../common/SetupMasterEnum";
import { CHANGE_BRANCH } from "./../reduxConstants";
const addDataToStore = (data, navigate) => (dispatch) => {
  addDataToIDB("userData", data, (message) => {
    if (message > 0) {
      dispatch({ type: SIGN_IN, payload: data });
      navigate("/");
    }
  });
};

export const setUserData = (navigate, pathname) => (dispatch) => {
  getAllObjectFromDatabase("menuList", (Table3) => {
    dispatch({
      type: ADD_MENU_LIST,
      payload: Table3,
    });
  });
  const token = localStorage.getItem(POS_TOKEN);
  let userData = null;
  getAllObjectFromDatabase("userData", (result) => {
    if (token !== null) {
      let obj = { ...result[0], JWT: token };
      userData = obj;
      dispatch({
        type: SIGN_IN,
        payload: obj,
      });
      if (pathname === "/login") {
        navigate("/");
      } else {
        navigate(pathname);
      }
    } else {
      dispatch({
        type: SIGN_OUT,
        payload: null,
      });
      if (pathname === "/webordering") {
        navigate("/webordering");
      } else {
        navigate("/login");
      }
    }
  });
  getAllObjectFromDatabase("companyList", (result) => {
    dispatch({
      type: ADD_COMPANY_LIST,
      payload: result,
    });
  });
  getAllObjectFromDatabase("branchList", (result) => {
    if (userData !== null) {
      if (userData.RoleId === CASHIER || userData.RoleId === BRANCH_ADMIN) {
        dispatch({
          type: "SET_BRANCH_ID",
          payload: result[0].BranchId,
        });
      }
    }
    dispatch({
      type: ADD_USER_BRANCH_LIST,
      payload: result,
    });
  });
};

export const signOut = (navigate) => (dispatch) => {
  clearStoreDataFromDatabase("userData");
  clearStoreDataFromDatabase("menuList");
  clearStoreDataFromDatabase("companyList");
  clearStoreDataFromDatabase("branchList");
  dispatch({
    type: SIGN_OUT,
    payload: null,
  });
  dispatch({
    type: SET_POS_STATE,
    payload: {
      name: "customerDetail",
      value: {
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
        GSTId: null,
        GSTPercentage: 0,
      },
    },
  });
  localStorage.removeItem(POS_TOKEN);
  localStorage.removeItem(DAY_SHIFT_TERMINAL);
  navigate("login");
};

export const LoginAction = (data, navigate, timeoutFunction) => {
  if (process.env.REACT_APP_ON_PREMISIS == 1) {
    return async (dispatch) => {
      try {
        dispatch({ type: TOGGLE_LOADING, payload: true });
        postRequest(
          `${process.env.REACT_APP_BASEURL}/UserLoginOnPremises`,
          data
        ).then(
          (res) => {
            if (!res?.data.Response) {
              console.log(res?.data.Response);
              dispatch({ type: TOGGLE_LOADING, payload: false });
              message.error(res?.data.ResponseMessage);
              return;
            }

            let { Table1, Table2, Table3, Table4, Table7 } = res.data.DataSet;
            if (Table7[0]?.RemainingDays <= 0) {
              message.error("Your License Key is Expired");
              dispatch({ type: TOGGLE_LOADING, payload: false });
              dispatch({ type: "IS_MODAL", payload: true });
              return;
            }

            localStorage.setItem(POS_TOKEN, Table1[0].JWT);
            localStorage.setItem("alert", Table7[0]?.Msg);

            getAllObjectFromDatabase("menuList", (result) => {
              if (result.length === 0) addObjectToDatabase("menuList", Table3);
            });

            getAllObjectFromDatabase("userData", (result) => {
              if (result.length === 0)
                getAllObjectFromDatabase("userData", (response) => {
                  if (response.length > 0)
                    clearStoreDataFromDatabase("userData");
                  dispatch(addDataToStore(Table1[0], navigate));
                });
            });
            getAllObjectFromDatabase("companyList", (result) => {
              if (result.length === 0)
                addObjectToDatabase("companyList", Table2);
            });
            getAllObjectFromDatabase("branchList", (result) => {
              if (result.length === 0)
                addObjectToDatabase("branchList", Table4);
            });
            dispatch({
              type: ADD_MENU_LIST,
              payload: Table3,
            });
            dispatch({
              type: ADD_USER_BRANCH_LIST,
              payload: Table4,
            });
            dispatch({
              type: ADD_COMPANY_LIST,
              payload: Table2,
            });
            if (
              Table1[0].RoleId === BRANCH_ADMIN ||
              Table1[0].RoleId === CASHIER
            ) {
              dispatch({ type: "SET_BRANCH_ID", payload: Table4[0].BranchId });
            }
            dispatch({ type: TOGGLE_LOADING, payload: false });
            timeoutFunction();
          },
          (error) => {
            dispatch({ type: TOGGLE_LOADING, payload: false });
            console.error(error, " Error Block");
          }
        );
      } catch (err) {
        console.error(err, "Error");
      }
    };
  } else {
    return async (dispatch) => {
      try {
        dispatch({ type: TOGGLE_LOADING, payload: true });
        postRequest(`${process.env.REACT_APP_BASEURL}/userlogin`, data).then(
          (res) => {
            if (res.error === true) {
              dispatch({ type: TOGGLE_LOADING, payload: false });
              // message.error("Invalid Username or Password");
              message.error(
                res.errorMessage === "Failure"
                  ? "Invalid Username or Password"
                  : res.errorMessage
              );
              return;
            }
            let { Table1, Table2, Table3, Table4 } = res.data.DataSet;
            localStorage.setItem(POS_TOKEN, Table1[0].JWT);

            getAllObjectFromDatabase("menuList", (result) => {
              if (result.length === 0) addObjectToDatabase("menuList", Table3);
            });
            getAllObjectFromDatabase("userData", (result) => {
              if (result.length === 0)
                getAllObjectFromDatabase("userData", (response) => {
                  if (response.length > 0)
                    clearStoreDataFromDatabase("userData");
                  dispatch(addDataToStore(Table1[0], navigate));
                });
            });
            getAllObjectFromDatabase("companyList", (result) => {
              if (result.length === 0)
                addObjectToDatabase("companyList", Table2);
            });
            getAllObjectFromDatabase("branchList", (result) => {
              if (result.length === 0)
                addObjectToDatabase("branchList", Table4);
            });
            dispatch({
              type: ADD_MENU_LIST,
              payload: Table3,
            });
            dispatch({
              type: ADD_USER_BRANCH_LIST,
              payload: Table4,
            });
            dispatch({
              type: ADD_COMPANY_LIST,
              payload: Table2,
            });
            if (
              Table1[0].RoleId === BRANCH_ADMIN ||
              Table1[0].RoleId === CASHIER ||
              Table1[0].RoleId === DISPATCHER
            ) {
              dispatch({ type: "SET_BRANCH_ID", payload: Table4[0].BranchId });
            }
            dispatch({ type: TOGGLE_LOADING, payload: false });
            timeoutFunction();
          },
          (error) => {
            dispatch({ type: TOGGLE_LOADING, payload: false });
            console.error(error, " Error Block");
          }
        );
      } catch (err) {
        console.error(err, "Error");
      }
    };
  }
};
export const SignUpAction = (data, navigate) => {
  return async (dispatch) => {
    try {
      dispatch({ type: TOGGLE_LOADING, payload: true });
      postRequest(`${process.env.REACT_APP_BASEURL}/UserSignup`, data).then(
        (res) => {
          let { Table } = res.data.DataSet;
          let { Table2 } = res.data.DataSet;
          if (Table[0].HasError === 1) {
            message.error(Table[0].Error_Message);
            dispatch({ type: TOGGLE_LOADING, payload: false });
            // navigate("/login");
            return;
          }
          dispatch({
            type: ADD_COMPANY_LIST,
            payload: Table2,
          });
          message.success("Sign Up Successful");
          dispatch({ type: TOGGLE_LOADING, payload: false });
          navigate("/login");
        },
        (error) => {
          dispatch({ type: TOGGLE_LOADING, payload: false });
          message.error("Sign Up Failed");
          console.error(error, " Error Block");
        }
      );
    } catch (err) {
      console.error(err, "Error");
      message.error("Sign Up Failed");
    }
  };
};

export const ForgotPasswordAction = (data, navigate) => {
  return async (dispatch) => {
    try {
      dispatch({ type: TOGGLE_LOADING, payload: true });
      postRequest(
        `${process.env.REACT_APP_BASEURL}/ForgetPassword?LoginId=${data.Email}`
      ).then(
        (res) => {
          let { Table2 } = res.data.DataSet;
          dispatch({
            type: ADD_COMPANY_LIST,
            payload: Table2,
          });
          message.success(" Reset Password link sent to your email");
          dispatch({ type: TOGGLE_LOADING, payload: false });
          navigate("/login");
        },
        (error) => {
          dispatch({ type: TOGGLE_LOADING, payload: false });
          message.error("Sign Up Failed");
          console.error(error, " Error Block");
        }
      );
    } catch (err) {
      console.error(err, "Error");
      message.error("Sign Up Failed");
    }
  };
};

export const changeRoute = (data) => {
  return async (dispatch) => {
    dispatch({ type: CHANGE_ROUTE, payload: data });
  };
};

export const changeCompany = (data) => {
  return async (dispatch) => {
    dispatch({ type: CHANGE_COMPANY, payload: data });
  };
};

export const changeDateFrom = (data) => {
  return async (dispatch) => {
    dispatch({ type: CHANGE_DATE_FROM, payload: data });
  };
};

export const changeDateTo = (data) => {
  return async (dispatch) => {
    dispatch({ type: CHANGE_DATE_TO, payload: data });
  };
};

export const changeBranch = (data) => {
  return async (dispatch) => {
    dispatch({ type: CHANGE_BRANCH, payload: data });
  };
};
