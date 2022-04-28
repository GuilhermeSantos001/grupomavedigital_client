import React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Icon from '@/src/utils/fontAwesomeIcons'

import { SwapSpinner } from 'react-spinners-kit';

export type Props = {
  label: string
  message: string
  disabledButtonAppend?: boolean
  handleButtonAppend?: () => void
}

export function OutlinedInputEmpty(props: Props) {
  return (
    <>
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
      {
        props.handleButtonAppend &&
        <div className='d-flex justify-content-start align-items-start'>
          <button
            type="button"
            className="btn btn-link"
            disabled={props.disabledButtonAppend}
            onClick={props.handleButtonAppend}
          >
            <FontAwesomeIcon
              icon={Icon.render('fas', 'plus-square')}
              className="me-1 flex-shrink-1 my-auto"
            /> Adicionar
          </button>
        </div>
      }
    </>
  )
}