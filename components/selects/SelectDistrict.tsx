/**
 * @description Input -> Seleciona um distrito (Estado)
 * @author GuilhermeSantos001
 * @update 09/02/2022
 */

 import { useState } from 'react';
 import { Autocomplete, TextField, createFilterOptions, Button } from '@mui/material'

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
   const { data: district, create: CreateDistrict } = useDistrictService(props.id);
   const { data: districts, update: UpdateDistricts, delete: DeleteDistricts } = useDistrictsService();

   const [value, setValue] = useState<FilmOptionType | null>(district || null);
   const [hasEdit, setHasEdit] = useState<boolean>(false);
   const [editValue, setEditValue] = useState<string>('');

   const
     handleAppendDistrict: FunctionCreateDistrictTypeof = async (data: DataDistrict) => CreateDistrict ? await CreateDistrict(data) : undefined,
     handleUpdateDistrict: FunctionUpdateDistrictsTypeof = async (id: string, data: DataDistrict) => UpdateDistricts ? await UpdateDistricts(id, data) : false,
     handleRemoveDistrict: FunctionDeleteDistrictsTypeof = async (id: string) => DeleteDistricts ? await DeleteDistricts(id) : false;

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
               valueId = '',
               district: FilmOptionType = {
                 id: hasEdit ? value?.id || valueId : valueId,
                 value: newValue.inputValue,
               };

             setValue(district);
             props.handleChangeId(district.id);

             if (!newValue.inputUpdate) {
               handleAppendDistrict({ value: district.value });
             } else {
               handleUpdateDistrict(district.id, { value: district.value });
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
           if (value) {
             setValue(null);
             handleRemoveDistrict(value.id);
             props.handleChangeId('');
           }
         }}
       >
         Deletar
       </Button>
     </div>
   )
 }