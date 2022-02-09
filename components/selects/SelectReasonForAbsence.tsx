/**
 * @description Input -> Seleciona um Motivo de Falta
 * @author GuilhermeSantos001
 * @update 09/02/2022
 */

import { useState } from 'react';
import { Autocomplete, TextField, createFilterOptions, Button } from '@mui/material'

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
  const { data: reasonForAbsence, create: CreateReasonForAbsence } = useReasonForAbsenceService(props.id);
  const { data: reasonForAbsences, update: UpdateReasonForAbsences, delete: DeleteReasonForAbsences } = useReasonForAbsencesService();

  const [value, setValue] = useState<FilmOptionType | null>(reasonForAbsence || null);
  const [hasEdit, setHasEdit] = useState<boolean>(false);
  const [editValue, setEditValue] = useState<string>('');

  const
    handleAppendNeighborhood: FunctionCreateReasonForAbsenceTypeof = async (data: DataReasonForAbsence) => CreateReasonForAbsence ? await CreateReasonForAbsence(data) : undefined,
    handleUpdateNeighborhood: FunctionUpdateReasonForAbsencesTypeof = async (id: string, data: DataReasonForAbsence) => UpdateReasonForAbsences ? await UpdateReasonForAbsences(id, data) : false,
    handleRemoveNeighborhood: FunctionDeleteReasonForAbsencesTypeof = async (id: string) => DeleteReasonForAbsences ? await DeleteReasonForAbsences(id) : false;

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
                  const reasonForAbsence = reasonForAbsences.find(reasonForAbsence => reasonForAbsence.value === editValue);

                  if (reasonForAbsence) {
                    const update: FilmOptionType = {
                      id: reasonForAbsence.id,
                      value: editValue,
                    };

                    setValue(update);
                    handleUpdateNeighborhood(reasonForAbsence.id, { value: editValue });
                    props.handleChangeId(reasonForAbsence.id);
                  }
                } else {
                  if (reasonForAbsences.filter(reasonForAbsence => reasonForAbsence.value === newValue).length <= 0) {
                    handleAppendNeighborhood({ value: value.value });
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
              valueId = '',
              reasonForAbsence: FilmOptionType = {
                id: hasEdit ? value?.id || valueId : valueId,
                value: newValue.inputValue,
              };

            setValue(reasonForAbsence);
            props.handleChangeId(reasonForAbsence.id);

            if (!newValue.inputUpdate) {
              handleAppendNeighborhood({ value: reasonForAbsence.value });
            } else {
              handleUpdateNeighborhood(reasonForAbsence.id, { value: reasonForAbsence.value });
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