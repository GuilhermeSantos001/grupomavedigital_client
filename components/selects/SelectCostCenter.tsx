import { useState } from 'react';
import { Autocomplete, TextField, createFilterOptions, Button } from '@mui/material'

import { AutocompleteLoading } from '@/components/utils/AutocompleteLoading'
import { AutocompleteError } from '@/components/utils/AutocompleteError'

import type { CostCenterType } from '@/types/CostCenterType'

import type {
  DataCostCenter,
  FunctionCreateCostCenterTypeof,
  FunctionUpdateCostCentersTypeof,
  FunctionDeleteCostCentersTypeof
} from '@/types/CostCenterServiceType'

import { useCostCenterService } from '@/services/useCostCenterService'
import { useCostCenterWithIdService } from '@/services/useCostCenterWithIdService'
import { useCostCentersService } from '@/services/useCostCentersService'

import Alerting from '@/src/utils/alerting'

export type Props = {
  id?: string
  disabled?: boolean
  handleChangeId: (id: string) => void
}

export type FilmOptionType = Pick<CostCenterType, 'id' | 'value'> & {
  inputValue?: string;
  inputUpdate?: boolean;
}

const filter = createFilterOptions<FilmOptionType>();

export function SelectCostCenter(props: Props) {
  const [syncData, setSyncData] = useState<boolean>(false);

  const [value, setValue] = useState<FilmOptionType | null>(null);
  const [hasEdit, setHasEdit] = useState<boolean>(false);
  const [editValue, setEditValue] = useState<string>('');

  const { create: CreateCostCenter } = useCostCenterService();
  const { data: costCenter, isLoading: isLoadingCostCenter } = useCostCenterWithIdService(props.id || '');
  const { data: costCenters, isLoading: isLoadingCostCenters, update: UpdateCostCenters, delete: DeleteCostCenters } = useCostCentersService();

  const
    handleAppendCostCenter: FunctionCreateCostCenterTypeof = async (data: DataCostCenter) => CreateCostCenter ? await CreateCostCenter(data) : undefined,
    handleUpdateCostCenter: FunctionUpdateCostCentersTypeof = async (id: string, data: DataCostCenter) => UpdateCostCenters ? await UpdateCostCenters(id, data) : false,
    handleRemoveCostCenter: FunctionDeleteCostCentersTypeof = async (id: string) => DeleteCostCenters ? await DeleteCostCenters(id) : false;

  if (!value && hasEdit)
    setHasEdit(false);

  if (isLoadingCostCenter && !syncData || isLoadingCostCenters && !props.id && !syncData)
    return <AutocompleteLoading label='Centro de Custo' message='Carregando...' />

  if (!syncData && costCenter || !syncData && !props.id && costCenters) {
    if (costCenter) {
      setValue({
        id: costCenter.id,
        value: costCenter.value,
      });
    }

    setSyncData(true);
  } else if (!syncData && !costCenter || !syncData && !props.id && !costCenters) {
    return <AutocompleteError label='Centro de Custo' message='Ocorreu um erro' />
  }

  return (
    <div className='d-flex flex-column flex-md-row'>
      <Autocomplete
        className='col-12 col-md-10 mb-2 mb-md-0 me-md-2'
        value={value}
        disabled={props.disabled !== undefined ? props.disabled : false}
        onChange={async (event: any, newValue) => {
          if (typeof newValue === 'string') {
            const value: FilmOptionType = {
              id: '',
              value: newValue,
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
                    handleUpdateCostCenter(costCenter.id, { value: editValue });
                    props.handleChangeId(costCenter.id);
                  }
                } else {
                  if (costCenters.filter(costCenter => costCenter.value === newValue).length <= 0) {
                    handleAppendCostCenter({ value: value.value });
                  } else {
                    const costcenter = costCenters.find(costCenter => costCenter.value === newValue);

                    if (costcenter) {
                      setValue({
                        id: costcenter.id,
                        value: costcenter.value
                      });
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
                value: newValue.inputValue,
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
            props.handleChangeId(costCenter.id);
          } else {
            if (!newValue && props.id) {
              newValue = {
                id: props.id,
                value: costCenter?.value || '???'
              }
            }

            setValue(newValue);
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
          if (value && value.id !== props.id) {
            if (props.id) {
              setValue({
                id: props.id,
                value: costCenter?.value || '???'
              })
            } else {
              setValue(null);
            }

            handleRemoveCostCenter(value.id);
            props.handleChangeId('');
          } else {
            Alerting.create('info', 'Não é possível remover o centro de custo sendo usado pelo registro.');
          }
        }}
      >
        Deletar
      </Button>
    </div>
  )
}