/**
 * @description Input -> Seleciona um distrito(Estado)
 * @author @GuilhermeSantos001
 * @update 05/01/2022
 */

import * as React from 'react';
import { Autocomplete, TextField, createFilterOptions, Button } from '@mui/material'

import { useAppSelector } from '@/app/hooks'

import canDeleteDistrict from '@/src/functions/canDeleteAddressAssociation'
import StringEx from '@/src/utils/stringEx'

import type {
  District
} from '@/app/features/system/system.slice'

export type Props = {
  districts: District[]
  district?: FilmOptionType
  handleChangeDistrict: (id: string) => void
  handleAppendDistrict: (city: District) => void
  handleUpdateDistrict: (city: District) => void
  handleRemoveDistrict: (id: string) => void
}

export type FilmOptionType = District & {
  inputValue?: string;
  inputUpdate?: boolean;
}

const filter = createFilterOptions<FilmOptionType>();

export default function SelectStreet(props: Props) {
  const [value, setValue] = React.useState<FilmOptionType | null>(props.district || null);
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
            const value: District = {
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
                  const district = props.districts.find(district => district.id === editValue);

                  if (district) {
                    const update: District = {
                      ...district,
                      name: newValue
                    };

                    setValue(update);

                    props.handleUpdateDistrict(update);
                    props.handleChangeDistrict(update.id);
                  }
                } else {
                  if (props.districts.filter(district => district.name === newValue).length <= 0) {
                    props.handleAppendDistrict(value);
                    props.handleChangeDistrict(value.id);
                  } else {
                    const district = props.districts.find(district => district.name === newValue);

                    if (district) {
                      setValue(district);
                      props.handleChangeDistrict(district.id)
                    }
                  }
                }
              }
            }
          } else if (newValue && newValue.inputValue) {
            // Create a new value from the user input
            const district: District = {
              id: hasEdit ? value.id : StringEx.id(),
              name: newValue.inputValue,
            };

            setValue(district);

            if (!newValue.inputUpdate) {
              props.handleAppendDistrict(district);
            } else {
              props.handleUpdateDistrict(district);
            }

            props.handleChangeDistrict(district.id);
          } else {
            setValue(newValue);

            props.handleChangeDistrict(newValue ? newValue.id : '');
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
        options={props.districts.map(district => {
          return { ...district, inputValue: '', inputUpdate: false }
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
          <TextField {...params} label="Estado" />
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
        disabled={hasEdit || !value || !canDeleteDistrict(workplaces, 'district', value.id)}
        onClick={() => {
          setValue(null);
          props.handleChangeDistrict('');
          props.handleRemoveDistrict(value.id);
        }}
      >
        Deletar
      </Button>
    </div>
  )
}