import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../../action/action";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  styled,
  tableCellClasses,
} from "@mui/material";
import { USER_TYPE } from "../../consts/consts";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

const Users = () => {
  const dispatch = useDispatch();

  useEffect(() => {
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
              <Button>Add User</Button>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Name</StyledTableCell>
                      <StyledTableCell>Email</StyledTableCell>
                      <StyledTableCell>userType</StyledTableCell>
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
                          <StyledTableCell>
                            {row.email}
                          </StyledTableCell>
                          <StyledTableCell>
                            {row.userType}
                          </StyledTableCell>
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
    </div>
  );
};

export default Users;
