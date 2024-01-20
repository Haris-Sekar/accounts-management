import { Avatar, Badge } from "@mui/material";
import "./navbar.css";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"; 
import "@coreui/coreui/dist/css/coreui.min.css";
import { USER_TYPE } from "../../consts/consts";
import { Link } from "react-router-dom";

const Navbar = ({ userDetails }) => {
  return (
    <>
      <div className="cusNavbar">
        <div className="navItems">
          <div className="companyDets">AVS ENTERPRISES</div>
          <div className="serachBar">
            {/* <SearchBar /> */}
            <Link
              to="/"
              className={location.pathname === "/app" ? "active" : ""}
            >
              Dashboard
            </Link>
            <Link
              to="customers"
              className={location.pathname.includes("/app/customers") ? "active" : ""}
            >
              Customers
            </Link>
            <Link
              to="bills"
              className={location.pathname === "/app/bills" ? "active" : ""}
            >
              Bills
            </Link>
            <Link
              to="voucher"
              className={location.pathname === "/app/voucher" ? "active" : ""}
            >
              Voucher
            </Link>
          </div>
          <div className="profile">
            {/* <div className="notification">
              <Badge badgeContent={1} color="primary">
                <NotificationsNoneIcon />
              </Badge>
            </div> */}
            <div className="userProfile">
              <div className="avatar">
                <Avatar
                  alt={userDetails?.name}
                  src="/static/images/avatar/1.jpg"
                />
              </div>
              <div className="userDetails">
                <div className="name">
                  {userDetails?.name} -{" "}
                  {USER_TYPE.ADMIN === userDetails?.userType
                    ? "Admin"
                    : "Employee"}
                </div>
                <div className="email">{userDetails?.email}</div>
              </div>
              <div className="expand">
                <ArrowDropDownIcon sx={{ fontSize: 30 }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
