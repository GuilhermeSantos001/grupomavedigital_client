/**
 * @description Input -> Seleciona um Motivo de Falta
 * @author GuilhermeSantos001
 * @update 10/01/2022
 */

import { useState } from 'react';
import { Autocomplete, TextField, createFilterOptions, Button } from '@mui/material'

import { useAppSelector, useAppDispatch } from '@/app/hooks'

import StringEx from '@/src/utils/stringEx'

import {
  ReasonForAbsence,
  appendReasonForAbsence,
  editReasonForAbsence,
  removeReasonForAbsence,
} from '@/app/features/system/system.slice'

export type Props = {
  reasonForAbsence?: FilmOptionType
  handleChangeReasonForAbsence: (id: string) => void
}

export type FilmOptionType = ReasonForAbsence & {
  inputValue?: string;
  inputUpdate?: boolean;
}

const filter = createFilterOptions<FilmOptionType>();

export default function selectReasonForAbsence(props: Props) {
  const [value, setValue] = useState<FilmOptionType | null>(props.reasonForAbsence || null);
  const [hasEdit, setHasEdit] = useState<boolean>(false);
  const [editValue, setEditValue] = useState<string>('');

  const
    reasonForAbsences = useAppSelector(state => state.system.reasonForAbsences || []),
    postings = useAppSelector((state) => state.payback.postings || []);

  const
    dispatch = useAppDispatch(),
    handleAppendReasonForAbsence = (reasonForAbsence: ReasonForAbsence) => dispatch(appendReasonForAbsence(reasonForAbsence)),
    handleUpdateReasonForAbsence = (reasonForAbsence: ReasonForAbsence) => dispatch(editReasonForAbsence(reasonForAbsence)),
    handleRemoveReasonForAbsence = (id: string) => dispatch(removeReasonForAbsence(id));

  const canDeleteReasonForAbsence = (itemId: string) => {
    const
      posting = postings.find((item) => item.covering.reasonForAbsence === itemId);

    return posting === undefined;
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
            const value: ReasonForAbsence = {
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
                  const reasonForAbsence = reasonForAbsences.find(reasonForAbsence => reasonForAbsence.id === editValue);

                  if (reasonForAbsence) {
                    const update: ReasonForAbsence = {
                      ...reasonForAbsence,
                      value: newValue
                    };

                    setValue(update);

                    handleUpdateReasonForAbsence(update);
                    props.handleChangeReasonForAbsence(update.id);
                  }
                } else {
                  if (reasonForAbsences.filter(reasonForAbsence => reasonForAbsence.value === newValue).length <= 0) {
                    handleAppendReasonForAbsence(value);
                    props.handleChangeReasonForAbsence(value.id);
                  } else {
                    const reasonForAbsence = reasonForAbsences.find(reasonForAbsence => reasonForAbsence.value === newValue);

                    if (reasonForAbsence) {
                      setValue(reasonForAbsence);
                      props.handleChangeReasonForAbsence(reasonForAbsence.id)
                    }
                  }
                }
              }
            }
          } else if (newValue && newValue.inputValue) {
            // Create a new value from the user input
            const reasonForAbsence: ReasonForAbsence = {
              id: hasEdit ? value.id : StringEx.id(),
              value: newValue.inputValue,
            };

            setValue(reasonForAbsence);

            if (!newValue.inputUpdate) {
              handleAppendReasonForAbsence(reasonForAbsence);
            } else {
              handleUpdateReasonForAbsence(reasonForAbsence);
            }

            props.handleChangeReasonForAbsence(reasonForAbsence.id);
          } else {
            setValue(newValue);

            props.handleChangeReasonForAbsence(newValue ? newValue.id : '');
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
        disabled={hasEdit || !value || !canDeleteReasonForAbsence(value.id)}
        onClick={() => {
          setValue(null);
          handleRemoveReasonForAbsence(value.id);
          props.handleChangeReasonForAbsence('');
        }}
      >
        Deletar
      </Button>
    </div>
  )
}