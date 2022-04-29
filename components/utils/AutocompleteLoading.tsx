import React from 'react';

import { Autocomplete, TextField } from '@mui/material'
import { ImpulseSpinner } from 'react-spinners-kit'

export type Props = {
  message: string
  label: string
}

export function AutocompleteLoading(props: Props) {
  return (
    <div className='d-flex flex-column flex-md-row col'>
      <Autocomplete
        className='col-12 mb-2 mb-md-0 me-md-2'
        value={props.message}
        disabled={true}
        options={[props.message]}
        renderInput={(params) => (
          <TextField
            {...params}
            label={props.label}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  <ImpulseSpinner size={30} frontColor={'#004a6e'} />
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
      />
    </div>
  )
}