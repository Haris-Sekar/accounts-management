import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import { useEffect } from "react";
import { Analytics } from '@vercel/analytics/react';

const PageLayout = () => {

  const userDetails = JSON.parse(localStorage.getItem("user_details") as string);
  const companyDetails = JSON.parse(localStorage.getItem("company_details") as string);
  const navigate = useNavigate(); 
  const a = useLocation();

  useEffect(() => { 
    if(a.search.includes('auth')) {
      window.location.replace('/auth');
    }
    const token = localStorage.getItem("token");
    if (!token) {
      navigate('/auth');
    }
  }, [a.search, navigate])

  return (
    <div>
      <Analytics />
      <Navbar userDetails={userDetails} companyDetails={companyDetails} />
      <div className="main">
        <Outlet />
      </div>
    </div>
  );
};

export default PageLayout;