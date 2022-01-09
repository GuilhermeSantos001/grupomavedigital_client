/**
 * @description Modal -> Modal de Cadastro de pessoa
 * @author GuilhermeSantos001
 * @update 08/01/2022
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

import MobileDatePicker from '@/components/inputs/mobileDatePicker'
import SelectScale from '@/components/inputs/selectScale'
import SelectService from '@/components/inputs/selectService'
import SelectCard from '@/components/inputs/selectCard'
import SelectStreet from '@/components/inputs/selectStreet'
import SelectNeighborhood from '@/components/inputs/selectNeighborhood'
import SelectCity from '@/components/inputs/selectCity'
import SelectDistrict from '@/components/inputs/selectDistrict'

import StringEx from '@/src/utils/stringEx'
import Alerting from '@/src/utils/alerting'

import { useAppDispatch, useAppSelector } from '@/app/hooks';

import {
  Person,
  appendPerson,
} from '@/app/features/system/system.slice'

import {
  LotItem,
  editItemLot
} from '@/app/features/payback/payback.slice'

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

export default function RegisterPeople(props: Props) {
  const [matricule, setMatricule] = useState<number>(0)
  const [name, setName] = useState<string>('')
  const [cpf, setCPF] = useState<string>('')
  const [rg, setRG] = useState<string>('')
  const [motherName, setMotherName] = useState<string>('')
  const [birthDate, setBirthDate] = useState<Date>(null)
  const [phone, setPhone] = useState<string>('')
  const [mail, setMail] = useState<string>('')
  const [scale, setScale] = useState<string>('')
  const [appliedCards, setAppliedCards] = useState<string[]>([])
  const [appliedServices, setAppliedServices] = useState<string[]>([])
  const [street, setStreet] = useState<string>('')
  const [numberHome, setNumberHome] = useState<number>(0)
  const [complement, setComplement] = useState<string>('')
  const [neighborhood, setNeighborhood] = useState<string>('')
  const [city, setCity] = useState<string>('')
  const [district, setDistrict] = useState<string>('')
  const [zipCode, setZipCode] = useState<number>(0)

  const
    dispatch = useAppDispatch(),
    people = useAppSelector(state => state.system.people),
    lotItems = useAppSelector(state => state.payback.lotItems || []),
    services = useAppSelector((state) => state.system.services || []),
    scales = useAppSelector((state) => state.system.scales || []),
    streets = useAppSelector((state) => state.system.streets || []),
    neighborhoods = useAppSelector((state) => state.system.neighborhoods || []),
    cities = useAppSelector((state) => state.system.cities || []),
    districts = useAppSelector((state) => state.system.districts || []);

  const
    handleResetInputs = () => {
      setMatricule(0)
      setName('');
      setCPF('');
      setRG('');
      setMotherName('');
      setBirthDate(null);
      setPhone('');
      setMail('');
      setScale('');
      setAppliedCards([]);
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

  const canRegisterPerson = () => {
    return name.length > 0 &&
      matricule > 0 &&
      cpf.length > 0 &&
      rg.length > 0 &&
      motherName.length > 0 &&
      birthDate != null &&
      phone.length > 0 &&
      mail.length > 0 &&
      appliedCards.length > 0 &&
      scale.length > 0 &&
      appliedServices.length > 0 &&
      street.length > 0 &&
      numberHome > 0 &&
      // complement.length > 0 && // ? Complemento não é obrigatório
      neighborhood.length > 0 &&
      city.length > 0 &&
      district.length > 0 &&
      zipCode > 0
  }

  const handleRegisterPerson = () => {
    const person: Person = {
      id: StringEx.id(),
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
      cards: lotItems.filter(_lotItem => appliedCards.includes(`${_lotItem.id} - ${_lotItem.lastCardNumber}`)).map(_lotItem => `${_lotItem.id} - ${_lotItem.lastCardNumber}`),
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

    if (people.find(_person =>
      _person.matricule === matricule ||
      _person.cpf === cpf ||
      _person.rg === rg ||
      _person.cards.filter(card => appliedCards.includes(card)).length > 0
    ))
      return Alerting.create('Já existe uma pessoa com esses dados.');

    // ? Associa o cartão a pessoa
    lotItems
      .filter(
        _lotItem => appliedCards.includes(`${_lotItem.id} - ${_lotItem.lastCardNumber}`)
      )
      .forEach(
        _lotItem => {
          const card: LotItem = {
            ..._lotItem,
            person: person.id
          }

          dispatch(editItemLot(card));
        })

    dispatch(appendPerson(person));
    handleResetInputs();
    props.handleClose();
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
              Registrar Funcionário
            </Typography>
            <Button
              color="inherit"
              disabled={!canRegisterPerson()}
              onClick={handleRegisterPerson}
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
              label="Matrícula"
              variant="standard"
              value={String(matricule).padStart(6, '0')}
              onChange={(e) => {
                const value = parseInt(e.target.value);

                if (value >= 0 && value <= 999999)
                  handleChangeMatricule(value)
              }}
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
              value={cpf}
              onChange={(e) => handleChangeCPF(e.target.value)}
            />
          </ListItem>
          <ListItem>
            <TextField
              className='col'
              label="RG"
              variant="standard"
              value={rg}
              onChange={(e) => handleChangeRG(e.target.value)}
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
              value={phone}
              onChange={(e) => handleChangePhone(e.target.value)}
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
              handleChangeValue={handleChangeBirthDate}
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
            <div className='col'>
              <SelectCard
                handleChangeCard={(cards) => setAppliedCards(cards)}
              />
            </div>
          </ListItem>
          <ListItem>
            <ListItemText primary="Funções da Pessoa" />
          </ListItem>
        </List>
        <SelectService
          left={services.map((service) => service.value)}
          right={[]}
          onChangeAppliedServices={(values) => setAppliedServices(services.filter(service => values.includes(service.value)).map(service => service.id))}
        />
        <List>
          <ListItem>
            <ListItemText primary="Endereço" />
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
          color="primary"
          disabled={!canRegisterPerson()}
          onClick={handleRegisterPerson}
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