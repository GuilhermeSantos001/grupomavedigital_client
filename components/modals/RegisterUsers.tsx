/**
 * @description Modal -> Modal de Cadastro do(a) Funcionário(a)
 * @author GuilhermeSantos001
 * @update 15/02/2022
 */

import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

import { SelectAddress } from '@/components/selects/SelectAddress';

import StringEx from '@/src/utils/stringEx';
import Alerting from '@/src/utils/alerting';

import { useUserService } from '@/services/useUserService';

export interface Props {
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

export function RegisterUsers(props: Props) {
  const [syncData, setSyncData] = useState<boolean>(false)

  const [addressId, setAddressId] = useState<string>('')

  const { create: CreateUser } = useUserService();

  const
    handleChangeAddressId = (value: string) => setAddressId(value)

  const
    canRegisterUser = () => {
      return addressId.length > 0
    },
    handleRegisterUser = async () => {
      const user = await CreateUser({
        authorization,
        name,
        surname,
        username,
        email,
        password,
        cnpj,
        location,
        photoProfile,
        privileges
      })

      if (!user)
        return Alerting.create('error', 'Não foi possível registrar o usuário. Tente novamente com outros dados.');

      Alerting.create('success', 'Usuário registrado com sucesso.');
      props.handleClose();
    };

  return (
    <div>
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
              Registrar Funcionário(a)
            </Typography>
            <Button
              color="inherit"
              disabled={!canRegisterUser()}
              onClick={handleRegisterUser}
            >
              Registrar
            </Button>
          </Toolbar>
        </AppBar>
        <List>
          <ListItem>
            <ListItemText primary="Informações Básicas" />
          </ListItem>
          <ListItem>
            <TextField
              className='col'
              label="Matrícula"
              variant="standard"
              value={StringEx.maskMatricule(matricule, true)}
              onChange={(e) => handleChangeMatricule(StringEx.removeMaskNum(e.target.value))}
            />
          </ListItem>
        </List>
        <List>
          <ListItem>
            <ListItemText primary="Localização" />
          </ListItem>
          <ListItem>
            <SelectAddress
              handleChangeId={(id) => handleChangeAddressId(id)}
            />
          </ListItem>
        </List>
        <Button
          className='col-10 mx-auto my-2'
          variant="contained"
          color="primary"
          disabled={!canRegisterUser()}
          onClick={handleRegisterUser}
        >
          Registrar
        </Button>
        <Button
          className='col-10 mx-auto my-2'
          variant="contained"
          color="error"
          onClick={props.handleClose}
        >
          Cancelar
        </Button>
      </Dialog>
    </div>
  );
}