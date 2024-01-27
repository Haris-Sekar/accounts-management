import { Route, Routes, useNavigate } from "react-router-dom";
import Auth from "./Auth/Auth";
import Dashboard from "./Dashboard/Dashboard";
import PageLayout from "../components/PageLayout/PageLayout";
import { useEffect } from "react";
import Customers from "./Customers/Customers";
import Bills from "./Bills/Bills";
import Voucher from "./Voucher/Voucher";
import CustomerDetailPage from "./Customers/CustomerDetailPage";
import CustomerDetailExport from "./Customers/CustomerDetailExport";
import Users from "./Users/Users";

const Pages = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.pathname === '/') {
      navigate('/app')
    }
  });
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route path="/app" element={<PageLayout />}>
        <Route path="/app" element={<Dashboard />} />
        <Route path="/app/customers" element={<Customers />} />
        <Route path="/app/customers/:id" element={<CustomerDetailPage />} />
        <Route path="/app/bills" element={<Bills />} />
        <Route path="/app/voucher" element={<Voucher />} />
        <Route path="/app/users" element={<Users />} />
      </Route>
      <Route path="/app/customers/:id/exportTransaction" element={<CustomerDetailExport />} />

    </Routes>
  );
};

export default Pages;
