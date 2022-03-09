import { useState, memo } from 'react';
import { Autocomplete, TextField, createFilterOptions, Button } from '@mui/material'

import { AutocompleteLoading } from '@/components/utils/AutocompleteLoading';
import { AutocompleteError } from '@/components/utils/AutocompleteError';

import Alerting from '@/src/utils/alerting';
import StringEx from '@/src/utils/stringEx'

import type {
  DataStreet,
  FunctionCreateStreetTypeof,
  FunctionUpdateStreetsTypeof,
  FunctionDeleteStreetsTypeof
} from '@/types/StreetServiceType'

import type { StreetType } from '@/types/StreetType'

export type Props = {
  createStreet: FunctionCreateStreetTypeof
  street?: StreetType
  isLoadingStreet?: boolean
  streets: StreetType[]
  updateStreets: FunctionUpdateStreetsTypeof
  deleteStreets: FunctionDeleteStreetsTypeof
  isLoadingStreets: boolean
  disabled?: boolean
  handleChangeData?: (data: StreetType) => void
  handleChangeId: (id: string) => void
}

export type FilmOptionType = Pick<StreetType, 'id' | 'value'> & {
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
    createStreet,
    street,
    isLoadingStreet,
    streets,
    updateStreets,
    deleteStreets,
    isLoadingStreets,
  } = props;

  const
    handleAppendStreet: FunctionCreateStreetTypeof = async (data: DataStreet) => createStreet ? await createStreet(data) : undefined,
    handleUpdateStreet: FunctionUpdateStreetsTypeof = async (id: string, data: DataStreet) => updateStreets ? await updateStreets(id, data) : false,
    handleRemoveStreet: FunctionDeleteStreetsTypeof = async (id: string) => deleteStreets ? await deleteStreets(id) : false;

  if (!value && hasEdit)
    setHasEdit(false);

  if (isLoadingStreet && !syncData || isLoadingStreets && !syncData)
    return <AutocompleteLoading label='Rua' message='Carregando...' />

  if (!syncData && street || !syncData && streets) {
    if (street) {
      setValue({
        id: street.id,
        value: street.value,
      });
    }

    setSyncData(true);
  } else if (!syncData && !street || !syncData && !streets) {
    return <AutocompleteError label='Rua' message='Ocorreu um erro' />
  }

  if (street && props.handleChangeData && returnData) {
    const updateStreet = streets.find(street => street.id === street.id);

    if (updateStreet)
      props.handleChangeData(updateStreet);

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
                  const street = streets.find(street => street.value === editValue);

                  if (street) {
                    const update: FilmOptionType = {
                      id: street.id,
                      value: editValue,
                    };

                    setValue(update);
                    setReturnData(true);
                    handleUpdateStreet(street.id, { value: editValue });
                    props.handleChangeId(street.id);
                  }
                } else {
                  if (streets.filter(street => street.value === value.value).length <= 0) {
                    handleAppendStreet({ value: value.value });
                  } else {
                    const street = streets.find(street => street.value === value.value);

                    if (street) {
                      setValue({
                        id: street.id,
                        value: street.value
                      });
                      setReturnData(true);
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
                value: StringEx.trim(newValue.inputValue),
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
            setReturnData(true);
            props.handleChangeId(street.id);
          } else {
            if (!newValue && props.street) {
              newValue = {
                id: props.street.id,
                value: street?.value || '???'
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
          if (props.street && value && props.street.id === value.id)
            return Alerting.create('info', 'Não é possível remover a rua sendo usada pelo registro.');

          if (value) {
            if (props.street) {
              setValue({
                id: props.street.id,
                value: street?.value || '???'
              })
            } else {
              setValue(null);
            }

            handleRemoveStreet(value.id);
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

export const SelectStreet = memo(Component, (prevStates, nextStates) => {
  if (
    prevStates.street?.value !== nextStates.street?.value
    || prevStates.streets.length !== nextStates.streets.length
  )
    return false;

  return true;
});