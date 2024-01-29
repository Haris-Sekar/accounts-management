export const USER_TYPE = {
  ADMIN: 0,
  EMPLOYEE: 1,
};

export const MODULES = {
  CUSTOMERS: 0,
  BILLS: 1,
  VOUCHERS: 2,
  DASHBOARD: 3,
  USER: 4,
};

export const MODULE_VS_PATH = [
  { module: MODULES.CUSTOMERS, path: "/app/customers" },
  { module: MODULES.BILLS, path: "/app/bills" },
  { module: MODULES.VOUCHERS, path: "/app/voucher" },
  { module: MODULES.DASHBOARD, path: "/app/dashboard" },
  {module: MODULES.USER, path: "/app/users"}
];

export function hasViewPermission(moduleNumber: number) {
    const permissions = JSON.parse(localStorage.getItem('permissions') as string).permission;
    const moduleIndex = MODULE_VS_PATH.findIndex(module => module.module === moduleNumber);
    if (moduleIndex !== -1) {
      return permissions[moduleIndex].permission[0] === 1;
    }
    return false; // Return false if module is not found
  }