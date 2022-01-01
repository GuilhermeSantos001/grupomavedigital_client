/**
 * @description Input -> Seleciona um bairro
 * @author @GuilhermeSantos001
 * @update 31/12/2021
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

  const
    workplaces = useAppSelector((state) => state.system.workplaces || []);

  if (!value && hasEdit)
    setHasEdit(false);

  return (
    <div className='d-flex flex-column flex-md-row'>
      <Autocomplete
        className='col-12 col-md-10 mb-2 mb-md-0 me-md-2'
        value={value}
        onChange={(event, newValue) => {
          if (typeof newValue === 'string') {
            setValue({
              id: StringEx.id(),
              name: newValue,
              status: 'available',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            });
          } else if (newValue && newValue.inputValue) {
            // Create a new value from the user input
            const neighborhood: Neighborhood = {
              id: hasEdit ? value.id : StringEx.id(),
              name: newValue.inputValue,
              status: 'available',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
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
              status: 'available',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
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
          } else {
            setHasEdit(false);
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
          props.handleRemoveNeighborhood(value.id);
          setValue(null);
        }}
      >
        Deletar
      </Button>
    </div>
  )
}