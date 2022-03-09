import { useState, memo } from 'react';
import { Autocomplete, TextField, createFilterOptions, Button } from '@mui/material'

import { AutocompleteLoading } from '@/components/utils/AutocompleteLoading';
import { AutocompleteError } from '@/components/utils/AutocompleteError';

import Alerting from '@/src/utils/alerting';
import StringEx from '@/src/utils/stringEx'

import type {
  DataReasonForAbsence,
  FunctionCreateReasonForAbsenceTypeof,
  FunctionUpdateReasonForAbsencesTypeof,
  FunctionDeleteReasonForAbsencesTypeof
} from '@/types/ReasonForAbsenceServiceType'

import type { ReasonForAbsenceType } from '@/types/ReasonForAbsenceType'

export type Props = {
  createReasonForAbsence: FunctionCreateReasonForAbsenceTypeof
  reasonForAbsence?: ReasonForAbsenceType
  isLoadingReasonForAbsence?: boolean
  reasonForAbsences: ReasonForAbsenceType[]
  updateReasonForAbsences: FunctionUpdateReasonForAbsencesTypeof
  deleteReasonForAbsences: FunctionDeleteReasonForAbsencesTypeof
  isLoadingReasonForAbsences: boolean
  disabled?: boolean
  handleChangeData?: (data: ReasonForAbsenceType) => void
  handleChangeId: (id: string) => void
}

export type FilmOptionType = Pick<ReasonForAbsenceType, 'id' | 'value'> & {
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
    createReasonForAbsence,
    reasonForAbsence,
    isLoadingReasonForAbsence,
    reasonForAbsences,
    updateReasonForAbsences,
    deleteReasonForAbsences,
    isLoadingReasonForAbsences,
  } = props;

  const
    handleAppendCity: FunctionCreateReasonForAbsenceTypeof = async (data: DataReasonForAbsence) => createReasonForAbsence ? await createReasonForAbsence(data) : undefined,
    handleUpdateCity: FunctionUpdateReasonForAbsencesTypeof = async (id: string, data: DataReasonForAbsence) => updateReasonForAbsences ? await updateReasonForAbsences(id, data) : false,
    handleRemoveCity: FunctionDeleteReasonForAbsencesTypeof = async (id: string) => deleteReasonForAbsences ? await deleteReasonForAbsences(id) : false;

  if (!value && hasEdit)
    setHasEdit(false);

  if (isLoadingReasonForAbsence && !syncData || isLoadingReasonForAbsences && !syncData)
    return <AutocompleteLoading label='Motivo de Falta' message='Carregando...' />

  if (!syncData && reasonForAbsence || !syncData && reasonForAbsences) {
    if (reasonForAbsence) {
      setValue({
        id: reasonForAbsence.id,
        value: reasonForAbsence.value,
      });
    }

    setSyncData(true);
  } else if (!syncData && !reasonForAbsence || !syncData && !reasonForAbsences) {
    return <AutocompleteError label='Motivo de Falta' message='Ocorreu um erro' />
  }

  if (reasonForAbsence && props.handleChangeData && returnData) {
    const updateReasonForAbsence = reasonForAbsences.find(reasonForAbsence => reasonForAbsence.id === reasonForAbsence.id);

    if (updateReasonForAbsence)
      props.handleChangeData(updateReasonForAbsence);

    setReturnData(false);
  }

  return (
    <div className='d-flex flex-column flex-md-row'>
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
                  const reasonForAbsence = reasonForAbsences.find(reasonForAbsence => reasonForAbsence.value === editValue);

                  if (reasonForAbsence) {
                    const update: FilmOptionType = {
                      id: reasonForAbsence.id,
                      value: editValue,
                    };

                    setValue(update);
                    setReturnData(true);
                    handleUpdateCity(reasonForAbsence.id, { value: editValue });
                    props.handleChangeId(reasonForAbsence.id);
                  }
                } else {
                  if (reasonForAbsences.filter(reasonForAbsence => reasonForAbsence.value === value.value).length <= 0) {
                    handleAppendCity({ value: value.value });
                  } else {
                    const reasonForAbsence = reasonForAbsences.find(reasonForAbsence => reasonForAbsence.value === value.value);

                    if (reasonForAbsence) {
                      setValue({
                        id: reasonForAbsence.id,
                        value: reasonForAbsence.value
                      });
                      setReturnData(true);
                      props.handleChangeId(reasonForAbsence.id);
                    }
                  }
                }
              }
            }
          } else if (newValue && newValue.inputValue) {
            // Create a new value from the user input
            const
              reasonForAbsence: FilmOptionType = {
                id: hasEdit ? value?.id || '' : '',
                value: StringEx.trim(newValue.inputValue),
              };

            if (!newValue.inputUpdate) {
              const append = await handleAppendCity({ value: reasonForAbsence.value });

              if (append) {
                const { data } = append;
                reasonForAbsence.id = data.id;
              }
            } else {
              handleUpdateCity(reasonForAbsence.id, { value: reasonForAbsence.value });
            }

            setValue(reasonForAbsence);
            setReturnData(true);
            props.handleChangeId(reasonForAbsence.id);
          } else {
            if (!newValue && props.reasonForAbsence) {
              newValue = {
                id: props.reasonForAbsence.id,
                value: reasonForAbsence?.value || '???'
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
        options={reasonForAbsences.map(reasonForAbsence => {
          return { ...reasonForAbsence, inputValue: '', inputUpdate: false }
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
          <TextField {...params} label="Motivo de Falta" />
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
          if (props.reasonForAbsence && value && props.reasonForAbsence.id === value.id)
            return Alerting.create('info', 'Não é possível remover o motive de falta sendo usado pelo registro.');

          if (value) {
            if (props.reasonForAbsence) {
              setValue({
                id: props.reasonForAbsence.id,
                value: reasonForAbsence?.value || '???'
              })
            } else {
              setValue(null);
            }

            handleRemoveCity(value.id);
            setReturnData(true);
            props.handleChangeId('');
          } else {
          }
        }}
      >
        Deletar
      </Button>
    </div>
  )
}

export const SelectReasonForAbsence = memo(Component, (prevStates, nextStates) => {
  if (
    prevStates.reasonForAbsence?.value !== nextStates.reasonForAbsence?.value
    || prevStates.reasonForAbsences.length !== nextStates.reasonForAbsences.length
  )
    return false;

  return true;
});