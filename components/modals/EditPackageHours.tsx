import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
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

import { PersonType } from '@/types/PersonType'
import { WorkplaceType } from '@/types/WorkplaceType'
import { DatabasePaymentMethodType } from '@/types/DatabasePaymentMethodType'

import {
  FunctionDeletePackageHoursAllTypeof,
  FunctionUpdatePackageHoursAllTypeof
} from '@/types/PackageHoursServiceType'

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
  id: string
  author: string
  periodStart: Date
  periodEnd: Date
  costCenterId: string
  personPHId: string
  personId: string
  workplaceDestinationId: string
  contractStartedAt: Date
  contractFinishAt: Date
  entryTime: Date
  exitTime: Date
  valueClosed: number
  jobTitle: string
  lawdays: number
  paymentMethod: DatabasePaymentMethodType
  paymentDatePayable: Date
  postingDescription: string
  people: PersonType[]
  workplaces: WorkplaceType[]
  updatePosting: FunctionUpdatePackageHoursAllTypeof
  deletePosting: FunctionDeletePackageHoursAllTypeof
  isPossibleHandleDelete: boolean
  open: boolean
  onClose: () => void
}

export function EditPackageHours(props: Props) {
  const [personId, setPersonId] = React.useState<string>(props.personId);
  const [workplaceDestinationId, setWorkplaceDestinationId] = React.useState<string>(props.workplaceDestinationId);
  const [contractStartedAt, setContractStartedAt] = React.useState<Date>(props.contractStartedAt);
  const [contractFinishAt, setContractFinishAt] = React.useState<Date>(props.contractFinishAt);
  const [entryTime, setEntryTime] = React.useState<Date>(props.entryTime);
  const [exitTime, setExitTime] = React.useState<Date>(props.exitTime);
  const [valueClosed, setValueClosed] = React.useState<number>(props.valueClosed);
  const [jobTitle, setJobTitle] = React.useState<string>(props.jobTitle);
  const [lawdays, setLawdays] = React.useState<number>(props.lawdays);
  const [paymentMethod, setPaymentMethod] = React.useState<DatabasePaymentMethodType>(props.paymentMethod);
  const [paymentDatePayable, setPaymentDatePayable] = React.useState<Date>(DateEx.addDays(props.paymentDatePayable, 5));
  const [postingDescription, setPostingDescription] = React.useState<string>(props.postingDescription);

  const
    handleChangePersonId = (id: string) => setPersonId(id),
    handleChangeWorkplaceDestinationId = (id: string) => setWorkplaceDestinationId(id),
    handleChangeContractStartedAt = (date: Date) => setContractStartedAt(date),
    handleChangeContractFinishAt = (date: Date) => setContractFinishAt(date),
    handleChangeEntryTime = (date: Date) => setEntryTime(date),
    handleChangeExitTime = (date: Date) => setExitTime(date),
    handleChangeValueClosed = (value: number) => setValueClosed(value || 0),
    handleChangeJobTitle = (value: string) => setJobTitle(value),
    handleChangeLawdays = (value: number) => setLawdays(value),
    handleChangePaymentMethod = (method: DatabasePaymentMethodType) => setPaymentMethod(method),
    handleChangePaymentDatePayable = (date: Date) => setPaymentDatePayable(date),
    handleChangePostingDescription = (value: string) => setPostingDescription(value);

  const
    paymentMethods = ['Cartão Alelo', 'Dinheiro'],
    dateNow = new Date(),
    paymentValue = valueClosed / 30 * lawdays;

  const
    isPossibleHandleSubmit = () => {
      if (
        personId.length > 0
        && workplaceDestinationId.length > 0
        && contractStartedAt
        && contractFinishAt
        && entryTime
        && exitTime
        && valueClosed > 0
        && jobTitle.length > 0
        && lawdays > 0
        && paymentMethod
        && paymentDatePayable
      ) {
        return true;
      }
    },
    handleUpdate = async () => {
      if (!props.updatePosting)
        return Alerting.create('error', 'Não foi possível atualizar o Pacote de Horas. Tente novamente, mais tarde!');

      const update = await props.updatePosting(props.id, {
        author: props.author,
        periodStart: props.periodStart.toISOString(),
        periodEnd: props.periodEnd.toISOString(),
        costCenterId: props.costCenterId,
        description: postingDescription,
        personId: props.personId,
        workplacePHDestinationId: workplaceDestinationId,
        contractStartedAt: contractStartedAt.toISOString(),
        contractFinishAt: contractFinishAt.toISOString(),
        entryTime: entryTime.toISOString(),
        exitTime: exitTime.toISOString(),
        valueClosed,
        jobTitle,
        lawdays,
        onlyHistory: false,
        paymentMethod,
        paymentDatePayable: paymentDatePayable.toISOString(),
        paymentValue,
        paymentStatus: 'pending',
        status: 'available'
      });

      if (!update)
        return Alerting.create('error', 'Não foi possível atualizar o Pacote de Horas. Tente novamente, mais tarde!');

      Alerting.create('success', 'Pacote de Horas atualizado com sucesso!');

      props.onClose();
    },
    handleDelete = async () => {
      if (props.isPossibleHandleDelete) {
        if (!props.deletePosting)
          return Alerting.create('error', 'Não foi possível remover o Pacote de Horas. Tente novamente, mais tarde!');

        const deleted = await props.deletePosting(props.id);

        if (!deleted)
          return Alerting.create('error', 'Não foi possível remover o Pacote de Horas. Tente novamente, mais tarde!');

        Alerting.create('success', 'Pacote de Horas removido com sucesso!');
      } else {
        if (!props.updatePosting)
          return Alerting.create('error', 'Não foi possível atualizar o Pacote de Horas. Tente novamente, mais tarde!');

        const update = await props.updatePosting(props.id, {
          author: props.author,
          periodStart: props.periodStart.toISOString(),
          periodEnd: props.periodEnd.toISOString(),
          costCenterId: props.costCenterId,
          description: postingDescription,
          personId: props.personId,
          workplacePHDestinationId: workplaceDestinationId,
          contractStartedAt: contractStartedAt.toISOString(),
          contractFinishAt: contractFinishAt.toISOString(),
          entryTime: entryTime.toISOString(),
          exitTime: exitTime.toISOString(),
          valueClosed,
          jobTitle,
          lawdays,
          onlyHistory: false,
          paymentMethod,
          paymentDatePayable: paymentDatePayable.toISOString(),
          paymentValue,
          paymentStatus: 'pending',
          status: 'unavailable'
        });

        if (!update)
          return Alerting.create('error', 'Não foi possível encerrar o Pacote de Horas. Tente novamente, mais tarde!');

        Alerting.create('success', 'Pacote de Horas encerrado com sucesso!');
      }

      props.onClose();
    }

  return (
    <BootstrapDialog
      fullWidth
      onClose={props.onClose}
      aria-labelledby="dialog-updatePH-title"
      open={props.open}
    >
      <BootstrapDialogTitle id="dialog-updatePH-title" onClose={props.onClose}>
        Atualização de Pacote de Horas
      </BootstrapDialogTitle>
      <DialogContent dividers>
        <FormControl fullWidth className="mb-3" disabled={true}>
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
        <TextField
          className='col-12 mb-3'
          label="Função"
          value={jobTitle}
          disabled={true}
          onChange={(e) => handleChangeJobTitle(e.target.value)}
        />
        <FormControl fullWidth className="mb-3" disabled={true}>
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
              props.workplaces.map((place) => (
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
          label="Início do Contrato"
          value={contractStartedAt}
          maxDate={dateNow}
          minDate={DateEx.subYears(dateNow, 1)}
          disabled={true}
          handleChangeValue={(value) => handleChangeContractStartedAt(value)}
        />
        <DatePicker
          className="col-12 mb-3"
          label="Final do Contrato"
          value={contractFinishAt}
          maxDate={DateEx.addYears(contractStartedAt, 1)}
          minDate={contractStartedAt}
          disabled={true}
          handleChangeValue={(value) => handleChangeContractFinishAt(value)}
        />
        <TimePicker
          className='col-12 mb-3'
          label="Horário de Entrada"
          value={entryTime}
          disabled={true}
          handleChangeValue={(value) => handleChangeEntryTime(value)}
        />
        <TimePicker
          className='col-12 mb-3'
          label="Horário de Saída"
          value={exitTime}
          disabled={true}
          handleChangeValue={(value) => handleChangeExitTime(value)}
        />
        <TextField
          className='col-12 mb-3'
          label="Valor Fechado"
          value={StringEx.maskMoney(valueClosed)}
          disabled={true}
          onChange={(e) => handleChangeValueClosed(getValueMoney(StringEx.removeMaskNum(e.target.value, 'infinity')))}
        />
        <TextField
          className='col-12 mb-3'
          label="Dias de Direito"
          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
          value={lawdays}
          onChange={(e) => {
            let value = StringEx.removeMaskNum(e.target.value || '0', 'infinity');

            if (value < 0)
              value = 0;

            if (value > 31)
              value = 31;

            handleChangeLawdays(value);
          }}
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
          onClick={handleUpdate}
          disabled={!isPossibleHandleSubmit()}
        >
          Salvar
        </Button>
        <Button
          className="col-2"
          variant="outlined"
          onClick={handleDelete}
        >
          {props.isPossibleHandleDelete ? 'Excluir' : 'Encerrar'}
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
}