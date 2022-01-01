/**
 * @description Lista -> Lista com ícones (MUI)
 * @author @GuilhermeSantos001
 * @update 31/12/2021
 */

import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import WorkIcon from '@mui/icons-material/Work';

import type {
  Workplace
} from '@/app/features/system/system.slice';

export type Props = {
  workplaces: Workplace[]
}

export function renderListItem(key: string, title: string, subtitle: string) {
  return (
    <ListItem key={key}>
      <ListItemAvatar>
        <Avatar className='bg-primary'>
          <WorkIcon className='text-secondary' />
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={title} secondary={subtitle} />
    </ListItem>
  )
}

export default function ListWithIconsMUI(props: Props) {
  return (
    <List className='col-12 bg-light-gray border rounded m-2'>
      {
        props.workplaces.length > 0 ?
          props.workplaces.map(workplace => renderListItem(workplace.id, workplace.name, `Escala ${workplace.scale.value} - Serviços ${workplace.services.map(service => service.value).join(', ')}`))
          :
          <ListItem>
            <ListItemText primary='Nenhum local de trabalho aplicado.' />
          </ListItem>
      }
    </List>
  );
}