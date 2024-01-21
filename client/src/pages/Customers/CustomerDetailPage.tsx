/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getCustomers } from "../../action/action";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, Card, CardContent} from "@mui/material";
import "./customer.css"
import CallIcon from '@mui/icons-material/Call';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
const CustomerDetailPage = () => {
    const param = useParams();
    const dispatch = useDispatch();
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


    const rows: { date: string; billAmount: string; billNumber: string | number; voucherAmount: string; }[] = [];
    useEffect(() => {
        //@ts-ignore
        dispatch(getCustomers(param.id));
    }, [dispatch, param.id]);

    const { customer } = useSelector(
        (state: any) => state.customerReducer
    );

    let cardContents: any[] = []

    if (customer && customer.customerDetails) {
        cardContents = [
            {
                cardName: "Total Bills",
                value: customer.customerDetails.totalBills,
                color: "#000000"
            }, {
                cardName: "Total Bill Amount",
                value: `₹ ${Number(customer.customerDetails.totalSalesAmount).toLocaleString('en-IN')} /-`,
                color: "#5DCA36"
            }, {
                cardName: "Total Amount Paid",
                value: `₹ ${Number(customer.customerDetails.totalAmountRecived).toLocaleString('en-IN')} /-`,
                color: "#5DCA36"
            }, {
                cardName: "Over All Balance",
                value: `₹ ${Number(customer.customerDetails.balance).toLocaleString('en-IN')} /-`,
                color: "#FF4244"
            }
        ];
        customer.customerTransDetails.forEach((data: any) => {
            rows.push(createData(data.date, data.billNumber, data.billAmount, data.voucherAmount));
        })
    }
    interface Column {
        id: 'date' | 'billNumber' | 'billAmount' | 'voucherAmount';
        label: string;
        minWidth?: number;
        align?: 'right';
        format?: (value: number) => string;
        color?: string
    }


    const columns: readonly Column[] = [
        { id: 'date', label: 'Date', minWidth: 170, format: (value: number) => new Date(value).toLocaleDateString('en-IN') },
        { id: 'billNumber', align: 'right', label: 'Bill Number', minWidth: 100 },
        {
            id: 'billAmount',
            label: 'Bill Amount',
            minWidth: 170,
            align: 'right',
            format: (value: number) => `₹ ${Number(value).toLocaleString('en-IN')} /-`,
            color: '#FF4344'
        },
        {
            id: 'voucherAmount',
            label: 'Paid Amount',
            minWidth: 170,
            align: 'right',
            color: '#5DCA36',
            format: (value: number) => `₹ ${Number(value).toLocaleString('en-IN')} /-`,
        }
    ];
    return (
        <div>
            {customer && customer.customerDetails && (
                <>
                    <div className="customerDetailsContainer customerDetailPageTable" style={{margin: 'auto'}}>
                        <Paper elevation={9} sx={{ width: 'fit-content', minWidth: 300 }} className="customerCardPaper">
                            <Card>
                                <CardContent>
                                    <div className="customerDetails">
                                        <div className="customerAvatar">
                                            <AccountCircleIcon sx={{ fontSize: '40px', color: '#023047' }} />{customer.customerDetails.customerName}
                                        </div>
                                        <div className="phoneNumber" onClick={() => window.open(`tel:${customer.customerDetails.phoneNumber}`)}><CallIcon /> <span>{customer.customerDetails.phoneNumber}</span></div>
                                        <div className="area">{customer.customerDetails.area}</div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Paper>
                        <Paper elevation={9} className="statsContainer">
                            {cardContents.map((card) => (
                                <Card variant="outlined" component={Paper} sx={{ width: 300 }}>
                                    <CardContent className="statsCard">
                                        <div className="cardTitle">{card.cardName}</div>
                                        <div className="cardValue" style={{ color: card.color }}>{card.value}</div>
                                    </CardContent>
                                </Card>
                            ))}
                        </Paper>
                    </div>
                    <div className="transData" style={{width: '100%'}}>
                        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                            <TableContainer className="customerDetailPageTable" sx={{ maxHeight: 440, margin: 'auto', maxWidth: 1500 }}>
                                <Table stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow>
                                            {columns.map((column) => (
                                                <TableCell
                                                    key={column.id}
                                                    align={column.align}
                                                    style={{ minWidth: column.minWidth }}
                                                >
                                                    {column.label}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {rows
                                            .map((row) => {
                                                return (
                                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.date}>
                                                        {columns.map((column) => {
                                                            const value = row[column.id];
                                                            return (
                                                                <TableCell key={column.id} align={column.align} sx={{ color: column.color ?? "#000000" }}>
                                                                    {column.format && typeof value === 'number'
                                                                        ? column.format(value)
                                                                        : value}
                                                                </TableCell>
                                                            );
                                                        })}
                                                    </TableRow>
                                                );
                                            })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <div className="exportBtn">
                                <Button variant="contained" onClick={() => window.open('/app/customers/' + param.id + '/exportTransaction', "_blank")}>Export</Button>
                            </div>
                        </Paper>
                    </div>
                </>
            )}

        </div>

    );

}
export default CustomerDetailPage;
