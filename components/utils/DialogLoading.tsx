import React from "react";
import Dialog from "@mui/material/Dialog"
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';

import { TransitionProps } from '@mui/material/transitions';
import { MetroSpinner } from 'react-spinners-kit';

export type Props = {
  header: string
  message: string
  show: boolean
  handleClose: () => void
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export function DialogLoading(props: Props) {
  return (
    <Dialog
      fullScreen
      open={props.show}
      onClose={props.handleClose}
      TransitionComponent={Transition}
    >
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={props.handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            {props.header}
          </Typography>
          <Button
            color="inherit"
            onClick={props.handleClose}
          >
            Cancelar
          </Button>
        </Toolbar>
      </AppBar>
      <List>
        <ListItem>
          <ListItemText primary={props.message} />
        </ListItem>
        <ListItem className='d-flex justify-content-center align-items-center'>
          <div className='d-flex justify-content-center col-6 p-2'>
            <MetroSpinner size={42} color="#004a6e" />
          </div>
        </ListItem>
      </List>
    </Dialog>
  )
}