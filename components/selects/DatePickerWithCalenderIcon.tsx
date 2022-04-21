import { memo } from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ptBRLocale from 'date-fns/locale/pt-BR';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import TextField from '@mui/material/TextField';

export type Props = {
  label: string
  value: Date
  className: string
  maxDate: Date
  minDate: Date
  disabled?: boolean
  handleChangeValue: (value: Date) => void
}

function Component(props: Props) {
  const localeMap = {
    ptBR: ptBRLocale
  };

  return <LocalizationProvider dateAdapter={AdapterDateFns} locale={localeMap['ptBR']}>
    <DesktopDatePicker
      label={props.label}
      value={props.value}
      maxDate={props.maxDate}
      minDate={props.minDate}
      disabled={props.disabled !== undefined ? props.disabled : false}
      onChange={(newValue) => props.handleChangeValue(newValue || new Date())}
      renderInput={(params) => <TextField className={props.className} {...params} />}
    />
  </LocalizationProvider>
}

export const DatePickerWithCalenderIcon = memo(Component, (prevProps, nextProps) => {
  if (
    prevProps.value !== nextProps.value
  )
    return false;

  return true;
});