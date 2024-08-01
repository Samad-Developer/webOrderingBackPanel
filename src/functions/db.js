const IndexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB ||
  window.shimIndexedDB;

if (!IndexedDB) {
  console.error("IndexedDB could not be found in this browser.");
}

export const createDatabase = () => {
  const req = IndexedDB.open(
    process.env.REACT_APP_DATABASE_NAME,
    Number(process.env.REACT_APP_DATABASE_VERSION)
  );

  req.onerror = function (event) {
    console.error("An error occurred with IndexedDB");
    console.error(event);
  };

  req.onupgradeneeded = (event) => {
    const db = event.target.result;
    db.createObjectStore("branchList", {
      keyPath: "id",
      autoIncrement: true,
    });
    db.createObjectStore("menuList", {
      keyPath: "id",
      autoIncrement: true,
    });
    db.createObjectStore("userData", {
      keyPath: "id",
      autoIncrement: true,
    });
    db.createObjectStore("companyList", {
      keyPath: "id",
      autoIncrement: true,
    });
    db.create();
  };
  req.onsuccess = (event) => {
    const db = event.target.result;
    if (!db.objectStoreNames.contains("companyList")) console.error(event.target);
  };
};

export const addObjectToDatabase = (objectStore, data) => {
  const request = IndexedDB.open(
    process.env.REACT_APP_DATABASE_NAME,
    Number(process.env.REACT_APP_DATABASE_VERSION)
  );

  request.onerror = function (event) {
    console.error("An error occurred with IndexedDB");
    console.error(event);
  };

  request.onupgradeneeded = () => {
    const db = request.result;
    db.createObjectStore(objectStore, {
      keyPath: "id",
      autoIncrement: true,
    });
  };

  request.onsuccess = () => {
    const db = request.result;
    if (!db.objectStoreNames.contains(objectStore))
      db.createObjectStore(objectStore, { keyPath: "id", autoIncrement: true });
    const transaction = db.transaction(objectStore, "readwrite");
    const store = transaction.objectStore(objectStore);

    if (data && data.length && data.length > 0) {
      data.forEach((element) => {
        store.add(element);
      });
    } else {
      store.add(data);
    }
  };
};

export const getAllObjectFromDatabase = (objectStore, callback) => {
  const request = IndexedDB.open(
    process.env.REACT_APP_DATABASE_NAME,
    Number(process.env.REACT_APP_DATABASE_VERSION)
  );

  request.onerror = function (event) {
    console.error("An error occurred with IndexedDB");
    console.error(event);
  };

  request.onupgradeneeded = () => {
    const db = request.result;
    db.createObjectStore(objectStore, { keyPath: "id" });
  };

  request.onsuccess = () => {
    const db = request.result;
    if (!db.objectStoreNames.contains(objectStore))
      db.createObjectStore(objectStore, { keyPath: "id", autoIncrement: true });
    const transaction = db.transaction(objectStore, "readwrite");
    const store = transaction.objectStore(objectStore);

    const iQuery = store.getAll();
    iQuery.onsuccess = (event) => {
      callback(event.target.result);
    };
  };
};

export const clearStoreDataFromDatabase = (objectStore) => {
  const request = IndexedDB.open(
    process.env.REACT_APP_DATABASE_NAME,
    Number(process.env.REACT_APP_DATABASE_VERSION)
  );

  request.onerror = function (event) {
    console.error("An error occurred with IndexedDB");
    console.error(event);
  };

  request.onupgradeneeded = (event) => {
    const db = event.target.result;
    db.createObjectStore(objectStore, { keyPath: "id" });
  };

  request.onsuccess = () => {
    const db = request.result;
    if (!db.objectStoreNames.contains(objectStore))
      db.createObjectStore(objectStore, { keyPath: "id", autoIncrement: true });
    const transaction = db.transaction(objectStore, "readwrite");
    const store = transaction.objectStore(objectStore);

    const iQuery = store.clear();
    iQuery.onsuccess = () => {};
  };
};

export const deleteDataFromDatabase = (objectStore, key) => {
  const request = IndexedDB.open(
    process.env.REACT_APP_DATABASE_NAME,
    Number(process.env.REACT_APP_DATABASE_VERSION)
  );

  request.onerror = function (event) {
    console.error("An error occurred with IndexedDB");
    console.error(event);
  };

  request.onupgradeneeded = () => {
    const db = request.result;
    db.createObjectStore(objectStore, { keyPath: "id" });
  };

  request.onsuccess = () => {
    const db = request.result;
    const transaction = db.transaction(objectStore, "readwrite");
    const store = transaction.objectStore(objectStore);

    const iQuery = store.delete(key);
    iQuery.onsuccess = () => {};
  };
};
