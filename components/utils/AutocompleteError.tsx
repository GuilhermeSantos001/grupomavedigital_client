import React from 'react';
import { Autocomplete, TextField } from '@mui/material'
import ErrorIcon from '@mui/icons-material/Error';

export type Props = {
  label: string
  message: string
}

export function AutocompleteError(props: Props) {
  return (
    <div className='d-flex flex-column flex-md-row'>
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
                <ErrorIcon />
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