/**
 * @description Modal -> Modal de Edição de local de trabalho
 * @author GuilhermeSantos001
 * @update 24/01/2022
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
import UpdateIcon from '@mui/icons-material/Update';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

import { TimePicker } from '@/components/selects/TimePicker';
import { SelectScale } from '@/components/selects/SelectScale';
import { SelectService } from '@/components/selects/SelectService';
import { SelectStreet } from '@/components/selects/SelectStreet';
import { SelectNeighborhood } from '@/components/selects/SelectNeighborhood';
import { SelectCity } from '@/components/selects/SelectCity';
import { SelectDistrict } from '@/components/selects/SelectDistrict';

import Alerting from '@/src/utils/alerting'
import ArrayEx from '@/src/utils/arrayEx'
import StringEx from '@/src/utils/stringEx'

import { useAppDispatch, useAppSelector } from '@/app/hooks';

import {
  Workplace,
  SystemActions,
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
  const [name, setName] = useState<string>(props.name);
  const [entryTime, setEntryTime] = useState<Date>(new Date(props.entryTime));
  const [exitTime, setExitTime] = useState<Date>(new Date(props.exitTime));
  const [appliedServices, setAppliedServices] = useState<string[]>(props.services);
  const [numberHome, setNumberHome] = useState<number>(props.numberHome);
  const [complement, setComplement] = useState<string>(props.complement);
  const [zipCode, setZipCode] = useState<number>(props.zipCode);
  const [scale, setScale] = useState<string>(props.scale);
  const [street, setStreet] = useState<string>(props.street);
  const [neighborhood, setNeighborhood] = useState<string>(props.neighborhood);
  const [city, setCity] = useState<string>(props.city);
  const [district, setDistrict] = useState<string>(props.district);

  const
    dispatch = useAppDispatch(),
    services = useAppSelector((state) => state.system.services || []),
    scales = useAppSelector((state) => state.system.scales || []),
    streets = useAppSelector((state) => state.system.streets || []),
    neighborhoods = useAppSelector((state) => state.system.neighborhoods || []),
    cities = useAppSelector((state) => state.system.cities || []),
    districts = useAppSelector((state) => state.system.districts || []);

  const
    handleChangeName = (value: string) => setName(value),
    handleChangeScale = (value: string) => setScale(value),
    handleChangeEntryTime = (value: Date) => setEntryTime(value),
    handleChangeExitTime = (value: Date) => setExitTime(value),
    handleChangeNumberHome = (value: number) => setNumberHome(value),
    handleChangeComplement = (value: string) => setComplement(value),
    handleChangeZipCode = (value: number) => setZipCode(value),
    handleChangeStreet = (value: string) => setStreet(value),
    handleChangeNeighborhood = (value: string) => setNeighborhood(value),
    handleChangeCity = (value: string) => setCity(value),
    handleChangeDistrict = (value: string) => setDistrict(value);

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
      const available = ArrayEx.returnItemsOfANotContainInB(services.map((service) => service.id), props.services.map((service) => service));

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
      scale: scales.find(_scale => _scale.id === scale)?.id || "",
      address: {
        street: streets.find(_street => _street.id === street)?.id || "",
        neighborhood: neighborhoods.find(_neighborhood => _neighborhood.id === neighborhood)?.id || "",
        city: cities.find(_city => _city.id === city)?.id || "",
        district: districts.find(_district => _district.id === district)?.id || "",
        number: numberHome,
        complement,
        zipCode,
      },
    }

    try {
      dispatch(SystemActions.UPDATE_WORKPLACE(workplace));
      props.handleClose();
    } catch (error) {
      Alerting.create('error', error instanceof Error ? error.message : JSON.stringify(error));
    }
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
              Editar Local de Trabalho
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
                scale={scales.find(scale => scale.id === props.scale)}
                handleChangeScale={handleChangeScale}
              />
            </div>
          </ListItem>
          <ListItem>
            <TimePicker
              className='col-12'
              label="Horário de Entrada"
              value={entryTime}
              handleChangeValue={handleChangeEntryTime}
            />
          </ListItem>
          <ListItem>
            <TimePicker
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
                street={streets.find(_street => _street.id === street)}
                handleChangeStreet={handleChangeStreet}
              />
            </div>
          </ListItem>
          <ListItem>
            <div className='col'>
              <SelectNeighborhood
                neighborhood={neighborhoods.find(_neighborhood => _neighborhood.id === neighborhood)}
                handleChangeNeighborhood={handleChangeNeighborhood}
              />
            </div>
          </ListItem>
          <ListItem>
            <div className='col'>
              <SelectCity
                city={cities.find(_city => _city.id === city)}
                handleChangeCity={handleChangeCity}
              />
            </div>
          </ListItem>
          <ListItem>
            <div className='col'>
              <SelectDistrict
                district={districts.find(_district => _district.id === district)}
                handleChangeDistrict={handleChangeDistrict}
              />
            </div>
          </ListItem>
          <ListItem>
            <TextField
              className='col'
              label="Número"
              variant="standard"
              value={StringEx.maskHouseNumber(String(numberHome).padStart(4, '0'))}
              onChange={(e) => handleChangeNumberHome(parseInt(StringEx.removeMaskNum(e.target.value)))}
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
              value={StringEx.maskZipcode(String(zipCode).padStart(8, '0'))}
              onChange={(e) => handleChangeZipCode(parseInt(StringEx.removeMaskNum(e.target.value)))}
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