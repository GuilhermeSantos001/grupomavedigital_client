import React from 'react';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';

import ArrayEx from '@/src/utils/arrayEx';

export type Props = {
  title: React.ReactNode
  items: readonly string[]
  checked: readonly string[]
  handleChangeChecked: (values: readonly string[]) => void
  hasEdit: boolean
}

export function ListItemsForSelection(props: Props) {
  const handleToggle = (value: string) => {
    const currentIndex = props.checked.indexOf(value);
    const newChecked = [...props.checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    props.handleChangeChecked(newChecked);
  };

  const numberOfChecked = (items: readonly string[]) =>
    ArrayEx.intersection(props.checked, items).length;

  const handleToggleAll = (items: readonly string[]) => {
    if (numberOfChecked(items) === items.length) {
      props.handleChangeChecked(ArrayEx.returnItemsOfANotContainInB(props.checked, items));
    } else {
      props.handleChangeChecked(ArrayEx.union(props.checked, items));
    }
  };

  return (
    <Card>
      <CardHeader
        sx={{ px: 2, py: 1 }}
        avatar={
          <Checkbox
            onClick={() => handleToggleAll(props.items)}
            checked={numberOfChecked(props.items) === props.items.length && props.items.length !== 0}
            indeterminate={numberOfChecked(props.items) !== props.items.length && numberOfChecked(props.items) !== 0}
            disabled={props.items.length === 0 || props.hasEdit}
            inputProps={{
              'aria-label': 'all items selected',
            }}
          />
        }
        title={props.title}
        subheader={`${numberOfChecked(props.items)}/${props.items.length} selecionado(s)`}
      />
      <Divider />
      <List
        sx={{
          width: 200,
          height: 230,
          bgcolor: 'background.paper',
          overflow: 'auto',
        }}
        dense
        component="div"
        role="list"
      >
        {props.items.map((value: string) => {
          const labelId = `transfer-list-all-item-${value}-label`;

          return (
            <ListItem
              key={value}
              role="listitem"
              button
              onClick={() => handleToggle(value)}
              disabled={props.hasEdit}
            >
              <ListItemIcon>
                <Checkbox
                  checked={props.checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    'aria-labelledby': labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={value} />
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Card>
  )
}