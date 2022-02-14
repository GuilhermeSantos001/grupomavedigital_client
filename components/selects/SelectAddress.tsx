/**
 * @description Input -> Seleciona um endereço
 * @author GuilhermeSantos001
 * @update 12/02/2022
 */

import { useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import { OutlinedInputLoading } from '@/components/utils/OutlinedInputLoading';
import { OutlinedInputEmpty } from '@/components/utils/OutlinedInputEmpty';
import { BoxError } from '@/components/utils/BoxError';

import {
  useAddressesService
} from '@/services/useAddressesService'

export type Props = {
  id?: string
  disabled?: boolean
  handleChangeId: (id: string) => void
}

export function SelectAddress(props: Props) {
  const [syncData, setSyncData] = useState<boolean>(false);

  const [address, setAddress] = useState<string>(props.id || '');

  const { data: addresses, isLoading: isLoadingAddresses } = useAddressesService();

  if (isLoadingAddresses && !syncData)
    return <OutlinedInputLoading label='Endereço' message='Carregando...' />

  if (!syncData && addresses) {
    setSyncData(true);
  } else if (!syncData && !addresses) {
    return <BoxError />
  }

  if (addresses.length <= 0)
    return <OutlinedInputEmpty label='Endereço' message='Nenhum endereço cadastrado' />

  return (
    <FormControl variant="outlined" className='col-12'>
      <InputLabel id="select-address-label">
        Endereço
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
        label="Endereço"
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