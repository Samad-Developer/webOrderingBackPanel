import {
  RESET_FORM_FIELD,
  RESET_STATE,
  SET_FORM_FIELD_VALUE,
  SET_INITIAL_STATE,
  SET_RESERVATION_TABLE_DATA,
  SET_SEARCH_FIELD_VALUE,
  SET_SUPPORTING_TABLE,
  SET_SUPP_TABLES_TABLE,
  SET_TABLE_DATA,
  TOGGLE_FORM_LOADING,
  TOGGLE_TABLE_LOADING,
  UPDATE_FORM_FIELD,
} from "../reduxConstants";

const initialState = {
  formFields: {},
  searchFields: {},
  itemList: [],
  supportingTable: {},
  formLoading: false,
  tableLoading: false,
};

const basicFormReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_INITIAL_STATE:
      return {
        ...state,
        formFields: { ...state.formFields, ...payload.formFields },
        tableLoading: true,
        searchFields: payload.searchFields,
      };
    case SET_TABLE_DATA:
      return { ...state, itemList: payload.table, tableLoading: false };
    // case SET_RESERVATION_TABLE_DATA:
    //   console.log("data",payload.table)
    //   return { ...state, itemList: payload.table, tableLoading: false };
    case SET_FORM_FIELD_VALUE:
      return {
        ...state,
        formFields: { ...state.formFields, [payload.name]: payload.value },
      };
    case RESET_FORM_FIELD:
      return {
        ...state,
        formFields: payload.initialValue,
        itemList: payload.listItem || state.listItem,
      };
    case SET_SEARCH_FIELD_VALUE:
      return {
        ...state,
        searchFields: { ...state.searchFields, [payload.name]: payload.value },
      };
    case RESET_STATE:
      return {
        ...state,
        ...initialState,
      };
    case SET_SUPPORTING_TABLE:
      return {
        ...state,
        supportingTable: {
          ...state.supportingTable,
          ...payload,
        },
      };
    case UPDATE_FORM_FIELD: {
      return {
        ...state,
        formFields: payload,
      };
    }
    case TOGGLE_FORM_LOADING:
      return { ...state, formLoading: !state.formLoading };
    case TOGGLE_TABLE_LOADING:
      return { ...state, tableLoading: !state.tableLoading };
    case "RESET_FORM_FIELDS":
      return { ...state, formFields: payload.initialValue };
    case SET_SUPP_TABLES_TABLE:
      return {
        ...state,
        supportingTable: {
          ...state.supportingTable,
          [payload.name]: payload.value,
        },
      };
    default:
      return state;
  }
};

export default basicFormReducer;
