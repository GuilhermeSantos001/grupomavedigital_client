import React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

import { SwapSpinner } from 'react-spinners-kit';

export type Props = {
  label: string
  message: string
}

export function OutlinedInputEmpty(props: Props) {
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
            <SwapSpinner size={30} color={'#004a6e'} />
          </React.Fragment>
        }
      />
    </FormControl>
  )
}