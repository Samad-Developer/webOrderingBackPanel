export const dbConfig = {
  name: process.env.REACT_APP_DATABASE_NAME,
  version: process.env.REACT_APP_DATABASE_VERSION,
  objectStoresMeta: [
    {
      store: "userData",
      storeConfig: { keypath: "id", autoIncrement: true },
      storeSchema: [
        { name: "CompanyId", keypath: "CompanyId", options: { unique: false } },
        {
          name: "CompanyName",
          keypath: "CompanyName",
          options: { unique: false },
        },
        {
          name: "EmailAddress",
          keypath: "EmailAddress",
          options: { unique: false },
        },
        { name: "IsActive", keypath: "IsActive", options: { unique: false } },
        { name: "IsEnable", keypath: "IsEnable", options: { unique: false } },
        { name: "JWT", keypath: "JWT", options: { unique: false } },
        {
          name: "RoleIdRoleName",
          keypath: "RoleIdRoleName",
          options: { unique: false },
        },
      ],
    },
    {
      store: "companyList",
      storeConfig: { keypath: "id", autoIncrement: true },
      storeSchema: [
        { name: "CompanyId", keypath: "CompanyId", options: { unique: false } },
        {
          name: "CompanyName",
          keypath: "CompanyName",
          options: { unique: false },
        },
      ],
    },
    {
      store: "menuList",
      storeConfig: { keypath: "id", autoIncrement: true },
      storeSchema: [
        { name: "IconClass", keypath: "IconClass", options: { unique: false } },
        { name: "IsActive", keypath: "IsActive", options: { unique: false } },
        {
          name: "Is_Displayed_In_Menu",
          keypath: "Is_Displayed_In_Menu",
          options: { unique: false },
        },
        { name: "MenuId", keypath: "MenuId", options: { unique: false } },
        {
          name: "MenuItemFeatureId",
          keypath: "MenuItemFeatureId",
          options: { unique: false },
        },
        { name: "Menu_Name", keypath: "Menu_Name", options: { unique: false } },
        { name: "Menu_URL", keypath: "Menu_URL", options: { unique: false } },
        { name: "Parent_Id", keypath: "Parent_Id", options: { unique: false } },
        { name: "SortOrder", keypath: "SortOrder", options: { unique: false } },
      ],
    },
    {
      store: "holdOrders",
      storeConfig: { keypath: "id", autoIncrement: true },
      storeSchema: [
        { name: "orderType", keypath: "orderType", options: { unique: false } },
        { name: "orderMode", keypath: "orderMode", options: { unique: false } },
      ],
    },
    {
      store: "branchList",
      storeConfig: { keypath: "id", autoIncrement: true },
      storeSchema: [
        { name: "BranchId", keypath: "BranchId", options: { unique: false } },
        {
          name: "BranchName",
          keypath: "BranchName",
          options: { unique: false },
        },
      ],
    },
  ],
};
