/**
 * @description Input -> Seleciona um endereço
 * @author GuilhermeSantos001
 * @update 10/02/2022
 */

import { useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import {
  useAddressesService
} from '@/services/useAddressesService'

export type Props = {
  id?: string
  disabled?: boolean
  handleChangeId: (id: string) => void
}

export function SelectAddress(props: Props) {
  const [address, setAddress] = useState<string>(props.id || '');

  const { data: addresses } = useAddressesService();

  return (
    <FormControl variant="outlined" className='col-12'>
      <InputLabel id="select-address-label">
        Local de Trabalho
      </InputLabel>
      <Select
        labelId="select-address-label"
        id="select-address"
        value={address}
        disabled={props.disabled !== undefined ? props.disabled : false}
        onChange={(e) => {
          setAddress(e.target.value as string);
          props.handleChangeId(e.target.value as string);
        }}
        label="Local de Trabalho"
      >
        {addresses.map((address) => {
          return (
            <MenuItem
              key={address.id}
              value={address.id}
            >
              <em>{`${address.street.value}, ${address.number} - ${address.neighborhood.value}, ${address.city.value} - ${address.district.value}, ${address.zipCode}`}</em>
            </MenuItem>
          )
        })}
      </Select>
    </FormControl>
  )
}