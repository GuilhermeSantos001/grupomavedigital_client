/**
 * @description Input -> Seleciona uma pessoa
 * @author @GuilhermeSantos001
 * @update 30/12/2021
 */

import { Autocomplete, TextField } from '@mui/material'

import type {
  Person
} from '@/app/features/system/system.slice'

export type Props = {
  person: string
  persons: Person[]
  handleChangePerson: (id: string) => void
}

const SelectPerson = (props: Props): JSX.Element => {
  return (
    <Autocomplete
      disablePortal
      options={[{
        label: 'Testando',
        id: 1
      }]}
      renderInput={(params) => <TextField className='col-12' {...params} label="Person" />}
      onChange={(_, value) => console.log(value)}
    />
  )
}

export default SelectPerson
