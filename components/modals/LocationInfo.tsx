/**
 * @description Modal -> Modal de exibição de informações de localização
 * @author GuilhermeSantos001
 * @update 15/02/2022
 */

import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

import { Location } from '@/types/UserType'

import StringEx from '@/src/utils/stringEx'

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export type Props = {
  show: boolean
  username: string
  location: Location
  handleClose: () => void
}

export function LocationInfo(props: Props) {
  return (
    <Dialog
      fullWidth
      open={props.show}
      TransitionComponent={Transition}
      keepMounted
      onClose={props.handleClose}
      aria-describedby="location-dialog-slide-description"
    >
      <DialogTitle>{`Localização do(a) ${props.username}`}</DialogTitle>
      <DialogContent>
        <DialogContentText id="location-dialog-slide-description">
          {`${props.location.street}, ${props.location.number} - ${props.location.district}, ${props.location.city} - ${props.location.state}, ${StringEx.maskZipcode(parseInt(props.location.zipcode), true)}`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant={'contained'} onClick={props.handleClose}>Voltar</Button>
      </DialogActions>
    </Dialog>
  )
}
