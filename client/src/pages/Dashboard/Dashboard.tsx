/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Box, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDashBoardDetails } from "../../action/action";
import { useNavigate } from "react-router-dom";
import { MODULES, hasViewPermission } from "../../consts/consts";
import CustomCard from "../../components/Card/CustomCard";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!hasViewPermission(MODULES.DASHBOARD)) {
      navigate("/app");
    }
    //@ts-ignore
    dispatch(getDashBoardDetails());
  }, [dispatch]);

  const { dashboardDetails, isLoading } = useSelector(
    (state: any) => state.customerReducer
  );
  let cardContents: any[] = [
    { cardName: "Total Customers" },
    { cardName: "Total Billed Amount" },
    { cardName: "Total Amount Recived" },
    { cardName: "Total Outstanding Amount" },
  ];
  const rows: any[] = [];
  function createData(
    id: string,
    customerName: string,
    area: string,
    billCount: number,
    totalBillAmount: number,
    totalVoucherAmount: number,
    balance: number
  ) {
    return {
      id,
      customerName,
      area,
      billCount,
      totalBillAmount:
        totalBillAmount === 0
          ? `-`
          : `₹ ${Number(totalBillAmount).toLocaleString("en-IN")} /-`,
      totalVoucherAmount:
        totalVoucherAmount === 0
          ? `-`
          : `₹ ${Number(totalVoucherAmount).toLocaleString("en-IN")} /-`,
      balance:
        balance === 0 ? `-` : `₹ ${Number(balance).toLocaleString("en-IN")} /-`,
    };
  }

  if (dashboardDetails && dashboardDetails.hasOwnProperty("totalBillAmount")) {
    cardContents = [
      {
        cardName: "Total Customers",
        value: dashboardDetails.totalCustomers,
        isHide: true,
      },
      {
        cardName: "Total Billed Amount",
        value: `₹ ${Number(dashboardDetails.totalBillAmount).toLocaleString(
          "en-IN"
        )} /-`,
        isHide: true,
      },
      {
        cardName: "Total Amount Recived",
        value: `₹ ${Number(dashboardDetails.totalVoucherAmount).toLocaleString(
          "en-IN"
        )} /-`,
        isHide: true,
      },
      {
        cardName: "Total Outstanding Amount",
        value: `₹ ${Number(
          dashboardDetails.totalOutstandingAmount
        ).toLocaleString("en-IN")} /-`,
        isHide: true,
      },
    ];

    dashboardDetails.topCustomers.forEach(
      (customer: {
        _id: string;
        customerName: string;
        area: string;
        billCount: number;
        totalBillAmount: number;
        totalVoucherAmount: number;
        balance: any;
      }) => {
        rows.push(
          createData(
            customer._id,
            customer.customerName,
            customer.area,
            customer.billCount,
            customer.totalBillAmount,
            customer.totalVoucherAmount,
            Number(
              customer.totalBillAmount +
                customer.balance -
                customer.totalVoucherAmount
            )
          )
        );
      }
    );
  }

  const [hide, setHide] = useState(true);

  // console.log(cardContents);

  return (
    <>
      <Box sx={{backgroundColor: "#eef2f6", margin: '1% 2%', minHeight: '800px', borderRadius: '10px'}}>
        <div className="statsContainer">
          {cardContents.map((card) => (
            <CustomCard
              title={card.cardName}
              value={
                card.isHide && hide ? (
                  <span
                    onClick={() => setHide(false)}
                    style={{ color: "#ffffff", cursor: "pointer" }}
                  >
                    ####
                  </span>
                ) : (
                  <span
                    style={{ color: card.color, cursor: "pointer" }}
                    onClick={() => setHide(true)}
                  >
                    {card.value}
                  </span>
                )
              }
            />
          ))}
        </div>
      </Box>
    </>
  );
};

export default Dashboard;
