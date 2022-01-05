/**
 * @description Modal -> Modal de Edição de local de trabalho
 * @author @GuilhermeSantos001
 * @update 05/01/2022
 */

import * as React from 'react';
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
import UpdateIcon from '@mui/icons-material/Update';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

import MobileTimePicker from '@/components/inputs/mobileTimePicker'
import SelectScale from '@/components/inputs/selectScale'
import SelectService from '@/components/inputs/selectService'
import SelectStreet from '@/components/inputs/selectStreet'
import SelectNeighborhood from '@/components/inputs/selectNeighborhood'
import SelectCity from '@/components/inputs/selectCity'
import SelectDistrict from '@/components/inputs/selectDistrict'

import Alerting from '@/src/utils/alerting'
import { not } from '@/components/inputs/selectService'

import { useAppDispatch, useAppSelector } from '@/app/hooks';

import type {
  Workplace,
  Scale,
  Service,
  Street,
  Neighborhood,
  City,
  District,
} from '@/app/features/system/system.slice'

import {
  editWorkplace,
  appendScale,
  editScale,
  removeScale,
  appendStreet,
  editStreet,
  removeStreet,
  appendNeighborhood,
  editNeighborhood,
  removeNeighborhood,
  appendCity,
  editCity,
  removeCity,
  appendDistrict,
  editDistrict,
  removeDistrict,
} from '@/app/features/system/system.slice'

