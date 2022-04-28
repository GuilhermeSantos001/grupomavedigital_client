import * as React from 'react';
import Button from '@mui/material/Button';
import CheckBoxRoundedIcon from '@mui/icons-material/CheckBoxRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export type Props = {
  open: boolean
  title: string
  message: string
  handleConfirm: () => void
  handleClose: () => void
}

export function ConfirmBox(props: Props) {
  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="confirm-box-title"
      aria-describedby="confirm-box-message"
    >
      <DialogTitle id="confirm-box-title">
        {props.title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="confirm-box-message">
          {props.message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button endIcon={<CancelRoundedIcon />} onClick={props.handleClose}>
          Cancelar
        </Button>
        <Button endIcon={<CheckBoxRoundedIcon />} onClick={props.handleConfirm} autoFocus>
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
}