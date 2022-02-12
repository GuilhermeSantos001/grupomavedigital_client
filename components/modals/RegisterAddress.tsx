/**
 * @description Modal -> Modal de Cadastro do endereço
 * @author GuilhermeSantos001
 * @update 11/02/2022
 */

import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

import { SelectStreet } from '@/components/selects/SelectStreet';
import { SelectNeighborhood } from '@/components/selects/SelectNeighborhood';
import { SelectCity } from '@/components/selects/SelectCity';
import { SelectDistrict } from '@/components/selects/SelectDistrict';

import Alerting from '@/src/utils/alerting'
import StringEx from '@/src/utils/stringEx'

import { useAddressService } from '@/services/useAddressService';

export interface Props {
  show: boolean
  handleClose: () => void
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export function RegisterAddress(props: Props) {
  const [streetId, setStreetId] = useState<string>('');
  const [houseNumber, sethouseNumber] = useState<number>(0);
  const [complement, setComplement] = useState<string>('');
  const [neighborhoodId, setNeighborhoodId] = useState<string>('');
  const [cityId, setCityId] = useState<string>('');
  const [districtId, setDistrictId] = useState<string>('');
  const [zipCode, setZipCode] = useState<number>(0);

  const { create: CreateAddress } = useAddressService();

  const
    handleChangeStreetId = (id: string) => setStreetId(id),
    handleChangehouseNumber = (value: number) => sethouseNumber(value),
    handleChangeComplement = (value: string) => setComplement(value),
    handleChangeNeighborhoodId = (id: string) => setNeighborhoodId(id),
    handleChangeCityId = (id: string) => setCityId(id),
    handleChangeDistrictId = (id: string) => setDistrictId(id),
    handleChangeZipCode = (value: number) => setZipCode(value);

  const
    canRegisterAddress = () => {
      return streetId.length > 0 &&
        houseNumber > 0 &&
        // complement.length > 0 && // ! Complemento não é obrigatório
        neighborhoodId.length > 0 &&
        cityId.length > 0 &&
        districtId.length > 0 &&
        zipCode > 0
    },
    handleRegisterAddress = async () => {
      const address = await CreateAddress({
        streetId,
        number: houseNumber.toString(),
        complement,
        neighborhoodId,
        cityId,
        districtId,
        zipCode: zipCode.toString()
      });

      if (address)
        return Alerting.create('success', 'Endereço cadastrado com sucesso!');
    }

  return (
    <div>
      <Dialog
        fullScreen
        open={props.show}
        onClose={props.handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={props.handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Registrar Endereço
            </Typography>
            <Button
              color="inherit"
              disabled={!canRegisterAddress()}
              onClick={handleRegisterAddress}
            >
              Registrar
            </Button>
          </Toolbar>
        </AppBar>
        <List>
          <ListItem>
            <ListItemText primary="Informações Gerais" />
          </ListItem>
          <ListItem>
            <div className='col'>
              <SelectStreet
                handleChangeId={handleChangeStreetId}
              />
            </div>
          </ListItem>
          <ListItem>
            <TextField
              className='col'
              label="Número"
              variant="standard"
              value={StringEx.maskHouseNumber(houseNumber, true)}
              onChange={(e) => handleChangehouseNumber(StringEx.removeMaskNum(e.target.value))}
            />
          </ListItem>
          <ListItem>
            <TextField
              className='col'
              label="Complemento"
              variant="standard"
              value={complement}
              onChange={(e) => handleChangeComplement(e.target.value)}
            />
          </ListItem>
          <ListItem>
            <div className='col'>
              <SelectNeighborhood
                handleChangeId={handleChangeNeighborhoodId}
              />
            </div>
          </ListItem>
          <ListItem>
            <div className='col'>
              <SelectCity
                handleChangeId={handleChangeCityId}
              />
            </div>
          </ListItem>
          <ListItem>
            <div className='col'>
              <SelectDistrict
                handleChangeId={handleChangeDistrictId}
              />
            </div>
          </ListItem>
          <ListItem>
            <TextField
              className='col'
              label="CEP"
              variant="standard"
              value={StringEx.maskZipcode(zipCode, true)}
              onChange={(e) => handleChangeZipCode(StringEx.removeMaskNum(e.target.value))}
            />
          </ListItem>
        </List>
        <Button
          className='col-10 mx-auto my-2'
          variant="contained"
          color="primary"
          disabled={!canRegisterAddress()}
          onClick={handleRegisterAddress}
        >
          Registrar
        </Button>
        <Button
          className='col-10 mx-auto my-2'
          variant="contained"
          color="error"
          onClick={props.handleClose}
        >
          Cancelar
        </Button>
      </Dialog>
    </div>
  );
}