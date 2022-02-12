/**
 * @description Modal -> Modal de Cadastro de local de trabalho
 * @author GuilhermeSantos001
 * @update 10/02/2022
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

import { SelectService } from '@/components/selects/SelectService'
import { SelectAddress } from '@/components/selects/SelectAddress'
import { SelectScale } from '@/components/selects/SelectScale'
import MobileTimePicker from '@/components/selects/mobileTimePicker'

import Alerting from '@/src/utils/alerting'

import { useWorkplaceService } from '@/services/useWorkplaceService';
import { useServicesService } from '@/services/useServicesService';

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

export function RegisterWorkplace(props: Props) {
  const [name, setName] = useState<string>('');
  const [entryTime, setEntryTime] = useState<Date>(new Date());
  const [exitTime, setExitTime] = useState<Date>(new Date());
  const [appliedServices, setAppliedServices] = useState<string[]>([]);
  const [addressId, setAddressId] = useState<string>('');
  const [scaleId, setScaleId] = useState<string>('')

  const { create: CreateWorkplace } = useWorkplaceService();
  const { data: services } = useServicesService();

  const
    handleChangeName = (value: string) => setName(value),
    handleChangeEntryTime = (value: Date) => setEntryTime(value),
    handleChangeExitTime = (value: Date) => setExitTime(value),
    handleChangeAddress = (id: string) => setAddressId(id),
    handleChangeScale = (id: string) => setScaleId(id);

  const canRegisterWorkPlace = () => {
    return name.length > 0 &&
      entryTime !== null &&
      exitTime !== null &&
      appliedServices.length > 0 &&
      addressId.length > 0 &&
      scaleId.length > 0
  }

  const handleRegisterWorkplace = async () => {
    const workplace = await CreateWorkplace({
      name,
      entryTime: entryTime.toISOString(),
      exitTime: exitTime.toISOString(),
      addressId,
      scaleId,
      status: 'available'
    });

    if (workplace)
      return Alerting.create('success', 'Local de trabalho cadastrado com sucesso!');
  }

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
              Registrar Local de Trabalho
            </Typography>
            <Button
              color="inherit"
              disabled={!canRegisterWorkPlace()}
              onClick={handleRegisterWorkplace}
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
              label="Nome do Posto"
              variant="standard"
              value={name}
              onChange={(e) => handleChangeName(e.target.value)}
            />
          </ListItem>
          <ListItem>
            <div className='col'>
              <SelectScale
                handleChangeId={handleChangeScale}
              />
            </div>
          </ListItem>
          <ListItem>
            <MobileTimePicker
              className='col-12'
              label="Horário de Entrada"
              value={entryTime}
              handleChangeValue={handleChangeEntryTime}
            />
          </ListItem>
          <ListItem>
            <MobileTimePicker
              className='col-12'
              label="Horário de Saída"
              value={exitTime}
              handleChangeValue={handleChangeExitTime}
            />
          </ListItem>
          <ListItem>
            <ListItemText primary="Serviços no Posto" />
          </ListItem>
        </List>
        {
          services.length > 0 &&
          <SelectService
            itemsLeft={services.map((service) => service.value)}
            itemsRight={[]}
            onChangeAppliedServices={(values) => setAppliedServices(services.filter(service => values.includes(service.value)).map(service => service.id))}
          />
        }
        <List>
          <ListItem>
            <ListItemText primary="Endereço do Posto" />
          </ListItem>
          <ListItem>
            <SelectAddress
              handleChangeId={handleChangeAddress}
            />
          </ListItem>
        </List>
        <Button
          className='col-10 mx-auto my-2'
          variant="contained"
          color="primary"
          disabled={!canRegisterWorkPlace()}
          onClick={handleRegisterWorkplace}
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