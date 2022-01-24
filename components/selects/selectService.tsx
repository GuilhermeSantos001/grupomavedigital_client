/**
 * @description Input -> Seleciona um serviço
 * @author GuilhermeSantos001
 * @update 24/01/2022
 */

import React, { useState } from 'react';
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
import ArrayEx from '@/src/utils/arrayEx';
import Alerting from '@/src/utils/alerting';

import { useAppDispatch, useAppSelector } from '@/app/hooks';

import {
  Service,
  SystemActions
} from '@/app/features/system/system.slice'

export interface Props {
  left: string[];
  right: string[];
  onChangeAppliedServices: (values: string[]) => void;
}

export default function SelectService(props: Props) {
  const [checked, setChecked] = useState<readonly string[]>([]);
  const [left, setLeft] = useState<readonly string[]>(props.left);
  const [right, setRight] = useState<readonly string[]>(props.right);
  const [newService, setNewService] = useState<string>('');
  const [hasEditService, setHasEditService] = useState<boolean>(false);
  const [textUpdateService, setTextUpdateService] = useState<string>('');
  const [idUpdateService, setIdUpdateService] = useState<string>('');

  const dispatch = useAppDispatch();
  const services = useAppSelector((state) => state.system.services || []);
  const workplaces = useAppSelector((state) => state.system.workplaces || []);

  const
    handleClickAdd = (item: Service) => {
      try {
        dispatch(SystemActions.CREATE_SERVICE(item));
      } catch (error) {
        Alerting.create('error', error instanceof Error ? error.message : JSON.stringify(error));
      }
    },
    handleClickEdit = (item: Service) => {
      try {
        dispatch(SystemActions.UPDATE_SERVICE(item));
      } catch (error) {
        Alerting.create('error', error instanceof Error ? error.message : JSON.stringify(error));
      }
    },
    handleClickDelete = (id: string) => {
      try {
        dispatch(SystemActions.DELETE_SERVICE(id));
      } catch (error) {
        Alerting.create('error', error instanceof Error ? error.message : JSON.stringify(error));
      }
    };

  const leftChecked = ArrayEx.intersection(checked, left);
  const rightChecked = ArrayEx.intersection(checked, right);

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
    ArrayEx.intersection(checked, items).length;

  const handleToggleAll = (items: readonly string[]) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(ArrayEx.not(checked, items));
    } else {
      setChecked(ArrayEx.union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    props.onChangeAppliedServices(right.concat(leftChecked));

    setRight(right.concat(leftChecked));
    setLeft(ArrayEx.not(left, leftChecked));
    setChecked(ArrayEx.not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    props.onChangeAppliedServices(ArrayEx.not(right, rightChecked));

    setLeft(left.concat(rightChecked));
    setRight(ArrayEx.not(right, rightChecked));
    setChecked(ArrayEx.not(checked, rightChecked));
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
              });
              setNewService('');
              setLeft([...left, newService]);
            } else {
              Alerting.create('warning', 'O serviço já existe');
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
            setIdUpdateService(services.find(service => service.value === leftChecked[0])?.id || "");
            setTextUpdateService(leftChecked[0]);
          } else {
            if (services.filter(service => service.value === textUpdateService && service.id !== idUpdateService).length > 0)
              return Alerting.create('warning', 'Já existe um serviço com esse nome.');

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
            handleClickEdit({
              id: updateService?.id || "",
              value: updateService.value
            });
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
          workplaces.filter(place => place.services.filter(service => leftChecked.indexOf(service) !== -1).length > 0).length > 0
        }
        onClick={() => {
          leftChecked.forEach(value => handleClickDelete(services.find(service => service.value === value)?.id || ""));
          setLeft([...left.filter(value => leftChecked.indexOf(value) === -1)]);
        }}
      >
        - Deletar
      </Button>
    </>
  );
}