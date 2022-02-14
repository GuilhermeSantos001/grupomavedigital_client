/**
 * @description Input -> Seleciona um local de trabalho
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
  useWorkplacesService
} from '@/services/useWorkplacesService'

export type Props = {
  id?: string
  disabled?: boolean
  handleChangeId: (id: string) => void
}

export function SelectWorkplace(props: Props) {
  const [syncData, setSyncData] = useState<boolean>(false);

  const [workplace, setWorkplace] = useState<string>(props.id || '');

  const { data: workplaces, isLoading: isLoadingWorkplaces } = useWorkplacesService();

  if (isLoadingWorkplaces && !syncData)
    return <OutlinedInputLoading label='Local de Trabalho' message='Carregando...' />

  if (!syncData && workplaces) {
    setSyncData(true);
  } else if (!syncData && !workplaces) {
    return <BoxError />
  }

  if (workplaces.length <= 0)
    return <OutlinedInputEmpty label='Local de Trabalho' message='Nenhum endereço cadastrado' />

  return (
    <FormControl variant="outlined" className='col-12'>
      <InputLabel id="select-workplace-label">
        Local de Trabalho
      </InputLabel>
      <Select
        labelId="select-workplace-label"
        id="select-workplace"
        value={workplace}
        disabled={props.disabled !== undefined ? props.disabled : false}
        onChange={(e) => {
          setWorkplace(e.target.value as string);
          props.handleChangeId(e.target.value as string);
        }}
        label="Local de Trabalho"
      >
        {workplaces.map((place) => {
          return (
            <MenuItem
              key={place.id}
              value={place.id}
            >
              <em>{place.name} ({place.scale.value})</em>
            </MenuItem>
          )
        })}
      </Select>
    </FormControl>
  )
}