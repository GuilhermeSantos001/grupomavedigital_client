import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import { DatePicker } from '@/components/selects/DatePicker'
import { TimePicker } from '@/components/selects/TimePicker'

import getValueMoney from '@/src/functions/getValueMoney'

import StringEx from '@/src/utils/stringEx'
import DateEx from '@/src/utils/dateEx'
import Alerting from '@/src/utils/alerting'

import { B2Type, RoleGratification } from '@/types/B2Type'
import { PersonType } from '@/types/PersonType'
import { WorkplaceType } from '@/types/WorkplaceType'
import { DatabasePaymentMethodType } from '@/types/DatabasePaymentMethodType'

import {
  FunctionCreateB2Typeof
} from '@/types/B2ServiceType'

import {
  FunctionCreatePersonB2Typeof
} from '@/types/PersonB2ServiceType'

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

const BootstrapDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle className="bg-primary bg-gradient text-secondary fw-bold" sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          className="text-secondary"
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

export type Props = {
  author: string
  periodStart: Date
  periodEnd: Date
  costCenterId: string
  people: PersonType[]
  workplaces: WorkplaceType[]
  createPosting: FunctionCreateB2Typeof
  createPersonB2: FunctionCreatePersonB2Typeof
  open: boolean
  onClose: () => void
}

