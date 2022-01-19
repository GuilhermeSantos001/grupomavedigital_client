/**
 * @description Modal -> Modal de Edição das pessoas
 * @author GuilhermeSantos001
 * @update 18/01/2022
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

import MobileDatePicker from '@/components/selects/mobileDatePicker'
import SelectScale from '@/components/selects/selectScale'
import SelectService from '@/components/selects/selectService'
import SelectStreet from '@/components/selects/selectStreet'
import SelectNeighborhood from '@/components/selects/selectNeighborhood'
import SelectCity from '@/components/selects/selectCity'
import SelectDistrict from '@/components/selects/selectDistrict'

import DateEx from '@/src/utils/dateEx'
import StringEx from '@/src/utils/stringEx'
import ArrayEx from '@/src/utils/arrayEx'
import Alerting from '@/src/utils/alerting'

import { useAppDispatch, useAppSelector } from '@/app/hooks';

import {
  Person,
  SystemActions
} from '@/app/features/system/system.slice'

export interface Props {
  show: boolean
  id: string
  matricule: number
  name: string
  cpf: string
  rg: string
  motherName: string
  birthDate: string
  phone: string
  mail: string
  scale: string
  cards: string[]
  services: string[]
  street: string
  numberHome: number
  complement: string
  neighborhood: string
  city: string
  district: string
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

export default function RegisterPeople(props: Props) {
  const [matricule, setMatricule] = useState<number>(props.matricule)
  const [name, setName] = useState<string>(props.name)
  const [cpf, setCPF] = useState<string>(props.cpf)
  const [rg, setRG] = useState<string>(props.rg)
  const [motherName, setMotherName] = useState<string>(props.motherName)
  const [birthDate, setBirthDate] = useState<Date>(new Date(props.birthDate))
  const [phone, setPhone] = useState<string>(props.phone)
  const [mail, setMail] = useState<string>(props.mail)
  const [scale, setScale] = useState<string>(props.scale)
  const [appliedServices, setAppliedServices] = useState<string[]>(props.services)
  const [street, setStreet] = useState<string>(props.street)
  const [numberHome, setNumberHome] = useState<number>(props.numberHome)
  const [complement, setComplement] = useState<string>(props.complement)
  const [neighborhood, setNeighborhood] = useState<string>(props.neighborhood)
  const [city, setCity] = useState<string>(props.city)
  const [district, setDistrict] = useState<string>(props.district)
  const [zipCode, setZipCode] = useState<number>(props.zipCode)

  const
    dispatch = useAppDispatch(),
    lotItems = useAppSelector(state => state.payback.lotItems || []),
    services = useAppSelector((state) => state.system.services || []),
    scales = useAppSelector((state) => state.system.scales || []),
    streets = useAppSelector((state) => state.system.streets || []),
    neighborhoods = useAppSelector((state) => state.system.neighborhoods || []),
    cities = useAppSelector((state) => state.system.cities || []),
    districts = useAppSelector((state) => state.system.districts || []);

  const
    handleChangeScale = (value: string) => setScale(value),
    handleChangeMatricule = (value: number) => setMatricule(value),
    handleChangeName = (value: string) => setName(value),
    handleChangeCPF = (value: string) => setCPF(value),
    handleChangeRG = (value: string) => setRG(value),
    handleChangeMotherName = (value: string) => setMotherName(value),
    handleChangeBirthDate = (value: Date) => setBirthDate(value),
    handleChangePhone = (value: string) => setPhone(value),
    handleChangeMail = (value: string) => setMail(value),
    handleChangeStreet = (value: string) => setStreet(value),
    handleChangeNumberHome = (value: number) => setNumberHome(value),
    handleChangeComplement = (value: string) => setComplement(value),
    handleChangeNeighborhood = (value: string) => setNeighborhood(value),
    handleChangeCity = (value: string) => setCity(value),
    handleChangeDistrict = (value: string) => setDistrict(value),
    handleChangeZipCode = (value: number) => setZipCode(value);

  const
    canEditPerson = () => {
      return name.length > 0 &&
        matricule > 0 &&
        cpf.length > 0 &&
        rg.length > 0 &&
        motherName.length > 0 &&
        birthDate != null &&
        phone.length > 0 &&
        mail.length > 0 &&
        scale.length > 0 &&
        appliedServices.length > 0 &&
        street.length > 0 &&
        numberHome > 0 &&
        // complement.length > 0 && // ? Complemento não é obrigatório
        neighborhood.length > 0 &&
        city.length > 0 &&
        district.length > 0 &&
        zipCode > 0
    },
    servicesAvailables = () => {
      const available = ArrayEx.not(services.map((service) => service.id), props.services.map((service) => service));

      return services
        .filter(service => available.includes(service.id))
        .map(service => service.value)
    };

  const handleEditPerson = () => {
    const person: Person = {
      id: props.id,
      matricule,
      name,
      cpf,
      rg,
      motherName,
      birthDate: birthDate.toISOString(),
      phone,
      mail,
      services: appliedServices,
      scale: scales.find(_scale => _scale.id === scale).id,
      cards: lotItems.filter(_lotItem => props.cards.includes(`${_lotItem.id} - ${_lotItem.lastCardNumber}`)).map(_lotItem => `${_lotItem.id} - ${_lotItem.lastCardNumber}`),
      status: 'available',
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

    try {
      dispatch(SystemActions.UPDATE_PERSON(person));
      props.handleClose();
    } catch(error) {
      Alerting.create('error', error.message);
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
              Editar Funcionário
            </Typography>
            <Button
              color="inherit"
              disabled={!canEditPerson()}
              onClick={handleEditPerson}
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
              label="Matrícula"
              variant="standard"
              value={StringEx.maskMatricule(String(matricule).padStart(5, '0'))}
              onChange={(e) => handleChangeMatricule(parseInt(e.target.value))}
            />
          </ListItem>
          <ListItem>
            <TextField
              className='col'
              label="Nome Completo"
              variant="standard"
              value={name}
              onChange={(e) => handleChangeName(e.target.value)}
            />
          </ListItem>
          <ListItem>
            <TextField
              className='col'
              label="CPF"
              variant="standard"
              value={StringEx.maskCPF(cpf)}
              onChange={(e) => handleChangeCPF(StringEx.removeMaskNum(e.target.value))}
            />
          </ListItem>
          <ListItem>
            <TextField
              className='col'
              label="RG"
              variant="standard"
              value={StringEx.maskRG(rg)}
              onChange={(e) => handleChangeRG(StringEx.removeMaskNum(e.target.value))}
            />
          </ListItem>
          <ListItem>
            <TextField
              className='col'
              label="Nome da Mãe"
              variant="standard"
              value={motherName}
              onChange={(e) => handleChangeMotherName(e.target.value)}
            />
          </ListItem>
          <ListItem>
            <TextField
              className='col'
              label="Celular"
              variant="standard"
              value={StringEx.maskPhone(phone)}
              onChange={(e) => handleChangePhone(StringEx.removeMaskNum(e.target.value))}
            />
          </ListItem>
          <ListItem>
            <TextField
              className='col'
              label="E-mail"
              variant="standard"
              value={mail}
              onChange={(e) => handleChangeMail(e.target.value)}
            />
          </ListItem>
        </List>
        <List>
          <ListItem>
            <MobileDatePicker
              className='col-12'
              label="Data de Nascimento"
              value={birthDate}
              maxDate={DateEx.addYears(DateEx.subYears(new Date(), 75), 55)}
              minDate={DateEx.subYears(new Date(), 75)}
              handleChangeValue={handleChangeBirthDate}
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
            <ListItemText primary="Funções da Pessoa" />
          </ListItem>
        </List>
        <SelectService
          left={servicesAvailables()}
          right={services.filter((service) => props.services.includes(service.id)).map((service) => service.value)}
          onChangeAppliedServices={(values) => setAppliedServices(services.filter(service => values.includes(service.value)).map(service => service.id))}
        />
        <List>
          <ListItem>
            <ListItemText primary="Endereço" />
          </ListItem>
          <ListItem>
            <div className='col'>
              <SelectStreet
                street={streets.find(street => street.id === props.street)}
                handleChangeStreet={handleChangeStreet}
              />
            </div>
          </ListItem>
          <ListItem>
            <div className='col'>
              <SelectNeighborhood
                neighborhood={neighborhoods.find(neighborhood => neighborhood.id === props.neighborhood)}
                handleChangeNeighborhood={handleChangeNeighborhood}
              />
            </div>
          </ListItem>
          <ListItem>
            <div className='col'>
              <SelectCity
                city={cities.find(city => city.id === props.city)}
                handleChangeCity={handleChangeCity}
              />
            </div>
          </ListItem>
          <ListItem>
            <div className='col'>
              <SelectDistrict
                district={districts.find(district => district.id === props.district)}
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
              onChange={(e) => handleChangeNumberHome(parseInt(e.target.value))}
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
          disabled={!canEditPerson()}
          onClick={handleEditPerson}
        >
          Atualizar
        </Button>
      </Dialog>
    </div>
  );
}