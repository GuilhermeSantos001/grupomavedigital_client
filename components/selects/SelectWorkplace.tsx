import { useState, memo } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import { OutlinedInputLoading } from '@/components/utils/OutlinedInputLoading';
import { OutlinedInputEmpty } from '@/components/utils/OutlinedInputEmpty';
import { BoxError } from '@/components/utils/BoxError';

import type { WorkplaceType } from '@/types/WorkplaceType';

export type Props = {
  id?: string
  workplaces: WorkplaceType[]
  isLoadingWorkplaces: boolean
  disabled?: boolean
  handleChangeData?: (data: WorkplaceType) => void
  handleChangeId: (id: string) => void
}

function Component(props: Props) {
  const [syncData, setSyncData] = useState<boolean>(false);
  const [returnData, setReturnData] = useState<boolean>(false);

  const [workplace, setWorkplace] = useState<string>(props.id || '');

  const { workplaces, isLoadingWorkplaces } = props;

  if (isLoadingWorkplaces && !syncData)
    return <OutlinedInputLoading label='Local de Trabalho' message='Carregando...' />

  if (!syncData && workplaces) {
    setSyncData(true);
  } else if (!syncData && !workplaces) {
    return <BoxError />
  }

  if (workplaces.length <= 0)
    return <OutlinedInputEmpty label='Local de Trabalho' message='Nenhum endereço cadastrado' />

  if (props.id && props.handleChangeData && returnData) {
    const place = workplaces.find(place => place.id === props.id);

    if (place)
      props.handleChangeData(place);

    setReturnData(false);
  }

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
          setReturnData(true);
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

export const SelectWorkplace = memo(Component, (prevStates, nextStates) => {
  if (
    prevStates.id !== nextStates.id
    || prevStates.workplaces.length <= 0 || nextStates.workplaces.length <= 0
    || prevStates.workplaces.length !== nextStates.workplaces.length
  )
    return false;

  return true;
})