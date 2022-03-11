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
import ArrayEx from '@/src/utils/arrayEx'
import StringEx from '@/src/utils/stringEx'
import Alerting from '@/src/utils/alerting'

import type {
  FunctionUpdatePeopleTypeof
} from '@/types/PersonServiceType';

import type {
  FunctionCreateServiceTypeof,
  FunctionUpdateServicesTypeof,
  FunctionDeleteServicesTypeof,
  FunctionAssignPeopleServiceTypeof,
  FunctionUnassignPeopleServiceTypeof,
} from '@/types/ServiceServiceType';

import type {
  FunctionAssignPeopleCardTypeof,
  FunctionUnassignPeopleCardTypeof
} from '@/types/CardServiceType';

import type {
  FunctionCreateScaleTypeof,
  FunctionUpdateScalesTypeof,
  FunctionDeleteScalesTypeof
} from '@/types/ScaleServiceType';

import type { PersonType } from '@/types/PersonType';
import type { AddressType } from '@/types/AddressType';
import type { ServiceType } from '@/types/ServiceType';
import type { CardType } from '@/types/CardType';
import type { ScaleType } from '@/types/ScaleType';

export interface Props {
  show: boolean
  person: PersonType | undefined
  isLoadingPerson: boolean
  updatePeople: FunctionUpdatePeopleTypeof
  addresses: AddressType[]
  isLoadingAddresses: boolean
  services: ServiceType[]
  isLoadingServices: boolean
  createService: FunctionCreateServiceTypeof,
  assignPeopleService: FunctionAssignPeopleServiceTypeof
  unassignPeopleService: FunctionUnassignPeopleServiceTypeof
  updateServices: FunctionUpdateServicesTypeof,
  deleteServices: FunctionDeleteServicesTypeof,
  cards: CardType[]
  isLoadingCards: boolean
  assignPeopleCard: FunctionAssignPeopleCardTypeof
  unassignPeopleCard: FunctionUnassignPeopleCardTypeof
  createScale: FunctionCreateScaleTypeof
  scale: ScaleType | undefined
  isLoadingScale: boolean
  scales: ServiceType[]
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
    person,
    isLoadingPerson,
    updatePeople,
    addresses,
    isLoadingAddresses,
    createService,
    services,
    updateServices,
    deleteServices,
    isLoadingServices,
    assignPeopleService,
    unassignPeopleService,
    cards,
    isLoadingCards,
    assignPeopleCard,
    unassignPeopleCard,
    createScale,
    scale,
    isLoadingScale,
    scales,
    isLoadingScales,
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
    handleChangeMail = (value: string) => setMail(value);

