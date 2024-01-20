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
  import { getBills, getCustomers, getVouchers } from "../../action/action";
  import { useDispatch, useSelector } from "react-redux";
  import { addBills, updateBill } from "../../api/services/billls";
  import { useEffect } from "react";
  import { ICustomerDetails } from "../../models/IAddCustomerForm";
  import { DatePicker } from '@mui/x-date-pickers/DatePicker';
  import { LocalizationProvider } from "@mui/x-date-pickers";
  import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
  import moment from "moment";
import { IAddVoucherFrom, IVoucherDetails } from "../../models/IAddVoucherForm";
import { addVoucher, updateVoucher } from "../../api/services/voucher";
  
  const AddVoucher = ({
    handleClose,
    editValues
  }: {
    handleClose: any,
    editValues: IVoucherDetails
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
    } = useForm<IAddVoucherFrom>();
    const onSubmit = (e: IAddVoucherFrom) => {
      if (editValues && editValues?._id !== undefined) {
        updateVoucher(e, editValues._id)
          .then(() => {
            //@ts-ignore
            dispatch(getVouchers(null));
            handleClose();
          })
          .catch((e) => {
            toast.error(e);
          });
      } else {
        addVoucher(e)
          .then(() => {
            //@ts-ignore
            dispatch(getVouchers(null));
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
                  name="customerId"
                  control={control}
                  render={({ ...field }) => (
                    <Autocomplete
                      {...field}
                      disablePortal
                      id="combo-box-demo"
                      disabled={editValues?.customerName !== undefined ? true : false}
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
                  name="date"
                  defaultValue={editValues?.date}
                  rules={{
                    required: "Voucher Date is requried"
                  }}
                  control={control}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterMoment} >
                      <DatePicker
                        label="Voucher Date"
                        {...field}
                        defaultValue={moment(editValues?.date)}
                        onChange={(value) => {
                          //@ts-ignore
                          control._formValues.billDate = value ? value.format('x') : null;
                        }}
                        value={moment(field.value)} // Assuming field.value is a timestamp
                      // ...rest of your properties
                      />
                    </LocalizationProvider>
                  )}
                />
              </Grid>
  
              <Grid item xs={12}>
                <Controller
                  name="amount"
                  defaultValue={editValues?.amount}
                  rules={{
                    required: "Voucher Amount is requried"
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
              <Grid item xs={12}>
                <Controller
                  name="amount"
                  defaultValue={editValues?.amount}
                  rules={{
                    required: "Voucher Amount is requried"
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
  
  export default AddVoucher;
  