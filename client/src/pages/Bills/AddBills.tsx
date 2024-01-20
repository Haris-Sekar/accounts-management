import {
  Autocomplete,
  Box,
  Button,
  Container,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { getBills, getCustomers } from "../../action/action";
import { useDispatch, useSelector } from "react-redux";
import { IBillAddForm, IBillDetails } from "../../models/IAddBillForm";
import { addBills, updateBill } from "../../api/services/billls";
import { useEffect } from "react";
import { ICustomerDetails } from "../../models/IAddCustomerForm";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import moment, { Moment } from "moment";



const AddBills = ({ 
  handleClose, 
  editValues 
}: {
  handleClose: any,
  editValues: IBillDetails
}) => {
  const dispatch = useDispatch();
  useEffect(() => {
    //@ts-ignore
    dispatch(getCustomers(null));
  }, [dispatch]);

  const { customers }: { customers: Array<ICustomerDetails> } = useSelector(
    (state: any) => state.customerReducer
  );
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IBillAddForm>();
  const onSubmit = (e: IBillAddForm) => {
    e.billDate = e.billDate as Moment;
    e.billDate = e.billDate.format('x');
    if (editValues && editValues?._id !== undefined) {
      updateBill(e, editValues._id)
        .then(() => {
          //@ts-ignore
          dispatch(getBills(null));
          handleClose();
        })
        .catch((e) => {
          toast.error(e);
        });
    } else {
      addBills(e)
      .then(() => {
        //@ts-ignore
        dispatch(getBills(null));
        handleClose();
      })
      .catch((e) => {
        toast.error(e);
      });
    }
    
  };
  const onError = (errors: any) => {
    console.log(errors);
  };
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmit, onError)}
          sx={{ mt: 3 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                name="billNo"
                control={control}
                defaultValue={editValues?.billNumber}
                rules={{
                  required: "Bill Number is required",
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Bill Number"
                    required
                    fullWidth
                    error={Boolean(errors.billNo)}
                    helperText={errors.billNo?.message}
                    autoComplete="given-name"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="customerId"
                control={control}
                render={({ ...field }) => (
                  <Autocomplete
                    {...field}
                    disablePortal
                    id="combo-box-demo"
                    disabled={editValues?.customerName !== undefined ? true: false}
                    options={customers.map(customer => { return { id: customer._id, label: customer.customerName } })}
                    sx={{ width: 300 }}
                    onChange={(_event, value) => {
                      control._formValues.customerId = value?.id;
                      return value?.id;
                    }}
                    renderInput={(params) => <TextField {...params} label="Customer" />}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="billDate"
                defaultValue={moment(editValues ? editValues?.billDate : Date.now())}
                rules={{
                  required: "Bill Date is requried"
                }}
                control={control}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker label="Bill Date" {...field} format="DD-MM-YYYY"/>
                  </LocalizationProvider>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="amount"
                defaultValue={editValues?.amount}
                rules={{
                  required: "Bill Amount is requried"
                }}
                control={control}
                render={({ field }) => (
                  <TextField
                    required
                    {...field}
                    label="Bill Amount"
                    fullWidth
                    error={Boolean(errors.amount)}
                    helperText={errors.amount?.message}
                    autoComplete="amount"
                    type="number"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">₹</InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {editValues?._id !== undefined
              ? "Update Bill"
              : "Create Bill"}
          </Button>
          <Button
            fullWidth
            sx={{ mb: 2 }}
            variant="contained"
            color="error"
            onClick={handleClose}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default AddBills;
