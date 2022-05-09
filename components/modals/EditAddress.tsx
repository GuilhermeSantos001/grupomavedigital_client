import React, { useState, memo } from 'react';
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

import type {
  FunctionUpdateAddressesTypeof
} from '@/types/AddressServiceType'

import type {
  FunctionCreateStreetTypeof,
  FunctionUpdateStreetsTypeof,
  FunctionDeleteStreetsTypeof
} from '@/types/StreetServiceType'

import type {
  FunctionCreateNeighborhoodTypeof,
  FunctionUpdateNeighborhoodsTypeof,
  FunctionDeleteNeighborhoodsTypeof
} from '@/types/NeighborhoodServiceType'

import type {
  FunctionCreateCityTypeof,
  FunctionUpdateCitiesTypeof,
  FunctionDeleteCitiesTypeof
} from '@/types/CityServiceType'

import {
  FunctionCreateDistrictTypeof,
  FunctionUpdateDistrictsTypeof,
  FunctionDeleteDistrictsTypeof
} from '@/types/DistrictServiceType'

import type {
  AddressType
} from '@/types/AddressType'

import type {
  StreetType
} from '@/types/StreetType'

import type {
  NeighborhoodType
} from '@/types/NeighborhoodType'

import type {
  CityType
} from '@/types/CityType'

import {
  DistrictType
} from '@/types/DistrictType'

