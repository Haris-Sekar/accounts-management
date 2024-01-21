/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getCustomers } from "../../action/action";


const CustomerDetailExport = () => {
    const params = useParams();
    const dispatch = useDispatch();
    useEffect(() => {
        //@ts-ignore
        dispatch(getCustomers(params.id));
    }, [dispatch, params.id]);

 

    const { customer } = useSelector(
        (state: any) => state.customerReducer
    );

    useEffect(() => {
        if(customer.customerTransDetails) {
            document.title =  `${customer.customerDetails.customerName} Balance Sheet`
            window.print()
        }
    }, [customer])
    const rows: { date: string; billAmount: string; billNumber: string | number; voucherAmount: string; }[] = [];

    function createData(
        date: number,
        billNumber: number,
        billAmount: number,
        voucherAmount: number
    ) {
        return {
            date: new Date(date).toLocaleDateString(),
            billAmount: billAmount === 0 ? `-` : `₹ ${Number(billAmount).toLocaleString('en-IN')} /-`,
            billNumber: billNumber === 0 ? `-` : billNumber,
            voucherAmount: voucherAmount === 0 ? `-` : `₹ ${Number(voucherAmount).toLocaleString('en-IN')} /-`
        };
    }

    if (customer && customer.customerTransDetails) {
        customer.customerTransDetails.forEach((data: any) => {
            rows.push(createData(data.date, data.billNumber, data.billAmount, data.voucherAmount));
        });
    }
    return (
        <>
            {customer && customer.customerTransDetails && (
                <Box sx={{ display: "flex", flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <TableContainer component={Paper} id="report" sx={{ maxWidth: 600 }}>
                        <Typography align="center" sx={{ fontWeight: 'bolder' }}>AVS Enterprises - {customer.customerDetails.customerName}</Typography>
                        <Table sx={{ minWidth: 100 }} aria-label="spanning table">

                            <TableHead>
                                <TableRow>
                                    <TableCell>Date</TableCell>
                                    <TableCell align="right">Bill Number</TableCell>
                                    <TableCell align="right">Bill Amount</TableCell>
                                    <TableCell align="right">Paid Amount</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row) => (
                                    <TableRow
                                        key={row.date}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {row.date}
                                        </TableCell>
                                        <TableCell align="right">{row.billNumber}</TableCell>
                                        <TableCell align="right" sx={{color: "#FF4244"}}>{row.billAmount}</TableCell>
                                        <TableCell align="right" sx={{color: "#5DCA36"}}>{row.voucherAmount}</TableCell>
                                    </TableRow>
                                ))}
                                <TableRow>
                                    <TableCell rowSpan={4} />
                                </TableRow>
                                <TableRow>
                                    <TableCell>Total Bill Amount</TableCell>
                                    <TableCell align="right" sx={{color: "#FF4244"}}>{`₹ ${Number(customer.customerDetails.totalSalesAmount).toLocaleString('en-IN')} /-`}</TableCell>
                                    <TableCell align="right"></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Total Paid Amount</TableCell>
                                    <TableCell align="right"></TableCell>
                                    <TableCell align="right" sx={{color: '#5DCA36'}}>{`₹ ${Number(customer.customerDetails.totalAmountRecived).toLocaleString('en-IN')} /-`}</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell>Old Balance</TableCell>
                                    <TableCell align="right" sx={{color: '#FF4244'}}>{`₹ ${Number(customer.customerDetails.oldBalance).toLocaleString('en-IN')} /-`}</TableCell>
                                    <TableCell align="right"></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell colSpan={2} />
                                    <TableCell width={120}>Total Balance</TableCell>
                                    <TableCell width={120} sx={{color: "#FF4244"}}>{`₹ ${Number(customer.customerDetails.balance).toLocaleString('en-IN')} /-`}</TableCell>
                                    <TableCell align="right"></TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer> 
                </Box>
            )} 

        </>
    )
}

export default CustomerDetailExport;