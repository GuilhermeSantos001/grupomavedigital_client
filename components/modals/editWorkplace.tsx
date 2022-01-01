/**
 * @description Modal -> Modal de Edição de local de trabalho
 * @author @GuilhermeSantos001
 * @update 01/01/2022
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
} from '@/app/features/system/system.slice'

export interface Props {
  show: boolean
  id: string,
  name: string,
  entryTime: string,
  exitTime: string,
  services: Service[],
  scale: string
  neighborhood: string
  city: string
  district: string
  workplaces: Workplace[]
  scales: Scale[]
  street: string
  numberHome: number
  complement: string
  zipCode: number
  streets: Street[]
  neighborhoods: Neighborhood[]
  cities: City[]
  districts: District[]
  handleAppendScale: (scale: Scale) => void
  handleUpdateScale: (scale: Scale) => void
  handleRemoveScale: (id: string) => void
  handleAppendStreet: (street: Street) => void
  handleUpdateStreet: (street: Street) => void
  handleRemoveStreet: (id: string) => void
  handleAppendNeighborhood: (neighborhood: Neighborhood) => void
  handleUpdateNeighborhood: (neighborhood: Neighborhood) => void
  handleRemoveNeighborhood: (id: string) => void
  handleAppendCity: (city: City) => void
  handleUpdateCity: (city: City) => void
  handleRemoveCity: (id: string) => void
  handleAppendDistrict: (district: District) => void
  handleUpdateDistrict: (district: District) => void
  handleRemoveDistrict: (id: string) => void
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
  const [appliedServices, setAppliedServices] = React.useState<Service[]>(props.services);
  const [numberHome, setNumberHome] = React.useState<number>(props.numberHome);
  const [complement, setComplement] = React.useState<string>(props.complement);
  const [zipCode, setZipCode] = React.useState<number>(props.zipCode);
  const [scale, setScale] = React.useState<string>(props.scale);
  const [street, setStreet] = React.useState<string>(props.street);
  const [neighborhood, setNeighborhood] = React.useState<string>(props.neighborhood);
  const [city, setCity] = React.useState<string>(props.city);
  const [district, setDistrict] = React.useState<string>(props.district);

  const dispatch = useAppDispatch();
  const services = useAppSelector((state) => state.system.services || []);

  const
    handleChangeName = (value: string) => setName(value),
    handleChangeEntryTime = (value: Date) => setEntryTime(value),
    handleChangeExitTime = (value: Date) => setExitTime(value),
    handleChangeNumberHome = (value: number) => setNumberHome(value),
    handleChangeComplement = (value: string) => setComplement(value),
    handleChangeZipCode = (value: number) => setZipCode(value),
    handleChangeScale = (value: string) => setScale(value),
    handleChangeStreet = (value: string) => setStreet(value),
    handleChangeNeighborhood = (value: string) => setNeighborhood(value),
    handleChangeCity = (value: string) => setCity(value),
    handleChangeDistrict = (value: string) => setDistrict(value);

  const canEditWorkPlace = () => {
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
  }

  const handleEditWorkplace = () => {
    const workplace: Workplace = {
      id: props.id,
      name,
      entryTime: entryTime.toISOString(),
      exitTime: exitTime.toISOString(),
      services: appliedServices,
      scale: props.scales.find(_scale => _scale.id === scale),
      address: {
        street: props.streets.find(_street => _street.id === street),
        neighborhood: props.neighborhoods.find(_neighborhood => _neighborhood.id === neighborhood),
        city: props.cities.find(_city => _city.id === city),
        district: props.districts.find(_district => _district.id === district),
        number: numberHome,
        complement,
        zipCode,
      },
    }

    if (props.workplaces.find(workplace => workplace.name === name && workplace.scale.id === scale && workplace.id !== props.id))
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
                scales={props.scales}
                scale={props.scales.find(scale => scale.id === props.scale)}
                handleChangeScale={handleChangeScale}
                handleAppendScale={props.handleAppendScale}
                handleUpdateScale={props.handleUpdateScale}
                handleRemoveScale={props.handleRemoveScale}
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
          left={not(services.map((service) => service.value), props.services.map((service) => service.value))}
          right={props.services.map((service) => service.value)}
          onChangeAppliedServices={(values) => setAppliedServices(services.filter(service => values.includes(service.value)))}
        />
        <List>
          <ListItem>
            <ListItemText primary="Endereço do Posto" />
          </ListItem>
          <ListItem>
            <div className='col'>
              <SelectStreet
                streets={props.streets}
                street={props.streets.find(_street => _street.id === street)}
                handleChangeStreet={handleChangeStreet}
                handleAppendStreet={props.handleAppendStreet}
                handleUpdateStreet={props.handleUpdateStreet}
                handleRemoveStreet={props.handleRemoveStreet}
              />
            </div>
          </ListItem>
          <ListItem>
            <div className='col'>
              <SelectNeighborhood
                neighborhoods={props.neighborhoods}
                neighborhood={props.neighborhoods.find(_neighborhood => _neighborhood.id === neighborhood)}
                handleChangeNeighborhood={handleChangeNeighborhood}
                handleAppendNeighborhood={props.handleAppendNeighborhood}
                handleUpdateNeighborhood={props.handleUpdateNeighborhood}
                handleRemoveNeighborhood={props.handleRemoveNeighborhood}
              />
            </div>
          </ListItem>
          <ListItem>
            <div className='col'>
              <SelectCity
                cities={props.cities}
                city={props.cities.find(_city => _city.id === city)}
                handleChangeCity={handleChangeCity}
                handleAppendCity={props.handleAppendCity}
                handleUpdateCity={props.handleUpdateCity}
                handleRemoveCity={props.handleRemoveCity}
              />
            </div>
          </ListItem>
          <ListItem>
            <div className='col'>
              <SelectDistrict
                districts={props.districts}
                district={props.districts.find(_district => _district.id === district)}
                handleChangeDistrict={handleChangeDistrict}
                handleAppendDistrict={props.handleAppendDistrict}
                handleUpdateDistrict={props.handleUpdateDistrict}
                handleRemoveDistrict={props.handleRemoveDistrict}
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