import { combineReducers } from "redux";
import customerReducer from "./customer";
import billsReducer from "./bills";
import voucherReducer from "./voucher";
import userReducer from "./user";

export default combineReducers({
  customerReducer,
  billsReducer,
  voucherReducer,
  userReducer
});