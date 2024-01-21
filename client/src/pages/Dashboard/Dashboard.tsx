/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Box, Card, CardContent, Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDashBoardDetails } from "../../action/action";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
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
            totalBillAmount: totalBillAmount === 0 ? `-` : `₹ ${Number(totalBillAmount).toLocaleString('en-IN')} /-`,
            totalVoucherAmount: totalVoucherAmount === 0 ? `-` : `₹ ${Number(totalVoucherAmount).toLocaleString('en-IN')} /-`,
            balance: balance === 0 ? `-` : `₹ ${Number(balance).toLocaleString('en-IN')} /-`,
        };
    }

    if (dashboardDetails && dashboardDetails?.totalBillAmount) {
        cardContents = [
            {
                cardName: "Total Customers",
                value: dashboardDetails.totalCustomers,
            },
            {
                cardName: "Total Billed Amount",
                value: `₹ ${Number(dashboardDetails.totalBillAmount).toLocaleString(
                    "en-IN"
                )} /-`,
                isHide: true,
                color: "#5DCA36",
            },
            {
                cardName: "Total Amount Recived",
                value: `₹ ${Number(dashboardDetails.totalVoucherAmount).toLocaleString(
                    "en-IN"
                )} /-`,
                isHide: true,
                color: "#5DCA36",
            },
            {
                cardName: "Total Outstanding Amount",
                value: `₹ ${Number(
                    dashboardDetails.totalOutstandingAmount
                ).toLocaleString("en-IN")} /-`,
                isHide: true,
                color: "#FF4244",
            },
        ];

        dashboardDetails.topCustomers.forEach((customer: { _id: string, customerName: string; area: string; billCount: number; totalBillAmount: number; totalVoucherAmount: number; balance: any; }) => {
            rows.push(createData(customer._id, customer.customerName, customer.area, customer.billCount, customer.totalBillAmount, customer.totalVoucherAmount, Number((customer.totalBillAmount + customer.balance) - customer.totalVoucherAmount)))
        })
    }

    const [hide, setHide] = useState(true);

    return (
        <>
            <Paper elevation={9} className="statsContainer">
                {cardContents.map((card) => (
                    <Card variant="outlined" component={Paper} sx={{ width: 300 }}>
                        <CardContent className="statsCard">
                            <div className="cardTitle">{card.cardName}</div>
                            {isLoading ? (
                                <Skeleton animation="wave" width={150} height={50} />
                            ) : (
                                <div className="cardValue" style={{ color: card.color, cursor: 'pointer' }}>
                                    {card.isHide && hide ? <span onClick={() => setHide(false)} style={{ color: "#000000" }}>#######</span> : <span onClick={() => setHide(true)}>{card.value}</span>}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </Paper>
            <Paper elevation={9} className="top20Cus" sx={{ maxWidth: 1100, padding: 5, margin: 'auto', marginTop: '50px' }}>
                <Typography align="center" fontWeight='bolder' fontSize='24px'>Top 20 Customer Stats</Typography>
                <Box sx={{ display: "flex", flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <TableContainer component={Paper} id="report" sx={{ maxWidth: 1000 }}>
                        <Table sx={{ minWidth: 200 }} aria-label="spanning table">

                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Customer Name</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Area</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }} align="right">Total Bill Purchased</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }} align="right">Total Bill Purchased Amount</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }} align="right">Total Amount Recived</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }} align="right">Balance</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row) => (
                                    <TableRow
                                        onClick={() => navigate(`/app/customers/${row.id}`)}

                                        key={row.customerName}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer' }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {row.customerName}
                                        </TableCell> <TableCell component="th" scope="row">
                                            {row.area}
                                        </TableCell>
                                        <TableCell align="right">
                                            {row.billCount}
                                        </TableCell>
                                        <TableCell align="right" sx={{ color: "#FF4244" }}>{row.totalBillAmount}</TableCell>
                                        <TableCell align="right" sx={{ color: "#5DCA36" }}>{row.totalVoucherAmount}</TableCell>
                                        <TableCell align="right" sx={{ color: "#FF4244" }}>{row.balance}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Paper>
        </>
    );
};

export default Dashboard;
