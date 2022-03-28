import * as React from 'react';

import Link from 'next/link'

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import Tooltip from '@mui/material/Tooltip';
import LaunchIcon from '@mui/icons-material/Launch';
import InfoRounded from '@mui/icons-material/InfoRounded';
import IconButton from '@mui/material/IconButton';


const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

declare type Help = {
  title: string
  description: string
}

export type Props = {
  title: string
  subtitle: string
  link: string
  help?: Help
}

export function ModuleCardControl(props: Props) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const
    handleClickOpen = () => setOpen(true),
    handleClose = () => setOpen(false);

  return (
    <>
      {HelpDialog(
        open,
        handleClose,
        props.help,
      )}
      <Card className={`col-12 col-md my-2 mx-2 bg-primary bg-gradient shadow`} sx={{ display: 'flex' }}>
        <Box className="col-12" sx={{ display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ flex: '1 0 auto' }}>
            <Typography className="text-secondary text-truncate" component="div" variant="h5">
              {props.title}
            </Typography>
            <Typography className="text-white text-truncate" variant="subtitle1" component="div">
              {props.subtitle}
            </Typography>
          </CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
            {
              props.help ?
                <Tooltip title="Informações">
                  <IconButton
                    className='text-secondary'
                    aria-label="enter"
                    onClick={handleClickOpen}
                  >
                    <InfoRounded />
                  </IconButton>
                </Tooltip> : <></>
            }
            <Tooltip title="Acessar">
              <IconButton
                color='secondary'
                aria-label="enter"
                onClick={() => setLoading(true)}
              >
                <Link href={props.link}>
                  {
                    loading ?
                      <CircularProgress className="text-secondary" size={25} />
                      :
                      <LaunchIcon />
                  }
                </Link>
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Card>
    </>
  );
}

function HelpDialog(
  open: boolean,
  handleClose: () => void,
  help?: Help,
) {
  return help ? (
    <Dialog
      fullWidth
      maxWidth='md'
      scroll='paper'
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="dialog-description"
    >
      <DialogTitle
        className="bg-primary bg-gradient text-secondary fw-bold mb-2"
      >
        {help.title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="dialog-description">
          {help.description}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button className="col-6 mx-auto" variant={'outlined'} size="small"  onClick={handleClose}>Sair</Button>
      </DialogActions>
    </Dialog>
  ) : <></>
}