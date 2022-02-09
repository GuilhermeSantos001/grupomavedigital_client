/**
 * @description Input -> Seleciona uma escala de trabalho
 * @author GuilhermeSantos001
 * @update 09/02/2022
 */

import { useState } from 'react';
import { Autocomplete, TextField, createFilterOptions, Button } from '@mui/material'

import { ScaleType } from '@/types/ScaleType'

import {
  useScaleService,
  DataScale,
  FunctionCreateScaleTypeof
} from '@/services/useScaleService'

import {
  useScalesService,
  FunctionUpdateScalesTypeof,
  FunctionDeleteScalesTypeof
} from '@/services/useScalesService'

export type Props = {
  id?: string
  disabled?: boolean
  handleChangeId: (id: string) => void
}

export type FilmOptionType = Pick<ScaleType, 'id' | 'value'> & {
  inputValue?: string;
  inputUpdate?: boolean;
}

const filter = createFilterOptions<FilmOptionType>();

export function SelectScale(props: Props) {
  const { data: scale, create: CreateScale } = useScaleService(props.id);
  const { data: scales, update: UpdateScales, delete: DeleteScales } = useScalesService();

  const [value, setValue] = useState<FilmOptionType | null>(scale || null);
  const [hasEdit, setHasEdit] = useState<boolean>(false);
  const [editValue, setEditValue] = useState<string>('');

  const
    handleAppendScale: FunctionCreateScaleTypeof = async (data: DataScale) => CreateScale ? await CreateScale(data) : undefined,
    handleUpdateScale: FunctionUpdateScalesTypeof = async (id: string, data: DataScale) => UpdateScales ? await UpdateScales(id, data) : false,
    handleRemoveScale: FunctionDeleteScalesTypeof = async (id: string) => DeleteScales ? await DeleteScales(id) : false;

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
                  const scale = scales.find(scale => scale.value === editValue);

                  if (scale) {
                    const update: FilmOptionType = {
                      id: scale.id,
                      value: editValue,
                    };

                    setValue(update);
                    handleUpdateScale(scale.id, { value: editValue });
                    props.handleChangeId(scale.id);
                  }
                } else {
                  if (scales.filter(scale => scale.value === newValue).length <= 0) {
                    handleAppendScale({ value: value.value });
                  } else {
                    const scale = scales.find(scale => scale.value === newValue);

                    if (scale) {
                      setValue({
                        id: scale.id,
                        value: scale.value
                      });
                      props.handleChangeId(scale.id);
                    }
                  }
                }
              }
            }
          } else if (newValue && newValue.inputValue) {
            // Create a new value from the user input
            const
              valueId = '',
              scale: FilmOptionType = {
                id: hasEdit ? value?.id || valueId : valueId,
                value: newValue.inputValue,
              };

            setValue(scale);
            props.handleChangeId(scale.id);

            if (!newValue.inputUpdate) {
              handleAppendScale({ value: scale.value });
            } else {
              handleUpdateScale(scale.id, { value: scale.value });
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
        options={scales.map(scale => {
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
            handleRemoveScale(value.id);
            props.handleChangeId('');
          }
        }}
      >
        Deletar
      </Button>
    </div>
  )
}