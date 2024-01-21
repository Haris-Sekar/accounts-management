import { MODULES } from "./const.js";

export const API_METHODS = {
  GET: "get",
  POST: "post",
  PATCH: "patch",
  DELETE: "delete",
};
const apis = [
  {
    path: "/user",
    method: [API_METHODS.GET, API_METHODS.POST],
    module: MODULES.USER,
  },
  {
    path: "/customers",
    method: [
      API_METHODS.GET,
      API_METHODS.POST,
      API_METHODS.PATCH,
      API_METHODS.DELETE,
    ],
    module: MODULES.CUSTOMERS,
  },
  {
    path: "/bills",
    method: [
      API_METHODS.GET,
      API_METHODS.POST,
      API_METHODS.PATCH,
      API_METHODS.DELETE,
    ],
    module: MODULES.BILLS,
  },
  {
    path: "/voucher",
    method: [
      API_METHODS.GET,
      API_METHODS.POST,
      API_METHODS.PATCH,
      API_METHODS.DELETE,
    ],
    module: MODULES.VOUCHERS,
  }, {
    path: "/dashboard",
    method: [API_METHODS.GET],
    module: MODULES.DASHBOARD
  }
];

export default apis;
