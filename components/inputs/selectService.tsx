/**
 * @description Input -> Seleciona um serviço
 * @author @GuilhermeSantos001
 * @update 31/12/2021
 */

import * as React from 'react';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';

import StringEx from '@/src/utils/stringEx';
import Alerting from '@/src/utils/alerting';

import { useAppDispatch, useAppSelector } from '@/app/hooks';

import {
  Service,
  appendService,
  editService,
  removeService,
} from '@/app/features/system/system.slice'

// ? Retorna todos os itens da lista A que não estão na lista B
export function not(a: readonly string[], b: readonly string[]) {
  return a.filter((value) => b.indexOf(value) === -1);
}

// ? Retorna todos os itens da lista A que estão na lista B
export function intersection(a: readonly string[], b: readonly string[]) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

// ? Faz a união da lista A com os itens da lista B
export function union(a: readonly string[], b: readonly string[]) {
  return [...a, ...not(b, a)];
}

export interface Props {
  left: string[];
  right: string[];
  onChangeAppliedServices: (values: string[]) => void;
}

export default function SelectService(props: Props) {
  const [checked, setChecked] = React.useState<readonly string[]>([]);
  const [left, setLeft] = React.useState<readonly string[]>(props.left);
  const [right, setRight] = React.useState<readonly string[]>(props.right);
  const [newService, setNewService] = React.useState<string>('');
  const [hasEditService, setHasEditService] = React.useState<boolean>(false);
  const [textUpdateService, setTextUpdateService] = React.useState<string>('');
  const [idUpdateService, setIdUpdateService] = React.useState<string>('');

  const dispatch = useAppDispatch();
  const services = useAppSelector((state) => state.system.services || []);
  const workplaces = useAppSelector((state) => state.system.workplaces || []);

  const
    handleClickAdd = (item: Service) => dispatch(appendService(item)),
    handleClickEdit = (item: Service) => dispatch(editService(item)),
    handleClickDelete = (id: string) => dispatch(removeService(id));

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value: string) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = (items: readonly string[]) =>
    intersection(checked, items).length;

  const handleToggleAll = (items: readonly string[]) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    props.onChangeAppliedServices(right.concat(leftChecked));

    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    props.onChangeAppliedServices(not(right, rightChecked));

    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const customList = (title: React.ReactNode, items: readonly string[]) => (
    <Card>
      <CardHeader
        sx={{ px: 2, py: 1 }}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={numberOfChecked(items) === items.length && items.length !== 0}
            indeterminate={
              numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0
            }
            disabled={items.length === 0 || hasEditService}
            inputProps={{
              'aria-label': 'all items selected',
            }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} selecionado(s)`}
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
        {items.map((value: string) => {
          const labelId = `transfer-list-all-item-${value}-label`;

          return (
            <ListItem
              key={value}
              role="listitem"
              button
              onClick={handleToggle(value)}
              disabled={hasEditService}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
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
  );

  return (
    <>
      <Grid className='my-2' container spacing={2} justifyContent="center" alignItems="center">
        <Grid item>{customList('Disponíveis', left)}</Grid>
        <Grid item>
          <Grid container direction="column" alignItems="center">
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={handleCheckedRight}
              disabled={leftChecked.length === 0 || hasEditService}
              aria-label="move selected right"
            >
              &gt;
            </Button>
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={handleCheckedLeft}
              disabled={rightChecked.length === 0 || hasEditService}
              aria-label="move selected left"
            >
              &lt;
            </Button>
          </Grid>
        </Grid>
        <Grid item>{customList('Aplicados', right)}</Grid>
      </Grid>
      <TextField
        className='col-2 mx-auto my-2'
        label={hasEditService ? 'Serviço' : 'Novo Serviço'}
        variant="standard"
        value={hasEditService ? textUpdateService : newService}
        onChange={(e) => {
          if (hasEditService) {
            setTextUpdateService(e.target.value);
          } else {
            setNewService(e.target.value)
          }
        }}
      />
      <Button
        className='col-2 mx-auto my-2'
        variant="contained"
        color="primary"
        disabled={hasEditService}
        onClick={() => {
          if (newService) {
            if (services.filter(service => service.value === newService).length === 0) {
              handleClickAdd({
                id: StringEx.id(),
                value: newService,
                status: 'available',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              });
              setNewService('');
              setLeft([...left, newService]);
            } else {
              Alerting.create('O serviço já existe');
            }
          }
        }}
      >
        + Adicionar
      </Button>
      <Button
        className='col-2 mx-auto my-2'
        variant="contained"
        color={hasEditService ? 'success' : 'warning'}
        disabled={leftChecked.length !== 1}
        onClick={() => {
          if (!hasEditService) {
            setHasEditService(true);
            setIdUpdateService(services.find(service => service.value === leftChecked[0]).id);
            setTextUpdateService(leftChecked[0]);
          } else {
            if (services.filter(service => service.value === textUpdateService && service.id !== idUpdateService).length > 0)
              return Alerting.create('Já existe um serviço com esse nome.');

            const updateService = {
              ...services.find(service => service.id === idUpdateService),
              value: textUpdateService,
            };

            setLeft([...left.map(service => {
              if (service === leftChecked[0])
              service = textUpdateService;

              return service;
            })]);
            setChecked([textUpdateService]);
            setHasEditService(false);
            handleClickEdit(updateService);
          }
        }}
      >
        {hasEditService ? 'Salvar' : 'Editar'}
      </Button>
      <Button
        className='col-2 mx-auto my-2'
        variant="contained"
        color="error"
        disabled={
          leftChecked.length <= 0 ||
          hasEditService ||
          workplaces.filter(place => place.services.filter(service => leftChecked.indexOf(service.value) !== -1).length > 0).length > 0
        }
        onClick={() => {
          leftChecked.forEach(value => handleClickDelete(services.find(service => service.value === value).id));
          setLeft([...left.filter(value => leftChecked.indexOf(value) === -1)]);
        }}
      >
        - Deletar
      </Button>
    </>
  );
}