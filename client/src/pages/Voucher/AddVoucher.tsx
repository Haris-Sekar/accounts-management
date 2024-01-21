/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
   Autocomplete,
   Box,
   Button,
   Container,
   FormControl,
   FormControlLabel,
   FormLabel,
   Grid,
   InputAdornment,
   Radio,
   RadioGroup,
   TextField,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { getCustomers, getVouchers } from "../../action/action";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { ICustomerDetails } from "../../models/IAddCustomerForm";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import moment, { Moment } from "moment";
import { IAddVoucherFrom, IVoucherDetails } from "../../models/IAddVoucherForm";
import { addVoucher, updateVoucher } from "../../api/services/voucher";

const AddVoucher = ({ handleClose, editValues }: { handleClose: any, editValues: IVoucherDetails }) => {

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
      e.date = e.date as Moment;
      e.date = Number(e.date.format('x'));
      e.isCheque = chequeData.isCheque;
      e.isChequeCredited = chequeData.isChequeCredited;
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
         console.log(e);
         
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

   const [chequeData, setChequeData] = useState<{
      isCheque: boolean,
      isChequeCredited: boolean
   }>({
      isCheque: editValues?.isCheque ?? false,
      isChequeCredited: editValues?.isChequeCredited ?? false
   });

   const [toggleCheque, setToggleCheque] = useState<boolean>(false);

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
                        disabled ={ editValues?._id !== undefined}
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
                        defaultValue={moment(editValues ? editValues?.date : Date.now())}
                        rules={{
                           required: "Bill Date is requried"
                        }}
                        control={control}
                        render={({ field }) => (
                           <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker label="Date" {...field} format="DD-MM-YYYY" />
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
                              label="Amount"
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
                     <FormControl>
                        <FormLabel id="demo-radio-buttons-group-label">Is Cheque</FormLabel>
                        <RadioGroup
                           row
                           aria-labelledby="demo-radio-buttons-group-label"
                           defaultValue="false"
                           name="isCheque"
                           onChange={(_e, value) => {
                              const value1: boolean = value === "true" ? true : false
                              const tempData = chequeData;
                              tempData.isCheque = value1;
                              setChequeData(tempData);
                              setToggleCheque(value1);

                           }}
                        >
                           <FormControlLabel name="isCheque" value="true" control={<Radio />} label="Yes" />
                           <FormControlLabel name="isCheque" value="false" control={<Radio />} label="No" />
                        </RadioGroup>
                     </FormControl>
                  </Grid>
                  {toggleCheque ? (
                     <>
                        <Grid item xs={12}>
                           <Controller
                              name="chequeNumber"
                              defaultValue={editValues?.chequeNumber}
                              control={control}
                              render={({ field }) => (
                                 <TextField
                                    required
                                    {...field}
                                    label="Cheque Number"
                                    fullWidth
                                    error={Boolean(errors.chequeNumber)}
                                    helperText={errors.chequeNumber?.message}
                                    autoComplete="chequeNumber"
                                    type="number"
                                 />
                              )}
                           />
                        </Grid>
                        <Grid item xs={12}>
                           <Controller
                              name="bankName"
                              defaultValue={editValues?.bankName}
                              control={control}
                              render={({ field }) => (
                                 <TextField
                                    required
                                    {...field}
                                    label="Bank Name"
                                    fullWidth
                                    error={Boolean(errors.bankName)}
                                    helperText={errors.bankName?.message}
                                    autoComplete="bankName"
                                    type="text"
                                 />
                              )}
                           />
                        </Grid>
                        <Grid item xs={12}>
                           <FormControl>
                              <FormLabel id="demo-radio-buttons-group-label">Is Cheque Credited</FormLabel>
                              <RadioGroup
                                 row
                                 aria-labelledby="demo-radio-buttons-group-label"
                                 defaultValue="false"
                                 name="isChequeCreited"
                                 onChange={(_e, value) => {
                                    const value1: boolean = value === "true" ? true : false
                                    const tempData = chequeData;
                                    tempData.isChequeCredited = value1;
                                    setChequeData(tempData);
                                 }}
                              >
                                 <FormControlLabel name="isChequeCreited" value="true" control={<Radio />} label="Yes" />
                                 <FormControlLabel name="isChequeCreited" value="false" control={<Radio />} label="No" />
                              </RadioGroup>
                           </FormControl>
                        </Grid>
                     </>
                  ) : (<></>)}


               </Grid>
               <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
               >
                  {editValues?._id !== undefined
                     ? "Update Voucher"
                     : "Create Voucher"}
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
      </Container >
   );
};

export default AddVoucher;
