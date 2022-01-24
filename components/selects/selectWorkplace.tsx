/**
 * @description Input -> Seleciona um local de trabalho
 * @author GuilhermeSantos001
 * @update 24/01/2022
 */

import { useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import { useAppSelector } from '@/app/hooks';

export type Props = {
  handleChangeWorkplace: (id: string) => void
}

export default function SelectWorkplace(props: Props) {
  const [workplace, setWorkplace] = useState<string>('');

  const
    workplaces = useAppSelector(state => state.system.workplaces),
    scales = useAppSelector(state => state.system.scales);

  return (
    <FormControl variant="outlined" className='col-12'>
      <InputLabel id="select-workplace-label">
        Local de Trabalho
      </InputLabel>
      <Select
        labelId="select-workplace-label"
        id="select-workplace"
        value={workplace}
        onChange={(e) => {
          setWorkplace(e.target.value as string);
          props.handleChangeWorkplace(e.target.value as string);
        }}
        label="Local de Trabalho"
      >
        {workplaces.map((place) => {
          return (
            <MenuItem
              key={place.id}
              value={place.id}
            >
              <em>{place.name}({scales.find(scale => scale.id === place.scale)?.value || "???"})</em>
            </MenuItem>
          )
        })}
      </Select>
    </FormControl>
  )
}