/**
 * @description Input -> Seleciona um centro de custo
 * @author GuilhermeSantos001
 * @update 07/02/2022
 */

import { useState } from 'react';
import { Autocomplete, TextField, createFilterOptions, Button } from '@mui/material'

import { useAppSelector, useAppDispatch } from '@/app/hooks'

import Alerting from '@/src/utils/alerting'
import StringEx from '@/src/utils/stringEx'

import {
  CostCenter,
  SystemActions,
} from '@/app/features/system/system.slice'

export type Props = {
  costCenter?: FilmOptionType
  disabled?: boolean
  handleChangeCostCenter: (id: string) => void
}

export type FilmOptionType = CostCenter & {
  inputValue?: string;
  inputUpdate?: boolean;
}

const filter = createFilterOptions<FilmOptionType>();

export default function SelectCostCenter(props: Props) {
  const [value, setValue] = useState<FilmOptionType | null>(props.costCenter || null);
  const [hasEdit, setHasEdit] = useState<boolean>(false);
  const [editValue, setEditValue] = useState<string>('');

  const
    costCenters = useAppSelector(state => state.system.costCenters),
    lotItems = useAppSelector((state) => state.payback.lotItems || []),
    postings = useAppSelector((state) => state.payback.postings || []);

  const dispatch = useAppDispatch(),
    handleAppendCostCenter = (costCenter: CostCenter) => {
      try {
        dispatch(SystemActions.CREATE_COSTCENTER(costCenter));
      } catch (error) {
        Alerting.create('error', error instanceof Error ? error.message : JSON.stringify(error));
      }
    },
    handleUpdateCostCenter = (costCenter: CostCenter) => {
      try {
        dispatch(SystemActions.UPDATE_COSTCENTER(costCenter));
      } catch (error) {
        Alerting.create('error', error instanceof Error ? error.message : JSON.stringify(error));
      }
    },
    handleRemoveCostCenter = (id: string) => {
      try {
        dispatch(SystemActions.DELETE_COSTCENTER(id));
      } catch (error) {
        Alerting.create('error', error instanceof Error ? error.message : JSON.stringify(error));
      }
    },
    canDeleteCostCenter = (id: string) => {
      if (
        lotItems.filter(lotItem => lotItem.costCenter === id).length > 0 ||
        postings.filter(posting => posting.costCenter === id).length > 0
      )
        return false;

      return true;
    }

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
            const value: CostCenter = {
              id: StringEx.id(),
              title: newValue,
            };

            setValue(value);

            if (String(event.type).toLowerCase() === 'keydown') {
              if (
                String(event.code).toLowerCase() === 'enter' ||
                String(event.code).toLowerCase() === 'numpadenter'
              ) {
                if (hasEdit) {
                  const costCenter = costCenters.find(costCenter => costCenter.id === editValue);

                  if (costCenter) {
                    const update: CostCenter = {
                      ...costCenter,
                      title: newValue
                    };

                    setValue(update);
                    handleUpdateCostCenter(update);

                    props.handleChangeCostCenter(update.id);
                  }
                } else {
                  if (costCenters.filter(costCenter => costCenter.title === newValue).length <= 0) {
                    handleAppendCostCenter(value);
                    props.handleChangeCostCenter(value.id);
                  } else {
                    const costcenter = costCenters.find(costCenter => costCenter.title === newValue);

                    if (costcenter) {
                      setValue(costcenter);
                      props.handleChangeCostCenter(costcenter.id)
                    }
                  }
                }
              }
            }
          } else if (newValue && newValue.inputValue) {
            // Create a new value from the user input
            const
              valueId = StringEx.id(),
              costCenter: CostCenter = {
                id: hasEdit ? value?.id || valueId : valueId,
                title: newValue.inputValue,
              };

            setValue(costCenter);

            if (!newValue.inputUpdate) {
              handleAppendCostCenter(costCenter);
            } else {
              handleUpdateCostCenter(costCenter);
            }

            props.handleChangeCostCenter(costCenter.id);
          } else {
            setValue(newValue);

            props.handleChangeCostCenter(newValue ? newValue.id : '');
          }
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);

          const { inputValue } = params;

          // Suggest the creation of a new value
          const isExisting = options.some((option) => inputValue === option.title);

          if (inputValue !== '' && !isExisting) {
            const valueId = StringEx.id();

            filtered.push({
              id: hasEdit ? value?.id || valueId : valueId,
              title: hasEdit ? `Atualizar "${value?.title || "???"}" para "${inputValue}"` : `Adicionar "${inputValue}"`,
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
        options={costCenters.map(costCenter => {
          return { ...costCenter, inputValue: '', inputUpdate: false }
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
          return option.title;
        }}
        renderOption={(props, option) => <li {...props}>{option.title}</li>}
        freeSolo
        renderInput={(params) => (
          <TextField {...params} label="Centro de Custo" />
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
        disabled={props.disabled ? true : hasEdit || !value || !canDeleteCostCenter(value.id)}
        onClick={() => {
          if (value) {
            setValue(null);
            handleRemoveCostCenter(value.id);
            props.handleChangeCostCenter('');
          }
        }}
      >
        Deletar
      </Button>
    </div>
  )
}