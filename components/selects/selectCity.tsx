/**
 * @description Input -> Seleciona uma cidade
 * @author GuilhermeSantos001
 * @update 18/02/2022
 */

import { useState } from 'react';
import { Autocomplete, TextField, createFilterOptions, Button } from '@mui/material'

import { useAppSelector, useAppDispatch } from '@/app/hooks'

import canDeleteCity from '@/src/functions/canDeleteAddressAssociation'

import Alerting from '@/src/utils/alerting'
import StringEx from '@/src/utils/stringEx'

import {
  City,
  SystemActions
} from '@/app/features/system/system.slice'

export type Props = {
  city?: FilmOptionType
  handleChangeCity: (id: string) => void
}

export type FilmOptionType = City & {
  inputValue?: string;
  inputUpdate?: boolean;
}

const filter = createFilterOptions<FilmOptionType>();

export default function SelectStreet(props: Props) {
  const [value, setValue] = useState<FilmOptionType | null>(props.city || null);
  const [hasEdit, setHasEdit] = useState<boolean>(false);
  const [editValue, setEditValue] = useState<string>('');

  const
    cities = useAppSelector(state => state.system.cities),
    workplaces = useAppSelector((state) => state.system.workplaces || []);

  const dispatch = useAppDispatch(),
    handleAppendCity = (city: City) => {
      try {
        dispatch(SystemActions.CREATE_CITY(city));
      } catch (error) {
        Alerting.create('error', error.message);
      }
    },
    handleUpdateCity = (city: City) => {
      try {
        dispatch(SystemActions.UPDATE_CITY(city));
      } catch (error) {
        Alerting.create('error', error.message);
      }
    },
    handleRemoveCity = (id: string) => {
      try {
        dispatch(SystemActions.DELETE_CITY(id));
      } catch (error) {
        Alerting.create('error', error.message);
      }
    };

  if (!value && hasEdit)
    setHasEdit(false);

  return (
    <div className='d-flex flex-column flex-md-row'>
      <Autocomplete
        className='col-12 col-md-10 mb-2 mb-md-0 me-md-2'
        value={value}
        onChange={(event: any, newValue) => {
          if (typeof newValue === 'string') {
            const value: City = {
              id: StringEx.id(),
              name: newValue,
            };

            setValue(value);

            if (String(event.type).toLowerCase() === 'keydown') {
              if (
                String(event.code).toLowerCase() === 'enter' ||
                String(event.code).toLowerCase() === 'numpadenter'
              ) {
                if (hasEdit) {
                  const city = cities.find(city => city.id === editValue);

                  if (city) {
                    const update: City = {
                      ...city,
                      name: newValue
                    };

                    setValue(update);
                    handleUpdateCity(update);

                    props.handleChangeCity(update.id);
                  }
                } else {
                  if (cities.filter(city => city.name === newValue).length <= 0) {
                    handleAppendCity(value);
                    props.handleChangeCity(value.id);
                  } else {
                    const city = cities.find(city => city.name === newValue);

                    if (city) {
                      setValue(city);
                      props.handleChangeCity(city.id)
                    }
                  }
                }
              }
            }
          } else if (newValue && newValue.inputValue) {
            // Create a new value from the user input
            const city: City = {
              id: hasEdit ? value.id : StringEx.id(),
              name: newValue.inputValue,
            };

            setValue(city);

            if (!newValue.inputUpdate) {
              handleAppendCity(city);
            } else {
              handleUpdateCity(city);
            }

            props.handleChangeCity(city.id);
          } else {
            setValue(newValue);

            props.handleChangeCity(newValue ? newValue.id : '');
          }
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);

          const { inputValue } = params;

          // Suggest the creation of a new value
          const isExisting = options.some((option) => inputValue === option.name);

          if (inputValue !== '' && !isExisting) {
            filtered.push({
              id: hasEdit ? value.id : StringEx.id(),
              name: hasEdit ? `Atualizar "${value.name}" para "${inputValue}"` : `Adicionar "${inputValue}"`,
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
          return option.name;
        }}
        renderOption={(props, option) => <li {...props}>{option.name}</li>}
        freeSolo
        renderInput={(params) => (
          <TextField {...params} label="Cidade" />
        )}
      />
      <Button
        className='col mx-1'
        variant="contained"
        color={hasEdit ? 'primary' : 'warning'}
        disabled={!value}
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
        disabled={hasEdit || !value || !canDeleteCity(workplaces, 'city', value.id)}
        onClick={() => {
          setValue(null);
          handleRemoveCity(value.id);
          props.handleChangeCity('');
        }}
      >
        Deletar
      </Button>
    </div>
  )
}