export interface Props {
  address: AddressType | undefined
  isLoadingAddress: boolean
  updateAddresses: FunctionUpdateAddressesTypeof
  createStreet: FunctionCreateStreetTypeof,
  street: StreetType | undefined
  isLoadingStreet: boolean
  streets: StreetType[]
  isLoadingStreets: boolean
  updateStreets: FunctionUpdateStreetsTypeof
  deleteStreets: FunctionDeleteStreetsTypeof
  createNeighborhood: FunctionCreateNeighborhoodTypeof
  neighborhood: NeighborhoodType | undefined
  isLoadingNeighborhood: boolean
  neighborhoods: NeighborhoodType[]
  isLoadingNeighborhoods: boolean
  updateNeighborhoods: FunctionUpdateNeighborhoodsTypeof
  deleteNeighborhoods: FunctionDeleteNeighborhoodsTypeof
  createCity: FunctionCreateCityTypeof
  city: CityType | undefined
  isLoadingCity: boolean
  cities: CityType[]
  isLoadingCities: boolean
  updateCities: FunctionUpdateCitiesTypeof
  deleteCities: FunctionDeleteCitiesTypeof
  createDistrict: FunctionCreateDistrictTypeof
  district: DistrictType | undefined
  isLoadingDistrict: boolean
  districts: DistrictType[]
  isLoadingDistricts: boolean
  updateDistricts: FunctionUpdateDistrictsTypeof
  deleteDistricts: FunctionDeleteDistrictsTypeof
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

function Component(props: Props) {
  const [syncData, setSyncData] = useState<boolean>(false);

  const [streetId, setStreetId] = useState<string>('');
  const [houseNumber, sethouseNumber] = useState<string>('');
  const [complement, setComplement] = useState<string>('');
  const [neighborhoodId, setNeighborhoodId] = useState<string>('');
  const [cityId, setCityId] = useState<string>('');
  const [districtId, setDistrictId] = useState<string>('');
  const [zipCode, setZipCode] = useState<string>('');

  const {
    address,
    isLoadingAddress,
    updateAddresses,
    createStreet,
    street,
    isLoadingStreet,
    streets,
    isLoadingStreets,
    updateStreets,
    deleteStreets,
    createNeighborhood,
    neighborhood,
    isLoadingNeighborhood,
    neighborhoods,
    isLoadingNeighborhoods,
    updateNeighborhoods,
    deleteNeighborhoods,
    createCity,
    city,
    isLoadingCity,
    cities,
    isLoadingCities,
    updateCities,
    deleteCities,
    createDistrict,
    district,
    isLoadingDistrict,
    districts,
    isLoadingDistricts,
    updateDistricts,
    deleteDistricts
  } = props;

  const
    handleChangeStreetId = (id: string) => setStreetId(id),
    handleChangehouseNumber = (value: string) => value.length <= 4 ? sethouseNumber(value) : undefined,
    handleChangeComplement = (value: string) => setComplement(value),
    handleChangeNeighborhoodId = (id: string) => setNeighborhoodId(id),
    handleChangeCityId = (id: string) => setCityId(id),
    handleChangeDistrictId = (id: string) => setDistrictId(id),
    handleChangeZipCode = (value: string) => value.length <= 8 ? setZipCode(value) : undefined;

  const
    canUpdateAddress = () => {
      return streetId.length > 0 &&
        houseNumber.length > 0 &&
        // complement.length > 0 && // ! Complemento não é obrigatório
        neighborhoodId.length > 0 &&
        cityId.length > 0 &&
        districtId.length > 0 &&
        zipCode.length > 0
    },
    handleUpdateAddress = async () => {
      if (!address || !updateAddresses)
        return Alerting.create('error', 'Não foi possível atualizar o endereço. Tente novamente, mais tarde!.');

      const update = await updateAddresses(address.id, {
        streetId,
        number: houseNumber,
        complement,
        neighborhoodId,
        cityId,
        districtId,
        zipCode
      });

      if (update)
        return Alerting.create('success', 'Endereço atualizado com sucesso!');
    }

  if (
    isLoadingAddress && !syncData
    || isLoadingStreet && !syncData
    || isLoadingStreets && !syncData
    || isLoadingNeighborhood && !syncData
    || isLoadingNeighborhoods && !syncData
    || isLoadingCity && !syncData
    || isLoadingCities && !syncData
    || isLoadingDistrict && !syncData
    || isLoadingDistricts && !syncData
  )
    return <DialogLoading
      header='Editar Endereço'
      message='Carregando...'
      show={props.show}
      handleClose={props.handleClose}
    />

  if (
    !syncData
    && address
    && street
    && streets
    && neighborhood
    && neighborhoods
    && city
    && cities
    && district
    && districts
  ) {
    handleChangeStreetId(address.streetId);
    handleChangehouseNumber(address.number);
    handleChangeComplement(address.complement || '');
    handleChangeNeighborhoodId(address.neighborhoodId);
    handleChangeCityId(address.cityId);
    handleChangeDistrictId(address.districtId);
    handleChangeZipCode(address.zipCode);
    setSyncData(true);
  } else if (
    !syncData && !address
    || !syncData && !street
    || !syncData && !streets
    || !syncData && !neighborhood
    || !syncData && !neighborhoods
    || !syncData && !city
    || !syncData && !cities
    || !syncData && !district
    || !syncData && !districts
  ) {
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
            createStreet={createStreet}
            street={street}
            isLoadingStreet={isLoadingAddress}
            streets={streets}
            isLoadingStreets={isLoadingAddress}
            updateStreets={updateStreets}
            deleteStreets={deleteStreets}
            handleChangeId={handleChangeStreetId}
          />
        </ListItem>
        <ListItem>
          <TextField
            className='col'
            label="Número"
            variant="standard"
            value={StringEx.maskHouseNumber(houseNumber)}
            onChange={(e) => handleChangehouseNumber(StringEx.removeMaskNumToString(e.target.value, 'housenumber'))}
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
            createNeighborhood={createNeighborhood}
            neighborhood={neighborhood}
            isLoadingNeighborhood={isLoadingNeighborhood}
            neighborhoods={neighborhoods}
            isLoadingNeighborhoods={isLoadingNeighborhood}
            updateNeighborhoods={updateNeighborhoods}
            deleteNeighborhoods={deleteNeighborhoods}
            handleChangeId={handleChangeNeighborhoodId}
          />
        </ListItem>
        <ListItem>
          <SelectCity
            createCity={createCity}
            city={city}
            isLoadingCity={isLoadingCity}
            cities={cities}
            isLoadingCities={isLoadingCity}
            updateCities={updateCities}
            deleteCities={deleteCities}
            handleChangeId={handleChangeCityId}
          />
        </ListItem>
        <ListItem>
          <SelectDistrict
            createDistrict={createDistrict}
            district={district}
            isLoadingDistrict={isLoadingDistrict}
            districts={districts}
            isLoadingDistricts={isLoadingDistrict}
            updateDistricts={updateDistricts}
            deleteDistricts={deleteDistricts}
            handleChangeId={handleChangeDistrictId}
          />
        </ListItem>
        <ListItem>
          <TextField
            className='col'
            label="CEP"
            variant="standard"
            value={StringEx.maskZipcode(zipCode)}
            onChange={(e) => handleChangeZipCode(StringEx.removeMaskNumToString(e.target.value, 'zipcode'))}
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
        Sair
      </Button>
    </Dialog>
  );
}

export const EditAddress = memo(Component, (prevStates, nextStates) => {
  if (
    prevStates.show !== nextStates.show
    || prevStates.street?.id !== nextStates.street?.id
    || prevStates.street?.value !== nextStates.street?.value
    || prevStates.streets.length !== nextStates.streets.length
    || prevStates.neighborhood?.id !== nextStates.neighborhood?.id
    || prevStates.neighborhood?.value !== nextStates.neighborhood?.value
    || prevStates.neighborhoods.length !== nextStates.neighborhoods.length
    || prevStates.city?.id !== nextStates.city?.id
    || prevStates.city?.value !== nextStates.city?.value
    || prevStates.cities.length !== nextStates.cities.length
    || prevStates.district?.id !== nextStates.district?.id
    || prevStates.district?.value !== nextStates.district?.value
    || prevStates.districts.length !== nextStates.districts.length
  )
    return false;

  return true;
});