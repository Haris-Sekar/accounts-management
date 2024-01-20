import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import { useEffect } from "react";
const PageLayout = () => {

    const userDetails = JSON.parse(localStorage.getItem("user_details"));

    const navigate = useNavigate();

    useEffect(() => {
      const token  = localStorage.getItem("token");
      if(!token) {
        navigate('/auth');
      }
    }, [])

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