import { useState, memo } from 'react';
import { Autocomplete, TextField, createFilterOptions, Button } from '@mui/material'

import { AutocompleteLoading } from '@/components/utils/AutocompleteLoading';
import { AutocompleteError } from '@/components/utils/AutocompleteError';

import Alerting from '@/src/utils/alerting';
import StringEx from '@/src/utils/stringEx'

import type {
  DataDistrict,
  FunctionCreateDistrictTypeof,
  FunctionUpdateDistrictsTypeof,
  FunctionDeleteDistrictsTypeof
} from '@/types/DistrictServiceType'

import type { DistrictType } from '@/types/DistrictType'

export type Props = {
  createDistrict: FunctionCreateDistrictTypeof
  district?: DistrictType
  isLoadingDistrict?: boolean
  districts: DistrictType[]
  updateDistricts: FunctionUpdateDistrictsTypeof
  deleteDistricts: FunctionDeleteDistrictsTypeof
  isLoadingDistricts: boolean
  disabled?: boolean
  handleChangeData?: (data: DistrictType) => void
  handleChangeId: (id: string) => void
}

export type FilmOptionType = Pick<DistrictType, 'id' | 'value'> & {
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
    createDistrict,
    district,
    isLoadingDistrict,
    districts,
    updateDistricts,
    deleteDistricts,
    isLoadingDistricts,
  } = props;

  const
    handleAppendDistrict: FunctionCreateDistrictTypeof = async (data: DataDistrict) => createDistrict ? await createDistrict(data) : undefined,
    handleUpdateDistrict: FunctionUpdateDistrictsTypeof = async (id: string, data: DataDistrict) => updateDistricts ? await updateDistricts(id, data) : false,
    handleRemoveDistrict: FunctionDeleteDistrictsTypeof = async (id: string) => deleteDistricts ? await deleteDistricts(id) : false;

  if (!value && hasEdit)
    setHasEdit(false);

  if (isLoadingDistrict && !syncData || isLoadingDistricts && !syncData)
    return <AutocompleteLoading label='Estado' message='Carregando...' />

  if (!syncData && district || !syncData && districts) {
    if (district) {
      setValue({
        id: district.id,
        value: district.value,
      });
    }

    setSyncData(true);
  } else if (!syncData && !district || !syncData && !districts) {
    return <AutocompleteError label='Estado' message='Ocorreu um erro' />
  }

  if (district && props.handleChangeData && returnData) {
    const changeDistrict = districts.find(district => district.id === district.id);

    if (changeDistrict)
      props.handleChangeData(changeDistrict);

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
                  const district = districts.find(district => district.value === editValue);

                  if (district) {
                    const update: FilmOptionType = {
                      id: district.id,
                      value: editValue,
                    };

                    setValue(update);
                    setReturnData(true);
                    handleUpdateDistrict(district.id, { value: editValue });
                    props.handleChangeId(district.id);
                  }
                } else {
                  if (districts.filter(district => district.value === value.value).length <= 0) {
                    handleAppendDistrict({ value: value.value });
                  } else {
                    const district = districts.find(district => district.value === value.value);

                    if (district) {
                      setValue({
                        id: district.id,
                        value: district.value
                      });
                      setReturnData(true);
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
                value: StringEx.trim(newValue.inputValue),
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
            setReturnData(true);
            props.handleChangeId(district.id);
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
          if (props.district && value && props.district.id === value.id)
            return Alerting.create('info', 'Não é possível remover o estado sendo usado pelo registro.');

          if (value) {
            if (props.district) {
              setValue({
                id: props.district.id,
                value: district?.value || '???'
              })
            } else {
              setValue(null);
            }

            handleRemoveDistrict(value.id);
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

export const SelectDistrict = memo(Component, (prevStates, nextStates) => {
  if (
    prevStates.district?.value !== nextStates.district?.value
    || prevStates.districts.length <= 0 || nextStates.districts.length <= 0
    || prevStates.districts.length !== nextStates.districts.length
    || JSON.stringify(prevStates.districts) !== JSON.stringify(nextStates.districts)
  )
    return false;

  return true;
});