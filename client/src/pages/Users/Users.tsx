import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../../action/action";
import {
  Backdrop,
  Button,
  Fade,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  styled,
  tableCellClasses,
} from "@mui/material";
import { MODULES, USER_TYPE, hasViewPermission } from "../../consts/consts";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { useNavigate } from "react-router-dom";
import { AddCircle, Delete, Edit } from "@mui/icons-material";

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

const Users = () => {
  const permissions = JSON.parse(localStorage.getItem("permissions") as string)
    .permission[MODULES.BILLS].permission;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (!hasViewPermission(MODULES.USER)) {
      navigate("/app");
    }
    //@ts-ignore
    dispatch(getUsers());
  }, [dispatch]);

  const { users } = useSelector((state: any) => state.userReducer);

  const rows: {
    name: string;
    email: string;
    userType: string;
    permission: any;
  }[] = [];

  if (users.length > 0) {
    //@ts-ignore
    users.forEach((user) => {
      rows.push(
        createData(
          user.name,
          user.email,
          user.userType,
          user.permissions.permission[0].permissions
        )
      );
    });
  }

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  function createData(
    name: string,
    email: string,
    userType: number,
    permission: any
  ) {
    return {
      name,
      email,
      userType: userType === USER_TYPE.ADMIN ? "ADMIN" : "EMPLOYEE",
      permission,
    };
  }

  const [value, setValue] = React.useState("1");

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    // setEditValues(undefined);
    setOpen(false);
  };

  const addUserInitalState = {
    name: "",
    email: "",
    password: "",
    userType: 1,
  };

  const [profile, setProfile] = React.useState(addUserInitalState.userType);

  const handleChangeSelect = (event: SelectChangeEvent) => {
    //@ts-ignore
    setProfile(event.target.value);
  };

  const [newUser, setNewUser] = useState(addUserInitalState);
  const [error, setError] = useState(addUserInitalState);

  const addUser = () => {
    validateForm();
    console.log(newUser);
  };

  const validateForm = () => {
    console.log(newUser.name.length === 0);
    const tempError = addUserInitalState;
    if (newUser.name.length === 0) {
      tempError.name = "Name should not be empty";
    }

    if (newUser.email.length === 0) {
      tempError.email = "Email should not be empty";
    }
    if (newUser.password.length < 6) {
      tempError.password = "Password length should be greater than 6";
    }  
    setError(tempError)
  };

  console.log(error);

  return (
    <div>
      <Paper sx={{ maxWidth: 900, margin: "auto", marginTop: "5%" }}>
        <Box sx={{ width: "100%", typography: "body1" }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
              >
                <Tab label="Users" value="1" />
                <Tab label="Permissions" value="2" />
              </TabList>
            </Box>
            <TabPanel value="1">
              <Button
                variant="contained"
                startIcon={<AddCircle />}
                color="secondary"
                sx={{ margin: "2% 0" }}
                onClick={(_e) => handleOpen()}
              >
                Add User
              </Button>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Name</StyledTableCell>
                      <StyledTableCell>Email</StyledTableCell>
                      <StyledTableCell>User Type</StyledTableCell>
                      {permissions[2] && (
                        <StyledTableCell align="center">Edit</StyledTableCell>
                      )}
                      {permissions[2] && (
                        <StyledTableCell align="center">Delete</StyledTableCell>
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users &&
                      users.length > 0 &&
                      rows.map((row) => (
                        <StyledTableRow key={row.name}>
                          <StyledTableCell component="th" scope="row">
                            {row.name}
                          </StyledTableCell>
                          <StyledTableCell>{row.email}</StyledTableCell>
                          <StyledTableCell>{row.userType}</StyledTableCell>
                          {permissions[2] && (
                            <StyledTableCell align="center">
                              <Edit color="info" />
                            </StyledTableCell>
                          )}
                          {permissions[3] && (
                            <StyledTableCell align="center">
                              <Delete color="error" />
                            </StyledTableCell>
                          )}
                        </StyledTableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>
            <TabPanel value="2">Permissions</TabPanel>
          </TabContext>
        </Box>
      </Paper>
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
            <TextField
              error={error.name.length > 0}
              fullWidth
              sx={{ marginTop: "5%" }}
              label="Name"
              value={newUser.name}
              onChange={(e) => {
                setNewUser({ ...newUser, name: e.currentTarget.value });
                validateForm();
              }}
            />
            <span>{error.name}</span>
            <TextField
              error={error.email.length > 0}
              fullWidth
              sx={{ marginTop: "5%" }}
              label="Email"
              value={newUser.email}
              onChange={(e) => {
                setNewUser({ ...newUser, email: e.currentTarget.value });
                validateForm();
              }}
            />
            <TextField
              error={error.password.length > 0}
              fullWidth
              sx={{ marginTop: "5%" }}
              label="Password"
              value={newUser.password}
              type="password"
              onChange={(e) => {
                setNewUser({ ...newUser, password: e.currentTarget.value });
                validateForm();
              }}
            />
            <FormControl fullWidth sx={{ marginTop: "5%" }}>
              <InputLabel id="demo-simple-select-label">Profile</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={String(profile)}
                label="Profile"
                onChange={handleChangeSelect}
              >
                <MenuItem value={0}>Admin</MenuItem>
                <MenuItem value={1}>Employee</MenuItem>
              </Select>
            </FormControl>
            <Button
              fullWidth
              variant="contained"
              sx={{ marginTop: "5%", backgroundColor: "#2196f3" }}
              onClick={addUser}
            >
              Add User
            </Button>
            <Button
              fullWidth
              variant="contained"
              sx={{ marginTop: "5%" }}
              onClick={(_e) => handleClose()}
              color="error"
            >
              Cancel
            </Button>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default Users;
