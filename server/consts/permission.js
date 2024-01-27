import { MODULES, USER_TYPE } from "./const.js";
export const DEFAULT_PERMISSION = [
  {
    userType: USER_TYPE.ADMIN,
    permissions: [
      {
        module: MODULES.CUSTOMERS,
        permission: [1, 1, 1, 1],
      },
      {
        module: MODULES.BILLS,
        permission: [1, 1, 1, 1],
      },
      {
        module: MODULES.VOUCHERS,
        permission: [1, 1, 1, 1],
      },
      {
        module: MODULES.DASHBOARD,
        permission: [1, 1, 1, 1],
      },
      {
        module: MODULES.USER,
        permission: [1, 1, 1, 1],
      },
    ],
  },
  {
    userType: USER_TYPE.EMPLOYEE,
    permissions: [
      {
        module: MODULES.CUSTOMERS,
        permission: [1, 0, 0, 0],
      },
      {
        module: MODULES.BILLS,
        permission: [1, 1, 0, 0],
      },
      {
        module: MODULES.VOUCHERS,
        permission: [1, 1, 1, 0],
      },
      {
        module: MODULES.DASHBOARD,
        permission: [0, 0, 0, 0],
      },
      {
        module: MODULES.USER,
        permission: [0, 0, 0, 0],
      },
    ],
  },
];
