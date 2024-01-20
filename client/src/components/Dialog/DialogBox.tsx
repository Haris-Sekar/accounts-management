import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { IDialogBox } from '../../models/IComponents';

export default function DialogBox({ dialogDetails, open, setOpen, successCallBack }: { dialogDetails: IDialogBox, open: boolean, setOpen: Function, successCallBack: Function }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {dialogDetails.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {(dialogDetails.description)}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' autoFocus onClick={handleClose}>
            {dialogDetails.failureBtnText}
          </Button>
          <Button variant='outlined' color='error' onClick={(e) => successCallBack(e, dialogDetails.id)} autoFocus>
          {dialogDetails.successBtnText}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}