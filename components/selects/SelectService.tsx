/**
 * @description Input -> Seleciona um serviço
 * @author GuilhermeSantos001
 * @update 09/02/2022
 */

import React, { useState } from 'react';
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

import {
  useServiceService,
  DataService,
  FunctionCreateServiceTypeof,
} from '@/services/useServiceService';

import {
  useServicesService,
  FunctionUpdateServicesTypeof,
  FunctionDeleteServicesTypeof
} from '@/services/useServicesService';

export interface Props {
  itemsLeft: string[];
  itemsRight: string[];
  onChangeAppliedServices: (values: string[]) => void;
}

export function SelectService(props: Props) {
  const [checked, setChecked] = useState<readonly string[]>([]);
  const [itemsLeft, setItemsLeft] = useState<readonly string[]>(props.itemsLeft);
  const [itemsRight, setItemsRight] = useState<readonly string[]>(props.itemsRight);
  const [newService, setNewService] = useState<string>('');
  const [hasEditService, setHasEditService] = useState<boolean>(false);
  const [textUpdateService, setTextUpdateService] = useState<string>('');
  const [idUpdateService, setIdUpdateService] = useState<string>('');

  const { create: CreateService } = useServiceService();
  const { data: services, update: UpdateServices, delete: DeleteServices } = useServicesService();

  const
    handleAppendService: FunctionCreateServiceTypeof = async (data: DataService) => CreateService ? await CreateService(data) : undefined,
    handleUpdateService: FunctionUpdateServicesTypeof = async (id: string, data: DataService) => UpdateServices ? await UpdateServices(id, data) : false,
    handleDeleteService: FunctionDeleteServicesTypeof = async (id: string) => DeleteServices ? await DeleteServices(id) : false;

  const itemsLeftChecked = ArrayEx.intersection(checked, itemsLeft);
  const itemsRightChecked = ArrayEx.intersection(checked, itemsRight);

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
      setChecked(ArrayEx.returnItemsOfANotContainInB(checked, items));
    } else {
      setChecked(ArrayEx.union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    props.onChangeAppliedServices(itemsRight.concat(itemsLeftChecked));

    setItemsRight(itemsRight.concat(itemsLeftChecked));
    setItemsLeft(ArrayEx.returnItemsOfANotContainInB(itemsLeft, itemsLeftChecked));
    setChecked(ArrayEx.returnItemsOfANotContainInB(checked, itemsLeftChecked));
  };

  const handleCheckedLeft = () => {
    props.onChangeAppliedServices(ArrayEx.returnItemsOfANotContainInB(itemsRight, itemsRightChecked));

    setItemsLeft(itemsLeft.concat(itemsRightChecked));
    setItemsRight(ArrayEx.returnItemsOfANotContainInB(itemsRight, itemsRightChecked));
    setChecked(ArrayEx.returnItemsOfANotContainInB(checked, itemsRightChecked));
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
      <div className='my-2 d-flex flex-row justify-content-center'>
        {customList('Disponíveis', itemsLeft)}
        <div className='d-flex flex-column'>
          <Button
            className='mt-auto'
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedRight}
            disabled={itemsLeftChecked.length === 0 || hasEditService}
            aria-label="move selected right"
          >
            &gt;
          </Button>
          <Button
            className='mb-auto'
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedLeft}
            disabled={itemsRightChecked.length === 0 || hasEditService}
            aria-label="move selected left"
          >
            &lt;
          </Button>
        </div>
        {customList('Aplicados', itemsRight)}
      </div>
      <div className='d-flex flex-column'>
        <TextField
          className='col-2 m-auto'
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
      </div>
      <div className='d-flex flex-row justify-content-center my-2'>
        <Button
          className='col-2 mx-1'
          variant="contained"
          color="primary"
          disabled={hasEditService}
          onClick={async () => {
            if (newService) {
              if (services.filter(service => service.value === newService).length === 0) {
                const service = await handleAppendService({ value: newService });

                if (!service)
                  return Alerting.create('error', 'Não foi possível adicionar o serviço. Tente novamente com outro valor.');

                setNewService('');
                setItemsLeft([...itemsLeft, newService]);
              } else {
                Alerting.create('warning', 'O serviço já existe');
              }
            }
          }}
        >
          + Adicionar
        </Button>
        <Button
          className='col-2 mx-1'
          variant="contained"
          color={hasEditService ? 'success' : 'warning'}
          disabled={itemsLeftChecked.length !== 1}
          onClick={async () => {
            if (!hasEditService) {
              setHasEditService(true);
              setIdUpdateService(services.find(service => service.value === itemsLeftChecked[0])?.id || "");
              setTextUpdateService(itemsLeftChecked[0]);
            } else {
              if (services.filter(service => service.value === textUpdateService && service.id !== idUpdateService).length > 0)
                return Alerting.create('warning', 'Já existe um serviço com esse nome.');

              const
                updateServiceId = services.find(service => service.id === idUpdateService)?.id || "";

              const updateService = await handleUpdateService(updateServiceId, { value: textUpdateService });

              if (!updateService)
                return Alerting.create('error', 'Não foi possível atualizar o serviço. Tente novamente com outro valor.');

              setItemsLeft([...itemsLeft.map(service => {
                if (service === itemsLeftChecked[0])
                  service = textUpdateService;

                return service;
              })]);

              setChecked([textUpdateService]);
              setHasEditService(false);
            }
          }}
        >
          {hasEditService ? 'Salvar' : 'Editar'}
        </Button>
        <Button
          className='col-2 mx-1'
          variant="contained"
          color="error"
          disabled={
            itemsLeftChecked.length <= 0 ||
            hasEditService
          }
          onClick={() => {
            itemsLeftChecked.forEach(value => handleDeleteService(services.find(service => service.value === value)?.id || ""));
            setItemsLeft([...itemsLeft.filter(value => itemsLeftChecked.indexOf(value) === -1)]);
          }}
        >
          - Deletar
        </Button>
      </div>
    </>
  );
}