/**
 * @description Modal -> Modal de Edição do local de trabalho
 * @author GuilhermeSantos001
 * @update 13/02/2022
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

import { DialogLoading } from '@/components/utils/DialogLoading';
import { DialogError } from '@/components/utils/DialogError';

import { TimePicker } from '@/components/selects/TimePicker'
import { SelectService } from '@/components/selects/SelectService'
import { SelectAddress } from '@/components/selects/SelectAddress'
import { SelectScale } from '@/components/selects/SelectScale'

import ArrayEx from '@/src/utils/arrayEx'
import Alerting from '@/src/utils/alerting'

import { useWorkplaceService } from '@/services/useWorkplaceService';
import { useServicesService } from '@/services/useServicesService';

export interface Props {
  id: string
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

export function EditWorkplace(props: Props) {
  const [syncData, setSyncData] = useState<boolean>(false)

  const [name, setName] = useState<string>('');
  const [entryTime, setEntryTime] = useState<Date>(new Date());
  const [exitTime, setExitTime] = useState<Date>(new Date());
  const [appliedServices, setAppliedServices] = useState<string[]>([]);
  const [addressId, setAddressId] = useState<string>('');
  const [scaleId, setScaleId] = useState<string>('')

  const { data: workplace, isLoading: isLoadingWorkplace, update: UpdateWorkplace } = useWorkplaceService(props.id);
  const { data: services, isLoading: isLoadingServices, assignWorkplace: AssignWorkplaceService, unassignWorkplace: UnassignWorkplaceService } = useServicesService();

  const
    handleChangeName = (value: string) => setName(value),
    handleChangeEntryTime = (value: Date) => setEntryTime(value),
    handleChangeExitTime = (value: Date) => setExitTime(value),
    handleChangeAddressId = (id: string) => setAddressId(id),
    handleChangeScaleId = (id: string) => setScaleId(id);

  const
    canUpdateWorkplace = () => {
      return name.length > 0 &&
        entryTime !== null &&
        exitTime !== null &&
        appliedServices.length > 0 &&
        addressId.length > 0 &&
        scaleId.length > 0
    },
    handleAssignWorkplaceService = async (workplaceId: string, servicesId: string[]) => {
      if (!AssignWorkplaceService)
        throw new Error('AssignWorkplaceService is undefined');

      for (const serviceId of servicesId) {
        const assign = await AssignWorkplaceService(serviceId, { workplaceId });

        if (!assign)
          throw new Error('AssignWorkplaceService failed');
      }
    },
    handleUnassignWorkplaceService = async (workplaceServicesId: string[]) => {
      if (!UnassignWorkplaceService)
        throw new Error('UnassignWorkplaceService is undefined');

      for (const workplaceServiceId of workplaceServicesId) {
        const unassign = await UnassignWorkplaceService(workplaceServiceId);

        if (!unassign)
          throw new Error('UnassignWorkplaceService failed');
      }
    },
    handleUpdateWorkplace = async () => {
      if (!workplace || !UpdateWorkplace)
      return Alerting.create('error', 'Não foi possível atualizar os dados do(a) funcionário(a). Tente novamente, mais tarde!.');

      const updated = await UpdateWorkplace({
        name,
        entryTime: entryTime.toISOString(),
        exitTime: exitTime.toISOString(),
        addressId,
        scaleId,
        status: 'available'
      });

      if (!updated)
        return Alerting.create('error', 'Não foi possível atualizar os dados do local de trabalho. Tente novamente com outros dados.');

      try {
        const
          newServices = ArrayEx.returnItemsOfANotContainInB(appliedServices, workplace.workplaceService.map(_ => _.service.value)),
          removeServices = workplace.workplaceService.filter(_ => !appliedServices.includes(_.service.value));

        await handleUnassignWorkplaceService(removeServices.map(_ => _.id));
        await handleAssignWorkplaceService(workplace.id, newServices);

        Alerting.create('success', 'Local de Trabalho teve os dados atualizados com sucesso.');
        props.handleClose();
      } catch {
        Alerting.create('error', 'Local de Trabalho teve os dados atualizados, mas ocorreram erros na confirmação de alguns dados. Verifique se todos os dados estão corretos na tela de registro dos locais de trabalho.');
        props.handleClose();
      }
    }

  if (
    isLoadingWorkplace && !syncData
    || isLoadingServices && !syncData
  )
    return <DialogLoading
      header='Atualizar Local de Trabalho'
      message='Carregando...'
      show={props.show}
      handleClose={props.handleClose}
    />

  if (!syncData && workplace && services) {
    handleChangeName(workplace.name);
    handleChangeEntryTime(new Date(workplace.entryTime));
    handleChangeExitTime(new Date(workplace.exitTime));
    handleChangeAddressId(workplace.addressId);
    handleChangeScaleId(workplace.scaleId);
    setAppliedServices(workplace.workplaceService.map(_ => _.service.value));
    setSyncData(true);
  } else if (
    !syncData && !workplace
    || !syncData && !services
    || !syncData && !UpdateWorkplace
    || !syncData && !AssignWorkplaceService
    || !syncData && !UnassignWorkplaceService
  ) {
    return <DialogError
      header='Atualizar Local de Trabalho'
      message='Ocorreu um erro'
      show={props.show}
      handleClose={props.handleClose}
    />
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
              Atualizar Local de Trabalho
            </Typography>
            <Button
              color="inherit"
              disabled={!canUpdateWorkplace()}
              onClick={handleUpdateWorkplace}
            >
              Atualizar
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
              id={workplace?.scaleId}
                handleChangeId={handleChangeScaleId}
              />
            </div>
          </ListItem>
          <ListItem>
            <TimePicker
              className='col-12'
              label="Horário de Entrada"
              value={entryTime}
              handleChangeValue={handleChangeEntryTime}
            />
          </ListItem>
          <ListItem>
            <TimePicker
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
          itemsLeft={workplace ? ArrayEx.returnItemsOfANotContainInB(services.map(service => service.value), workplace.workplaceService.map(_ => _.service.value)) : []}
          itemsRight={workplace?.workplaceService.map((_) => _.service.value) || []}
            onChangeAppliedServices={(values) => setAppliedServices(services.filter(service => values.includes(service.value)).map(service => service.id))}
          />
        }
        <List>
          <ListItem>
            <ListItemText primary="Endereço do Posto" />
          </ListItem>
          <ListItem>
            <SelectAddress
              id={workplace?.addressId}
              handleChangeId={handleChangeAddressId}
            />
          </ListItem>
        </List>
        <Button
          className='col-10 mx-auto my-2'
          variant="contained"
          color="primary"
          disabled={!canUpdateWorkplace()}
          onClick={handleUpdateWorkplace}
        >
          Atualizar
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