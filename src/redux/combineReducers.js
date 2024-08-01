import { combineReducers } from "redux";
import authReducer from "./reducers/authReducer";
import basicFormReducer from "./reducers/basicFormReducer";
import PointOfSaleReducer from "./reducers/PointOfSaleReducer";
import reportsReducer from "./reducers/reportsReducer";
import SinglePagePOSReducers from "../screens/PunchingScreen/redux/reducers/SinglePagePOSReducers";
import AuthReducerSP from "../screens/PunchingScreen/redux/reducers/authReducerSP";

const combineReducer = combineReducers({
  authReducer,
  basicFormReducer,
  PointOfSaleReducer,
  reportsReducer,
  SinglePagePOSReducers,
  AuthReducerSP,
});

export default combineReducer;
