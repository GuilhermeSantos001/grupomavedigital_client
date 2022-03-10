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

import { DatePicker } from '@/components/selects/DatePicker'
import { SelectScale } from '@/components/selects/SelectScale'
import { SelectService } from '@/components/selects/SelectService'
import { SelectCard } from '@/components/selects/SelectCard'
import { SelectAddress } from '@/components/selects/SelectAddress';

import DateEx from '@/src/utils/dateEx'
import StringEx from '@/src/utils/stringEx'
import Alerting from '@/src/utils/alerting'

import type {
  FunctionCreatePersonTypeof
} from '@/types/PersonServiceType';

import type {
  FunctionCreateServiceTypeof,
  FunctionAssignPeopleServiceTypeof,
  FunctionUpdateServicesTypeof,
  FunctionDeleteServicesTypeof,
} from '@/types/ServiceServiceType';

import type {
  FunctionAssignPeopleCardTypeof
} from '@/types/CardServiceType';

import {
  FunctionCreateScaleTypeof,
  FunctionDeleteScalesTypeof,
  FunctionUpdateScalesTypeof
} from '@/types/ScaleServiceType'

import type { AddressType } from '@/types/AddressType'
import type { ServiceType } from '@/types/ServiceType'
import type { CardType } from '@/types/CardType'
import type { ScaleType } from '@/types/ScaleType'

export interface Props {
  show: boolean
  createPerson: FunctionCreatePersonTypeof
  isLoadingAddresses: boolean
  addresses: AddressType[]
  isLoadingServices: boolean
  services: ServiceType[]
  createService: FunctionCreateServiceTypeof
  assignPeopleService: FunctionAssignPeopleServiceTypeof
  updateServices: FunctionUpdateServicesTypeof
  deleteServices: FunctionDeleteServicesTypeof
  isLoadingCards: boolean
  cards: CardType[]
  assignPeopleCard: FunctionAssignPeopleCardTypeof
  scale: ScaleType | undefined
  isLoadingScale: boolean
  scales: ScaleType[]
  isLoadingScales: boolean
  createScale: FunctionCreateScaleTypeof
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

  const [matricule, setMatricule] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [cpf, setCPF] = useState<string>('')
  const [rg, setRG] = useState<string>('')
  const [motherName, setMotherName] = useState<string>('')
  const [birthDate, setBirthDate] = useState<Date>(DateEx.subYears(new Date(), 75))
  const [phone, setPhone] = useState<string>('')
  const [mail, setMail] = useState<string>('')
  const [scaleId, setScaleId] = useState<string>('')
  const [addressId, setAddressId] = useState<string>('')
  const [appliedCards, setAppliedCards] = useState<string[]>([])
  const [appliedServices, setAppliedServices] = useState<string[]>([])

  const {
    createPerson,
    isLoadingAddresses,
    addresses,
    isLoadingServices,
    services,
    createService,
    assignPeopleService,
    updateServices,
    deleteServices,
    isLoadingCards,
    cards,
    assignPeopleCard,
    scale,
    isLoadingScale,
    scales,
    isLoadingScales,
    createScale,
    updateScales,
    deleteScales,
  } = props;

  const
    handleChangeScaleId = (value: string) => setScaleId(value),
    handleChangeAddressId = (value: string) => setAddressId(value),
    handleChangeMatricule = (value: string) => value.length <= 5 ? setMatricule(value) : undefined,
    handleChangeName = (value: string) => setName(value),
    handleChangeCPF = (value: string) => value.length <= 11 ? setCPF(value) : undefined,
    handleChangeRG = (value: string) => value.length <= 9 ? setRG(value) : undefined,
    handleChangeMotherName = (value: string) => setMotherName(value),
    handleChangeBirthDate = (value: Date) => setBirthDate(value),
    handleChangePhone = (value: string) => value.length <= 11 ? setPhone(value) : undefined,
    handleChangeMail = (value: string) => setMail(value),
    handleAssignPeopleService = async (personId: string, servicesId: string[]) => {
      if (!assignPeopleService)
        throw new Error('AssignPeopleService is undefined');

      for (const serviceId of servicesId) {
        await assignPeopleService([
          {
            personId,
            serviceId
          }
        ]);
      }
    },
    handleAssignPeopleCard = async (personId: string, cardsId: string[]) => {
      if (!assignPeopleCard)
        throw new Error('AssignPeopleCard is undefined');

      for (const cardId of cardsId) {
        const id = cards.find(card => cardId === `${card.serialNumber} - ${card.lastCardNumber}`)?.id || undefined;

        if (!id)
          throw new Error('Card not found');

        await assignPeopleCard(id, [{ personId }]);
      }
    },
    canRegisterPerson = () => {
      return name.length > 0 &&
        matricule.length > 0 &&
        cpf.length >= 11 &&
        rg.length >= 9 &&
        motherName.length > 0 &&
        birthDate != null &&
        phone.length >= 11 &&
        mail.length > 0 &&
        StringEx.isValidEmail(mail) &&
        scaleId.length > 0 &&
        addressId.length > 0 &&
        appliedCards.length > 0 &&
        appliedServices.length > 0
    },
    handleRegisterPerson = async () => {
      const person = await createPerson({
        matricule,
        name,
        cpf,
        rg,
        birthDate: birthDate.toISOString(),
        motherName,
        mail,
        phone,
        addressId,
        scaleId,
        status: 'available'
      })

      if (!person)
        return Alerting.create('error', 'Não foi possível registrar o(a) funcionário(a). Tente novamente com outros dados.');

      try {
        await handleAssignPeopleService(person.data.id, appliedServices);
        await handleAssignPeopleCard(person.data.id, appliedCards);

        Alerting.create('success', 'Funcionário(a) registrado(a) com sucesso.');
        props.handleClose();
      } catch {
        Alerting.create('error', 'Funcionário(a) registrado(a), mas ocorreram erros na confirmação de alguns dados do(a) funcionário(a). Verifique se todos os dados estão corretos na tela de registro dos funcionários.');
        props.handleClose();
      }
    };

