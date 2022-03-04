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

import { DialogLoading } from '@/components/utils/DialogLoading';
import { DialogError } from '@/components/utils/DialogError';

import { SelectStreet } from '@/components/selects/SelectStreet';
import { SelectNeighborhood } from '@/components/selects/SelectNeighborhood';
import { SelectCity } from '@/components/selects/SelectCity';
import { SelectDistrict } from '@/components/selects/SelectDistrict';

import Alerting from '@/src/utils/alerting'
import StringEx from '@/src/utils/stringEx'

import { useAddressWithIdService } from '@/services/useAddressWithIdService';

export interface Props {
  id: string
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

export function EditAddress(props: Props) {
  const [syncData, setSyncData] = useState<boolean>(false);

  const [streetId, setStreetId] = useState<string>('');
  const [houseNumber, sethouseNumber] = useState<number>(0);
  const [complement, setComplement] = useState<string>('');
  const [neighborhoodId, setNeighborhoodId] = useState<string>('');
  const [cityId, setCityId] = useState<string>('');
  const [districtId, setDistrictId] = useState<string>('');
  const [zipCode, setZipCode] = useState<number>(0);

  const { data: address, isLoading: isLoadingAddress, update: UpdateAddress } = useAddressWithIdService(props.id);

  const
    handleChangeStreetId = (id: string) => setStreetId(id),
    handleChangehouseNumber = (value: number) => sethouseNumber(value),
    handleChangeComplement = (value: string) => setComplement(value),
    handleChangeNeighborhoodId = (id: string) => setNeighborhoodId(id),
    handleChangeCityId = (id: string) => setCityId(id),
    handleChangeDistrictId = (id: string) => setDistrictId(id),
    handleChangeZipCode = (value: number) => setZipCode(value);

  const
    canUpdateAddress = () => {
      return streetId.length > 0 &&
        houseNumber > 0 &&
        // complement.length > 0 && // ! Complemento não é obrigatório
        neighborhoodId.length > 0 &&
        cityId.length > 0 &&
        districtId.length > 0 &&
        zipCode > 0
    },
    handleUpdateAddress = async () => {
      if (!UpdateAddress) return;

      const update = await UpdateAddress({
        streetId,
        number: houseNumber.toString(),
        complement,
        neighborhoodId,
        cityId,
        districtId,
        zipCode: zipCode.toString()
      });

      if (update)
        return Alerting.create('success', 'Endereço atualizado com sucesso!');
    }

  if (isLoadingAddress && !syncData)
    return <DialogLoading
      header='Editar Endereço'
      message='Carregando...'
      show={props.show}
      handleClose={props.handleClose}
    />

  if (!syncData && address) {
    handleChangeStreetId(address.streetId);
    handleChangehouseNumber(parseInt(address.number));
    handleChangeComplement(address.complement || '');
    handleChangeNeighborhoodId(address.neighborhoodId);
    handleChangeCityId(address.cityId);
    handleChangeDistrictId(address.districtId);
    handleChangeZipCode(parseInt(address.zipCode));
    setSyncData(true);
  } else if (!syncData && !address) {
    return <DialogError
      header='Editar Endereço'
      message='Ocorreu um erro'
      show={props.show}
      handleClose={props.handleClose}
    />
  }

  return (
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
            Editar Endereço
          </Typography>
          <Button
            color="inherit"
            disabled={!canUpdateAddress()}
            onClick={handleUpdateAddress}
          >
            Atualizar
          </Button>
        </Toolbar>
      </AppBar>
      <List>
        <ListItem>
          <ListItemText primary="Informações Gerais" />
        </ListItem>
        <ListItem>
          <SelectStreet
            id={address?.streetId}
            handleChangeId={handleChangeStreetId}
          />
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
          <SelectNeighborhood
            id={address?.neighborhoodId}
            handleChangeId={handleChangeNeighborhoodId}
          />
        </ListItem>
        <ListItem>
          <SelectCity
            id={address?.cityId}
            handleChangeId={handleChangeCityId}
          />
        </ListItem>
        <ListItem>
          <SelectDistrict
            id={address?.districtId}
            handleChangeId={handleChangeDistrictId}
          />
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
        disabled={!canUpdateAddress()}
        onClick={handleUpdateAddress}
      >
        Atualizar
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
  );
}