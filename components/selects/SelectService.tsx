import { useState, memo } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { BoxLoadingMagicSpinner } from '@/components/utils/BoxLoadingMagicSpinner';
import { BoxError } from '@/components/utils/BoxError';

import { ListItemsForSelection } from '@/components/lists/ListItemsForSelection'

import ArrayEx from '@/src/utils/arrayEx';
import Alerting from '@/src/utils/alerting';
import StringEx from '@/src/utils/stringEx'

import type {
  DataService,
  FunctionCreateServiceTypeof,
  FunctionUpdateServicesTypeof,
  FunctionDeleteServicesTypeof
} from '@/types/ServiceServiceType'

import type { ServiceType } from '@/types/ServiceType'

export interface Props {
  createService: FunctionCreateServiceTypeof
  services: ServiceType[]
  isLoadingServices: boolean
  updateServices: FunctionUpdateServicesTypeof
  deleteServices: FunctionDeleteServicesTypeof
  itemsLeft: string[];
  itemsRight: string[];
  onChangeAppliedServices: (values: string[]) => void;
}

function Component(props: Props) {
  const [syncData, setSyncData] = useState<boolean>(false);

  const [checked, setChecked] = useState<readonly string[]>([]);
  const [itemsLeft, setItemsLeft] = useState<readonly string[]>(props.itemsLeft);
  const [itemsRight, setItemsRight] = useState<readonly string[]>(props.itemsRight);
  const [newService, setNewService] = useState<string>('');
  const [hasEditService, setHasEditService] = useState<boolean>(false);
  const [textUpdateService, setTextUpdateService] = useState<string>('');
  const [idUpdateService, setIdUpdateService] = useState<string>('');

  const {
    createService,
    services,
    isLoadingServices,
    updateServices,
    deleteServices,
  } = props;

  const
    handleAppendService: FunctionCreateServiceTypeof = async (data: DataService) => createService ? await createService(data) : undefined,
    handleUpdateService: FunctionUpdateServicesTypeof = async (id: string, data: DataService) => updateServices ? await updateServices(id, data) : false,
    handleDeleteService: FunctionDeleteServicesTypeof = async (id: string) => deleteServices ? await deleteServices(id) : false;

  if (isLoadingServices && !syncData)
    return <BoxLoadingMagicSpinner />;

  if (!syncData && services) {
    setSyncData(true);
  } else if (
    !syncData && !services
    || !syncData && !updateServices
    || !syncData && !deleteServices
  ) {
    return <BoxError />
  }

  const itemsLeftChecked = ArrayEx.intersection(checked, itemsLeft);
  const itemsRightChecked = ArrayEx.intersection(checked, itemsRight);

  const
    handleChangeChecked = (values: readonly string[]) => setChecked(values),
    handleCheckedRight = () => {
      props.onChangeAppliedServices(itemsRight.concat(itemsLeftChecked));

      setItemsRight(itemsRight.concat(itemsLeftChecked));
      setItemsLeft(ArrayEx.returnItemsOfANotContainInB(itemsLeft, itemsLeftChecked));
      setChecked(ArrayEx.returnItemsOfANotContainInB(checked, itemsLeftChecked));
    },
    handleCheckedLeft = () => {
      props.onChangeAppliedServices(ArrayEx.returnItemsOfANotContainInB(itemsRight, itemsRightChecked));

      setItemsLeft(itemsLeft.concat(itemsRightChecked));
      setItemsRight(ArrayEx.returnItemsOfANotContainInB(itemsRight, itemsRightChecked));
      setChecked(ArrayEx.returnItemsOfANotContainInB(checked, itemsRightChecked));
    };

  return (
    <>
      <div className='my-2 d-flex flex-row justify-content-center'>
        <ListItemsForSelection title="Disponíveis" items={itemsLeft} checked={checked} handleChangeChecked={handleChangeChecked} hasEdit={hasEditService} />
        <div className='d-flex flex-column'>
          <Button
            className='mt-auto mx-2'
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
            className='mb-auto mx-2'
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
        <ListItemsForSelection title="Aplicados" items={itemsRight} checked={checked} handleChangeChecked={handleChangeChecked} hasEdit={hasEditService} />
      </div>
      <div className='d-flex flex-column'>
        <TextField
          className='col-2 m-auto'
          label={hasEditService ? 'Serviço' : 'Novo Serviço'}
          variant="standard"
          value={hasEditService ? textUpdateService : newService}
          onChange={(e) => {
            if (
              textUpdateService.length === 0 &&
              newService.length === 0 &&
              StringEx.trim(e.target.value).length <= 0
            )
              return Alerting.create('warning', 'Por favor, informe um valor válido.');

            if (hasEditService) {
              setTextUpdateService(StringEx.trim(e.target.value));
            } else {
              setNewService(StringEx.trim(e.target.value))
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
          onClick={async () => {
            const
              itemsChecked = [...itemsLeftChecked],
              items = [...itemsLeft];

            for (const value of itemsLeftChecked) {
              const remove = await handleDeleteService(services.find(service => service.value === value)?.id || "")

              if (!remove) {
                const indexOf = itemsChecked.indexOf(value);
                itemsChecked.splice(indexOf, 1);
              }
            }

            setItemsLeft([...ArrayEx.returnItemsOfANotContainInB(items, itemsChecked)]);
            setChecked([...checked.filter(value => itemsChecked.indexOf(value) === -1)]);
          }}
        >
          - Deletar
        </Button>
      </div>
    </>
  );
}

export const SelectService = memo(Component, (prevStates, nextStates) => {
  if (
    prevStates.services.length !== nextStates.services.length
    || prevStates.itemsLeft.length !== nextStates.itemsLeft.length
    || prevStates.itemsRight.length !== nextStates.itemsRight.length
  )
    return false;

  return true;
});