/**
 * @description Input -> Seleciona um bairro
 * @author GuilhermeSantos001
 * @update 09/02/2022
 */

import { useState } from 'react';
import { Autocomplete, TextField, createFilterOptions, Button } from '@mui/material'

import { NeighborhoodType } from '@/types/NeighborhoodType'

import {
  useNeighborhoodService,
  DataNeighborhood,
  FunctionCreateNeighborhoodTypeof
} from '@/services/useNeighborhoodService'

import {
  useNeighborhoodsService,
  FunctionUpdateNeighborhoodsTypeof,
  FunctionDeleteNeighborhoodsTypeof
} from '@/services/useNeighborhoodsService'

export type Props = {
  id?: string
  disabled?: boolean
  handleChangeId: (id: string) => void
}

export type FilmOptionType = Pick<NeighborhoodType, 'id' | 'value'> & {
  inputValue?: string;
  inputUpdate?: boolean;
}

const filter = createFilterOptions<FilmOptionType>();

export function SelectNeighborhood(props: Props) {
  const { data: neighborhood, create: CreateNeighborhood } = useNeighborhoodService(props.id);
  const { data: neighborhoods, update: UpdateNeighborhoods, delete: DeleteNeighborhoods } = useNeighborhoodsService();

  const [value, setValue] = useState<FilmOptionType | null>(neighborhood || null);
  const [hasEdit, setHasEdit] = useState<boolean>(false);
  const [editValue, setEditValue] = useState<string>('');

  const
    handleAppendNeighborhood: FunctionCreateNeighborhoodTypeof = async (data: DataNeighborhood) => CreateNeighborhood ? await CreateNeighborhood(data) : undefined,
    handleUpdateNeighborhood: FunctionUpdateNeighborhoodsTypeof = async (id: string, data: DataNeighborhood) => UpdateNeighborhoods ? await UpdateNeighborhoods(id, data) : false,
    handleRemoveNeighborhood: FunctionDeleteNeighborhoodsTypeof = async (id: string) => DeleteNeighborhoods ? await DeleteNeighborhoods(id) : false;

  if (!value && hasEdit)
    setHasEdit(false);

  return (
    <div className='d-flex flex-column flex-md-row'>
      <Autocomplete
        className='col-12 col-md-10 mb-2 mb-md-0 me-md-2'
        value={value}
        disabled={props.disabled !== undefined ? props.disabled : false}
        onChange={(event: any, newValue) => {
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
                  const neighborhood = neighborhoods.find(neighborhood => neighborhood.value === editValue);

                  if (neighborhood) {
                    const update: FilmOptionType = {
                      id: neighborhood.id,
                      value: editValue,
                    };

                    setValue(update);
                    handleUpdateNeighborhood(neighborhood.id, { value: editValue });
                    props.handleChangeId(neighborhood.id);
                  }
                } else {
                  if (neighborhoods.filter(neighborhood => neighborhood.value === newValue).length <= 0) {
                    handleAppendNeighborhood({ value: value.value });
                  } else {
                    const neighborhood = neighborhoods.find(neighborhood => neighborhood.value === newValue);

                    if (neighborhood) {
                      setValue({
                        id: neighborhood.id,
                        value: neighborhood.value
                      });
                      props.handleChangeId(neighborhood.id);
                    }
                  }
                }
              }
            }
          } else if (newValue && newValue.inputValue) {
            // Create a new value from the user input
            const
              valueId = '',
              neighborhood: FilmOptionType = {
                id: hasEdit ? value?.id || valueId : valueId,
                value: newValue.inputValue,
              };

            setValue(neighborhood);
            props.handleChangeId(neighborhood.id);

            if (!newValue.inputUpdate) {
              handleAppendNeighborhood({ value: neighborhood.value });
            } else {
              handleUpdateNeighborhood(neighborhood.id, { value: neighborhood.value });
            }
          } else {
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
        options={neighborhoods.map(neighborhood => {
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
          return option.value;
        }}
        renderOption={(props, option) => <li {...props}>{option.value}</li>}
        freeSolo
        renderInput={(params) => (
          <TextField {...params} label="Bairro" />
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
          if (value) {
            setValue(null);
            handleRemoveNeighborhood(value.id);
            props.handleChangeId('');
          }
        }}
      >
        Deletar
      </Button>
    </div>
  )
}