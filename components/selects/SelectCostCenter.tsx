import { useState, memo } from 'react';
import { Autocomplete, TextField, createFilterOptions, Button } from '@mui/material'

import { AutocompleteLoading } from '@/components/utils/AutocompleteLoading'
import { AutocompleteError } from '@/components/utils/AutocompleteError'

import Alerting from '@/src/utils/alerting'
import StringEx from '@/src/utils/stringEx'

import type {
  DataCostCenter,
  FunctionCreateCostCenterTypeof,
  FunctionUpdateCostCentersTypeof,
  FunctionDeleteCostCentersTypeof
} from '@/types/CostCenterServiceType'

import type { CostCenterType } from '@/types/CostCenterType'

export type Props = {
  createCostCenter: FunctionCreateCostCenterTypeof
  costCenter?: CostCenterType
  isLoadingCostCenter?: boolean
  costCenters: CostCenterType[]
  updateCostCenters: FunctionUpdateCostCentersTypeof
  deleteCostCenters: FunctionDeleteCostCentersTypeof
  isLoadingCostCenters: boolean
  disabled?: boolean
  handleChangeData?: (data: CostCenterType) => void
  handleChangeId: (id: string) => void
}

export type FilmOptionType = Pick<CostCenterType, 'id' | 'value'> & {
  inputValue?: string;
  inputUpdate?: boolean;
}

const filter = createFilterOptions<FilmOptionType>();

