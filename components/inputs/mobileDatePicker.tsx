/**
 * @description Input -> Seleção de Data
 * @author GuilhermeSantos001
 * @update 30/12/2021
 */

import { ThemeProvider } from '@mui/material/styles';
import theme from '@/styles/theme-material-ui'

import AdapterDateFns from '@mui/lab/AdapterDateFns'
import ptBRLocale from 'date-fns/locale/pt-BR';
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import MobileDatePicker from '@mui/lab/MobileDatePicker'
import TextField from '@mui/material/TextField';

export type Props = {
  label: string
  value: Date
  className: string
  handleChangeValue: (value: Date) => void
}

const DatePicker = (props: Props): JSX.Element => {
  const localeMap = {
    ptBR: ptBRLocale
  };

  return <ThemeProvider theme={theme}>
    <LocalizationProvider dateAdapter={AdapterDateFns} locale={localeMap['ptBR']}>
      <MobileDatePicker
        label={props.label}
        value={props.value}
        onChange={(newValue) => props.handleChangeValue(newValue)}
        renderInput={(params) => <TextField className={props.className} {...params} />}
      />
    </LocalizationProvider>
  </ThemeProvider>
}

export default DatePicker
