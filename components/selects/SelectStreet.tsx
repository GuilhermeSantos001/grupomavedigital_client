/**
 * @description Input -> Seleciona uma rua
 * @author GuilhermeSantos001
 * @update 10/02/2022
 */

import React, { useState } from 'react';
import { Autocomplete, TextField, createFilterOptions, Button } from '@mui/material'

import { AutocompleteLoading } from '@/components/utils/AutocompleteLoading';
import { AutocompleteError } from '@/components/utils/AutocompleteError';

import { StreetType } from '@/types/StreetType'

import {
  useStreetService,
  DataStreet,
  FunctionCreateStreetTypeof
} from '@/services/useStreetService'

import {
  useStreetsService,
  FunctionUpdateStreetsTypeof,
  FunctionDeleteStreetsTypeof
} from '@/services/useStreetsService'

import Alerting from '@/src/utils/alerting';

export type Props = {
  id?: string
  disabled?: boolean
  handleChangeId: (id: string) => void
}

export type FilmOptionType = Pick<StreetType, 'id' | 'value'> & {
  inputValue?: string;
  inputUpdate?: boolean;
}

const filter = createFilterOptions<FilmOptionType>();

export function SelectStreet(props: Props) {
  const [syncData, setSyncData] = useState<boolean>(false);

  const [value, setValue] = useState<FilmOptionType | null>(null);
  const [hasEdit, setHasEdit] = useState<boolean>(false);
  const [editValue, setEditValue] = useState<string>('');

  const { data: street, isLoading: isLoadingStreet, create: CreateStreet } = useStreetService(props.id);
  const { data: streets, isLoading: isLoadingStreets, update: UpdateStreets, delete: DeleteStreets } = useStreetsService();

  const
    handleAppendStreet: FunctionCreateStreetTypeof = async (data: DataStreet) => CreateStreet ? await CreateStreet(data) : undefined,
    handleUpdateStreet: FunctionUpdateStreetsTypeof = async (id: string, data: DataStreet) => UpdateStreets ? await UpdateStreets(id, data) : false,
    handleRemoveStreet: FunctionDeleteStreetsTypeof = async (id: string) => DeleteStreets ? await DeleteStreets(id) : false;

  if (!value && hasEdit)
    setHasEdit(false);

  if (isLoadingStreet && !syncData || isLoadingStreets && !props.id && !syncData)
    return <AutocompleteLoading label='Rua' message='Carregando...' />

  if (!syncData && street || !syncData && !props.id && streets) {
    if (street) {
      setValue({
        id: street.id,
        value: street.value,
      });
    }

    setSyncData(true);
  } else if (!syncData && !street || !syncData && !props.id && !streets) {
    return <AutocompleteError label='Rua' message='Ocorreu um erro' />
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
                  const street = streets.find(street => street.value === editValue);

                  if (street) {
                    const update: FilmOptionType = {
                      id: street.id,
                      value: editValue,
                    };

                    setValue(update);
                    handleUpdateStreet(street.id, { value: editValue });
                    props.handleChangeId(street.id);
                  }
                } else {
                  if (streets.filter(street => street.value === newValue).length <= 0) {
                    handleAppendStreet({ value: value.value });
                  } else {
                    const street = streets.find(street => street.value === newValue);

                    if (street) {
                      setValue({
                        id: street.id,
                        value: street.value
                      });
                      props.handleChangeId(street.id);
                    }
                  }
                }
              }
            }
          } else if (newValue && newValue.inputValue) {
            // Create a new value from the user input
            const
              street: FilmOptionType = {
                id: hasEdit ? value?.id || '' : '',
                value: newValue.inputValue,
              };

            if (!newValue.inputUpdate) {
              const append = await handleAppendStreet({ value: street.value });

              if (append) {
                const { data } = append;
                street.id = data.id;
              }
            } else {
              handleUpdateStreet(street.id, { value: street.value });
            }

            setValue(street);
            props.handleChangeId(street.id);
          } else {
            if (!newValue && props.id) {
              newValue = {
                id: props.id,
                value: street?.value || '???'
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
        options={streets.map(street => {
          return { ...street, inputValue: '', inputUpdate: false }
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
          <TextField {...params} label="Rua" />
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
                value: street?.value || '???'
              })
            } else {
              setValue(null);
            }

            handleRemoveStreet(value.id);
            props.handleChangeId('');
          } else {
            Alerting.create('info', 'Não é possível remover a rua sendo usada pelo registro.');
          }
        }}
      >
        Deletar
      </Button>
    </div>
  )
}