export interface Props {
  show: boolean
  id: string,
  name: string,
  entryTime: string,
  exitTime: string,
  services: string[],
  scale: string
  neighborhood: string
  city: string
  district: string
  street: string
  numberHome: number
  complement: string
  zipCode: number
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

export default function RegisterWorkplace(props: Props) {
  const [name, setName] = React.useState<string>(props.name);
  const [entryTime, setEntryTime] = React.useState<Date>(new Date(props.entryTime));
  const [exitTime, setExitTime] = React.useState<Date>(new Date(props.exitTime));
  const [appliedServices, setAppliedServices] = React.useState<string[]>(props.services);
  const [numberHome, setNumberHome] = React.useState<number>(props.numberHome);
  const [complement, setComplement] = React.useState<string>(props.complement);
  const [zipCode, setZipCode] = React.useState<number>(props.zipCode);
  const [scale, setScale] = React.useState<string>(props.scale);
  const [street, setStreet] = React.useState<string>(props.street);
  const [neighborhood, setNeighborhood] = React.useState<string>(props.neighborhood);
  const [city, setCity] = React.useState<string>(props.city);
  const [district, setDistrict] = React.useState<string>(props.district);

  const
    dispatch = useAppDispatch(),
    workplaces = useAppSelector(state => state.system.workplaces || []),
    services = useAppSelector((state) => state.system.services || []),
    scales = useAppSelector((state) => state.system.scales || []),
    streets = useAppSelector((state) => state.system.streets || []),
    neighborhoods = useAppSelector((state) => state.system.neighborhoods || []),
    cities = useAppSelector((state) => state.system.cities || []),
    districts = useAppSelector((state) => state.system.districts || []);

  const
    handleChangeName = (value: string) => setName(value),
    handleChangeScale = (value: string) => setScale(value),
    handleAppendScale = (scale: Scale) => dispatch(appendScale(scale)),
    handleUpdateScale = (scale: Scale) => dispatch(editScale(scale)),
    handleRemoveScale = (id: string) => dispatch(removeScale(id)),
    handleChangeEntryTime = (value: Date) => setEntryTime(value),
    handleChangeExitTime = (value: Date) => setExitTime(value),
    handleChangeNumberHome = (value: number) => setNumberHome(value),
    handleChangeComplement = (value: string) => setComplement(value),
    handleChangeZipCode = (value: number) => setZipCode(value),
    handleChangeStreet = (value: string) => setStreet(value),
    handleAppendStreet = (street: Street) => dispatch(appendStreet(street)),
    handleUpdateStreet = (street: Street) => dispatch(editStreet(street)),
    handleRemoveStreet = (id: string) => dispatch(removeStreet(id)),
    handleChangeNeighborhood = (value: string) => setNeighborhood(value),
    handleAppendNeighborhood = (neighborhood: Neighborhood) => dispatch(appendNeighborhood(neighborhood)),
    handleUpdateNeighborhood = (neighborhood: Neighborhood) => dispatch(editNeighborhood(neighborhood)),
    handleRemoveNeighborhood = (id: string) => dispatch(removeNeighborhood(id)),
    handleChangeCity = (value: string) => setCity(value),
    handleAppendCity = (city: City) => dispatch(appendCity(city)),
    handleUpdateCity = (city: City) => dispatch(editCity(city)),
    handleRemoveCity = (id: string) => dispatch(removeCity(id)),
    handleChangeDistrict = (value: string) => setDistrict(value),
    handleAppendDistrict = (district: District) => dispatch(appendDistrict(district)),
    handleUpdateDistrict = (district: District) => dispatch(editDistrict(district)),
    handleRemoveDistrict = (id: string) => dispatch(removeDistrict(id));

  const
    canEditWorkPlace = () => {
      return name.length > 0 &&
        entryTime !== null &&
        exitTime !== null &&
        appliedServices.length > 0 &&
        numberHome > 0 &&
        // complement.length > 0 && // ? Complemento não é obrigatório
        zipCode > 0 &&
        scale !== '' &&
        street !== '' &&
        neighborhood !== '' &&
        city !== ''
    },
    servicesAvailables = () => {
      const available = not(services.map((service) => service.id), props.services.map((service) => service));

      return services
        .filter(service => available.includes(service.id))
        .map(service => service.value)
    };

  const handleEditWorkplace = () => {
    const workplace: Workplace = {
      id: props.id,
      name,
      entryTime: entryTime.toISOString(),
      exitTime: exitTime.toISOString(),
      services: appliedServices,
      scale: scales.find(_scale => _scale.id === scale).id,
      address: {
        street: streets.find(_street => _street.id === street).id,
        neighborhood: neighborhoods.find(_neighborhood => _neighborhood.id === neighborhood).id,
        city: cities.find(_city => _city.id === city).id,
        district: districts.find(_district => _district.id === district).id,
        number: numberHome,
        complement,
        zipCode,
      },
    }

    if (workplaces.find(workplace => workplace.name === name && workplace.scale === scale && workplace.id !== props.id))
      return Alerting.create('Já existe um local de trabalho com esse nome e escala.');

    dispatch(editWorkplace(workplace));
    props.handleClose();
  }

  return (
    <div>
      <Dialog
        fullScreen
        open={props.show}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }} color='primary'>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="close"
            >
              <UpdateIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Local de Trabalho
            </Typography>
            <Button
              color="inherit"
              disabled={!canEditWorkPlace()}
              onClick={handleEditWorkplace}
            >
              Atualizar
            </Button>
          </Toolbar>
        </AppBar>
        <List>
          <ListItem>
            <ListItemText primary="Informações Básicas" />
          </ListItem>
          <ListItem>
            <TextField
              className='col'
              label="Nome do Posto"
              variant="standard"
              value={name}
              onChange={(e) => handleChangeName(e.target.value)}
            />
          </ListItem>
          <ListItem>
            <div className='col'>
              <SelectScale
                scales={scales}
                scale={scales.find(scale => scale.id === props.scale)}
                handleChangeScale={handleChangeScale}
                handleAppendScale={handleAppendScale}
                handleUpdateScale={handleUpdateScale}
                handleRemoveScale={handleRemoveScale}
              />
            </div>
          </ListItem>
          <ListItem>
            <MobileTimePicker
              className='col-12'
              label="Horário de Entrada"
              value={entryTime}
              handleChangeValue={handleChangeEntryTime}
            />
          </ListItem>
          <ListItem>
            <MobileTimePicker
              className='col-12'
              label="Horário de Saída"
              value={exitTime}
              handleChangeValue={handleChangeExitTime}
            />
          </ListItem>
          <ListItem>
            <ListItemText primary="Serviços no Posto" />
          </ListItem>
        </List>
        <SelectService
          left={servicesAvailables()}
          right={services.filter((service) => props.services.includes(service.id)).map((service) => service.value)}
          onChangeAppliedServices={(values) => setAppliedServices(services.filter(service => values.includes(service.value)).map(service => service.id))}
        />
        <List>
          <ListItem>
            <ListItemText primary="Endereço do Posto" />
          </ListItem>
          <ListItem>
            <div className='col'>
              <SelectStreet
                streets={streets}
                street={streets.find(_street => _street.id === street)}
                handleChangeStreet={handleChangeStreet}
                handleAppendStreet={handleAppendStreet}
                handleUpdateStreet={handleUpdateStreet}
                handleRemoveStreet={handleRemoveStreet}
              />
            </div>
          </ListItem>
          <ListItem>
            <div className='col'>
              <SelectNeighborhood
                neighborhoods={neighborhoods}
                neighborhood={neighborhoods.find(_neighborhood => _neighborhood.id === neighborhood)}
                handleChangeNeighborhood={handleChangeNeighborhood}
                handleAppendNeighborhood={handleAppendNeighborhood}
                handleUpdateNeighborhood={handleUpdateNeighborhood}
                handleRemoveNeighborhood={handleRemoveNeighborhood}
              />
            </div>
          </ListItem>
          <ListItem>
            <div className='col'>
              <SelectCity
                cities={cities}
                city={cities.find(_city => _city.id === city)}
                handleChangeCity={handleChangeCity}
                handleAppendCity={handleAppendCity}
                handleUpdateCity={handleUpdateCity}
                handleRemoveCity={handleRemoveCity}
              />
            </div>
          </ListItem>
          <ListItem>
            <div className='col'>
              <SelectDistrict
                districts={districts}
                district={districts.find(_district => _district.id === district)}
                handleChangeDistrict={handleChangeDistrict}
                handleAppendDistrict={handleAppendDistrict}
                handleUpdateDistrict={handleUpdateDistrict}
                handleRemoveDistrict={handleRemoveDistrict}
              />
            </div>
          </ListItem>
          <ListItem>
            <TextField
              className='col'
              label="Número"
              variant="standard"
              value={String(numberHome).padStart(4, '0')}
              onChange={(e) => {
                const value = parseInt(e.target.value);

                if (value >= 0 && value <= 9999)
                  handleChangeNumberHome(value)
              }}
            />
          </ListItem>
          <ListItem>
            <TextField
              type={'text'}
              className='col'
              label="Complemento"
              variant="standard"
              value={complement}
              onChange={(e) => handleChangeComplement(e.target.value)}
            />
          </ListItem>
          <ListItem>
            <TextField
              className='col'
              label="CEP"
              variant="standard"
              value={String(zipCode).padStart(8, '0')}
              onChange={(e) => {
                const value = parseInt(e.target.value);

                if (value >= 0 && value <= 99999999)
                  handleChangeZipCode(value)
              }}
            />
          </ListItem>
        </List>
        <Button
          className='col-10 mx-auto my-2'
          variant="contained"
          color="warning"
          disabled={!canEditWorkPlace()}
          onClick={handleEditWorkplace}
        >
          Atualizar
        </Button>
      </Dialog>
    </div>
  );
}