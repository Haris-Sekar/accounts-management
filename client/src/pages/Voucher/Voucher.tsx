/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
import { Add, Delete, Edit } from "@mui/icons-material";
import { getVouchers } from "../../action/action";
import DialogBox from "../../components/Dialog/DialogBox";
import { IDialogBox } from "../../models/IComponents";
import { toast } from "react-toastify";
import { IVoucherDetails } from "../../models/IAddVoucherForm";
import AddVoucher from "./AddVoucher";
import { deleteVoucher } from "../../api/services/voucher";
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
const Voucher = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  interface Column {
    id:
      | "customerName"
      | "amount"
      | "date"
      | "isCheque"
      | "chequeNumber"
      | "isChequeCredited"
      | "bankName";
    label: string;
    minWidth?: number;
    align?: "right";
    format?: (value: number) => string;
  }

  const columns: Column[] = [
    { id: "customerName", label: "Customer Name", minWidth: 170 },
    {
      id: "amount",
      label: "Voucher Amount",
      minWidth: 170,
      align: "right",
      format: (value: number) => value.toLocaleString("en-IN"),
    },
    {
      id: "date",
      label: "Date",
      minWidth: 100,
      align: "right",
    },
    {
      id: "isCheque",
      label: "Is Cheque?",
      minWidth: 100,
    },
    {
      id: "chequeNumber",
      label: "Cheque Number",
      minWidth: 100,
    },
    {
      id: "isChequeCredited",
      label: "Is Cheque Credited",
      minWidth: 100,
    },
    {
      id: "bankName",
      label: "Bank Name",
      minWidth: 100,
    },
  ];

  interface Data {
    id: string;
    customerName: string;
    amount: number;
    date: string;
    isCheque: string;
    chequeNumber: number;
    isChequeCredited: string;
    bankName: string;
  }
  function createData(
    id: string,
    customerName: string,
    amount: number,
    date: number,
    isCheque: boolean,
    chequeNumber: number,
    isChequeCredited: boolean,
    bankName: string
  ): Data {
    return {
      id: id,
      customerName: customerName,
      amount: amount,
      date: new Date(date).toLocaleDateString(),
      isCheque: String(isCheque),
      chequeNumber: chequeNumber ?? "-",
      isChequeCredited: String(isChequeCredited),
      bankName: bankName ?? "-",
    };
  }

  const rows: Data[] = [];

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [editValues, setEditValues] = React.useState<IVoucherDetails>();

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setEditValues(undefined);
    setOpen(false);
  };
  useEffect(() => {
    //@ts-ignore
    dispatch(getVouchers(null));
  }, [dispatch, navigate]);

  const { vouchers } = useSelector((state: any) => state.voucherReducer);

  if (vouchers !== undefined) {
    vouchers.forEach((voucher: IVoucherDetails) => {
      rows.push(
        createData(
          voucher._id,
          voucher.customerName,
          voucher.amount,
          voucher.date,
          voucher.isCheque,
          voucher.chequeNumber,
          voucher.isChequeCredited,
          voucher.bankName
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
    const data = vouchers.filter(
      (voucher: IVoucherDetails) => voucher._id === _e.currentTarget.id
    )[0];
    setEditValues(data);
    setOpen(true);
  }
  function handleDelete(e: any) {
    setDialogDetails({
      title: "Confirm Delete this Voucher",
      description: (
        <Typography>
          By deleting this Voucher you cannot restore it.
          <br />
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
    deleteVoucher(id)
      .then(() => {
        //@ts-ignore
        dispatch(getVouchers(null));
        setDeleteDialogOpen(false);
      })
      .catch((e) => {
        toast.error(e?.message);
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
      name: "Voucher date",
      value: 3,
      function: (row: { date: string }, searchTerm: any) =>
        row.date.toLowerCase().includes(searchTerm),
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
    <Paper
      sx={{ width: "100%", overflow: "hidden", padding: "2%", height: "100%" }}
    >
      <SearchBar
        onChangeFunc={searchOnChange}
        selectOnChange={(e: { currentTarget: { value: any } }) => {
          setIsSearch(false);
          setSearchResult([]);
          setSearchType(Number(e.currentTarget.value));
          //@ts-ignore
          document.getElementById("searchQueryInput").value = "";
        }}
        searchSelectItems={searchSelectItems}
      />
      <DialogBox
        dialogDetails={dialogDetails}
        successCallBack={deleteSuccessCallback}
        setOpen={setDeleteDialogOpen}
        open={deleteDialogOpen}
      />
      <TableContainer sx={{ maxHeight: 500 }}>
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
            {vouchers && vouchers.length > 0 && !isSearch
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
                        // onClick={handleCustomerClick}
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
                      // onClick={handleCustomerClick}
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
            <AddVoucher
              handleClose={handleClose}
              editValues={editValues as IVoucherDetails}
            />
          </Box>
        </Fade>
      </Modal>
    </Paper>
  );
};
export default Voucher;
