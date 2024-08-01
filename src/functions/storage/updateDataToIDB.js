import { useIndexedDB } from "react-indexed-db";

/**
 * this function is used to update data on IndexedDB of a document
 * @param {String} collection Collection Name
 * @param {Number} id ID of the data to be updated
 * @param {Object} data Data which is to be overwrite
 * @param {Function} cb CallBack Function which returns the result
 */
const updateDataToIDB = (collection, id, data, cb) => {
  const { update } = useIndexedDB(collection);
  update({ ...data, id }).then(
    (result) => {
      cb && cb(result);
    },
    (error) => {
      console.error(error);
    }
  );
};

export default updateDataToIDB;
