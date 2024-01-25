/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Add, Delete, Edit } from "@mui/icons-material";
import {
  Backdrop,
  Box,
  Fade,
  Modal,
  Paper,
  SpeedDial,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddCustomer from "./AddCustomer";
import { useDispatch, useSelector } from "react-redux";
import { getCustomers } from "../../action/action";
import { ICustomerDetails } from "../../models/IAddCustomerForm";
import DialogBox from "../../components/Dialog/DialogBox";
import { IDialogBox } from "../../models/IComponents";
import { deleteCustomer } from "../../api/services/customers";
import SearchBar from "../../components/Navbar/SearchBar";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const Customers = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  interface Column {
    id: "customerName" | "area" | "balance" | "totalPurchase" | "totalBill";
    label: string;
    minWidth?: number;
    align?: "right";
    format?: (value: number) => string;
  }

  const columns: readonly Column[] = [
    { id: "customerName", label: "Customer Name", minWidth: 170 },
    { id: "area", label: "Area", minWidth: 100 },
    {
      id: "totalBill",
      label: "Total Bill Count",
      minWidth: 170,
      align: "right",
      format: (value: number) => value.toLocaleString("en-IN"),
    },
    {
      id: "totalPurchase",
      label: "Total Purchased Amount",
      minWidth: 170,
      align: "right",
      format: (value: number) => "₹ " + value.toLocaleString("en-IN") + " /-",
    },
    {
      id: "balance",
      label: "Balance",
      minWidth: 170,
      align: "right",
      format: (value: number) => "₹ " + value.toLocaleString("en-IN") + " /-",
    },
  ];

  interface Data {
    id: string;
    customerName: string;
    area: string;
    totalBill: number;
    totalPurchase: number;
    balance: number;
  }

  function createData(
    id: string,
    customerName: string,
    area: string,
    totalBill: number,
    totalPurchase: number,
    balance: number
  ): Data {
    return { id, customerName, area, totalBill, totalPurchase, balance };
  }

  const rows: Data[] = [];

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [editValues, setEditValues] = React.useState<ICustomerDetails>();

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleCustomerClick = (event: any) => {
    navigate(`/app/customers/${event.target.id}`);
  };
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    console.log("asdf");

    setEditValues(undefined);
    setOpen(false);
  };
  useEffect(() => {
    //@ts-ignore
    dispatch(getCustomers(null));
  }, [dispatch, navigate]);

  const { customers } = useSelector((state: any) => state.customerReducer);

  if (customers !== undefined) {
    customers.forEach((customer: ICustomerDetails) => {
      rows.push(
        createData(
          customer._id,
          customer.customerName,
          customer.area,
          customer.totalBills,
          customer.totalSalesAmount,
          customer.balance
        )
      );
    });
  }

  function editComponent(id: any) {
    return (
      <span id={id} onClick={handleEdit} style={{color: '#2196f3'}}>
        <Edit />
      </span>
    );
  }
  const deleteComponent = (id: string | undefined) => (
    <span id={id} onClick={handleDelete} style={{color: "#FF4244"}}>
      <Delete />
    </span>
  );
  function handleEdit(_e: any) {
    const data = customers.filter(
      (customer: ICustomerDetails) => customer._id === _e.currentTarget.id
    )[0];
    setEditValues(data);
    setOpen(true);
  }
  function handleDelete(e: any) {
    setDialogDetails({
      title: "Confirm Delete customer",
      description: (
        <Typography>
          Deleting customer will delete all the <b>bills</b> and <b>vouchers</b>{" "}
          associated with this customer, <br />
          <b>Do you want to delete?</b>
        </Typography>
      ),
      id: e.currentTarget.id,
      successBtnText: "Delete",
      failureBtnText: "Cancel",
    });
    setDeleteDialogOpen(true);
  }
  function deleteSuccessCallback(_e: any, id: string) {
    deleteCustomer(id).then(() => {
      //@ts-ignore
      dispatch(getCustomers(null));
      setDeleteDialogOpen(false);
    });
  }

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [dialogDetails, setDialogDetails] = React.useState<IDialogBox>({
    title: "",
    description: <Typography />,
    id: "",
    successBtnText: "",
    failureBtnText: "",
  });

  const [isSearch, setIsSearch] = useState(false);
  const [searchResult, setSearchResult] = useState<Data[]>([]);
  const [searchType, setSearchType] = useState<number>(1);
  const searchSelectItems = [
    {
      name: "Customer",
      value: 1,
      function: (row: { customerName: string }, searchTerm: any) =>
        row.customerName.toLowerCase().includes(searchTerm),
    },
    {
      name: "Area",
      value: 2,
      function: (row: { area: string }, searchTerm: any) =>
        row.area.toLowerCase().includes(searchTerm),
    },
  ];

  const searchOnChange = (e: { currentTarget: { value: any } }) => {
    const searchTerm = String(e.currentTarget.value).toLowerCase();
    if (searchTerm.length > 0) {
      setIsSearch(true);
      const func = searchSelectItems.find((item) => item.value === searchType);
      setSearchResult(rows.filter((row) => func?.function(row, searchTerm)));
    } else {
      setIsSearch(false);
      setSearchResult([]);
    }
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", padding: "2%" }}>
      <SearchBar
        onChangeFunc={searchOnChange}
        selectOnChange={(e: { currentTarget: { value: any } }) => {
          setIsSearch(false);
          setSearchResult([]);
          setSearchType(Number(e.currentTarget.value));
          document.getElementById('searchQueryInput').value = "";
        }}
        searchSelectItems={searchSelectItems}
      />
      <DialogBox
        dialogDetails={dialogDetails}
        successCallBack={deleteSuccessCallback}
        setOpen={setDeleteDialogOpen}
        open={deleteDialogOpen}
      />
      <TableContainer sx={{ maxHeight: 440 }}>
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
              <TableCell key="edit" align="right" style={{ minWidth: 30 }}>
                Edit
              </TableCell>
              <TableCell key="delete" align="right" style={{ minWidth: 30 }}>
                Delete
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers && customers.length > 0 && !isSearch
              ? rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.id}
                        id={row.id}
                        onClick={handleCustomerClick}
                      >
                        {columns.map((column) => {
                          const value = row[column.id];
                          return (
                            <TableCell
                              key={column.id}
                              align={column.align}
                              id={row.id}
                            >
                              {column.format && typeof value === "number"
                                ? column.format(value)
                                : value}
                            </TableCell>
                          );
                        })}
                        <TableCell key="edit" align="right" id={row.id}>
                          {editComponent(row.id)}
                        </TableCell>
                        <TableCell key="delete" align="right" id={row.id}>
                          {deleteComponent(row.id)}
                        </TableCell>
                      </TableRow>
                    );
                  })
              : searchResult.map((row) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.id}
                      id={row.id}
                      onClick={handleCustomerClick}
                    >
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            id={row.id}
                          >
                            {column.format && typeof value === "number"
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      })}
                      <TableCell key="edit" align="right" id={row.id}>
                        {editComponent(row.id)}
                      </TableCell>
                      <TableCell key="delete" align="right" id={row.id}>
                        {deleteComponent(row.id)}
                      </TableCell>
                    </TableRow>
                  );
                })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: "absolute", bottom: 16, right: 16 }}
        icon={<Add />}
        onClick={handleOpen}
      ></SpeedDial>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <AddCustomer
              handleClose={handleClose}
              editValues={editValues as ICustomerDetails}
            />
          </Box>
        </Fade>
      </Modal>
    </Paper>
  );
};

export default Customers;
