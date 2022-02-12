/**
 * @description Input -> Seleciona um Motivo de Falta
 * @author GuilhermeSantos001
 * @update 11/02/2022
 */

import { useState } from 'react';
import { Autocomplete, TextField, createFilterOptions, Button } from '@mui/material'

import { AutocompleteLoading } from '@/components/utils/AutocompleteLoading';
import { AutocompleteError } from '@/components/utils/AutocompleteError';

import { ReasonForAbsenceType } from '@/types/ReasonForAbsenceType'

import {
  useReasonForAbsenceService,
  DataReasonForAbsence,
  FunctionCreateReasonForAbsenceTypeof
} from '@/services/useReasonForAbsenceService'

import {
  useReasonForAbsencesService,
  FunctionUpdateReasonForAbsencesTypeof,
  FunctionDeleteReasonForAbsencesTypeof
} from '@/services/useReasonForAbsencesService'

import Alerting from '@/src/utils/alerting';

export type Props = {
  id?: string
  disabled?: boolean
  handleChangeId: (id: string) => void
}

export type FilmOptionType = Pick<ReasonForAbsenceType, 'id' | 'value'> & {
  inputValue?: string;
  inputUpdate?: boolean;
}

const filter = createFilterOptions<FilmOptionType>();

export function SelectReasonForAbsence(props: Props) {
  const [syncData, setSyncData] = useState<boolean>(false);

  const [value, setValue] = useState<FilmOptionType | null>(null);
  const [hasEdit, setHasEdit] = useState<boolean>(false);
  const [editValue, setEditValue] = useState<string>('');

  const { data: reasonForAbsence, isLoading: isLoadingReasonForAbsence, create: CreateReasonForAbsence } = useReasonForAbsenceService(props.id);
  const { data: reasonForAbsences, isLoading: isLoadingReasonForAbsences, update: UpdateReasonForAbsences, delete: DeleteReasonForAbsences } = useReasonForAbsencesService();

  const
    handleAppendReasonForAbsence: FunctionCreateReasonForAbsenceTypeof = async (data: DataReasonForAbsence) => CreateReasonForAbsence ? await CreateReasonForAbsence(data) : undefined,
    handleUpdateReasonForAbsence: FunctionUpdateReasonForAbsencesTypeof = async (id: string, data: DataReasonForAbsence) => UpdateReasonForAbsences ? await UpdateReasonForAbsences(id, data) : false,
    handleRemoveReasonForAbsence: FunctionDeleteReasonForAbsencesTypeof = async (id: string) => DeleteReasonForAbsences ? await DeleteReasonForAbsences(id) : false;

  if (!value && hasEdit)
    setHasEdit(false);

  if (isLoadingReasonForAbsence && !syncData || isLoadingReasonForAbsences && !props.id && !syncData)
    return <AutocompleteLoading label='Motivo da Falta' message='Carregando...' />

  if (!syncData && reasonForAbsence || !syncData && !props.id && reasonForAbsences) {
    if (reasonForAbsence) {
      setValue({
        id: reasonForAbsence.id,
        value: reasonForAbsence.value,
      });
    }

    setSyncData(true);
  } else if (!syncData && !reasonForAbsence || !syncData && !props.id && !reasonForAbsences) {
    return <AutocompleteError label='Motivo da Falta' message='Ocorreu um erro' />
  }

  return (
    <div className='d-flex flex-column flex-md-row'>
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
                  const reasonForAbsence = reasonForAbsences.find(reasonForAbsence => reasonForAbsence.value === editValue);

                  if (reasonForAbsence) {
                    const update: FilmOptionType = {
                      id: reasonForAbsence.id,
                      value: editValue,
                    };

                    setValue(update);
                    handleUpdateReasonForAbsence(reasonForAbsence.id, { value: editValue });
                    props.handleChangeId(reasonForAbsence.id);
                  }
                } else {
                  if (reasonForAbsences.filter(reasonForAbsence => reasonForAbsence.value === newValue).length <= 0) {
                    handleAppendReasonForAbsence({ value: value.value });
                  } else {
                    const reasonForAbsence = reasonForAbsences.find(reasonForAbsence => reasonForAbsence.value === newValue);

                    if (reasonForAbsence) {
                      setValue({
                        id: reasonForAbsence.id,
                        value: reasonForAbsence.value
                      });
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
                value: newValue.inputValue,
              };

            if (!newValue.inputUpdate) {
              const append = await handleAppendReasonForAbsence({ value: reasonForAbsence.value });

              if (append) {
                const { data } = append;
                reasonForAbsence.id = data.id;
              }
            } else {
              handleUpdateReasonForAbsence(reasonForAbsence.id, { value: reasonForAbsence.value });
            }

            setValue(reasonForAbsence);
            props.handleChangeId(reasonForAbsence.id);
          } else {
            if (!newValue && props.id) {
              newValue = {
                id: props.id,
                value: reasonForAbsence?.value || '???'
              }
            }

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
          <TextField {...params} label="Motivo da Falta" />
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
                value: reasonForAbsence?.value || '???'
              })
            } else {
              setValue(null);
            }

            handleRemoveReasonForAbsence(value.id);
            props.handleChangeId('');
          } else {
            Alerting.create('info', 'Não é possível remover o motivo de falta sendo usado pelo registro.');
          }
        }}
      >
        Deletar
      </Button>
    </div>
  )
}