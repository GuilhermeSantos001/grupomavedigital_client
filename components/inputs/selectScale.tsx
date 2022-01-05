/**
 * @description Input -> Seleciona uma escala de trabalho
 * @author @GuilhermeSantos001
 * @update 05/01/2022
 */

import * as React from 'react';
import { Autocomplete, TextField, createFilterOptions, Button } from '@mui/material'

import { useAppSelector } from '@/app/hooks'

import StringEx from '@/src/utils/stringEx'

import type {
  Scale
} from '@/app/features/system/system.slice'

export type Props = {
  scales: Scale[]
  scale?: FilmOptionType
  handleChangeScale: (id: string) => void
  handleAppendScale: (scale: Scale) => void
  handleUpdateScale: (scale: Scale) => void
  handleRemoveScale: (id: string) => void
}

export type FilmOptionType = Scale & {
  inputValue?: string;
  inputUpdate?: boolean;
}

const filter = createFilterOptions<FilmOptionType>();

export default function SelectScale(props: Props) {
  const [value, setValue] = React.useState<FilmOptionType | null>(props.scale || null);
  const [hasEdit, setHasEdit] = React.useState<boolean>(false);
  const [editValue, setEditValue] = React.useState<string>('');

  const
    people = useAppSelector((state) => state.system.people || []),
    workplaces = useAppSelector((state) => state.system.workplaces || []);

  const canDeleteScale = (itemId: string) => {
    const
      person = people.find((item) => item.scale === itemId),
      workplace = workplaces.find((item) => item.scale === itemId);

    return person === undefined && workplace === undefined;
  }

  if (!value && hasEdit)
    setHasEdit(false);

  return (
    <div className='d-flex flex-column flex-md-row'>
      <Autocomplete
        className='col-12 col-md-10 mb-2 mb-md-0 me-md-2'
        value={value}
        onChange={(event: any, newValue) => {
          if (typeof newValue === 'string') {
            const value: Scale = {
              id: StringEx.id(),
              value: newValue,
            };

            setValue(value);

            if (String(event.type).toLowerCase() === 'keydown') {
              if (
                String(event.code).toLowerCase() === 'enter' ||
                String(event.code).toLowerCase() === 'numpadenter'
              ) {
                if (hasEdit) {
                  const scale = props.scales.find(scale => scale.id === editValue);

                  if (scale) {
                    const update: Scale = {
                      ...scale,
                      value: newValue
                    };

                    setValue(update);

                    props.handleUpdateScale(update);
                    props.handleChangeScale(update.id);
                  }
                } else {
                  if (props.scales.filter(scale => scale.value === newValue).length <= 0) {
                    props.handleAppendScale(value);
                    props.handleChangeScale(value.id);
                  } else {
                    const scale = props.scales.find(scale => scale.value === newValue);

                    if (scale) {
                      setValue(scale);
                      props.handleChangeScale(scale.id)
                    }
                  }
                }
              }
            }
          } else if (newValue && newValue.inputValue) {
            // Create a new value from the user input
            const scale: Scale = {
              id: hasEdit ? value.id : StringEx.id(),
              value: newValue.inputValue,
            };

            setValue(scale);

            if (!newValue.inputUpdate) {
              props.handleAppendScale(scale);
            } else {
              props.handleUpdateScale(scale);
            }

            props.handleChangeScale(scale.id);
          } else {
            setValue(newValue);

            props.handleChangeScale(newValue ? newValue.id : '');
          }
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);

          const { inputValue } = params;

          // Suggest the creation of a new value
          const isExisting = options.some((option) => inputValue === option.value);

          if (inputValue !== '' && !isExisting) {
            filtered.push({
              id: hasEdit ? value.id : StringEx.id(),
              value: hasEdit ? `Atualizar "${value.value}" para "${inputValue}"` : `Adicionar "${inputValue}"`,
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
        options={props.scales.map(scale => {
          return { ...scale, inputValue: '', inputUpdate: false }
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
          <TextField {...params} label="Escala de Trabalho" />
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
        disabled={hasEdit || !value || !canDeleteScale(value.id)}
        onClick={() => {
          setValue(null);
          props.handleChangeScale('');
          props.handleRemoveScale(value.id);
        }}
      >
        Deletar
      </Button>
    </div>
  )
}