function Component(props: Props) {
  const [syncData, setSyncData] = useState<boolean>(false);
  const [returnData, setReturnData] = useState<boolean>(false);

  const [value, setValue] = useState<FilmOptionType | null>(null);
  const [hasEdit, setHasEdit] = useState<boolean>(false);
  const [editValue, setEditValue] = useState<string>('');

  const {
    createCostCenter,
    costCenter,
    isLoadingCostCenter,
    costCenters,
    updateCostCenters,
    deleteCostCenters,
    isLoadingCostCenters,
  } = props;

  const
    handleAppendCostCenter: FunctionCreateCostCenterTypeof = async (data: DataCostCenter) => createCostCenter ? await createCostCenter(data) : undefined,
    handleUpdateCostCenter: FunctionUpdateCostCentersTypeof = async (id: string, data: DataCostCenter) => updateCostCenters ? await updateCostCenters(id, data) : false,
    handleRemoveCostCenter: FunctionDeleteCostCentersTypeof = async (id: string) => deleteCostCenters ? await deleteCostCenters(id) : false;

  if (!value && hasEdit)
    setHasEdit(false);

  if (isLoadingCostCenter && !syncData || isLoadingCostCenters && !syncData)
    return <AutocompleteLoading label='Centro de Custo' message='Carregando...' />

  if (!syncData && costCenter || !syncData && costCenters) {
    if (costCenter) {
      setValue({
        id: costCenter.id,
        value: costCenter.value,
      });
    }

    setSyncData(true);
  } else if (!syncData && !costCenter || !syncData && !costCenters) {
    return <AutocompleteError label='Centro de Custo' message='Ocorreu um erro' />
  }

  if (costCenter && props.handleChangeData && returnData) {
    const changeCostCenter = costCenters.find(costcenter => costcenter.id === costCenter.id);

    if (changeCostCenter)
      props.handleChangeData(changeCostCenter);

    setReturnData(false);
  }

  return (
    <div className='d-flex flex-column flex-md-row col'>
      <Autocomplete
        className='col-12 col-md-10 mb-2 mb-md-0 me-md-2'
        value={value}
        disabled={props.disabled !== undefined ? props.disabled : false}
        onChange={async (event: any, newValue) => {
          if (typeof newValue === 'string') {
            if (StringEx.trim(newValue).length <= 0)
              return Alerting.create('warning', 'Por favor, informe um valor válido.');
          } else if (newValue) {
            const inputValue = newValue.inputValue ? newValue.inputValue : newValue.value;
            if (StringEx.trim(inputValue).length <= 0)
              return Alerting.create('warning', 'Por favor, informe um valor válido.');
          }

          if (typeof newValue === 'string') {
            const value: FilmOptionType = {
              id: '',
              value: StringEx.trim(newValue),
            };

            setValue(value);

            if (String(event.type).toLowerCase() === 'keydown') {
              if (
                String(event.code).toLowerCase() === 'enter' ||
                String(event.code).toLowerCase() === 'numpadenter'
              ) {
                if (hasEdit) {
                  const costCenter = costCenters.find(costCenter => costCenter.value === editValue);

                  if (costCenter) {
                    const update: FilmOptionType = {
                      id: costCenter.id,
                      value: editValue,
                    };

                    setValue(update);
                    setReturnData(true);
                    handleUpdateCostCenter(costCenter.id, { value: editValue });
                    props.handleChangeId(costCenter.id);
                  }
                } else {
                  if (costCenters.filter(costCenter => costCenter.value === value.value).length <= 0) {
                    handleAppendCostCenter({ value: value.value });
                  } else {
                    const costcenter = costCenters.find(costCenter => costCenter.value === value.value);

                    if (costcenter) {
                      setValue({
                        id: costcenter.id,
                        value: costcenter.value
                      });
                      setReturnData(true);
                      props.handleChangeId(costcenter.id);
                    }
                  }
                }
              }
            }
          } else if (newValue && newValue.inputValue) {
            // Create a new value from the user input
            const
              costCenter: FilmOptionType = {
                id: hasEdit ? value?.id || '' : '',
                value: StringEx.trim(newValue.inputValue),
              };

            if (!newValue.inputUpdate) {
              const append = await handleAppendCostCenter({ value: costCenter.value });

              if (append) {
                const { data } = append;
                costCenter.id = data.id;
              }
            } else {
              handleUpdateCostCenter(costCenter.id, { value: costCenter.value });
            }

            setValue(costCenter);
            setReturnData(true);
            props.handleChangeId(costCenter.id);
          } else {
            if (!newValue && props.costCenter) {
              newValue = {
                id: props.costCenter.id,
                value: costCenter?.value || '???'
              }
            }

            setValue(newValue);
            setReturnData(true);
            props.handleChangeId(newValue?.id || '');
          }
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);

          const { inputValue } = params;

          // Suggest the creation of a new value
          const isExisting = options.some((option) => inputValue === option.value);

          if (inputValue !== '' && !isExisting) {
            const valueId = '';

            filtered.push({
              id: hasEdit ? value?.id || valueId : valueId,
              value: hasEdit ? `Atualizar "${value?.value || "???"}" para "${inputValue}"` : `Adicionar "${inputValue}"`,
              inputValue,
              inputUpdate: hasEdit ? true : false
            });
          }

          return filtered;
        }}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        id="free-solo-with-text-demo"
        options={costCenters.map(costCenter => {
          return { ...costCenter, inputValue: '', inputUpdate: false }
        })}
        getOptionLabel={(option) => {
          // Value selected with enter, right from the input
          if (typeof option === 'string') {
            return option;
          }
          // Add "xxx" option created dynamically
          if (option.inputValue) {
            return option.inputValue;
          }
          // Regular option
          return option.value;
        }}
        renderOption={(props, option) => <li {...props}>{option.value}</li>}
        freeSolo
        renderInput={(params) => (
          <TextField {...params} label="Centro de Custo" />
        )}
      />
      <Button
        className='col mx-1'
        variant="contained"
        color={hasEdit ? 'primary' : 'warning'}
        disabled={props.disabled ? true : !value}
        onClick={() => {
          if (!hasEdit) {
            setHasEdit(true);
            setEditValue(value ? value.id : '');
          } else {
            setHasEdit(false);
            setEditValue('');
          }
        }}
      >
        {hasEdit ? 'Voltar' : 'Editar'}
      </Button>
      <Button
        className='col mx-1'
        variant="contained"
        color='error'
        disabled={props.disabled ? true : hasEdit || !value}
        onClick={() => {
          if (props.costCenter && value && props.costCenter.id === value.id)
            return Alerting.create('info', 'Não é possível remover o centro de custo sendo usado pelo registro.');

          if (value) {
            if (props.costCenter) {
              setValue({
                id: props.costCenter.id,
                value: costCenter?.value || '???'
              })
            } else {
              setValue(null);
            }

            handleRemoveCostCenter(value.id);
            setReturnData(true);
            props.handleChangeId('');
          }
        }}
      >
        Deletar
      </Button>
    </div>
  )
}

export const SelectCostCenter = memo(Component, (prevStates, nextStates) => {
  if (
    prevStates.costCenter?.value !== nextStates.costCenter?.value
    || prevStates.costCenters.length !== nextStates.costCenters.length
  )
    return false;

  return true;
});