/**
 * @description Input -> Seleciona um bairro
 * @author @GuilhermeSantos001
 * @update 05/01/2022
 */

import * as React from 'react';
import { Autocomplete, TextField, createFilterOptions, Button } from '@mui/material'

import { useAppSelector } from '@/app/hooks'

import canDeleteNeighborhood from '@/src/functions/canDeleteAddressAssociation'
import StringEx from '@/src/utils/stringEx'

import type {
  Neighborhood
} from '@/app/features/system/system.slice'

export type Props = {
  neighborhoods: Neighborhood[]
  neighborhood?: FilmOptionType
  handleChangeNeighborhood: (id: string) => void
  handleAppendNeighborhood: (neighborhood: Neighborhood) => void
  handleUpdateNeighborhood: (neighborhood: Neighborhood) => void
  handleRemoveNeighborhood: (id: string) => void
}

export type FilmOptionType = Neighborhood & {
  inputValue?: string;
  inputUpdate?: boolean;
}

const filter = createFilterOptions<FilmOptionType>();

export default function SelectStreet(props: Props) {
  const [value, setValue] = React.useState<FilmOptionType | null>(props.neighborhood || null);
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
            const value: Neighborhood = {
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
                  const neighborhood = props.neighborhoods.find(neighborhood => neighborhood.id === editValue);

                  if (neighborhood) {
                    const update: Neighborhood = {
                      ...neighborhood,
                      name: newValue
                    };

                    setValue(update);

                    props.handleUpdateNeighborhood(update);
                    props.handleChangeNeighborhood(update.id);
                  }
                } else {
                  if (props.neighborhoods.filter(neighborhood => neighborhood.name === newValue).length <= 0) {
                    props.handleAppendNeighborhood(value);
                    props.handleChangeNeighborhood(value.id);
                  } else {
                    const neighborhood = props.neighborhoods.find(neighborhood => neighborhood.name === newValue);

                    if (neighborhood) {
                      setValue(neighborhood);
                      props.handleChangeNeighborhood(neighborhood.id)
                    }
                  }
                }
              }
            }
          } else if (newValue && newValue.inputValue) {
            // Create a new value from the user input
            const neighborhood: Neighborhood = {
              id: hasEdit ? value.id : StringEx.id(),
              name: newValue.inputValue,
            };

            setValue(neighborhood);

            if (!newValue.inputUpdate) {
              props.handleAppendNeighborhood(neighborhood);
            } else {
              props.handleUpdateNeighborhood(neighborhood);
            }

            props.handleChangeNeighborhood(neighborhood.id);
          } else {
            setValue(newValue);

            props.handleChangeNeighborhood(newValue ? newValue.id : '');
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
        options={props.neighborhoods.map(neighborhood => {
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
          return option.name;
        }}
        renderOption={(props, option) => <li {...props}>{option.name}</li>}
        freeSolo
        renderInput={(params) => (
          <TextField {...params} label="Bairro" />
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
        disabled={hasEdit || !value || !canDeleteNeighborhood(workplaces, 'neighborhood', value.id)}
        onClick={() => {
          setValue(null);
          props.handleChangeNeighborhood('');
          props.handleRemoveNeighborhood(value.id);
        }}
      >
        Deletar
      </Button>
    </div>
  )
}