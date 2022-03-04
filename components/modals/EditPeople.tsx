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

import { DatePicker } from '@/components/selects/DatePicker'
import { SelectScale } from '@/components/selects/SelectScale'
import { SelectService } from '@/components/selects/SelectService'
import { SelectCard } from '@/components/selects/SelectCard'
import { SelectAddress } from '@/components/selects/SelectAddress';

import DateEx from '@/src/utils/dateEx'
import ArrayEx from '@/src/utils/arrayEx'
import StringEx from '@/src/utils/stringEx'
import Alerting from '@/src/utils/alerting'

import { usePersonWithIdService } from '@/services/usePersonWithIdService';
import { useServicesService } from '@/services/useServicesService';
import { useCardsService } from '@/services/useCardsService';

export interface Props {
  id: string;
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

export function EditPeople(props: Props) {
  const [syncData, setSyncData] = useState<boolean>(false)

  const [matricule, setMatricule] = useState<number>(0)
  const [name, setName] = useState<string>('')
  const [cpf, setCPF] = useState<number>(0)
  const [rg, setRG] = useState<number>(0)
  const [motherName, setMotherName] = useState<string>('')
  const [birthDate, setBirthDate] = useState<Date>(DateEx.subYears(new Date(), 75))
  const [phone, setPhone] = useState<number>(0)
  const [mail, setMail] = useState<string>('')
  const [scaleId, setScaleId] = useState<string>('')
  const [addressId, setAddressId] = useState<string>('')
  const [appliedCards, setAppliedCards] = useState<string[]>([])
  const [appliedServices, setAppliedServices] = useState<string[]>([])

  const { data: person, isLoading: isLoadingPerson, update: UpdatePerson } = usePersonWithIdService(props.id);
  const { data: services, isLoading: isLoadingServices, assignPerson: AssignPersonService, unassignPerson: UnassignPersonService } = useServicesService();
  const { data: cards, isLoading: isLoadingCards, assignPerson: AssignPersonCard, unassignPerson: UnassignPersonCard } = useCardsService();

  const
    handleChangeScaleId = (value: string) => setScaleId(value),
    handleChangeAddressId = (value: string) => setAddressId(value),
    handleChangeMatricule = (value: number) => setMatricule(value),
    handleChangeName = (value: string) => setName(value),
    handleChangeCPF = (value: number) => setCPF(value),
    handleChangeRG = (value: number) => setRG(value),
    handleChangeMotherName = (value: string) => setMotherName(value),
    handleChangeBirthDate = (value: Date) => setBirthDate(value),
    handleChangePhone = (value: number) => setPhone(value),
    handleChangeMail = (value: string) => setMail(value);

  const
    handleAssignPersonService = async (personId: string, servicesId: string[]) => {
      if (!AssignPersonService)
        throw new Error('AssignPersonService is undefined');

      for (const serviceId of servicesId) {
        const assign = await AssignPersonService(serviceId, { personId });

        if (!assign)
          throw new Error('AssignPersonService failed');
      }
    },
    handleUnassignPersonService = async (personServiceIds: string[]) => {
      if (!UnassignPersonService)
        throw new Error('UnassignPersonService is undefined');

      for (const serviceId of personServiceIds) {
        const unassign = await UnassignPersonService(serviceId);

        if (!unassign)
          throw new Error('UnassignPersonService failed');
      }
    },
    handleAssignPersonCard = async (personId: string, cardsId: string[]) => {
      if (!AssignPersonCard)
        throw new Error('AssignPersonCard is undefined');

      for (const cardId of cardsId) {
        const id = cards.find(card => cardId === `${card.serialNumber} - ${card.lastCardNumber}`)?.id || undefined;

        if (!id)
          throw new Error('Card not found');

        const assign = await AssignPersonCard(id, { personId });

        if (!assign)
          throw new Error('AssignPersonCard failed');
      }
    },
    handleUnassignPersonCard = async (cardsId: string[]) => {
      if (!UnassignPersonCard)
        throw new Error('UnassignPersonCard is undefined');

      for (const cardId of cardsId) {
        const id = cards.find(card => cardId === `${card.serialNumber} - ${card.lastCardNumber}`)?.id || undefined;

        if (!id)
          throw new Error('Card not found');

        const assign = await UnassignPersonCard(id);

        if (!assign)
          throw new Error('UnassignPersonCard failed');
      }
    },
    canUpdatePerson = () => {
      return name.length > 0 &&
        StringEx.removeMaskNum(matricule.toString()).toString().length > 0 &&
        StringEx.removeMaskNum(cpf.toString()).toString().length >= 11 &&
        StringEx.removeMaskNum(rg.toString()).toString().length >= 9 &&
        motherName.length > 0 &&
        birthDate != null &&
        StringEx.removeMaskNum(phone.toString()).toString().length >= 11 &&
        mail.length > 0 &&
        scaleId.length > 0 &&
        addressId.length > 0 &&
        appliedCards.length > 0 &&
        appliedServices.length > 0
    },
    handleUpdatePerson = async () => {
      if (!person || !UpdatePerson)
        return Alerting.create('error', 'Não foi possível atualizar os dados do(a) funcionário(a). Tente novamente, mais tarde!.');

      const updated = await UpdatePerson({
        matricule: StringEx.removeMaskNum(matricule.toString()).toString(),
        name,
        cpf: StringEx.removeMaskNum(cpf.toString()).toString(),
        rg: StringEx.removeMaskNum(rg.toString()).toString(),
        birthDate: birthDate.toISOString(),
        motherName,
        mail,
        phone: StringEx.removeMaskNum(phone.toString()).toString(),
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

        await handleUnassignPersonCard(removeCards.map(card => `${card.serialNumber} - ${card.lastCardNumber}`));
        await handleUnassignPersonService(removeServices.map(_ => _.id));
        await handleAssignPersonCard(person.id, newCards);
        await handleAssignPersonService(person.id, newServices);

        Alerting.create('success', 'Funcionário(a) teve os dados atualizados com sucesso.');
        props.handleClose();
      } catch {
        Alerting.create('error', 'Funcionário(a) teve os dados atualizados, mas ocorreram erros na confirmação de alguns dados do(a) funcionário(a). Verifique se todos os dados estão corretos na tela de registro dos funcionários.');
        props.handleClose();
      }
    };

  if (
    isLoadingPerson && !syncData
    || isLoadingServices && !syncData
    || isLoadingCards && !syncData
  )
    return <DialogLoading
      header='Editar Funcionário(a)'
      message='Carregando...'
      show={props.show}
      handleClose={props.handleClose}
    />

  if (!syncData && person && services && cards) {
    handleChangeMatricule(parseInt(person.matricule));
    handleChangeName(person.name);
    handleChangeCPF(parseInt(person.cpf));
    handleChangeRG(parseInt(person.rg));
    handleChangeMotherName(person.motherName);
    handleChangeBirthDate(new Date(person.birthDate));
    handleChangePhone(parseInt(person.phone));
    handleChangeMail(person.mail);
    handleChangeScaleId(person.scaleId);
    handleChangeAddressId(person.addressId);
    setAppliedCards(person.cards.map(card => `${card.serialNumber} - ${card.lastCardNumber}`));
    setAppliedServices(person.personService.map(_ => _.service.value));
    setSyncData(true);
  } else if (
    !syncData && !person
    || !syncData && !services
    || !syncData && !cards
    || !syncData && !UpdatePerson
    || !syncData && !AssignPersonService
    || !syncData && !UnassignPersonService
    || !syncData && !AssignPersonCard
    || !syncData && !UnassignPersonCard
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
            value={StringEx.maskMatricule(matricule, true)}
            onChange={(e) => handleChangeMatricule(StringEx.removeMaskNum(e.target.value))}
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
            value={StringEx.maskCPF(cpf, true)}
            onChange={(e) => handleChangeCPF(StringEx.removeMaskNum(e.target.value))}
          />
        </ListItem>
        <ListItem>
          <TextField
            className='col'
            label="RG"
            variant="standard"
            value={StringEx.maskRG(rg, true)}
            onChange={(e) => handleChangeRG(StringEx.removeMaskNum(e.target.value))}
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
            value={StringEx.maskPhone(phone, true)}
            onChange={(e) => handleChangePhone(StringEx.removeMaskNum(e.target.value))}
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
            id={person?.scaleId}
            handleChangeId={(id) => handleChangeScaleId(id)}
          />
        </ListItem>
        <ListItem>
          <SelectCard
            selectCards={person?.cards.map(card => `${card.costCenter.value || "???"} - ${card.serialNumber} (4 Últimos Dígitos: ${card.lastCardNumber})`)}
            handleChangeCard={(cards) => setAppliedCards(cards)}
          />
        </ListItem>
        <ListItem>
          <ListItemText primary="Funções da Pessoa" />
        </ListItem>
      </List>
      <SelectService
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
        Cancelar
      </Button>
    </Dialog>
  );
}