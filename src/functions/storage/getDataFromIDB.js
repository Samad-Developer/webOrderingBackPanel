import { useIndexedDB } from "react-indexed-db";

/**
 * this function get allthe data in the provided Collection
 * @param {String} collection Collection Name
 * @param {Function} cb CallBack function which return the Selected Data
 */
export const getAllDataFromIDB = (collection, cb) => {
  const { getAll } = useIndexedDB(collection);
  getAll().then(
    (result) => cb && cb(result),
    (error) => console.error(error)
  );
};

/**
 * this function get the data that matches from the provided Collection
 * @param {String} collection Collection Name
 * @param {Number} id ID number from which to get data
 * @param {Function} cb CallBack function which return the Selected Data
 */
export const getByIdFromIDB = (collection, id, cb) => {
  const { getByID } = useIndexedDB(collection);
  getByID(id).then(
    (result) => cb && cb(result),
    (error) => console.error(error)
  );
};

/**
 * this function get the data that matches from the provided Collection
 * @param {String} collection Collection Name
 * @param {String} indexName index name from which the value is matched
 * @param {Any} value value to match from which to get data
 * @param {Function} cb CallBack function which return the Selected Data
 */
export const getByIndexFromIDB = (collection, indexName, value, cb) => {
  const { getByIndex } = useIndexedDB(collection);
  getByIndex(indexName, value).then(
    (result) => {
      cb(result);
    },
    (error) => {
      console.error(error);
    }
  );
};
