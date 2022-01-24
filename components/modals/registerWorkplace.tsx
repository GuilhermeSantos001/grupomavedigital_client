/**
 * @description Modal -> Modal de Cadastro de local de trabalho
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
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

import MobileTimePicker from '@/components/selects/mobileTimePicker'
import SelectScale from '@/components/selects/selectScale'
import SelectService from '@/components/selects/selectService'
import SelectStreet from '@/components/selects/selectStreet'
import SelectNeighborhood from '@/components/selects/selectNeighborhood'
import SelectCity from '@/components/selects/selectCity'
import SelectDistrict from '@/components/selects/selectDistrict'

import StringEx from '@/src/utils/stringEx'
import Alerting from '@/src/utils/alerting'

import { useAppDispatch, useAppSelector } from '@/app/hooks';

import {
  Workplace,
  SystemActions
} from '@/app/features/system/system.slice'

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

export default function RegisterWorkplace(props: Props) {
  const [name, setName] = useState<string>('');
  const [scale, setScale] = useState<string>('')
  const [entryTime, setEntryTime] = useState<Date>(new Date());
  const [exitTime, setExitTime] = useState<Date>(new Date());
  const [appliedServices, setAppliedServices] = useState<string[]>([]);
  const [street, setStreet] = useState<string>('')
  const [numberHome, setNumberHome] = useState<number>(0);
  const [complement, setComplement] = useState<string>('');
  const [neighborhood, setNeighborhood] = useState<string>('')
  const [city, setCity] = useState<string>('')
  const [district, setDistrict] = useState<string>('')
  const [zipCode, setZipCode] = useState<number>(0);

  const
    dispatch = useAppDispatch(),
    services = useAppSelector((state) => state.system.services || []),
    scales = useAppSelector((state) => state.system.scales || []),
    streets = useAppSelector((state) => state.system.streets || []),
    neighborhoods = useAppSelector((state) => state.system.neighborhoods || []),
    cities = useAppSelector((state) => state.system.cities || []),
    districts = useAppSelector((state) => state.system.districts || []);

  const
    handleResetInputs = () => {
      setName('');
      setScale('');
      setEntryTime(new Date());
      setExitTime(new Date());
      setAppliedServices([]);
      setStreet('');
      setNumberHome(0);
      setComplement('');
      setNeighborhood('');
      setCity('');
      setDistrict('');
      setZipCode(0);
    },
    handleChangeScale = (value: string) => setScale(value),
    handleChangeName = (value: string) => setName(value),
    handleChangeEntryTime = (value: Date) => setEntryTime(value),
    handleChangeExitTime = (value: Date) => setExitTime(value),
    handleChangeStreet = (value: string) => setStreet(value),
    handleChangeNumberHome = (value: number) => setNumberHome(value),
    handleChangeComplement = (value: string) => setComplement(value),
    handleChangeNeighborhood = (value: string) => setNeighborhood(value),
    handleChangeCity = (value: string) => setCity(value),
    handleChangeDistrict = (value: string) => setDistrict(value),
    handleChangeZipCode = (value: number) => setZipCode(value);

  const canRegisterWorkPlace = () => {
    return name.length > 0 &&
      scale.length > 0 &&
      entryTime !== null &&
      exitTime !== null &&
      appliedServices.length > 0 &&
      street.length > 0 &&
      numberHome > 0 &&
      // complement.length > 0 && // ? Complemento não é obrigatório
      neighborhood.length > 0 &&
      city.length > 0 &&
      district.length > 0 &&
      zipCode > 0
  }

  const handleRegisterWorkplace = () => {
    const workplace: Workplace = {
      id: StringEx.id(),
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
      dispatch(SystemActions.CREATE_WORKPLACE(workplace));

      handleResetInputs();
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
        onClose={() => {
          handleResetInputs();
          props.handleClose();
        }}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => {
                handleResetInputs();
                props.handleClose();
              }}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Registrar Local de Trabalho
            </Typography>
            <Button
              color="inherit"
              disabled={!canRegisterWorkPlace()}
              onClick={handleRegisterWorkplace}
            >
              Registrar
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
                handleChangeScale={handleChangeScale}
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
          left={services.map((service) => service.value)}
          right={[]}
          onChangeAppliedServices={(values) => setAppliedServices(services.filter(service => values.includes(service.value)).map(service => service.id))}
        />
        <List>
          <ListItem>
            <ListItemText primary="Endereço do Posto" />
          </ListItem>
          <ListItem>
            <div className='col'>
              <SelectStreet
                handleChangeStreet={handleChangeStreet}
              />
            </div>
          </ListItem>
          <ListItem>
            <div className='col'>
              <SelectNeighborhood
                handleChangeNeighborhood={handleChangeNeighborhood}
              />
            </div>
          </ListItem>
          <ListItem>
            <div className='col'>
              <SelectCity
                handleChangeCity={handleChangeCity}
              />
            </div>
          </ListItem>
          <ListItem>
            <div className='col'>
              <SelectDistrict
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
          color="primary"
          disabled={!canRegisterWorkPlace()}
          onClick={handleRegisterWorkplace}
        >
          Registrar
        </Button>
        <Button
          className='col-10 mx-auto my-2'
          variant="contained"
          color="error"
          onClick={() => {
            handleResetInputs();
            props.handleClose();
          }}
        >
          Cancelar
        </Button>
      </Dialog>
    </div>
  );
}