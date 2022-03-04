import { useState } from 'react';
import { Autocomplete, TextField, createFilterOptions, Button } from '@mui/material'

import { AutocompleteLoading } from '@/components/utils/AutocompleteLoading';
import { AutocompleteError } from '@/components/utils/AutocompleteError';

import type { NeighborhoodType } from '@/types/NeighborhoodType'

import type {
  DataNeighborhood,
  FunctionCreateNeighborhoodTypeof,
  FunctionUpdateNeighborhoodsTypeof,
  FunctionDeleteNeighborhoodsTypeof
} from '@/types/NeighborhoodServiceType'

import {
  useNeighborhoodService
} from '@/services/useNeighborhoodService'

import {
  useNeighborhoodWithIdService
} from '@/services/useNeighborhoodWithIdService'

import {
  useNeighborhoodsService
} from '@/services/useNeighborhoodsService'

import Alerting from '@/src/utils/alerting';

export type Props = {
  id?: string
  disabled?: boolean
  handleChangeData?: (data: NeighborhoodType) => void
  handleChangeId: (id: string) => void
}

export type FilmOptionType = Pick<NeighborhoodType, 'id' | 'value'> & {
  inputValue?: string;
  inputUpdate?: boolean;
}

const filter = createFilterOptions<FilmOptionType>();

export function SelectNeighborhood(props: Props) {
  const [syncData, setSyncData] = useState<boolean>(false);
  const [returnData, setReturnData] = useState<boolean>(false);

  const [value, setValue] = useState<FilmOptionType | null>(null);
  const [hasEdit, setHasEdit] = useState<boolean>(false);
  const [editValue, setEditValue] = useState<string>('');

  const { create: CreateNeighborhood } = useNeighborhoodService();
  const { data: neighborhood, isLoading: isLoadingNeighborhood } = useNeighborhoodWithIdService(props.id || '');
  const { data: neighborhoods, isLoading: isLoadingNeighborhoods, update: UpdateNeighborhoods, delete: DeleteNeighborhoods } = useNeighborhoodsService();

  const
    handleAppendNeighborhood: FunctionCreateNeighborhoodTypeof = async (data: DataNeighborhood) => CreateNeighborhood ? await CreateNeighborhood(data) : undefined,
    handleUpdateNeighborhood: FunctionUpdateNeighborhoodsTypeof = async (id: string, data: DataNeighborhood) => UpdateNeighborhoods ? await UpdateNeighborhoods(id, data) : false,
    handleRemoveNeighborhood: FunctionDeleteNeighborhoodsTypeof = async (id: string) => DeleteNeighborhoods ? await DeleteNeighborhoods(id) : false;

  if (!value && hasEdit)
    setHasEdit(false);

  if (isLoadingNeighborhood && !syncData || isLoadingNeighborhoods && !props.id && !syncData)
    return <AutocompleteLoading label='Bairro' message='Carregando...' />

  if (!syncData && neighborhood || !syncData && !props.id && neighborhoods) {
    if (neighborhood) {
      setValue({
        id: neighborhood.id,
        value: neighborhood.value,
      });
    }

    setSyncData(true);
  } else if (!syncData && !neighborhood || !syncData && !props.id && !neighborhoods) {
    return <AutocompleteError label='Bairro' message='Ocorreu um erro' />
  }

  if (props.id && props.handleChangeData && returnData) {
    const neighborhood = neighborhoods.find(neighborhood => neighborhood.id === props.id);

    if (neighborhood)
      props.handleChangeData(neighborhood);

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
                  if (neighborhoods.filter(neighborhood => neighborhood.value === newValue).length <= 0) {
                    handleAppendNeighborhood({ value: value.value });
                  } else {
                    const neighborhood = neighborhoods.find(neighborhood => neighborhood.value === newValue);

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
                value: newValue.inputValue,
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
            if (!newValue && props.id) {
              newValue = {
                id: props.id,
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
          if (value && value.id !== props.id) {
            if (props.id) {
              setValue({
                id: props.id,
                value: neighborhood?.value || '???'
              })
            } else {
              setValue(null);
            }

            handleRemoveNeighborhood(value.id);
            setReturnData(true);
            props.handleChangeId('');
          } else {
            Alerting.create('info', 'Não é possível remover o bairro sendo usado pelo registro.');
          }
        }}
      >
        Deletar
      </Button>
    </div>
  )
}