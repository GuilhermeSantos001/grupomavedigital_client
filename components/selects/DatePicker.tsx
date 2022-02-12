/**
 * @description Input -> Seleção de Data
 * @author GuilhermeSantos001
 * @update 11/02/2022
 */

import AdapterDateFns from '@mui/lab/AdapterDateFns'
import ptBRLocale from 'date-fns/locale/pt-BR';
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import MobileDatePicker from '@mui/lab/MobileDatePicker'
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

export function DatePicker(props: Props) {
  const localeMap = {
    ptBR: ptBRLocale
  };

  return <LocalizationProvider dateAdapter={AdapterDateFns} locale={localeMap['ptBR']}>
    <MobileDatePicker
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
