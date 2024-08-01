import { useIndexedDB } from "react-indexed-db";

/**
 * this function is used to store data into a specific collection of iDB
 * @param {string} collection Collection Name
 * @param {object} data Data Object
 * @param {Function} cb CallBack Function return document ID
 */
const addDataToIDB = (collection, data, cb) => {
  const { add } = useIndexedDB(collection);
  if (data.length > 0) {
    data.map((item) =>
      add(item).then(
        (result) => {
          cb && cb(result);
        },
        (error) => {
          console.error(error);
        }
      )
    );
  } else {
    add(data).then(
      (result) => {
        cb && cb(result);
      },
      (error) => {
        console.error(error);
      }
    );
  }
};

export default addDataToIDB;
