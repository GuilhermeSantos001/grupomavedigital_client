import { useState, memo } from 'react';
import { Autocomplete, TextField, createFilterOptions, Button } from '@mui/material'

import { AutocompleteLoading } from '@/components/utils/AutocompleteLoading';
import { AutocompleteError } from '@/components/utils/AutocompleteError';

import Alerting from '@/src/utils/alerting';
import StringEx from '@/src/utils/stringEx'

import type {
  DataNeighborhood,
  FunctionCreateNeighborhoodTypeof,
  FunctionUpdateNeighborhoodsTypeof,
  FunctionDeleteNeighborhoodsTypeof
} from '@/types/NeighborhoodServiceType'

import type { NeighborhoodType } from '@/types/NeighborhoodType'

export type Props = {
  createNeighborhood: FunctionCreateNeighborhoodTypeof
  neighborhood?: NeighborhoodType
  isLoadingNeighborhood?: boolean
  neighborhoods: NeighborhoodType[]
  updateNeighborhoods: FunctionUpdateNeighborhoodsTypeof
  deleteNeighborhoods: FunctionDeleteNeighborhoodsTypeof
  isLoadingNeighborhoods: boolean
  disabled?: boolean
  handleChangeData?: (data: NeighborhoodType) => void
  handleChangeId: (id: string) => void
}

export type FilmOptionType = Pick<NeighborhoodType, 'id' | 'value'> & {
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
    createNeighborhood,
    neighborhood,
    isLoadingNeighborhood,
    neighborhoods,
    updateNeighborhoods,
    deleteNeighborhoods,
    isLoadingNeighborhoods,
  } = props;

  const
    handleAppendNeighborhood: FunctionCreateNeighborhoodTypeof = async (data: DataNeighborhood) => createNeighborhood ? await createNeighborhood(data) : undefined,
    handleUpdateNeighborhood: FunctionUpdateNeighborhoodsTypeof = async (id: string, data: DataNeighborhood) => updateNeighborhoods ? await updateNeighborhoods(id, data) : false,
    handleRemoveNeighborhood: FunctionDeleteNeighborhoodsTypeof = async (id: string) => deleteNeighborhoods ? await deleteNeighborhoods(id) : false;

  if (!value && hasEdit)
    setHasEdit(false);

  if (isLoadingNeighborhood && !syncData || isLoadingNeighborhoods && !syncData)
    return <AutocompleteLoading label='Bairro' message='Carregando...' />

  if (!syncData && neighborhood || !syncData && neighborhoods) {
    if (neighborhood) {
      setValue({
        id: neighborhood.id,
        value: neighborhood.value,
      });
    }

    setSyncData(true);
  } else if (!syncData && !neighborhood || !syncData && !neighborhoods) {
    return <AutocompleteError label='Bairro' message='Ocorreu um erro' />
  }

  if (neighborhood && props.handleChangeData && returnData) {
    const updateNeighborhood = neighborhoods.find(neighborhood => neighborhood.id === neighborhood.id);

    if (updateNeighborhood)
      props.handleChangeData(updateNeighborhood);

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
                  const neighborhood = neighborhoods.find(neighborhood => neighborhood.value === editValue);

                  if (neighborhood) {
                    const update: FilmOptionType = {
                      id: neighborhood.id,
                      value: editValue,
                    };

                    setValue(update);
                    setReturnData(true);
                    handleUpdateNeighborhood(neighborhood.id, { value: editValue });
                    props.handleChangeId(neighborhood.id);
                  }
                } else {
                  if (neighborhoods.filter(neighborhood => neighborhood.value === value.value).length <= 0) {
                    handleAppendNeighborhood({ value: value.value });
                  } else {
                    const neighborhood = neighborhoods.find(neighborhood => neighborhood.value === value.value);

                    if (neighborhood) {
                      setValue({
                        id: neighborhood.id,
                        value: neighborhood.value
                      });
                      setReturnData(true);
                      props.handleChangeId(neighborhood.id);
                    }
                  }
                }
              }
            }
          } else if (newValue && newValue.inputValue) {
            // Create a new value from the user input
            let
              neighborhood: FilmOptionType = {
                id: hasEdit ? value?.id || '' : '',
                value: StringEx.trim(newValue.inputValue),
              };

            if (!newValue.inputUpdate) {
              const append = await handleAppendNeighborhood({ value: neighborhood.value });

              if (append) {
                const { data } = append;
                neighborhood.id = data.id;
              }
            } else {
              handleUpdateNeighborhood(neighborhood.id, { value: neighborhood.value });
            }

            setValue(neighborhood);
            setReturnData(true);
            props.handleChangeId(neighborhood.id);
          } else {
            if (!newValue && props.neighborhood) {
              newValue = {
                id: props.neighborhood.id,
                value: neighborhood?.value || '???'
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
        options={neighborhoods.map(neighborhood => {
          return { ...neighborhood, inputValue: '', inputUpdate: false }
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
          <TextField {...params} label="Bairro" />
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
          if (props.neighborhood && value && props.neighborhood.id === value.id)
            return Alerting.create('info', 'Não é possível remover o bairro sendo usado pelo registro.');

          if (value) {
            if (props.neighborhood) {
              setValue({
                id: props.neighborhood.id,
                value: neighborhood?.value || '???'
              })
            } else {
              setValue(null);
            }

            handleRemoveNeighborhood(value.id);
            setReturnData(true);
            props.handleChangeId('');
          } else {
          }
        }}
      >
        Deletar
      </Button>
    </div>
  )
}

export const SelectNeighborhood = memo(Component, (prevStates, nextStates) => {
  if (
    prevStates.neighborhood?.value !== nextStates.neighborhood?.value
    || prevStates.neighborhoods.length <= 0 || nextStates.neighborhoods.length <= 0
    || prevStates.neighborhoods.length !== nextStates.neighborhoods.length
  )
    return false;

  return true;
});