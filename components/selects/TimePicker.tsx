/**
 * @description Input -> Seleção de Hora
 * @author GuilhermeSantos001
 * @update 11/02/2022
 */

import AdapterDateFns from '@mui/lab/AdapterDateFns'
import ptBRLocale from 'date-fns/locale/pt-BR';
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import MobileTimePicker from '@mui/lab/MobileTimePicker'
import TextField from '@mui/material/TextField';

export type Props = {
  label: string
  value: Date
  className: string
  handleChangeValue: (value: Date) => void
}

export function TimePicker(props: Props) {
  const localeMap = {
    ptBR: ptBRLocale
  };

  return <LocalizationProvider dateAdapter={AdapterDateFns} locale={localeMap['ptBR']}>
    <MobileTimePicker
      label={props.label}
      value={props.value}
      onChange={(newValue) => props.handleChangeValue(newValue || new Date())}
      renderInput={(params) => <TextField className={props.className} {...params} />}
    />
  </LocalizationProvider>
}