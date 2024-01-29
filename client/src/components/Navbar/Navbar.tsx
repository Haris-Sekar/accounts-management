/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, Menu, MenuItem } from "@mui/material";
import "./navbar.css";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import "@coreui/coreui/dist/css/coreui.min.css";
import { USER_TYPE } from "../../consts/consts";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import SpeedIcon from "@mui/icons-material/Speed";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import MoneyOutlinedIcon from '@mui/icons-material/MoneyOutlined';
const Navbar = ({
  userDetails,
  companyDetails,
  permissions,
}: {
  userDetails: any;
  companyDetails: any;
  permissions: any;
}) => {
  const [anchorE2, setAnchorE2] = useState(null);
  const openMenu2 = Boolean(anchorE2);
  const profileItems = ["Users", "Logout"];
  const handleProfileMenuClose = (e: any) => {
    if (e.target.id === profileItems[1]) {
      logout();
      setAnchorE2(null);
    } else if (e.target.id === profileItems[0]) {
      navigate("/app/users");
    }
    setAnchorE2(null);
  };
  const handleCompanyMenuOpen = (event: any) => {
    if (anchorE2 !== null) {
      setAnchorE2(null);
    } else {
      setAnchorE2(event.currentTarget);
    }
  };
  const navigate = useNavigate();
  const logout = () => {
    localStorage.clear();
    navigate("/auth");
  };

  return (
    <>
      <div className="cusNavbar">
        <div className="navItems">
          <div className="companyDets" onClick={() => navigate("/app")}>
            {companyDetails?.name}
          </div>
          <div className="serachBar">
            {permissions.permission[3].permission[0] ? (
              <Link
                to="dashboard"
                className={
                  location.pathname === "/app/dashboard" ? "active" : ""
                }
              >
                <span className="flexcenter">
                  <SpeedIcon />
                  Dashboard
                </span>
              </Link>
            ) : (
              <></>
            )}

            {permissions.permission[0].permission[0] && (
              <Link
                to="customers"
                className={
                  location.pathname.includes("/app/customers") ? "active" : ""
                }
              >
                <span className="flexcenter">
                  <PersonOutlineOutlinedIcon /> Customers
                </span>
              </Link>
            )}
            {permissions.permission[1].permission[0] && (
              <Link
                to="bills"
                className={location.pathname === "/app/bills" ? "active" : ""}
              >
                <span className="flexcenter">
                  <DescriptionOutlinedIcon sx={{fontSize: 20, fontWeight: 100}} />
                  Bills
                </span>
              </Link>
            )}
            {permissions.permission[2].permission[0] && (
              <Link
                to="voucher"
                className={location.pathname === "/app/voucher" ? "active" : ""}
              >
                <span className="flexcenter">
                  <MoneyOutlinedIcon />
                Voucher
                </span>
              </Link>
            )}
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
                <span onClick={handleCompanyMenuOpen}>
                  <ArrowDropDownIcon sx={{ fontSize: 30 }} />
                </span>
                <Menu
                  anchorEl={anchorE2}
                  open={openMenu2}
                  onClose={handleProfileMenuClose}
                  PaperProps={{
                    style: {
                      width: "180px", // Adjust the width as needed
                    },
                  }}
                >
                  {profileItems.map((item, index) => (
                    <MenuItem
                      key={index}
                      onClick={handleProfileMenuClose}
                      id={item}
                    >
                      {item}
                    </MenuItem>
                  ))}
                </Menu>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
