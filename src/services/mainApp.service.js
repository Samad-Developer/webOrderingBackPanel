import axios from "axios";
import { POS_TOKEN } from "../common/SetupMasterEnum";

axios.defaults.baseURL = process.env.REACT_APP_BASEURL;

// Important: If axios is used with multiple domains, the AUTH_TOKEN will be sent to all of them.
// See below for an example using Custom instance defaults instead.
axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem(
  POS_TOKEN
)}`;
// document.cookie.includes("token=")
//   ? "Bearer " +
//     document.cookie
//       .split(";")
//       .find((indice) => {
//         return indice.includes("token=");
//       })
//       .split("=")[1]
//   : null;

axios.defaults.headers.post["Content-Type"] = "application/json"; //  "application/x-www-form-urlencoded";

axios.interceptors.response.use(
  (response) => {
    if (response.data.ResponseMessage === "Invalid Token") {
      localStorage.removeItem(POS_TOKEN, "");
      localStorage.setItem("loginAuth", "false");
      location.reload();
    }
    if (response.data.Response === false) {
      return {
        ...response,
        error: true,
        errorMessage: response.data.ResponseMessage,
      };
    } else if (
      response.data.DataSet.Table &&
      response.data.DataSet.Table.length > 0 &&
      response.data.DataSet.Table[0].HasError &&
      response.data.DataSet.Table[0].HasError > 0
    ) {
      return {
        ...response,
        error: true,
        errorMessage: response.data.DataSet.Table[0].Message,
      };
    } else {
      return {
        ...response,
        error: false,
        successMessage:
          response.data.DataSet.Table.length > 0 &&
          response.data.DataSet.Table[0].Message
            ? response.data.DataSet.Table[0].Message
            : null,
      };
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

/** ***************************************************************************************************************************************** */

/**
 * this function is used to GET data on Http:Server
 * @param {String} url url which you want to hit
 * @param {Function} controller use AbortController for request cancelation
 * @returns Response of Http Request
 */
export const getRequest = async (url, controller) => {
  return axios.get(url, { signal: controller && controller.signal });
};

/**
 * this function is used for POST data on Http:Server
 * @param {String} url url which you want to hit
 * @param {Object} data data object which you want to post
 * @param {Function} controller use AbortController for request cancelation
 * @returns Response of Http Request
 */
export const postRequest = async (url, data, controller) => {
  return new Promise((response, reject) => {
    axios
      .post(url, data, {
        signal: controller && controller.signal,
        headers: {
          Authorization: `Bearer ${localStorage.getItem(POS_TOKEN)}`,
        },
      })
      .then(
        (res) => response(res),
        (error) => reject(error)
      )
      .catch((error) => {
        reject(error);
      });
  });
};

/**
 * this function is used for POST Image data on Http:Server
 * @param {String} url url which you want to hit
 * @param {Object} data data object which you want to post
 * @param {Function} controller use AbortController for request cancelation
 * @returns Response of Http Request
 */
export const postImageRequest = async (url, data, controller) => {
  return new Promise((response, reject) => {
    axios
      .post(url, data, {
        signal: controller && controller.signal,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem(POS_TOKEN)}`,
        },
      })
      .then(
        (res) => response(res),
        (error) => reject(error)
      )
      .catch((error) => {
        reject(error);
      });
  });
};
