import { useState } from 'react';
import { Autocomplete, TextField, createFilterOptions, Button } from '@mui/material'

import { AutocompleteLoading } from '@/components/utils/AutocompleteLoading';
import { AutocompleteError } from '@/components/utils/AutocompleteError';

import type { ScaleType } from '@/types/ScaleType'

import type {
  DataScale,
  FunctionCreateScaleTypeof,
  FunctionUpdateScalesTypeof,
  FunctionDeleteScalesTypeof
} from '@/types/ScaleServiceType'

import {
  useScaleService
} from '@/services/useScaleService'

import {
  useScaleWithIdService
} from '@/services/useScaleWithIdService'

import {
  useScalesService
} from '@/services/useScalesService'

import Alerting from '@/src/utils/alerting';

export type Props = {
  id?: string
  disabled?: boolean
  handleChangeData?: (data: ScaleType) => void
  handleChangeId: (id: string) => void
}

export type FilmOptionType = Pick<ScaleType, 'id' | 'value'> & {
  inputValue?: string;
  inputUpdate?: boolean;
}

const filter = createFilterOptions<FilmOptionType>();

export function SelectScale(props: Props) {
  const [syncData, setSyncData] = useState<boolean>(false);
  const [returnData, setReturnData] = useState<boolean>(false);

  const [value, setValue] = useState<FilmOptionType | null>(null);
  const [hasEdit, setHasEdit] = useState<boolean>(false);
  const [editValue, setEditValue] = useState<string>('');

  const { create: CreateScale } = useScaleService();
  const { data: scale, isLoading: isLoadingScale } = useScaleWithIdService(props.id || '');
  const { data: scales, isLoading: isLoadingScales, update: UpdateScales, delete: DeleteScales } = useScalesService();

  const
    handleAppendScale: FunctionCreateScaleTypeof = async (data: DataScale) => CreateScale ? await CreateScale(data) : undefined,
    handleUpdateScale: FunctionUpdateScalesTypeof = async (id: string, data: DataScale) => UpdateScales ? await UpdateScales(id, data) : false,
    handleRemoveScale: FunctionDeleteScalesTypeof = async (id: string) => DeleteScales ? await DeleteScales(id) : false;

  if (!value && hasEdit)
    setHasEdit(false);

  if (isLoadingScale && !syncData || isLoadingScales && !props.id && !syncData)
    return <AutocompleteLoading label='Escala de Trabalho' message='Carregando...' />

  if (!syncData && scale || !syncData && !props.id && scales) {
    if (scale) {
      setValue({
        id: scale.id,
        value: scale.value,
      });
    }

    setSyncData(true);
  } else if (!syncData && !scale || !syncData && !props.id && !scales) {
    return <AutocompleteError label='Escala de Trabalho' message='Ocorreu um erro' />
  }

  if (props.id && props.handleChangeData && returnData) {
    const scale = scales.find(scale => scale.id === props.id);

    if (scale)
      props.handleChangeData(scale);

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
                    setReturnData(true);
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
                      setReturnData(true);
                      props.handleChangeId(scale.id);
                    }
                  }
                }
              }
            }
          } else if (newValue && newValue.inputValue) {
            // Create a new value from the user input
            const
              scale: FilmOptionType = {
                id: hasEdit ? value?.id || '' : '',
                value: newValue.inputValue,
              };

            if (!newValue.inputUpdate) {
              const append = await handleAppendScale({ value: scale.value });

              if (append) {
                const { data } = append;
                scale.id = data.id;
              }
            } else {
              handleUpdateScale(scale.id, { value: scale.value });
            }

            setValue(scale);
            setReturnData(true);
            props.handleChangeId(scale.id);
          } else {
            if (!newValue && props.id) {
              newValue = {
                id: props.id,
                value: scale?.value || '???'
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
          if (value && value.id !== props.id) {
            if (props.id) {
              setValue({
                id: props.id,
                value: scale?.value || '???'
              })
            } else {
              setValue(null);
            }

            handleRemoveScale(value.id);
            setReturnData(true);
            props.handleChangeId('');
          } else {
            Alerting.create('info', 'Não é possível remover a escala de trabalho sendo usada pelo registro.');
          }
        }}
      >
        Deletar
      </Button>
    </div>
  )
}