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
  FunctionCreateAddressTypeof
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
  createAddress: FunctionCreateAddressTypeof
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
  const [houseNumber, sethouseNumber] = useState<number>(0);
  const [complement, setComplement] = useState<string>('');
  const [neighborhoodId, setNeighborhoodId] = useState<string>('');
  const [cityId, setCityId] = useState<string>('');
  const [districtId, setDistrictId] = useState<string>('');
  const [zipCode, setZipCode] = useState<number>(0);

  const {
    createAddress,
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
      const address = await createAddress({
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

  if (
    isLoadingStreets && !syncData
    || isLoadingNeighborhoods && !syncData
    || isLoadingCities && !syncData
    || isLoadingDistricts && !syncData
  )
    return <DialogLoading
      header='Registrar Endereço'
      message='Carregando...'
      show={props.show}
      handleClose={props.handleClose}
    />

  if (
    !syncData
    && streets
    && neighborhoods
    && cities
    && districts
  ) {
    setSyncData(true);
  } else if (
    !syncData && !streets
    || !syncData && !neighborhoods
    || !syncData && !cities
    || !syncData && !districts
  ) {
    return <DialogError
      header='Registrar Endereço'
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
          <SelectStreet
            createStreet={createStreet}
            street={street}
            isLoadingStreet={isLoadingStreet}
            streets={streets}
            isLoadingStreets={isLoadingStreets}
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
            createNeighborhood={createNeighborhood}
            neighborhood={neighborhood}
            isLoadingNeighborhood={isLoadingNeighborhood}
            neighborhoods={neighborhoods}
            isLoadingNeighborhoods={isLoadingNeighborhoods}
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
            isLoadingCities={isLoadingCities}
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
            isLoadingDistricts={isLoadingDistricts}
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
  );
}

export const RegisterAddress = memo(Component, (prevStates, nextStates) => {
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