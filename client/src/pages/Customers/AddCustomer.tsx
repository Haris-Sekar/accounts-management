import {
  Box,
  Button,
  Container,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import {
  IAddCustomerForm,
  ICustomerDetails,
} from "../../models/IAddCustomerForm";
import { Controller, useForm } from "react-hook-form";
import { addCustomers, updateCustomers } from "../../api/services/customers";
import { toast } from "react-toastify";
import { getCustomers } from "../../action/action";
import { useDispatch } from "react-redux";

const AddCustomer = ({
  handleClose,
  editValues,
}: {
  handleClose: any;
  editValues: ICustomerDetails;
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IAddCustomerForm>();
  const dispatch = useDispatch();
  const onSubmit = (e: IAddCustomerForm) => {
    if (editValues && editValues?._id !== undefined) {
      updateCustomers(e, editValues._id)
        .then(() => {
          //@ts-ignore
          dispatch(getCustomers(null));
          handleClose();
        })
        .catch((e) => {
          toast.error(e);
        });
    } else {
      addCustomers(e)
        .then(() => {
          //@ts-ignore
          dispatch(getCustomers(null));
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
                name="customerName"
                control={control}
                defaultValue={editValues?.customerName}
                rules={{
                  required: "Name is required",
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Name"
                    fullWidth
                    error={Boolean(errors.customerName)}
                    helperText={errors.customerName?.message}
                    autoComplete="given-name"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="phoneNumber"
                defaultValue={editValues?.phoneNumber}
                control={control}
                rules={{
                  required: "Phone number is required",
                  pattern: {
                    value: /^\+?[0-9-]+$/,
                    message: "Invalid Phone number",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Phone Number"
                    fullWidth
                    error={Boolean(errors.phoneNumber)}
                    helperText={errors.phoneNumber?.message}
                    autoComplete="phoneNumber"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="area"
                control={control}
                defaultValue={editValues?.area}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Area"
                    fullWidth
                    error={Boolean(errors.area)}
                    helperText={errors.area?.message}
                    autoComplete="area"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="balance"
                defaultValue={editValues?.balance}
                control={control}
                disabled={editValues?.balance ? true : false}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Opening Balance"
                    fullWidth
                    error={Boolean(errors.balance)}
                    helperText={errors.balance?.message}
                    autoComplete="balance"
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
              ? "Update Customer"
              : "Create Customer"}
          </Button>
          <Button
            fullWidth
            sx={{ mb: 2 }}
            variant="contained"
            color="error"
            onClick={() => handleClose()}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default AddCustomer;