  if (
    isLoadingAddresses && !syncData
    || isLoadingServices && !syncData
    || isLoadingCards && !syncData
    || isLoadingScales && !syncData
  )
    return <DialogLoading
      header='Registrar Funcionário(a)'
      message='Carregando...'
      show={props.show}
      handleClose={props.handleClose}
    />

  if (
    !syncData
    && addresses
    && services
    && cards
    && scales
    && services
  ) {
    setSyncData(true);
  } else if (
    !syncData && !addresses
    || !syncData && !services
    || !syncData && !assignPeopleService
    || !syncData && !updateServices
    || !syncData && !deleteServices
    || !syncData && !cards
    || !syncData && !assignPeopleCard
    || !syncData && !scales
    || !syncData && !updateScales
    || !syncData && !deleteScales
  ) {
    return <DialogError
      header='Registrar Funcionário(a)'
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
            Registrar Funcionário(a)
          </Typography>
          <Button
            color="inherit"
            disabled={!canRegisterPerson()}
            onClick={handleRegisterPerson}
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
            value={StringEx.maskMatricule(matricule)}
            onChange={(e) => handleChangeMatricule(StringEx.removeMaskNumToString(e.target.value))}
          />
        </ListItem>
        <ListItem>
          <TextField
            className='col'
            label="Nome Completo"
            variant="standard"
            value={name}
            onChange={(e) => handleChangeName(e.target.value)}
          />
        </ListItem>
        <ListItem>
          <TextField
            className='col'
            label="CPF"
            variant="standard"
            value={StringEx.maskCPF(cpf)}
            onChange={(e) => handleChangeCPF(StringEx.removeMaskNumToString(e.target.value))}
          />
        </ListItem>
        <ListItem>
          <TextField
            className='col'
            label="RG"
            variant="standard"
            value={StringEx.maskRG(rg)}
            onChange={(e) => handleChangeRG(StringEx.removeMaskNumToString(e.target.value))}
          />
        </ListItem>
        <ListItem>
          <TextField
            className='col'
            label="Nome da Mãe"
            variant="standard"
            value={motherName}
            onChange={(e) => handleChangeMotherName(e.target.value)}
          />
        </ListItem>
        <ListItem>
          <TextField
            className='col'
            label="Celular"
            variant="standard"
            value={StringEx.maskPhone(phone)}
            onChange={(e) => handleChangePhone(StringEx.removeMaskNumToString(e.target.value))}
          />
        </ListItem>
        <ListItem>
          <TextField
            className='col'
            label="E-mail"
            variant="standard"
            value={mail}
            onChange={(e) => handleChangeMail(e.target.value)}
          />
        </ListItem>
      </List>
      <List>
        <ListItem>
          <DatePicker
            className='col-12'
            label="Data de Nascimento"
            value={birthDate}
            maxDate={DateEx.addYears(DateEx.subYears(new Date(), 75), 55)}
            minDate={DateEx.subYears(new Date(), 75)}
            handleChangeValue={handleChangeBirthDate}
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
            handleChangeId={(id) => handleChangeScaleId(id)}
          />
        </ListItem>
        <ListItem>
          <SelectCard
            isLoadingCards={isLoadingCards}
            cards={cards}
            handleChangeCard={(cards) => setAppliedCards(cards)}
          />
        </ListItem>
        <ListItem>
          <ListItemText primary="Funções da Pessoa" />
        </ListItem>
      </List>
      <SelectService
        services={services}
        isLoadingServices={isLoadingServices}
        createService={createService}
        updateServices={updateServices}
        deleteServices={deleteServices}
        itemsLeft={services.map((service) => service.value)}
        itemsRight={[]}
        onChangeAppliedServices={(values) => setAppliedServices(services.filter(service => values.includes(service.value)).map(service => service.id))}
      />
      <List>
        <ListItem>
          <ListItemText primary="Localização" />
        </ListItem>
        <ListItem>
          <SelectAddress
            addresses={addresses}
            isLoadingAddresses={isLoadingAddresses}
            handleChangeId={(id) => handleChangeAddressId(id)}
          />
        </ListItem>
      </List>
      <Button
        className='col-10 mx-auto my-2'
        variant="contained"
        color="primary"
        disabled={!canRegisterPerson()}
        onClick={handleRegisterPerson}
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
  );
}

export const RegisterPeople = memo(Component, (prevStates, nextStates) => {
  if (
    prevStates.show !== nextStates.show
    || prevStates.addresses.length !== nextStates.addresses.length
    || prevStates.services.length !== nextStates.services.length
    || prevStates.cards.length !== nextStates.cards.length
    || prevStates.scales.length !== nextStates.scales.length
  )
    return false;

  return true;
});