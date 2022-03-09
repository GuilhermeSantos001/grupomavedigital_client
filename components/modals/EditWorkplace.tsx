import React, { useState, memo } from 'react';
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

import type { FunctionUpdateWorkplacesTypeof } from '@/types/WorkplaceServiceType'
import type {
  FunctionCreateServiceTypeof,
  FunctionUpdateServicesTypeof,
  FunctionAssignWorkplacesServiceTypeof,
  FunctionUnassignWorkplacesServiceTypeof,
  FunctionDeleteServicesTypeof,
} from '@/types/ServiceServiceType';

import {
  FunctionCreateScaleTypeof,
  FunctionUpdateScalesTypeof,
  FunctionDeleteScalesTypeof
} from '@/types/ScaleServiceType'

import type { WorkplaceType } from '@/types/WorkplaceType'
import type { AddressType } from '@/types/AddressType'
import type { ServiceType } from '@/types/ServiceType'
import type { ScaleType } from '@/types/ScaleType'

export interface Props {
  show: boolean
  workplace: WorkplaceType | undefined
  isLoadingWorkplace: boolean
  updateWorkplaces: FunctionUpdateWorkplacesTypeof
  isLoadingAddresses: boolean
  addresses: AddressType[]
  createService: FunctionCreateServiceTypeof
  services: ServiceType[]
  isLoadingServices: boolean
  updateServices: FunctionUpdateServicesTypeof
  assignWorkplacesService: FunctionAssignWorkplacesServiceTypeof
  unassignWorkplacesService: FunctionUnassignWorkplacesServiceTypeof
  deleteServices: FunctionDeleteServicesTypeof
  createScale: FunctionCreateScaleTypeof
  scale: ScaleType | undefined
  isLoadingScale: boolean
  scales: ScaleType[]
  isLoadingScales: boolean
  updateScales: FunctionUpdateScalesTypeof
  deleteScales: FunctionDeleteScalesTypeof
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

function Component(props: Props) {
  const [syncData, setSyncData] = useState<boolean>(false)

  const [name, setName] = useState<string>('');
  const [entryTime, setEntryTime] = useState<Date>(new Date());
  const [exitTime, setExitTime] = useState<Date>(new Date());
  const [appliedServices, setAppliedServices] = useState<string[]>([]);
  const [addressId, setAddressId] = useState<string>('');
  const [scaleId, setScaleId] = useState<string>('')

  const {
    workplace,
    isLoadingWorkplace,
    updateWorkplaces,
    isLoadingAddresses,
    addresses,
    createService,
    services,
    isLoadingServices,
    updateServices,
    assignWorkplacesService,
    unassignWorkplacesService,
    deleteServices,
    createScale,
    scale,
    isLoadingScale,
    scales,
    isLoadingScales,
    updateScales,
    deleteScales,
  } = props;

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
      if (!assignWorkplacesService)
        throw new Error('AssignWorkplacesService is undefined');

      for (const serviceId of servicesId) {
        await assignWorkplacesService([
          {
            serviceId,
            workplaceId
          }
        ]);
      }
    },
    handleUnassignWorkplaceService = async (workplaceServicesId: string[]) => {
      if (!unassignWorkplacesService)
        throw new Error('UnassignWorkplacesService is undefined');

      await unassignWorkplacesService(workplaceServicesId);
    },
    handleUpdateWorkplace = async () => {
      if (!workplace || !updateWorkplaces)
        return Alerting.create('error', 'Não foi possível atualizar os dados do(a) funcionário(a). Tente novamente, mais tarde!.');

      const updated = await updateWorkplaces(workplace.id, {
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
    || isLoadingAddresses && !syncData
    || isLoadingServices && !syncData
    || isLoadingScale && !syncData
    || isLoadingScales && !syncData
  )
    return <DialogLoading
      header='Atualizar Local de Trabalho'
      message='Carregando...'
      show={props.show}
      handleClose={props.handleClose}
    />

  if (
    !syncData
    && workplace
    && addresses
    && services
    && scale
    && scales
  ) {
    handleChangeName(workplace.name);
    handleChangeEntryTime(new Date(workplace.entryTime));
    handleChangeExitTime(new Date(workplace.exitTime));
    handleChangeAddressId(workplace.addressId);
    handleChangeScaleId(workplace.scaleId);
    setAppliedServices(workplace.workplaceService.map(_ => _.service.value));
    setSyncData(true);
  } else if (
    !syncData && !workplace
    || !syncData && !updateWorkplaces
    || !syncData && !addresses
    || !syncData && !services
    || !syncData && !updateServices
    || !syncData && !assignWorkplacesService
    || !syncData && !unassignWorkplacesService
    || !syncData && !deleteServices
    || !syncData && !scale
    || !syncData && !scales
    || !syncData && !updateScales
    || !syncData && !deleteScales
  ) {
    return <DialogError
      header='Atualizar Local de Trabalho'
      message='Ocorreu um erro'
      show={props.show}
      handleClose={props.handleClose}
    />
  }

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
          <SelectScale
            createScale={createScale}
            scale={scale}
            isLoadingScale={isLoadingScale}
            scales={scales}
            isLoadingScales={isLoadingScales}
            updateScales={updateScales}
            deleteScales={deleteScales}
            handleChangeId={handleChangeScaleId}
          />
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
          createService={createService}
          services={services}
          isLoadingServices={isLoadingServices}
          updateServices={updateServices}
          deleteServices={deleteServices}
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
            addresses={addresses}
            isLoadingAddresses={isLoadingAddresses}
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
  );
}

export const EditWorkplace = memo(Component, (prevStates, nextStates) => {
  if (
    prevStates.show !== nextStates.show
    || prevStates.workplace?.id !== nextStates.workplace?.id
    || JSON.stringify(prevStates.workplace) !== JSON.stringify(nextStates.workplace)
    || prevStates.addresses.length !== nextStates.addresses.length
    || prevStates.services.length !== nextStates.services.length
    || prevStates.scale?.id !== nextStates.scale?.id
    || prevStates.scale?.value !== nextStates.scale?.value
    || prevStates.scales.length !== nextStates.scales.length
  )
    return false;

  return true;
});