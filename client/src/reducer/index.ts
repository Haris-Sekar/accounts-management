import { combineReducers } from "redux";
import customerReducer from "./customer";
import billsReducer from "./bills";
import voucherReducer from "./voucher";

export default combineReducers({
  customerReducer,
  billsReducer,
  voucherReducer
});