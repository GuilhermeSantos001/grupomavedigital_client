import React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

import { ImpulseSpinner } from 'react-spinners-kit';

export type Props = {
  label: string
  message: string
}

export function OutlinedInputLoading(props: Props) {
  return (
    <FormControl fullWidth>
      <InputLabel htmlFor={`outlined-adornment-${props.label}`}>
        {props.label}
      </InputLabel>
      <OutlinedInput
        id={`outlined-adornment-${props.label}`}
        className='col-12'
        label={props.label}
        defaultValue={props.message}
        disabled={true}
        endAdornment={
          <React.Fragment>
            <ImpulseSpinner size={30} frontColor={'#004a6e'} />
          </React.Fragment>
        }
      />
    </FormControl>
  )
}