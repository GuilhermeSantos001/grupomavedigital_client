import { useState, memo } from 'react';
import { Autocomplete, TextField, createFilterOptions, Button } from '@mui/material'

import { AutocompleteLoading } from '@/components/utils/AutocompleteLoading';
import { AutocompleteError } from '@/components/utils/AutocompleteError';

import Alerting from '@/src/utils/alerting';
import StringEx from '@/src/utils/stringEx'

import type {
  DataScale,
  FunctionCreateScaleTypeof,
  FunctionUpdateScalesTypeof,
  FunctionDeleteScalesTypeof
} from '@/types/ScaleServiceType'

import type { ScaleType } from '@/types/ScaleType'

export type Props = {
  createScale: FunctionCreateScaleTypeof
  scale?: ScaleType
  isLoadingScale?: boolean
  scales: ScaleType[]
  updateScales: FunctionUpdateScalesTypeof
  deleteScales: FunctionDeleteScalesTypeof
  isLoadingScales: boolean
  disabled?: boolean
  handleChangeData?: (data: ScaleType) => void
  handleChangeId: (id: string) => void
}

export type FilmOptionType = Pick<ScaleType, 'id' | 'value'> & {
  inputValue?: string;
  inputUpdate?: boolean;
}

const filter = createFilterOptions<FilmOptionType>();

 function Component(props: Props) {
  const [syncData, setSyncData] = useState<boolean>(false);
  const [returnData, setReturnData] = useState<boolean>(false);

  const [value, setValue] = useState<FilmOptionType | null>(null);
  const [hasEdit, setHasEdit] = useState<boolean>(false);
  const [editValue, setEditValue] = useState<string>('');

  const {
    createScale,
    scale,
    isLoadingScale,
    scales,
    updateScales,
    deleteScales,
    isLoadingScales,
  } = props;

  const
    handleAppendScale: FunctionCreateScaleTypeof = async (data: DataScale) => createScale ? await createScale(data) : undefined,
    handleUpdateScale: FunctionUpdateScalesTypeof = async (id: string, data: DataScale) => updateScales ? await updateScales(id, data) : false,
    handleRemoveScale: FunctionDeleteScalesTypeof = async (id: string) => deleteScales ? await deleteScales(id) : false;

  if (!value && hasEdit)
    setHasEdit(false);

  if (isLoadingScale && !syncData || isLoadingScales && !syncData)
    return <AutocompleteLoading label='Escala de Trabalho' message='Carregando...' />

  if (!syncData && scale || !syncData && scales) {
    if (scale) {
      setValue({
        id: scale.id,
        value: scale.value,
      });
    }

    setSyncData(true);
  } else if (!syncData && !scale || !syncData && !scales) {
    return <AutocompleteError label='Escala de Trabalho' message='Ocorreu um erro' />
  }

  if (scale && props.handleChangeData && returnData) {
    const updateScale = scales.find(scale => scale.id === scale.id);

    if (updateScale)
      props.handleChangeData(updateScale);

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
            if (StringEx.trim(newValue).length <= 0)
              return Alerting.create('warning', 'Por favor, informe um valor válido.');
          } else if (newValue) {
            const inputValue = newValue.inputValue ? newValue.inputValue : newValue.value;
            if (StringEx.trim(inputValue).length <= 0)
              return Alerting.create('warning', 'Por favor, informe um valor válido.');
          }

          if (typeof newValue === 'string') {
            const value: FilmOptionType = {
              id: '',
              value: StringEx.trim(newValue),
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
                  if (scales.filter(scale => scale.value === value.value).length <= 0) {
                    handleAppendScale({ value: value.value });
                  } else {
                    const scale = scales.find(scale => scale.value === value.value);

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
                value: StringEx.trim(newValue.inputValue),
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
          if (props.scale && value && props.scale.id === value.id)
            return Alerting.create('info', 'Não é possível remover a escala de trabalho sendo usada pelo registro.');

          if (value) {
            if (props.scale) {
              setValue({
                id: props.scale.id,
                value: scale?.value || '???'
              })
            } else {
              setValue(null);
            }

            handleRemoveScale(value.id);
            setReturnData(true);
            props.handleChangeId('');
          }
        }}
      >
        Deletar
      </Button>
    </div>
  )
}

export const SelectScale = memo(Component, (prevStates, nextStates) => {
  if (
    prevStates.scale?.value !== nextStates.scale?.value
    || prevStates.scales.length <= 0 || nextStates.scales.length <= 0
    || prevStates.scales.length !== nextStates.scales.length
    || JSON.stringify(prevStates.scales) !== JSON.stringify(nextStates.scales)
  )
    return false;

  return true;
});