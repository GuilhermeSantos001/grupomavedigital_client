import { useState, memo } from 'react';
import { Autocomplete, TextField, createFilterOptions, Button } from '@mui/material'

import { AutocompleteLoading } from '@/components/utils/AutocompleteLoading';
import { AutocompleteError } from '@/components/utils/AutocompleteError';

import Alerting from '@/src/utils/alerting';
import StringEx from '@/src/utils/stringEx'

import type {
  DataCity,
  FunctionCreateCityTypeof,
  FunctionUpdateCitiesTypeof,
  FunctionDeleteCitiesTypeof
} from '@/types/CityServiceType'

import type { CityType } from '@/types/CityType'

export type Props = {
  createCity: FunctionCreateCityTypeof
  city?: CityType
  isLoadingCity?: boolean
  cities: CityType[]
  updateCities: FunctionUpdateCitiesTypeof
  deleteCities: FunctionDeleteCitiesTypeof
  isLoadingCities: boolean
  disabled?: boolean
  handleChangeData?: (data: CityType) => void
  handleChangeId: (id: string) => void
}

export type FilmOptionType = Pick<CityType, 'id' | 'value'> & {
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
    createCity,
    city,
    isLoadingCity,
    cities,
    updateCities,
    deleteCities,
    isLoadingCities,
  } = props;

  const
    handleAppendCity: FunctionCreateCityTypeof = async (data: DataCity) => createCity ? await createCity(data) : undefined,
    handleUpdateCity: FunctionUpdateCitiesTypeof = async (id: string, data: DataCity) => updateCities ? await updateCities(id, data) : false,
    handleRemoveCity: FunctionDeleteCitiesTypeof = async (id: string) => deleteCities ? await deleteCities(id) : false;

  if (!value && hasEdit)
    setHasEdit(false);

  if (isLoadingCity && !syncData || isLoadingCities && !syncData)
    return <AutocompleteLoading label='Cidade' message='Carregando...' />

  if (!syncData && city || !syncData && cities) {
    if (city) {
      setValue({
        id: city.id,
        value: city.value,
      });
    }

    setSyncData(true);
  } else if (!syncData && !city || !syncData && !cities) {
    return <AutocompleteError label='Cidade' message='Ocorreu um erro' />
  }

  if (city && props.handleChangeData && returnData) {
    const changeCity = cities.find(city => city.id === city.id);

    if (changeCity)
      props.handleChangeData(changeCity);

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
                  const city = cities.find(city => city.value === editValue);

                  if (city) {
                    const update: FilmOptionType = {
                      id: city.id,
                      value: editValue,
                    };

                    setValue(update);
                    setReturnData(true);
                    handleUpdateCity(city.id, { value: editValue });
                    props.handleChangeId(city.id);
                  }
                } else {
                  if (cities.filter(city => city.value === value.value).length <= 0) {
                    handleAppendCity({ value: value.value });
                  } else {
                    const city = cities.find(city => city.value === value.value);

                    if (city) {
                      setValue({
                        id: city.id,
                        value: city.value
                      });
                      setReturnData(true);
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
                value: StringEx.trim(newValue.inputValue),
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
            setReturnData(true);
            props.handleChangeId(city.id);
          } else {
            if (!newValue && props.city) {
              newValue = {
                id: props.city.id,
                value: city?.value || '???'
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
          if (props.city && value && props.city.id === value.id)
            return Alerting.create('info', 'Não é possível remover a cidade sendo usada pelo registro.');

          if (value) {
            if (props.city) {
              setValue({
                id: props.city.id,
                value: city?.value || '???'
              })
            } else {
              setValue(null);
            }

            handleRemoveCity(value.id);
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

export const SelectCity = memo(Component, (prevStates, nextStates) => {
  if (
    prevStates.city?.value !== nextStates.city?.value
    || prevStates.cities.length <= 0 || nextStates.cities.length <= 0
    || prevStates.cities.length !== nextStates.cities.length
  )
    return false;

  return true;
});