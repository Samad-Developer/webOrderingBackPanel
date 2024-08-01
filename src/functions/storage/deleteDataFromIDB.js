import { useIndexedDB } from "react-indexed-db";

const deleteDataFromIDB = (collection, ids, idName, cb) => {
  const { deleteRecord } = useIndexedDB(collection);
  if (typeof ids === "object") {
    ids.forEach(
      async (id) => await deleteRecord(id[idName]).then((res) => null)
    );
    cb && cb(true);
  } else {
    deleteRecord(ids).then((event) => {
      cb && cb(event);
    });
  }
};

export default deleteDataFromIDB;
