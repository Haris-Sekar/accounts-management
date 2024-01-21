import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IBillDetails } from "../../models/IAddBillForm";
import { Backdrop, Box, Fade, Modal, Paper, SpeedDial, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from "@mui/material";
import { Add, Delete, Edit } from "@mui/icons-material";
import { getBills } from "../../action/action";
import AddBills from "./AddBills";
import DialogBox from "../../components/Dialog/DialogBox";
import { IDialogBox } from "../../models/IComponents";
import { deleteBill } from "../../api/services/billls";
import { toast } from "react-toastify";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
const Bills = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  interface Column {
    id: "billNo" | "customerName" | "billDate" | "amount";
    label: string;
    minWidth?: number;
    align?: "right";
    format?: (value: number) => string;
  }

  const columns: Column[] = [
    { id: "billNo", label: "Bill Number", minWidth: 100 },
    { id: "customerName", label: "Customer Name", minWidth: 170 },
    {
      id: "billDate",
      label: "Bill Date",
      minWidth: 170,
      align: "right",
      format: (value: number) => new Date(value).toLocaleDateString(),
    },
    {
      id: "amount",
      label: "Bill Amount",
      minWidth: 170,
      align: "right",
      format: (value: number) => value.toLocaleString("en-IN"),
    }
  ];

  interface Data {
    id: string;
    customerName: string;
    billNo: number;
    billDate: number;
    amount: number;
  }
  function createData(
    id: string,
    customerName: string,
    billNo: number,
    billDate: number,
    amount: number
  ): Data {
    return { id, customerName, billNo, billDate, amount };
  }

  let rows: Data[] = [];

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [editValues, setEditValues] = React.useState<IBillDetails>();

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
    setOpen(false)
  };
  useEffect(() => {
    //@ts-ignore
    dispatch(getBills(null));
  }, [navigate]);

  const { bills } = useSelector(
    (state: any) => state.billsReducer
  );

  if (bills !== undefined) {
    bills.forEach((customer: IBillDetails) => {
      rows.push(
        createData(
          customer._id,
          customer.customerName,
          customer.billNumber,
          customer.billDate,
          customer.amount
        )
      );
    });
  }

  function editComponent(id: any) { return (<span id={id} onClick={handleEdit}><Edit /></span>) }
  const deleteComponent = (id: string | undefined) => (<span id={id} onClick={handleDelete}><Delete /></span>)
  function handleEdit(_e: any) {
    const data = bills.filter((bill: IBillDetails) => bill._id === _e.currentTarget.id)[0];
    setEditValues(data)
    setOpen(true);
  }
  function handleDelete(e: any) {
    setDialogDetails({
      title: "Confirm Delete this Bill",
      description: (<Typography>By deleting this bill you cannot restore it.<br /><b>Do you want to delete?</b></Typography>),
      id: e.currentTarget.id,
      successBtnText: "Delete",
      failureBtnText: "Cancel"
    });
    setDeleteDialogOpen(true);
  }
  function deleteSuccessCallback(_e: any, id: string) {
    deleteBill(id).then(() => {
      //@ts-ignore
      dispatch(getBills(null));
      setDeleteDialogOpen(false);
    }).catch((e) => {
      toast.error(e?.message);
      setDeleteDialogOpen(false)
    })


  }

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [dialogDetails, setDialogDetails] = React.useState<IDialogBox>({
    title: "",
    description: (<Typography />),
    id: "",
    successBtnText: "",
    failureBtnText: ""
  });
  return (
    <Paper sx={{ width: "100%", overflow: "hidden", padding: '2%', height: "100%" }}>
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

            {bills &&
              bills.length > 0 &&
              rows
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
                          <TableCell key={column.id} align={column.align} id={row.id}>
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
            <AddBills handleClose={handleClose} editValues={editValues as IBillDetails} />
          </Box>
        </Fade>
      </Modal>
    </Paper>
  );
};
export default Bills;