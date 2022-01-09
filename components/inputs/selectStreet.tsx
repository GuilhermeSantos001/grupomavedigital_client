/**
 * @description Input -> Seleciona uma rua
 * @author GuilhermeSantos001
 * @update 07/01/2022
 */

import { useState } from 'react';
import { Autocomplete, TextField, createFilterOptions, Button } from '@mui/material'

import { useAppSelector, useAppDispatch } from '@/app/hooks'

import canDeleteStreet from '@/src/functions/canDeleteAddressAssociation'
import StringEx from '@/src/utils/stringEx'

import {
  Street,
  appendStreet,
  editStreet,
  removeStreet,
} from '@/app/features/system/system.slice'

export type Props = {
  street?: FilmOptionType
  handleChangeStreet: (id: string) => void
}

export type FilmOptionType = Street & {
  inputValue?: string;
  inputUpdate?: boolean;
}

const filter = createFilterOptions<FilmOptionType>();

export default function SelectStreet(props: Props) {
  const [value, setValue] = useState<FilmOptionType | null>(props.street || null);
  const [hasEdit, setHasEdit] = useState<boolean>(false);
  const [editValue, setEditValue] = useState<string>('');

  const
    streets = useAppSelector((state) => state.system.streets || []),
    workplaces = useAppSelector((state) => state.system.workplaces || []);

  const
    dispatch = useAppDispatch(),
    handleAppendStreet = (street: Street) => dispatch(appendStreet(street)),
    handleUpdateStreet = (street: Street) => dispatch(editStreet(street)),
    handleRemoveStreet = (id: string) => dispatch(removeStreet(id));

  if (!value && hasEdit)
    setHasEdit(false);

  return (
    <div className='d-flex flex-column flex-md-row'>
      <Autocomplete
        className='col-12 col-md-10 mb-2 mb-md-0 me-md-2'
        value={value}
        onChange={(event: any, newValue) => {
          if (typeof newValue === 'string') {
            const value: Street = {
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
                  const street = streets.find(street => street.id === editValue);

                  if (street) {
                    const update: Street = {
                      ...street,
                      name: newValue
                    };

                    setValue(update);

                    handleUpdateStreet(update);
                    props.handleChangeStreet(update.id);
                  }
                } else {
                  if (streets.filter(street => street.name === newValue).length <= 0) {
                    handleAppendStreet(value);
                    props.handleChangeStreet(value.id);
                  } else {
                    const street = streets.find(street => street.name === newValue);

                    if (street) {
                      setValue(street);
                      props.handleChangeStreet(street.id)
                    }
                  }
                }
              }
            }
          } else if (newValue && newValue.inputValue) {
            // Create a new value from the user input
            const street: Street = {
              id: hasEdit ? value.id : StringEx.id(),
              name: newValue.inputValue,
            };

            setValue(street);

            if (!newValue.inputUpdate) {
              handleAppendStreet(street);
            } else {
              handleUpdateStreet(street);
            }

            props.handleChangeStreet(street.id);
          } else {
            setValue(newValue);

            props.handleChangeStreet(newValue ? newValue.id : '');
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
          return option.name;
        }}
        renderOption={(props, option) => <li {...props}>{option.name}</li>}
        freeSolo
        renderInput={(params) => (
          <TextField {...params} label="Nome da Rua" />
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
        disabled={hasEdit || !value || !canDeleteStreet(workplaces, 'street', value.id)}
        onClick={() => {
          setValue(null);
          handleRemoveStreet(value.id);
          props.handleChangeStreet('');
        }}
      >
        Deletar
      </Button>
    </div>
  )
}