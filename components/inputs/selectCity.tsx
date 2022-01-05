/**
 * @description Input -> Seleciona uma cidade
 * @author @GuilhermeSantos001
 * @update 05/02/2022
 */

import * as React from 'react';
import { Autocomplete, TextField, createFilterOptions, Button } from '@mui/material'

import { useAppSelector } from '@/app/hooks'

import canDeleteCity from '@/src/functions/canDeleteAddressAssociation'
import StringEx from '@/src/utils/stringEx'

import type {
  City
} from '@/app/features/system/system.slice'

export type Props = {
  cities: City[]
  city?: FilmOptionType
  handleChangeCity: (id: string) => void
  handleAppendCity: (city: City) => void
  handleUpdateCity: (city: City) => void
  handleRemoveCity: (id: string) => void
}

export type FilmOptionType = City & {
  inputValue?: string;
  inputUpdate?: boolean;
}

const filter = createFilterOptions<FilmOptionType>();

export default function SelectStreet(props: Props) {
  const [value, setValue] = React.useState<FilmOptionType | null>(props.city || null);
  const [hasEdit, setHasEdit] = React.useState<boolean>(false);
  const [editValue, setEditValue] = React.useState<string>('');

  const
    workplaces = useAppSelector((state) => state.system.workplaces || []);

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
                  const city = props.cities.find(city => city.id === editValue);

                  if (city) {
                    const update: City = {
                      ...city,
                      name: newValue
                    };

                    setValue(update);

                    props.handleUpdateCity(update);
                    props.handleChangeCity(update.id);
                  }
                } else {
                  if (props.cities.filter(city => city.name === newValue).length <= 0) {
                    props.handleAppendCity(value);
                    props.handleChangeCity(value.id);
                  } else {
                    const city = props.cities.find(city => city.name === newValue);

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
              props.handleAppendCity(city);
            } else {
              props.handleUpdateCity(city);
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
        options={props.cities.map(city => {
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
          props.handleChangeCity('');
          props.handleRemoveCity(value.id);
        }}
      >
        Deletar
      </Button>
    </div>
  )
}