export function RegisterB2(props: Props) {
  const [personId, setPersonId] = React.useState<string>("");
  const [roleGratification, setRoleGratification] = React.useState<RoleGratification>("VIGILANTE");
  const [workplaceOriginId, setWorkplaceOriginId] = React.useState<string>("");
  const [workplaceDestinationId, setWorkplaceDestinationId] = React.useState<string>("");
  const [coverageStartedAt, setCoverageStartedAt] = React.useState<Date>(new Date());
  const [entryTime, setEntryTime] = React.useState<Date>(new Date());
  const [exitTime, setExitTime] = React.useState<Date>(DateEx.addHours(new Date(), 1));
  const [valueClosed, setValueClosed] = React.useState<number>(0);
  const [absences, setAbsences] = React.useState<number>(0);
  const [lawdays, setLawdays] = React.useState<number>(31);
  const [level, setLevel] = React.useState<number>(1);
  const [paymentMethod, setPaymentMethod] = React.useState<DatabasePaymentMethodType>("money");
  const [paymentDatePayable, setPaymentDatePayable] = React.useState<Date>(DateEx.addDays(new Date(), 5));
  const [postingDescription, setPostingDescription] = React.useState<string>("");

  const
    handleChangePersonId = (id: string) => setPersonId(id),
    handleChangeRoleGratification = (role: RoleGratification) => setRoleGratification(role),
    handleChangeWorkplaceOriginId = (id: string) => setWorkplaceOriginId(id),
    handleChangeWorkplaceDestinationId = (id: string) => setWorkplaceDestinationId(id),
    handleChangeCoverageStartedAt = (date: Date) => setCoverageStartedAt(date),
    handleChangeEntryTime = (date: Date) => setEntryTime(date),
    handleChangeExitTime = (date: Date) => setExitTime(date),
    handleChangeValueClosed = (value: number) => setValueClosed(value || 0),
    handleChangeAbsences = (value: number) => setAbsences(value),
    handleChangeLawdays = (value: number) => setLawdays(value),
    handleChangeLevel = (value: number) => setLevel(value),
    handleChangePaymentMethod = (method: DatabasePaymentMethodType) => setPaymentMethod(method),
    handleChangePaymentDatePayable = (date: Date) => setPaymentDatePayable(date),
    handleChangePostingDescription = (value: string) => setPostingDescription(value);

  const
    rolesGratification: RoleGratification[] = ['VIGILANTE', 'PORTEIRO'],
    paymentMethods = ['Cartão Alelo', 'Dinheiro'],
    dateNow = new Date(),
    discountValue = valueClosed / 30 * absences,
    gratification = (() => {
      if (roleGratification === 'VIGILANTE') {
        if (
          level === 0
          || level === 1
        )
          return 0
        else if (level === 2)
          return 50
        else if (level === 3)
          return 100
        else if (level === 4)
          return 150
        else if (level === 5)
          return 300
      } else if (roleGratification === 'PORTEIRO') {
        if (
          level === 0
          || level === 1
        )
          return 0
        else if (level === 2)
          return 30
        else if (level === 3)
          return 30
        else if (level === 4)
          return 44
        else if (level === 5)
          return 100
      }

      return 0;
    })(),
    paymentValue = (() => {
      if (absences > 0) {
        return (valueClosed / 30 * lawdays) - discountValue;
      } else {
        return (valueClosed / 30 * lawdays) + gratification;
      }
    })();

  const
    clearInputs = () => {
      setPersonId("");
      setRoleGratification("VIGILANTE");
      setWorkplaceOriginId("");
      setWorkplaceDestinationId("");
      setCoverageStartedAt(new Date());
      setEntryTime(new Date());
      setExitTime(DateEx.addHours(new Date(), 1));
      setValueClosed(0);
      setAbsences(0);
      setLawdays(31);
      setLevel(1);
      setPaymentMethod("money");
      setPaymentDatePayable(DateEx.addDays(new Date(), 5));
      setPostingDescription("");
    },
    isPossibleHandleSubmit = () => {
      if (
        personId.length > 0
        && workplaceOriginId.length > 0
        && workplaceDestinationId.length > 0
        && coverageStartedAt
        && entryTime
        && exitTime
        && valueClosed > 0
        && absences >= 0
        && lawdays > 0
        && level >= 0
        && paymentMethod
        && paymentDatePayable
      ) {
        return true;
      }
    },
    handleSubmit = async () => {
      const createPersonB2 = await props.createPersonB2({ personId });

      if (!createPersonB2)
        return Alerting.create('error', 'Error ao atribuir a pessoa ao B2. Tente novamente, mais tarde!');

      const { id } = createPersonB2.data;

      const create = await props.createPosting({
        author: props.author,
        periodStart: props.periodStart.toISOString(),
        periodEnd: props.periodEnd.toISOString(),
        costCenterId: props.costCenterId,
        description: postingDescription,
        personId: id,
        workplaceOriginId,
        workplaceDestinationId,
        coverageStartedAt: coverageStartedAt.toISOString(),
        entryTime: entryTime.toISOString(),
        exitTime: exitTime.toISOString(),
        valueClosed,
        absences,
        lawdays,
        discountValue,
        level,
        roleGratification,
        gratification,
        onlyHistory: false,
        paymentMethod,
        paymentDatePayable: paymentDatePayable.toISOString(),
        paymentValue,
        paymentStatus: 'pending',
        status: 'available'
      });

      if (!create)
        return Alerting.create('error', 'Não foi possível criar o B2. Tente novamente, mais tarde!');

      Alerting.create('success', 'B2 criado com sucesso!');

      clearInputs();
      props.onClose();
    }

  return (
    <BootstrapDialog
      fullWidth
      onClose={props.onClose}
      aria-labelledby="dialog-registerB2-title"
      open={props.open}
    >
      <BootstrapDialogTitle id="dialog-registerB2-title" onClose={props.onClose}>
        Registro de B2
      </BootstrapDialogTitle>
      <DialogContent dividers>
        <FormControl fullWidth className="mb-3">
          <InputLabel id="select-people-label">
            funcionário(a)
          </InputLabel>
          <Select
            labelId="select-people-label"
            value={personId}
            label="funcionário(a)"
            onChange={(event) => handleChangePersonId(event.target.value)}
          >
            <MenuItem value="">Selecionar</MenuItem>
            {
              props.people.map((person) => (
                <MenuItem
                  key={person.id}
                  value={person.id}>
                  {`[${person.matricule}] - ${person.name}`}
                </MenuItem>
              ))
            }
          </Select>
        </FormControl>
        <FormControl fullWidth className="mb-3">
          <InputLabel id="select-people-label">
            Função
          </InputLabel>
          <Select
            labelId="select-people-label"
            value={roleGratification}
            label="Função"
            onChange={(event) => handleChangeRoleGratification(event.target.value as RoleGratification)}
          >
            {
              rolesGratification.map((role, index) => (
                <MenuItem
                  key={`${role}-${index}`}
                  value={role}>
                  {role}
                </MenuItem>
              ))
            }
          </Select>
        </FormControl>
        <FormControl fullWidth className="mb-3">
          <InputLabel id="select-workplaceOrigin-label">
            Posto de Origem
          </InputLabel>
          <Select
            labelId="select-workplaceOrigin-label"
            value={workplaceOriginId}
            label="Posto de Origem"
            onChange={(event) => handleChangeWorkplaceOriginId(event.target.value)}
          >
            <MenuItem value="">Selecionar</MenuItem>
            {
              props.workplaces.filter(place => place.id !== workplaceDestinationId).map((place) => (
                <MenuItem
                  key={place.id}
                  value={place.id}>
                  {`${place.name} (${place.workplaceService.map(_ => _.service.value).join(', ')})`}
                </MenuItem>
              ))
            }
          </Select>
        </FormControl>
        <FormControl fullWidth className="mb-3">
          <InputLabel id="select-workplaceDestination-label">
            Posto de Cobertura
          </InputLabel>
          <Select
            labelId="select-workplaceDestination-label"
            value={workplaceDestinationId}
            label="Posto de Cobertura"
            onChange={(event) => handleChangeWorkplaceDestinationId(event.target.value)}
          >
            <MenuItem value="">Selecionar</MenuItem>
            {
              props.workplaces.filter(place => place.id !== workplaceOriginId).map((place) => (
                <MenuItem
                  key={place.id}
                  value={place.id}>
                  {`${place.name} (${place.workplaceService.map(_ => _.service.value).join(', ')})`}
                </MenuItem>
              ))
            }
          </Select>
        </FormControl>
        <DatePicker
          className="col-12 mb-3"
          label="Início da Cobertura"
          value={coverageStartedAt}
          maxDate={dateNow}
          minDate={DateEx.subYears(dateNow, 1)}
          handleChangeValue={(value) => handleChangeCoverageStartedAt(value)}
        />
        <TimePicker
          className='col-12 mb-3'
          label="Horário de Entrada"
          value={entryTime}
          handleChangeValue={(value) => handleChangeEntryTime(value)}
        />
        <TimePicker
          className='col-12 mb-3'
          label="Horário de Saída"
          value={exitTime}
          handleChangeValue={(value) => handleChangeExitTime(value)}
        />
        <TextField
          className='col-12 mb-3'
          label="Valor Fechado"
          value={StringEx.maskMoney(valueClosed)}
          onChange={(e) => handleChangeValueClosed(getValueMoney(StringEx.removeMaskNum(e.target.value)))}
        />
        <TextField
          className='col-12 mb-3'
          label="Faltas"
          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
          value={absences}
          onChange={(e) => {
            let value = StringEx.removeMaskNum(e.target.value || '0');

            if (value < 0)
              value = 0;

            if (value > 31)
              value = 31;

            handleChangeAbsences(value);
          }}
        />
        <TextField
          className='col-12 mb-3'
          label="Dias de Direito"
          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
          value={lawdays}
          onChange={(e) => {
            let value = StringEx.removeMaskNum(e.target.value || '0');

            if (value < 0)
              value = 0;

            if (value > 31)
              value = 31;

            handleChangeLawdays(value);
          }}
        />
        <TextField
          className='col-12 mb-3'
          label="Valor de Desconto"
          value={StringEx.maskMoney(discountValue)}
          disabled={true}
        />
        <div className='d-flex flex-column col-12 mb-3 border rounded p-2'>
          <Typography className='text-center' component="legend">Nível</Typography>
          <Rating
            className='align-self-center'
            name="level"
            value={level}
            onChange={(_, newValue) => {
              if (!newValue)
                newValue = 1;
              handleChangeLevel(newValue);
            }}
          />
        </div>
        <TextField
          className='col-12 mb-3'
          label="Gratificação"
          value={StringEx.maskMoney(gratification)}
          disabled={true}
        />
        <FormControl fullWidth className="mb-3">
          <InputLabel id="select-people-label">
            Forma de Pagamento
          </InputLabel>
          <Select
            labelId="select-people-label"
            value={paymentMethod}
            label="Forma de Pagamento"
            onChange={(event) => handleChangePaymentMethod(event.target.value as DatabasePaymentMethodType)}
          >
            {
              paymentMethods
                .filter(method => {
                  if (method !== 'Dinheiro') {
                    const person = props.people.find(person => person.id === personId);

                    if (person) {
                      const card = person.cards.find(card => card.costCenterId === props.costCenterId);

                      if (!card)
                        return false;
                    }
                  }

                  return true;
                })
                .map((method, index) => {
                  const value = method === 'Dinheiro' ? 'money' : 'card';
                  return (
                    <MenuItem
                      key={`${method}-${index}`}
                      value={value}>
                      {method}
                    </MenuItem>
                  )
                })
            }
          </Select>
        </FormControl>
        <TextField
          className='col-12 mb-3'
          label="Valor a Pagar"
          value={StringEx.maskMoney(paymentValue)}
          disabled={true}
        />
        <DatePicker
          className="col-12 mb-3"
          label="Data a Pagar"
          value={paymentDatePayable}
          maxDate={DateEx.addDays(dateNow, 10)}
          minDate={dateNow}
          handleChangeValue={(value) => handleChangePaymentDatePayable(value)}
        />
        <TextField
          className='col-12'
          label="Descrição"
          multiline
          rows={4}
          value={postingDescription}
          onChange={(e) => handleChangePostingDescription(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button className="col-2" variant="outlined" onClick={props.onClose}>
          Sair
        </Button>
        <Button
          className="col-2"
          variant="outlined"
          onClick={handleSubmit}
          disabled={!isPossibleHandleSubmit()}
        >
          Salvar
        </Button>
      </DialogActions>
    </BootstrapDialog >
  );
}