import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import StringEx from '@/src/utils/stringEx';

declare type Input = {
  id: string;
  label: string;
  type: 'phone';
  length?: number;
}

export interface Props {
  title: string;
  message: string;
  open: boolean;
  inputtedValue: string;
  input: Input;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  onClose: () => void;
}

export function InputDialog(props: Props) {
  const { title, message, open, inputtedValue, input, onChange, onSubmit, onClose } = props;

  const inputLength = input.length || 0;

  const handleSubmit = () => onSubmit(inputtedValue);

  const handleClose = () => onClose();

  const handleChange = (value: string) => onChange(value);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle className="bg-primary bg-gradient text-secondary fw-bold">
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText className="my-2">
          {message}
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id={input.id}
          label={input.label}
          value={StringEx.maskPhone(inputtedValue, 'cell')}
          fullWidth
          variant="standard"
          onChange={(e) => handleChange(StringEx.removeMaskNumToString(e.target.value, 'cell'))}
        />
      </DialogContent>
      <DialogActions>
        <Button disabled={inputtedValue.length < inputLength} onClick={handleSubmit}>
          Enviar
        </Button>
        <Button onClick={handleClose}>
          Cancelar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
