/**
 * @description Input -> Seleciona uma cidade
 * @author GuilhermeSantos001
 * @update 11/02/2022
 */
import { useState } from 'react';
import { Autocomplete, TextField, createFilterOptions, Button } from '@mui/material'

import { AutocompleteLoading } from '@/components/utils/AutocompleteLoading';
import { AutocompleteError } from '@/components/utils/AutocompleteError';

import { CityType } from '@/types/CityType'

import {
  useCityService,
  DataCity,
  FunctionCreateCityTypeof
} from '@/services/useCityService'

import {
  useCitiesService,
  FunctionUpdateCitiesTypeof,
  FunctionDeleteCitiesTypeof
} from '@/services/useCitiesService'

import Alerting from '@/src/utils/alerting';

export type Props = {
  id?: string
  disabled?: boolean
  handleChangeId: (id: string) => void
}

export type FilmOptionType = Pick<CityType, 'id' | 'value'> & {
  inputValue?: string;
  inputUpdate?: boolean;
}

const filter = createFilterOptions<FilmOptionType>();

export function SelectCity(props: Props) {
  const [syncData, setSyncData] = useState<boolean>(false);

  const [value, setValue] = useState<FilmOptionType | null>(null);
  const [hasEdit, setHasEdit] = useState<boolean>(false);
  const [editValue, setEditValue] = useState<string>('');

  const { data: city, isLoading: isLoadingCity, create: CreateCity } = useCityService(props.id);
  const { data: cities, isLoading: isLoadingCities, update: UpdateCities, delete: DeleteCities } = useCitiesService();

  const
    handleAppendCity: FunctionCreateCityTypeof = async (data: DataCity) => CreateCity ? await CreateCity(data) : undefined,
    handleUpdateCity: FunctionUpdateCitiesTypeof = async (id: string, data: DataCity) => UpdateCities ? await UpdateCities(id, data) : false,
    handleRemoveCity: FunctionDeleteCitiesTypeof = async (id: string) => DeleteCities ? await DeleteCities(id) : false;

  if (!value && hasEdit)
    setHasEdit(false);

  if (isLoadingCity && !syncData || isLoadingCities && !props.id && !syncData)
    return <AutocompleteLoading label='Cidade' message='Carregando...' />

  if (!syncData && city || !syncData && !props.id && cities) {
    if (city) {
      setValue({
        id: city.id,
        value: city.value,
      });
    }

    setSyncData(true);
  } else if (!syncData && !city || !syncData && !props.id && !cities) {
    return <AutocompleteError label='Cidade' message='Ocorreu um erro' />
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
                  const city = cities.find(city => city.value === editValue);

                  if (city) {
                    const update: FilmOptionType = {
                      id: city.id,
                      value: editValue,
                    };

                    setValue(update);
                    handleUpdateCity(city.id, { value: editValue });
                    props.handleChangeId(city.id);
                  }
                } else {
                  if (cities.filter(city => city.value === newValue).length <= 0) {
                    handleAppendCity({ value: value.value });
                  } else {
                    const city = cities.find(city => city.value === newValue);

                    if (city) {
                      setValue({
                        id: city.id,
                        value: city.value
                      });
                      props.handleChangeId(city.id);
                    }
                  }
                }
              }
            }
          } else if (newValue && newValue.inputValue) {
            // Create a new value from the user input
            const
              city: FilmOptionType = {
                id: hasEdit ? value?.id || '' : '',
                value: newValue.inputValue,
              };

            if (!newValue.inputUpdate) {
              const append = await handleAppendCity({ value: city.value });

              if (append) {
                const { data } = append;
                city.id = data.id;
              }
            } else {
              handleUpdateCity(city.id, { value: city.value });
            }

            setValue(city);
            props.handleChangeId(city.id);
          } else {
            if (!newValue && props.id) {
              newValue = {
                id: props.id,
                value: city?.value || '???'
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
        options={cities.map(city => {
          return { ...city, inputValue: '', inputUpdate: false }
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
          <TextField {...params} label="Cidade" />
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
                value: city?.value || '???'
              })
            } else {
              setValue(null);
            }

            handleRemoveCity(value.id);
            props.handleChangeId('');
          } else {
            Alerting.create('info', 'Não é possível remover a cidade sendo usada pelo registro.');
          }
        }}
      >
        Deletar
      </Button>
    </div>
  )
}