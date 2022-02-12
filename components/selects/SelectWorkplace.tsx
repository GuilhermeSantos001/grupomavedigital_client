/**
 * @description Input -> Seleciona um local de trabalho
 * @author GuilhermeSantos001
 * @update 10/02/2022
 */

import { useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import {
  useWorkplacesService
} from '@/services/useWorkplacesService'

export type Props = {
  id?: string
  disabled?: boolean
  handleChangeId: (id: string) => void
}

export function SelectWorkplace(props: Props) {
  const [workplace, setWorkplace] = useState<string>(props.id || '');

  const { data: workplaces } = useWorkplacesService();

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