import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import { useEffect } from "react";
const PageLayout = () => {

  const userDetails = JSON.parse(localStorage.getItem("user_details") as string);

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
      <Navbar userDetails={userDetails} />
      <div className="main">
        <Outlet />
      </div>
    </div>
  );
};

export default PageLayout;