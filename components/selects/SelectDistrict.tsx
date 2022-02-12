/**
 * @description Input -> Seleciona um distrito (Estado)
 * @author GuilhermeSantos001
 * @update 11/02/2022
 */

import { useState } from 'react';
import { Autocomplete, TextField, createFilterOptions, Button } from '@mui/material'

import { AutocompleteLoading } from '@/components/utils/AutocompleteLoading';
import { AutocompleteError } from '@/components/utils/AutocompleteError';

import { DistrictType } from '@/types/DistrictType'

import {
  useDistrictService,
  DataDistrict,
  FunctionCreateDistrictTypeof
} from '@/services/useDistrictService'

import {
  useDistrictsService,
  FunctionUpdateDistrictsTypeof,
  FunctionDeleteDistrictsTypeof
} from '@/services/useDistrictsService'

import Alerting from '@/src/utils/alerting';

export type Props = {
  id?: string
  disabled?: boolean
  handleChangeId: (id: string) => void
}

export type FilmOptionType = Pick<DistrictType, 'id' | 'value'> & {
  inputValue?: string;
  inputUpdate?: boolean;
}

const filter = createFilterOptions<FilmOptionType>();

export function SelectDistrict(props: Props) {
  const [syncData, setSyncData] = useState<boolean>(false);

  const [value, setValue] = useState<FilmOptionType | null>(null);
  const [hasEdit, setHasEdit] = useState<boolean>(false);
  const [editValue, setEditValue] = useState<string>('');

  const { data: district, isLoading: isLoadingDistrict, create: CreateDistrict } = useDistrictService(props.id);
  const { data: districts, isLoading: isLoadingDistricts, update: UpdateDistricts, delete: DeleteDistricts } = useDistrictsService();

  const
    handleAppendDistrict: FunctionCreateDistrictTypeof = async (data: DataDistrict) => CreateDistrict ? await CreateDistrict(data) : undefined,
    handleUpdateDistrict: FunctionUpdateDistrictsTypeof = async (id: string, data: DataDistrict) => UpdateDistricts ? await UpdateDistricts(id, data) : false,
    handleRemoveDistrict: FunctionDeleteDistrictsTypeof = async (id: string) => DeleteDistricts ? await DeleteDistricts(id) : false;

  if (!value && hasEdit)
    setHasEdit(false);

  if (isLoadingDistrict && !syncData || isLoadingDistricts && !props.id && !syncData)
    return <AutocompleteLoading label='Estado' message='Carregando...' />

  if (!syncData && district || !syncData && !props.id && districts) {
    if (district) {
      setValue({
        id: district.id,
        value: district.value,
      });
    }

    setSyncData(true);
  } else if (!syncData && !district || !syncData && !props.id && !districts) {
    return <AutocompleteError label='Estado' message='Ocorreu um erro' />
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
                  const district = districts.find(district => district.value === editValue);

                  if (district) {
                    const update: FilmOptionType = {
                      id: district.id,
                      value: editValue,
                    };

                    setValue(update);
                    handleUpdateDistrict(district.id, { value: editValue });
                    props.handleChangeId(district.id);
                  }
                } else {
                  if (districts.filter(district => district.value === newValue).length <= 0) {
                    handleAppendDistrict({ value: value.value });
                  } else {
                    const district = districts.find(district => district.value === newValue);

                    if (district) {
                      setValue({
                        id: district.id,
                        value: district.value
                      });
                      props.handleChangeId(district.id);
                    }
                  }
                }
              }
            }
          } else if (newValue && newValue.inputValue) {
            // Create a new value from the user input
            const
              district: FilmOptionType = {
                id: hasEdit ? value?.id || '' : '',
                value: newValue.inputValue,
              };

            if (!newValue.inputUpdate) {
              const append = await handleAppendDistrict({ value: district.value });

              if (append) {
                const { data } = append;
                district.id = data.id;
              }
            } else {
              handleUpdateDistrict(district.id, { value: district.value });
            }

            setValue(district);
            props.handleChangeId(district.id);
          } else {
            if (!newValue && props.id) {
              newValue = {
                id: props.id,
                value: district?.value || '???'
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
        options={districts.map(district => {
          return { ...district, inputValue: '', inputUpdate: false }
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
          <TextField {...params} label="Estado" />
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
                value: district?.value || '???'
              })
            } else {
              setValue(null);
            }

            handleRemoveDistrict(value.id);
            props.handleChangeId('');
          } else {
            Alerting.create('info', 'Não é possível remover o estado sendo usado pelo registro.');
          }
        }}
      >
        Deletar
      </Button>
    </div>
  )
}