  const
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
    handleUnassignPeopleService = async (peopleServiceId: string[]) => {
      if (!unassignPeopleService)
        throw new Error('UnassignPeopleService is undefined');

      await unassignPeopleService(peopleServiceId);
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
    handleUnassignPeopleCard = async (cardsId: string[]) => {
      if (!unassignPeopleCard)
        throw new Error('UnassignPeopleCard is undefined');

      for (const cardId of cardsId) {
        const id = cards.find(card => cardId === `${card.serialNumber} - ${card.lastCardNumber}`)?.id || undefined;

        if (!id)
          throw new Error('Card not found');

        await unassignPeopleCard([id]);
      }
    },
    canUpdatePerson = () => {
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
    handleUpdatePerson = async () => {
      if (!person || !updatePeople)
        return Alerting.create('error', 'Não foi possível atualizar os dados do(a) funcionário(a). Tente novamente, mais tarde!.');

      const updated = await updatePeople(person.id, {
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

      if (!updated)
        return Alerting.create('error', 'Não foi possível atualizar os dados do(a) funcionário(a). Tente novamente com outros dados.');

      try {
        const
          newCards = ArrayEx.returnItemsOfANotContainInB(appliedCards, person.cards.map(card => `${card.serialNumber} - ${card.lastCardNumber}`)),
          removeCards = person.cards.filter(card => !appliedCards.includes(`${card.serialNumber} - ${card.lastCardNumber}`)),
          newServices = ArrayEx.returnItemsOfANotContainInB(appliedServices, person.personService.map(_ => _.service.value)),
          removeServices = person.personService.filter(_ => !appliedServices.includes(_.service.value));

        await handleUnassignPeopleCard(removeCards.map(card => `${card.serialNumber} - ${card.lastCardNumber}`));
        await handleUnassignPeopleService(removeServices.map(_ => _.id));
        await handleAssignPeopleCard(person.id, newCards);
        await handleAssignPeopleService(person.id, newServices);

        Alerting.create('success', 'Funcionário(a) teve os dados atualizados com sucesso.');
        props.handleClose();
      } catch {
        Alerting.create('error', 'Funcionário(a) teve os dados atualizados, mas ocorreram erros na confirmação de alguns dados do(a) funcionário(a). Verifique se todos os dados estão corretos na tela de registro dos funcionários.');
        props.handleClose();
      }
    };

  if (
    isLoadingPerson && !syncData
    || isLoadingAddresses && !syncData
    || isLoadingServices && !syncData
    || isLoadingCards && !syncData
    || isLoadingScale && !syncData
    || isLoadingScales && !syncData
  )
    return <DialogLoading
      header='Editar Funcionário(a)'
      message='Carregando...'
      show={props.show}
      handleClose={props.handleClose}
    />

  if (
    !syncData
    && person
    && addresses
    && services
    && cards
    && scale
    && scales
  ) {
    handleChangeMatricule(person.matricule);
    handleChangeName(person.name);
    handleChangeCPF(person.cpf);
    handleChangeRG(person.rg);
    handleChangeMotherName(person.motherName);
    handleChangeBirthDate(new Date(person.birthDate));
    handleChangePhone(person.phone);
    handleChangeMail(person.mail);
    handleChangeScaleId(person.scaleId);
    handleChangeAddressId(person.addressId);
    setAppliedCards(person.cards.map(card => `${card.serialNumber} - ${card.lastCardNumber}`));
    setAppliedServices(person.personService.map(_ => _.service.value));
    setSyncData(true);
  } else if (
    !syncData && !person
    || !syncData && !updatePeople
    || !syncData && !addresses
    || !syncData && !services
    || !syncData && !assignPeopleService
    || !syncData && !unassignPeopleService
    || !syncData && !updateServices
    || !syncData && !deleteServices
    || !syncData && !cards
    || !syncData && !assignPeopleCard
    || !syncData && !unassignPeopleCard
    || !syncData && !scales
    || !syncData && !updateScales
    || !syncData && !deleteScales
  ) {
    return <DialogError
      header='Editar Funcionário(a)'
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
            Editar Funcionário(a)
          </Typography>
          <Button
            color="inherit"
            disabled={!canUpdatePerson()}
            onClick={handleUpdatePerson}
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
            selectCards={person?.cards.map(card => `${card.costCenter.value || "???"} - ${card.serialNumber} (4 Últimos Dígitos: ${card.lastCardNumber})`)}
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
        createService={createService}
        services={services}
        isLoadingServices={isLoadingServices}
        updateServices={updateServices}
        deleteServices={deleteServices}
        itemsLeft={person ? ArrayEx.returnItemsOfANotContainInB(services.map(service => service.value), person.personService.map(_ => _.service.value)) : []}
        itemsRight={person?.personService.map((_) => _.service.value) || []}
        onChangeAppliedServices={(values) => setAppliedServices(services.filter(service => values.includes(service.value)).map(service => service.id))}
      />
      <List>
        <ListItem>
          <ListItemText primary="Endereço" />
        </ListItem>
        <ListItem>
          <SelectAddress
            id={person?.addressId}
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
        disabled={!canUpdatePerson()}
        onClick={handleUpdatePerson}
      >
        Atualizar
      </Button>
      <Button
        className='col-10 mx-auto my-2'
        variant="contained"
        color="error"
        onClick={props.handleClose}
      >
        Sair
      </Button>
    </Dialog>
  );
}

export const EditPeople = memo(Component, (prevStates, nextStates) => {
  if (
    prevStates.show !== nextStates.show
    || JSON.stringify(prevStates.person) !== JSON.stringify(nextStates.person)
    || prevStates.addresses.length !== nextStates.addresses.length
    || prevStates.services.length !== nextStates.services.length
    || prevStates.cards.length !== nextStates.cards.length
    || prevStates.scale?.id !== nextStates.scale?.id
    || prevStates.scale?.value !== nextStates.scale?.value
    || prevStates.scales.length !== nextStates.scales.length
  )
    return false;

  return true;
});