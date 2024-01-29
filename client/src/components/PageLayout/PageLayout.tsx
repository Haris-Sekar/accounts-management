import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { MODULES, MODULE_VS_PATH } from "../../consts/consts";

const PageLayout = () => {
  const userDetails = JSON.parse(
    localStorage.getItem("user_details") as string
  );
  const companyDetails = JSON.parse(
    localStorage.getItem("company_details") as string
  );
  const permissions = JSON.parse(localStorage.getItem("permissions") as string);
  const navigate = useNavigate();
  const a = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/auth");
    }
    if (
      ![
        "/app/dashboard",
        "/app/customers",
        "/app/bills",
        "/app/voucher",
        "/app/users",
      ].includes(window.location.pathname) &&
      !window.location.pathname.includes("/app/customers/")
    ) {
      navigate(getFirstModulePathWithViewPermission() as string);
    }
  }, [a.search, navigate]);

  function getFirstModulePathWithViewPermission() {
    const order = [
      MODULES.VOUCHERS,
      MODULES.DASHBOARD,
      MODULES.CUSTOMERS,
      MODULES.BILLS,
    ];
    for (const moduleName of order) {
      const moduleIndex = MODULE_VS_PATH.findIndex(
        (module) => module.module === moduleName
      );
      if (
        moduleIndex !== -1 &&
        permissions.permission[moduleIndex].permission[0] === 1
      ) {
        return MODULE_VS_PATH[moduleIndex].path;
      }
    }
    return null; // Return null if no module with view permission is found
  }

  return (
    <div>
      {/* <Analytics /> */}
      {localStorage.getItem("token") && (
        <Navbar
          userDetails={userDetails}
          companyDetails={companyDetails}
          permissions={permissions}
        />
      )}

      <div className="main">
        <Outlet />
      </div>
    </div>
  );
};

export default PageLayout;
