/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getCustomers } from "../../action/action";
import logo from "../../assets/logo.png";

function daysGone(millis: number) {
  let date: number = new Date(millis).getTime();
  let now = Date.now();
  let diffInMillis = now - date;
  let daysGone = diffInMillis / (1000 * 60 * 60 * 24);
  daysGone = daysGone <= 1 ? 1 : daysGone;
  return Math.floor(daysGone);
}

const CustomerDetailExport = () => {
  const params = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    //@ts-ignore
    dispatch(getCustomers(params.id));
  }, [dispatch, params.id]);

  const { customer } = useSelector((state: any) => state.customerReducer);

  useEffect(() => {
    if (customer.customerTransDetails) {
      document.title = `${customer.customerDetails.customerName} Balance Sheet`;
      // window.print()
    }
  }, [customer]);
  const rows: {
    date: string;
    fromToday: string;
    billAmount: string;
    billNumber: string | number;
    voucherAmount: string;
  }[] = [];

  function createData(
    date: number,
    billNumber: number,
    billAmount: number,
    voucherAmount: number
  ) {
    // const startDate = moment(date);
    const days = daysGone(date);
    return {
      date: new Date(date).toLocaleDateString(),
      fromToday: days + (days === 1 ? " day" : " days"),
      billAmount:
        billAmount === 0
          ? `-`
          : `₹ ${Number(billAmount).toLocaleString("en-IN")} /-`,
      billNumber: billNumber === 0 ? `-` : billNumber,
      voucherAmount:
        voucherAmount === 0
          ? `-`
          : `₹ ${Number(voucherAmount).toLocaleString("en-IN")} /-`,
    };
  }

  if (customer && customer.customerTransDetails) {
    customer.customerTransDetails.forEach((data: any) => {
      rows.push(
        createData(
          data.date,
          data.billNumber,
          data.billAmount,
          data.voucherAmount
        )
      );
    });
  }
  return (
    <>
      {customer && customer.customerTransDetails && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TableContainer component={Paper} id="report" sx={{ maxWidth: 650 }}>
            <Typography
              align="center"
              sx={{ fontWeight: "bolder" }}
              fontSize={24}
            >
              <img src={logo} style={{ width: 70 }} />
              AVS ENTERPRISES
            </Typography>
            <Typography
              align="center"
              sx={{ fontWeight: "bold", fontSize: 20 }}
            >
              {customer.customerDetails.customerName}
            </Typography>
            <Table sx={{ minWidth: 100 }} aria-label="spanning table">
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>No of Days</TableCell>
                  <TableCell align="right">Bill Number</TableCell>
                  <TableCell align="right">Debit(-) / Credit(+)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.date}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.date}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.fromToday}
                    </TableCell>
                    <TableCell align="right">{row.billNumber}</TableCell>
                    <TableCell align="right" sx={{ color: "#FF4244" }}>
                      {row.billAmount === "-" ? (
                        <span style={{ color: "#5DCA36" }}>
                          {"(-) " + row.voucherAmount}
                        </span>
                      ) : (
                        <span style={{ color: "#FF4244" }}>
                          {"(+) " + row.billAmount}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={5}></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2} align="right" sx={{ fontSize: 16 }}>
                    <b>Total Bill Amount</b>
                  </TableCell>
                  <TableCell align="right"></TableCell>
                  <TableCell
                    align="right"
                    sx={{ color: "#FF4244", fontWeight: "bold", fontSize: 16 }}
                  >{`₹ ${Number(
                    customer.customerDetails.totalSalesAmount
                  ).toLocaleString("en-IN")} /-`}</TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2} align="right" sx={{ fontSize: 16 }}>
                    <b>Total Paid Amount</b>
                  </TableCell>
                  <TableCell align="right"></TableCell>
                  <TableCell
                    align="right"
                    sx={{ color: "#5DCA36", fontWeight: "bold", fontSize: 16 }}
                  >
                    {`₹ ${Number(
                      customer.customerDetails.totalAmountRecived
                    ).toLocaleString("en-IN")} /-`}
                  </TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>

                <TableRow>
                  <TableCell align="right" colSpan={2} sx={{ fontSize: 16 }}>
                    Old Balance
                  </TableCell>
                  <TableCell align="right"></TableCell>
                  <TableCell
                    align="right"
                    sx={{ color: "#FF4244", fontSize: 16 }}
                  >{`₹ ${Number(
                    customer.customerDetails.oldBalance
                  ).toLocaleString("en-IN")} /-`}</TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontSize: 22 }} colSpan={3} align="right">
                    <b>Total Balance</b>
                  </TableCell>
                  <TableCell
                    sx={{ fontSize: 22, color: "#FF4244" }}
                    align="right"
                  >{`₹ ${Number(
                    customer.customerDetails.balance
                  ).toLocaleString("en-IN")} /-`}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Button
            onClick={(_e) =>
              window.open(
                `https://wa.me/+91${customer.customerDetails.phoneNumber}?`
              )
            }
          >
            share
          </Button>
        </Box>
      )}
    </>
  );
};

export default CustomerDetailExport;
