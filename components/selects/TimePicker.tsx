import {memo} from 'react';
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import ptBRLocale from 'date-fns/locale/pt-BR';
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import MobileTimePicker from '@mui/lab/MobileTimePicker'
import TextField from '@mui/material/TextField';

export type Props = {
  label: string
  value: Date
  className: string
  disabled?: boolean
  handleChangeValue: (value: Date) => void
}

function Component(props: Props) {
  const localeMap = {
    ptBR: ptBRLocale
  };

  return <LocalizationProvider dateAdapter={AdapterDateFns} locale={localeMap['ptBR']}>
    <MobileTimePicker
      label={props.label}
      value={props.value}
      disabled={props.disabled !== undefined ? props.disabled : false}
      onChange={(newValue) => props.handleChangeValue(newValue || new Date())}
      renderInput={(params) => <TextField className={props.className} {...params} />}
    />
  </LocalizationProvider>
}

export const TimePicker = memo(Component, (prevProps, nextProps) => {
  if (
    prevProps.value !== nextProps.value
  )
    return false;

  return true;
});