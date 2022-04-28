import { useState, memo } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Icon from '@/src/utils/fontAwesomeIcons'

import { OutlinedInputLoading } from '@/components/utils/OutlinedInputLoading';
import { OutlinedInputEmpty } from '@/components/utils/OutlinedInputEmpty';
import { BoxError } from '@/components/utils/BoxError';

import StringEx from '@/src/utils/stringEx'

import type { AddressType } from '@/types/AddressType';

export type Props = {
  id?: string
  addresses: AddressType[]
  isLoadingAddresses: boolean
  handleChangeId: (id: string) => void
  disabled?: boolean
  handleChangeData?: (data: AddressType) => void
  disabledButtonAppend?: boolean
  disabledButtonUpdate?: boolean
  disabledButtonRemove?: boolean
  handleButtonAppend?: () => void
  handleButtonUpdate?: () => void
  handleButtonRemove?: () => void
}

function Component(props: Props) {
  const [syncData, setSyncData] = useState<boolean>(false);
  const [returnData, setReturnData] = useState<boolean>(false);

  const [address, setAddress] = useState<string>(props.id || '');

  const { addresses, isLoadingAddresses } = props;

  if (isLoadingAddresses && !syncData)
    return <OutlinedInputLoading label='Endereço' message='Carregando...' />

  if (!syncData && addresses) {
    setSyncData(true);
  } else if (!syncData && !addresses) {
    return <BoxError />
  }

  if (addresses.length <= 0)
    return <OutlinedInputEmpty
      label='Endereço'
      message='Nenhum endereço cadastrado'
      disabledButtonAppend={props.disabledButtonAppend}
      handleButtonAppend={props.handleButtonAppend}
    />

  if (props.id && props.handleChangeData && returnData) {
    const address = addresses.find(address => address.id === props.id);

    if (address)
      props.handleChangeData(address);

    setReturnData(false);
  }

  return (
    <>
      <FormControl variant="outlined" fullWidth>
        <InputLabel id="select-address-label">
          Endereço
        </InputLabel>
        <Select
          labelId="select-address-label"
          id="select-address"
          value={address}
          disabled={props.disabled !== undefined ? props.disabled : false}
          onChange={(e) => {
            setAddress(e.target.value as string);
            setReturnData(true);
            props.handleChangeId(e.target.value as string);
          }}
          label="Endereço"
        >
          {addresses.map((address) => {
            return (
              <MenuItem
                key={address.id}
                value={address.id}
              >
                <em>{`${address.street.value}, ${address.number} - ${address.neighborhood.value}, ${address.city.value} - ${address.district.value}, ${StringEx.maskZipcode(address.zipCode)}`}</em>
              </MenuItem>
            )
          })}
        </Select>
      </FormControl>
      {
        props.handleButtonAppend &&
        props.handleButtonUpdate &&
        props.handleButtonRemove &&
        <div className='d-flex justify-content-start align-items-start'>
          <button
            type="button"
            className="btn btn-link"
            disabled={props.disabledButtonUpdate}
            onClick={props.handleButtonUpdate}
          >
            <FontAwesomeIcon
              icon={Icon.render('fas', 'edit')}
              className="me-1 flex-shrink-1 my-auto"
            /> Atualizar
          </button>
          <button
            type="button"
            className="btn btn-link"
            disabled={props.disabledButtonRemove}
            onClick={() => {
              if (address.length > 0) {
                setAddress('');
                props.handleChangeId('');
              }

              if (props.handleButtonRemove)
                props.handleButtonRemove();
            }}
          >
            <FontAwesomeIcon
              icon={Icon.render('fas', 'minus-square')}
              className="me-1 flex-shrink-1 my-auto"
            /> Remover
          </button>
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

export const SelectAddress = memo(Component, (prevStates, nextStates) => {
  if (
    prevStates.id !== nextStates.id
    || JSON.stringify(prevStates.disabledButtonAppend) !== JSON.stringify(nextStates.disabledButtonAppend)
    || JSON.stringify(prevStates.disabledButtonUpdate) !== JSON.stringify(nextStates.disabledButtonUpdate)
    || JSON.stringify(prevStates.disabledButtonRemove) !== JSON.stringify(nextStates.disabledButtonRemove)
    || prevStates.addresses.length <= 0 || nextStates.addresses.length <= 0
    || prevStates.addresses.length !== nextStates.addresses.length
    || JSON.stringify(prevStates.addresses) !== JSON.stringify(nextStates.addresses)
  )
    return false;

  return true;
})