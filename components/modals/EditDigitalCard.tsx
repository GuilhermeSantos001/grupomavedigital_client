import * as React from 'react';
import Image from 'next/image'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Chip from '@mui/material/Chip';
import IconImportContacts from '@mui/icons-material/ImportContacts';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import IconContacts from '@mui/icons-material/Contacts';
import IconFacebook from '@mui/icons-material/Facebook';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import TextField from '@mui/material/TextField';
import { TransitionProps } from '@mui/material/transitions';
import { CircularProgress } from '@mui/material';
import SaveAltRoundedIcon from '@mui/icons-material/SaveAltRounded';

import { BounceInDiv } from '@/animations/BounceInAnimation';

import { ModalLoading } from '@/components/utils/ModalLoading'
import { ModalError } from '@/components/utils/ModalError'

import {
  FilesSocketEvents,
  DigitalCardsSocketEvents
} from '@/constants/SocketEvents'

import {
  TYPEOF_EMITTER_FILE_UPLOAD_ATTACHMENT,
  TYPEOF_LISTENER_FILE_UPLOAD_ATTACHMENT,
} from '@/constants/SocketFileType'

import type {
  Input_Vcard,
  Input_Vcardmetadata
} from '@/src/generated/graphql'

import type {
  UploadType
} from '@/types/UploadType'

import type {
  StreetType
} from '@/types/StreetType'

import type {
  CityType
} from '@/types/CityType'

import type {
  DistrictType
} from '@/types/DistrictType'

import { uploadRaw } from '@/src/functions/getUploads'

import { File as IUploadFile } from '@/src/functions/singleUpload'

import type {
  DataUpload,
  FunctionCreateUploadTypeof,
  FunctionUpdateUploadsTypeof
} from '@/types/UploadServiceType'

import type {
  FunctionCreateStreetTypeof,
  FunctionUpdateStreetsTypeof,
  FunctionDeleteStreetsTypeof,
} from '@/types/StreetServiceType'

import type {
  FunctionCreateCityTypeof,
  FunctionUpdateCitiesTypeof,
  FunctionDeleteCitiesTypeof,
} from '@/types/CityServiceType'

import type {
  FunctionCreateDistrictTypeof,
  FunctionUpdateDistrictsTypeof,
  FunctionDeleteDistrictsTypeof,
} from '@/types/DistrictServiceType'

import {
  FunctionUpdateCardTypeof,
} from '@/services/graphql/useUpdateCardsService'

import {
  FunctionCreateVCardTypeof,
} from '@/services/graphql/useCreateVCardsService'

import {
  FunctionRemoveVCardTypeof
} from '@/services/graphql/useRemoveVCardsService'

import DropZone from '@/components/dropZone'

import { makePermanentUpload } from '@/src/functions/graphql/makePermanentUpload'

import Fetch from '@/src/utils/fetch'

import { DigitalCardPage, LayoutVersions } from '../cards/DigitalCardPage'

import { DatePickerWithCalenderIcon } from '@/components/selects/DatePickerWithCalenderIcon'
import { SelectStreet } from '@/components/selects/SelectStreet'
import { SelectCity } from '@/components/selects/SelectCity'
import { SelectDistrict } from '@/components/selects/SelectDistrict'

import StringEx from '@/src/utils/stringEx'
import Alerting from '@/src/utils/alerting'
import DateEx from '@/src/utils/dateEx'

import { ISocialMedia, IVCardMetadata, SelectionLayout } from '@/components/modals/RegisterDigitalCard';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export type Props = {
  open: boolean
  fetch: Fetch
  data: {
    cid: string
    version: LayoutVersions
    username: string
    jobtitle: string
    whatsappPhone: string
    whatsappText: string
    whatsappMessage: string
    workPhone: string
    cellPhone: string
    mail: string
    googleMapsLink: string
    website: string
    firstName: string
    lastName: string
    organization: string
    birthDay: Date
    street: string
    city: string
    stateProvince: string
    postalCode: string
    socialUrls: ISocialMedia
    userPhotoProfileMirrorFileId: string
    userPhotoProfileMirrorId: string
    userPhotoProfileMirrorFileRaw: string
    userLogotipoMirrorFileId: string
    userLogotipoMirrorId: string
    userLogotipoMirrorFileRaw: string
    attachmentBusinessMirrorFileId: string
    attachmentBusinessMirrorId: string
    attachmentBusinessMirrorFileRaw: string
    attachmentVCardMetadata: IVCardMetadata
    vcardMetadata: Input_Vcardmetadata
  }
  updateCardsAuthorization: string
  createVCardsAuthorization: string
  removeVCardsAuthorization: string
  makePermanentUploadAuthorization: string
  updateCard: FunctionUpdateCardTypeof
  createVCard: FunctionCreateVCardTypeof
  removeVCard: FunctionRemoveVCardTypeof
  createUpload: FunctionCreateUploadTypeof
  uploads: UploadType[]
  isLoadingUploads: boolean
  updateUploads: FunctionUpdateUploadsTypeof
  handleRemoveUploadedFile: (filesId: string[], mirrorsId: string[]) => void
  streets: StreetType[]
  isLoadingStreets: boolean
  cities: CityType[]
  isLoadingCities: boolean
  districts: DistrictType[]
  isLoadingDistricts: boolean
  createStreet: FunctionCreateStreetTypeof
  updateStreets: FunctionUpdateStreetsTypeof
  deleteStreets: FunctionDeleteStreetsTypeof
  createCity: FunctionCreateCityTypeof
  updateCities: FunctionUpdateCitiesTypeof
  deleteCities: FunctionDeleteCitiesTypeof
  createDistrict: FunctionCreateDistrictTypeof
  updateDistricts: FunctionUpdateDistrictsTypeof
  deleteDistricts: FunctionDeleteDistrictsTypeof
  auth: string
  handleClose: () => void
}

export function EditDigitalCard(props: Props) {
  const [syncData, setSyncData] = React.useState<boolean>(false)
  const [isLoadingUpdateCard, setIsLoadingUpdateCard] = React.useState<boolean>(false);

  const [cid, setCid] = React.useState<string>(props.data.cid);
  const [version, setVersion] = React.useState<LayoutVersions>(props.data.version);
  const [username, setUsername] = React.useState<string>(props.data.username);
  const [jobtitle, setJobtitle] = React.useState<string>(props.data.jobtitle);
  const [whatsappPhone, setWhatsappPhone] = React.useState<string>(props.data.whatsappPhone);
  const [whatsappText, setWhatsappText] = React.useState<string>(props.data.whatsappText);
  const [whatsappMessage, setWhatsappMessage] = React.useState<string>(props.data.whatsappMessage);
  const [workPhone, setWorkPhone] = React.useState<string>(props.data.workPhone);
  const [cellPhone, setCellPhone] = React.useState<string>(props.data.cellPhone);
  const [mail, setMail] = React.useState<string>(props.data.mail);
  const [googleMapsLink, setGoogleMapsLink] = React.useState<string>(props.data.googleMapsLink);
  const [website, setWebsite] = React.useState<string>(props.data.website);

  const countryRegion = 'Brazil';
  const label = 'Work Address';

  const [firstName, setFirstName] = React.useState<string>(props.data.firstName);
  const [lastName, setLastName] = React.useState<string>(props.data.lastName);
  const [organization, setOrganization] = React.useState<string>(props.data.organization);
  const [birthDay, setBirthDay] = React.useState<Date>(props.data.birthDay);
  const [street, setStreet] = React.useState<string>(props.data.street);
  const [city, setCity] = React.useState<string>(props.data.city);
  const [stateProvince, setStateProvince] = React.useState<string>(props.data.stateProvince);
  const [postalCode, setPostalCode] = React.useState<string>(props.data.postalCode);
  const [socialUrls, setSocialUrls] = React.useState<ISocialMedia>(props.data.socialUrls);

  const [userPhotoProfileMirrorId, setUserPhotoProfileMirrorId] = React.useState<string>('');
  const [userPhotoProfileMirrorFileId, setUserPhotoProfileMirrorFileId] = React.useState<string>('');
  const [userPhotoProfileMirrorFileName, setUserPhotoProfileMirrorFileName] = React.useState<string>('');
  const [userPhotoProfileMirrorFileType, setUserPhotoProfileMirrorFileType] = React.useState<string>('');
  const [userPhotoProfileMirrorFileRaw, setUserPhotoProfileMirrorRaw] = React.useState<string>('');

  const [userLogotipoMirrorId, setUserLogotipoMirrorId] = React.useState<string>('');
  const [userLogotipoMirrorFileId, setUserLogotipoMirrorFileId] = React.useState<string>('');
  const [userLogotipoMirrorFileName, setUserLogotipoMirrorFileName] = React.useState<string>('');
  const [userLogotipoMirrorFileType, setUserLogotipoMirrorFileType] = React.useState<string>('');
  const [userLogotipoMirrorFileRaw, setUserLogotipoMirrorRaw] = React.useState<string>('');

  const [attachmentBusinessMirrorId, setAttachmentBusinessMirrorId] = React.useState<string>('');
  const [attachmentBusinessMirrorFileId, setAttachmentBusinessMirrorFileId] = React.useState<string>('');
  const [attachmentBusinessMirrorFileName, setAttachmentBusinessMirrorFileName] = React.useState<string>('');
  const [attachmentBusinessMirrorFileType, setAttachmentBusinessMirrorFileType] = React.useState<string>('');
  const [attachmentBusinessMirrorFileRaw, setAttachmentBusinessMirrorFileRaw] = React.useState<string>('');

  const [attachmentVCardMetadata, setAttachmentVCardMetadata] = React.useState<IVCardMetadata>(props.data.attachmentVCardMetadata);

  const [currentTab, setCurrentTab] = React.useState<string>('1');

  const {
    createUpload,
    uploads,
    isLoadingUploads,
    updateUploads,
    handleRemoveUploadedFile,
    streets,
    isLoadingStreets,
    cities,
    isLoadingCities,
    districts,
    isLoadingDistricts,
    createStreet,
    updateStreets,
    deleteStreets,
    createCity,
    updateCities,
    deleteCities,
    createDistrict,
    updateDistricts,
    deleteDistricts,
  } = props;

  if (
    isLoadingUploads && !syncData
    || isLoadingStreets && !syncData
    || isLoadingCities && !syncData
    || isLoadingDistricts && !syncData
  )
    return <ModalLoading
      header='Atualizar Cartão Digital'
      message='Carregando...'
      show={props.open}
      handleClose={props.handleClose}
    />

  if (
    !syncData
    && uploads
  ) {
    setSyncData(true);
  } else if (
    !syncData && !uploads
    || !syncData && !updateUploads
    || !syncData && !streets
    || !syncData && !updateStreets
    || !syncData && !deleteStreets
    || !syncData && !cities
    || !syncData && !updateCities
    || !syncData && !deleteCities
    || !syncData && !districts
    || !syncData && !updateDistricts
    || !syncData && !deleteDistricts
  ) {
    return <ModalError
      header='Atualizar Cartão Digital'
      show={props.open}
      handleClose={props.handleClose}
    />
  }

  const
    handleChangeCurrentTab = (event: React.SyntheticEvent, newValue: string) => setCurrentTab(newValue),
    handleChangeCid = (cid: string) => setCid(cid),
    handleVersion = (version: LayoutVersions) => setVersion(version),
    handleUsername = (username: string) => setUsername(username),
    handleJobtitle = (jobtitle: string) => setJobtitle(jobtitle),
    handleWhatsappPhone = (phone: string) => setWhatsappPhone(phone),
    handleWhatsappText = (text: string) => setWhatsappText(text),
    handleWhatsappMessage = (message: string) => setWhatsappMessage(message),
    handleWorkPhone = (phone: string) => setWorkPhone(phone),
    handleCellPhone = (phone: string) => setCellPhone(phone),
    handleMail = (mail: string) => setMail(mail),
    handleGoogleMapsLink = (link: string) => setGoogleMapsLink(link),
    handleWebsite = (website: string) => setWebsite(website),
    handleChangeUserPhotoProfileMirrorId = (id: string) => setUserPhotoProfileMirrorId(id),
    handleChangeUserPhotoProfileMirrorFileId = (fileId: string) => setUserPhotoProfileMirrorFileId(fileId),
    handleChangeUserPhotoProfileMirrorFileName = (fileName: string) => setUserPhotoProfileMirrorFileName(fileName),
    handleChangeUserPhotoProfileMirrorFileType = (fileType: string) => setUserPhotoProfileMirrorFileType(fileType),
    handleChangeUserPhotoProfileMirrorFileRaw = (fileRaw: string) => setUserPhotoProfileMirrorRaw(fileRaw),
    handleChangeUserLogotipoMirrorId = (id: string) => setUserLogotipoMirrorId(id),
    handleChangeUserLogotipoMirrorFileId = (fileId: string) => setUserLogotipoMirrorFileId(fileId),
    handleChangeUserLogotipoMirrorFileName = (fileName: string) => setUserLogotipoMirrorFileName(fileName),
    handleChangeUserLogotipoMirrorFileType = (fileType: string) => setUserLogotipoMirrorFileType(fileType),
    handleChangeUserLogotipoMirrorFileRaw = (fileRaw: string) => setUserLogotipoMirrorRaw(fileRaw),
    handleChangeAttachmentBusinessMirrorId = (id: string) => setAttachmentBusinessMirrorId(id),
    handleChangeAttachmentBusinessMirrorFileId = (fileId: string) => setAttachmentBusinessMirrorFileId(fileId),
    handleChangeAttachmentBusinessMirrorFileName = (fileName: string) => setAttachmentBusinessMirrorFileName(fileName),
    handleChangeAttachmentBusinessMirrorFileType = (fileType: string) => setAttachmentBusinessMirrorFileType(fileType),
    handleChangeAttachmentBusinessMirrorFileRaw = (fileRaw: string) => setAttachmentBusinessMirrorFileRaw(fileRaw),
    handleChangeAttachmentVCardMetadata = (metadata: string | { path: string, name: string, type: string }) => setAttachmentVCardMetadata(metadata),
    handleAppendUploads = async (data: DataUpload, type: 'photoProfile' | 'logotipo' | 'attachmentBusiness') => {
      try {
        if (
          type === 'photoProfile'
        ) {
          if (
            userPhotoProfileMirrorFileId.length > 0 &&
            userPhotoProfileMirrorId.length > 0
          )
            handleRemoveUploadedFile([userPhotoProfileMirrorFileId], [userPhotoProfileMirrorId]);
        }
        else if (
          type === 'logotipo'
        ) {
          if (
            userLogotipoMirrorFileId.length > 0 &&
            userLogotipoMirrorId.length > 0
          )
            handleRemoveUploadedFile([userLogotipoMirrorFileId], [userLogotipoMirrorId]);
        }
        else if (
          type === 'attachmentBusiness'
        ) {
          if (
            attachmentBusinessMirrorFileId.length > 0 &&
            attachmentBusinessMirrorId.length > 0
          )
            handleRemoveUploadedFile([attachmentBusinessMirrorFileId], [attachmentBusinessMirrorId]);
        }

        const upload = await createUpload(data);

        if (!upload)
          throw new Error('Não foi possível criar o anexo.');

        return upload.data.id;
      } catch (error) {
        Alerting.create('error', error instanceof Error ? error.message : JSON.stringify(error));
      }
    },
    handleUpdateUploads = async (id: string, fileId: string, newData: DataUpload) => {
      if (!updateUploads)
        throw new Error('Não foi possível atualizar o upload. Tente novamente, mais tarde!');

      try {
        await makePermanentUpload({ fileId }, {
          authorization: props.makePermanentUploadAuthorization,
          encodeuri: "false"
        });
        await updateUploads(id, newData);
      } catch (error) {
        Alerting.create('error', error instanceof Error ? error.message : JSON.stringify(error));
      }
    },
    handleChangeFirstName = (firstName: string) => setFirstName(firstName),
    handleChangeLastName = (lastName: string) => setLastName(lastName),
    handleChangeOrganization = (organization: string) => setOrganization(organization),
    handleChangeBirthDay = (birthDay: Date) => setBirthDay(birthDay),
    handleChangeStreet = (street: string) => setStreet(street),
    handleChangeCity = (city: string) => setCity(city),
    handleChangeStateProvince = (stateProvince: string) => setStateProvince(stateProvince),
    handleChangePostalCode = (postalCode: string) => setPostalCode(postalCode),
    handleChangeSocialUrls = (socialUrls: ISocialMedia) => setSocialUrls(socialUrls),
    canHandleConfirm = () => {
      if (
        jobtitle.length > 0 &&
        whatsappMessage.length > 0 &&
        whatsappText.length > 0 &&
        whatsappPhone.length > 0 &&
        workPhone.length > 0 &&
        cellPhone.length > 0 &&
        mail.length > 0 &&
        googleMapsLink.length > 0 &&
        website.length > 0 &&
        firstName.length > 0 &&
        lastName.length > 0 &&
        organization.length > 0 &&
        street.length > 0 &&
        city.length > 0 &&
        stateProvince.length > 0 &&
        postalCode.length > 0 &&
        Object.keys(socialUrls).filter(key => socialUrls[key].length > 0).length > 0 &&
        userPhotoProfileMirrorId.length > 0 &&
        userLogotipoMirrorId.length > 0 &&
        attachmentBusinessMirrorId.length > 0
      )
        return false;

      return true;
    }

  onSocketEvents(
    handleAppendUploads,
    handleChangeUserPhotoProfileMirrorId,
    handleChangeUserPhotoProfileMirrorFileId,
    handleChangeUserPhotoProfileMirrorFileName,
    handleChangeUserPhotoProfileMirrorFileType,
    handleChangeUserPhotoProfileMirrorFileRaw,
    handleChangeUserLogotipoMirrorId,
    handleChangeUserLogotipoMirrorFileId,
    handleChangeUserLogotipoMirrorFileName,
    handleChangeUserLogotipoMirrorFileType,
    handleChangeUserLogotipoMirrorFileRaw,
    handleChangeAttachmentBusinessMirrorId,
    handleChangeAttachmentBusinessMirrorFileId,
    handleChangeAttachmentBusinessMirrorFileName,
    handleChangeAttachmentBusinessMirrorFileType,
    handleChangeAttachmentBusinessMirrorFileRaw,
  )

  return (
    <Dialog
      fullScreen
      open={props.open}
      onClose={props.handleClose}
      TransitionComponent={Transition}
    >
      <AppBar position="sticky">
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
            Atualizar Cartão Digital
          </Typography>
          <Button autoFocus color="inherit" onClick={props.handleClose}>
            Sair
          </Button>
        </Toolbar>
      </AppBar>
      <List>
        <div className="d-flex flex-column flex-md-row p-2">
          <div className="col-12 col-md-8 border-end p-2">
            <TabContext value={currentTab}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList variant='fullWidth' onChange={handleChangeCurrentTab} aria-label="Tabela de informações do Cartão Digital">
                  <Tab icon={<IconImportContacts />} label="Informações" value="1" />
                  <Tab icon={<IconContacts />} label="Cartão de Contato" value="2" />
                  <Tab icon={<IconFacebook />} label="Redes Sociais" value="3" />
                </TabList>
              </Box>
              <TabPanel value="1">
                <BounceInDiv duration='800ms'>
                  <ListItem>
                    <TextField
                      label="ID Exclusivo do cartão digital"
                      placeholder='Deixe em branco para gerar um ID exclusivo aleatório'
                      variant="standard"
                      className="col-12"
                      value={cid}
                      onChange={(e) => handleChangeCid(e.target.value)}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    {SelectionLayout(version, handleVersion)}
                  </ListItem>
                  <Divider />
                  <div className="d-flex flex-row">
                    <div className="p-2 w-100 bd-highlight">
                      <ListItemText primary="Foto de Perfil" />
                    </div>
                    <div className="p-2 flex-shrink-1 bd-highlight">
                      <Chip icon={
                        userPhotoProfileMirrorFileRaw.length <= 0 ?
                          <CheckBoxOutlineBlankIcon /> :
                          <CheckBoxIcon />
                      } label={
                        userPhotoProfileMirrorFileRaw.length <= 0 ?
                          'Campo Obrigatório' : 'Campo Preenchido'
                      }
                      />
                    </div>
                  </div>
                  <ListItem className="col-12">
                    <DropZone
                      fetch={props.fetch}
                      auth={props.auth}
                      ext={['.png', '.jpg', '.gif']}
                      maxSize={5000000}
                      limit={1}
                      randomName={true}
                      onCallbackAfterUpload={async (files) => {
                        const
                          emitCreateFile = async (
                            authorId: string,
                            name: string,
                            description: string,
                            size: number,
                            compressedSize: number,
                            fileId: string,
                            version: number
                          ) => window.socket.emit(
                            FilesSocketEvents.FILE_UPLOAD_ATTACHMENT,
                            window.socket.compress<TYPEOF_EMITTER_FILE_UPLOAD_ATTACHMENT>({
                              channel: DigitalCardsSocketEvents.DIGITAL_CARDS_UPLOAD_USER_PHOTO,
                              authorId,
                              name,
                              description,
                              size,
                              compressedSize,
                              fileId,
                              version
                            }))

                        const
                          { authorId, name, size, compressedSize, fileId, version } = files as IUploadFile,
                          description = `Arquivo enviado na "Atualização do Cartão Digital". Foto de Perfil.`;

                        emitCreateFile(authorId, name, description, size, compressedSize, fileId, version);
                      }}
                    />
                  </ListItem>
                  <Divider />
                  <div className="d-flex flex-row">
                    <div className="p-2 w-100 bd-highlight">
                      <ListItemText primary="Apresentação Comercial" />
                    </div>
                    <div className="p-2 flex-shrink-1 bd-highlight">
                      <Chip icon={
                        attachmentBusinessMirrorFileRaw.length <= 0 ?
                          <CheckBoxOutlineBlankIcon /> :
                          <CheckBoxIcon />
                      } label={
                        attachmentBusinessMirrorFileRaw.length <= 0 ?
                          'Campo Obrigatório' : 'Campo Preenchido'
                      }
                      />
                    </div>
                  </div>
                  <ListItem className="col-12">
                    <DropZone
                      fetch={props.fetch}
                      auth={props.auth}
                      ext={['.pdf']}
                      maxSize={50000000}
                      limit={1}
                      randomName={true}
                      onCallbackAfterUpload={async (files) => {
                        const
                          emitCreateFile = async (
                            authorId: string,
                            name: string,
                            description: string,
                            size: number,
                            compressedSize: number,
                            fileId: string,
                            version: number
                          ) => window.socket.emit(
                            FilesSocketEvents.FILE_UPLOAD_ATTACHMENT,
                            window.socket.compress<TYPEOF_EMITTER_FILE_UPLOAD_ATTACHMENT>({
                              channel: DigitalCardsSocketEvents.DIGITAL_CARDS_UPLOAD_ATTACHMENT_BUSINESS,
                              authorId,
                              name,
                              description,
                              size,
                              compressedSize,
                              fileId,
                              version
                            }))

                        const
                          { authorId, name, size, compressedSize, fileId, version } = files as IUploadFile,
                          description = `Arquivo enviado na "Atualização do Cartão Digital". Apresentação Comercial.`;

                        emitCreateFile(authorId, name, description, size, compressedSize, fileId, version);
                      }}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <TextField
                      label="Nome"
                      variant="standard"
                      className="col-12"
                      value={username}
                      onChange={(e) => handleUsername(e.target.value)}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <TextField
                      label="Cargo"
                      variant="standard"
                      className="col-12"
                      value={jobtitle}
                      onChange={(e) => handleJobtitle(e.target.value)}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <TextField
                      label="Número do Whatsapp"
                      variant="standard"
                      className="col-12"
                      value={StringEx.maskPhone(whatsappPhone, 'cell')}
                      onChange={(e) => handleWhatsappPhone(StringEx.removeMaskNumToString(e.target.value, 'cell'))}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <TextField
                      multiline
                      label="Texto do Whatsapp"
                      variant="standard"
                      className="col-12"
                      value={whatsappText}
                      onChange={(e) => handleWhatsappText(e.target.value)}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <TextField
                      multiline
                      label="Mensagem de Compartilhamento"
                      variant="standard"
                      className="col-12"
                      value={whatsappMessage}
                      onChange={(e) => handleWhatsappMessage(e.target.value)}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <TextField
                      label="Telefone de Trabalho"
                      variant="standard"
                      className="col-12"
                      value={StringEx.maskPhone(workPhone, 'tel')}
                      onChange={(e) => handleWorkPhone(StringEx.removeMaskNumToString(e.target.value, 'tel'))}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <TextField
                      label="Celular"
                      variant="standard"
                      className="col-12"
                      value={StringEx.maskPhone(cellPhone, 'cell')}
                      onChange={(e) => handleCellPhone(StringEx.removeMaskNumToString(e.target.value, 'cell'))}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <TextField
                      type={'email'}
                      label="E-mail"
                      variant="standard"
                      className="col-12"
                      value={mail}
                      onChange={(e) => handleMail(e.target.value)}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <TextField
                      type={'url'}
                      label="Google Maps Link"
                      variant="standard"
                      className="col-12"
                      value={googleMapsLink}
                      onChange={(e) => handleGoogleMapsLink(e.target.value)}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <TextField
                      type={'url'}
                      label="Link do Site"
                      variant="standard"
                      className="col-12"
                      value={website}
                      onChange={(e) => handleWebsite(e.target.value)}
                    />
                  </ListItem>
                </BounceInDiv>
              </TabPanel>
              <TabPanel value="2">
                <BounceInDiv duration='800ms'>
                  <div className="d-flex flex-row">
                    <div className="p-2 w-100 bd-highlight">
                      <ListItemText primary="Logotipo" />
                    </div>
                    <div className="p-2 flex-shrink-1 bd-highlight">
                      <Chip icon={
                        userLogotipoMirrorFileRaw.length <= 0 ?
                          <CheckBoxOutlineBlankIcon /> :
                          <CheckBoxIcon />
                      } label={
                        userLogotipoMirrorFileRaw.length <= 0 ?
                          'Campo Obrigatório' : 'Campo Preenchido'
                      }
                      />
                    </div>
                  </div>
                  <div className="d-flex flex-column flex-md-row align-self-center justify-content-center rounded py-3">
                    <Image
                      src={userLogotipoMirrorFileRaw.length > 0 || props.data.userLogotipoMirrorFileRaw.length > 0 ? userLogotipoMirrorFileRaw || props.data.userLogotipoMirrorFileRaw : `/favicon/favicon512.png`}
                      alt={props.data.username}
                      className="rounded-circle"
                      width={150}
                      height={150}
                    />
                  </div>
                  <ListItem className="col-12">
                    <DropZone
                      fetch={props.fetch}
                      auth={props.auth}
                      ext={['.png', '.jpg', '.gif']}
                      maxSize={5000000}
                      limit={1}
                      randomName={true}
                      onCallbackAfterUpload={async (files) => {
                        const
                          emitCreateFile = async (
                            authorId: string,
                            name: string,
                            description: string,
                            size: number,
                            compressedSize: number,
                            fileId: string,
                            version: number
                          ) => window.socket.emit(
                            FilesSocketEvents.FILE_UPLOAD_ATTACHMENT,
                            window.socket.compress<TYPEOF_EMITTER_FILE_UPLOAD_ATTACHMENT>({
                              channel: DigitalCardsSocketEvents.DIGITAL_CARDS_UPLOAD_USER_LOGOTIPO,
                              authorId,
                              name,
                              description,
                              size,
                              compressedSize,
                              fileId,
                              version
                            }))

                        const
                          { authorId, name, size, compressedSize, fileId, version } = files as IUploadFile,
                          description = `Arquivo enviado na "Atualização do Cartão Digital". Logotipo.`;

                        emitCreateFile(authorId, name, description, size, compressedSize, fileId, version);
                      }}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <TextField
                      type="text"
                      label="Primeiro Nome"
                      variant="standard"
                      className="col-12"
                      value={firstName}
                      onChange={(e) => handleChangeFirstName(e.target.value)}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <TextField
                      type="text"
                      label="Último Nome"
                      variant="standard"
                      className="col-12"
                      value={lastName}
                      onChange={(e) => handleChangeLastName(e.target.value)}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <TextField
                      type="text"
                      label="Organização"
                      variant="standard"
                      className="col-12"
                      value={organization}
                      onChange={(e) => handleChangeOrganization(e.target.value)}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <DatePickerWithCalenderIcon
                      label='Aniversario'
                      className='col-12'
                      minDate={DateEx.subYears(new Date(), 100)}
                      maxDate={new Date()}
                      value={birthDay}
                      handleChangeValue={handleChangeBirthDay}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <SelectStreet
                      street={street.length > 0 ? streets.find(_ => _.id === street) : null}
                      streets={streets}
                      isLoadingStreets={isLoadingStreets}
                      createStreet={createStreet}
                      updateStreets={updateStreets}
                      deleteStreets={deleteStreets}
                      handleChangeId={handleChangeStreet}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <SelectCity
                      city={city.length > 0 ? cities.find(_ => _.id === city) : null}
                      cities={cities}
                      isLoadingCities={isLoadingCities}
                      createCity={createCity}
                      updateCities={updateCities}
                      deleteCities={deleteCities}
                      handleChangeId={handleChangeCity}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <SelectDistrict
                      district={stateProvince.length > 0 ? districts.find(_ => _.id === stateProvince) : null}
                      districts={districts}
                      isLoadingDistricts={isLoadingDistricts}
                      createDistrict={createDistrict}
                      updateDistricts={updateDistricts}
                      deleteDistricts={deleteDistricts}
                      handleChangeId={handleChangeStateProvince}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <TextField
                      type="text"
                      label="CEP"
                      variant="standard"
                      className="col-12"
                      value={StringEx.maskZipcode(postalCode)}
                      onChange={(e) => handleChangePostalCode(StringEx.removeMaskNumToString(e.target.value, 'zipcode'))}
                    />
                  </ListItem>
                  <Divider />
                </BounceInDiv>
              </TabPanel>
              <TabPanel value="3">
                <BounceInDiv duration='800ms'>
                  <ListItem>
                    <TextField
                      type="text"
                      label="Facebook"
                      variant="standard"
                      className="col-12"
                      value={socialUrls.facebook}
                      onChange={(e) => handleChangeSocialUrls({ ...socialUrls, facebook: e.target.value })}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <TextField
                      type="text"
                      label="Youtube"
                      variant="standard"
                      className="col-12"
                      value={socialUrls.youtube}
                      onChange={(e) => handleChangeSocialUrls({ ...socialUrls, youtube: e.target.value })}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <TextField
                      type="text"
                      label="Linkedin"
                      variant="standard"
                      className="col-12"
                      value={socialUrls.linkedin}
                      onChange={(e) => handleChangeSocialUrls({ ...socialUrls, linkedin: e.target.value })}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <TextField
                      type="text"
                      label="Instagram"
                      variant="standard"
                      className="col-12"
                      value={socialUrls.instagram}
                      onChange={(e) => handleChangeSocialUrls({ ...socialUrls, instagram: e.target.value })}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <TextField
                      type="text"
                      label="Twitter"
                      variant="standard"
                      className="col-12"
                      value={socialUrls.twitter}
                      onChange={(e) => handleChangeSocialUrls({ ...socialUrls, twitter: e.target.value })}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <TextField
                      type="text"
                      label="Tiktok"
                      variant="standard"
                      className="col-12"
                      value={socialUrls.tiktok}
                      onChange={(e) => handleChangeSocialUrls({ ...socialUrls, tiktok: e.target.value })}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <TextField
                      type="text"
                      label="Flickr"
                      variant="standard"
                      className="col-12"
                      value={socialUrls.flickr}
                      onChange={(e) => handleChangeSocialUrls({ ...socialUrls, flickr: e.target.value })}
                    />
                  </ListItem>
                  <Divider />
                </BounceInDiv>
              </TabPanel>
            </TabContext>
            <Divider />
            <BounceInDiv duration='800ms'>
              <ListItem>
                <Button
                  className="col-12"
                  variant="contained"
                  disabled={canHandleConfirm() || isLoadingUpdateCard}
                  startIcon={isLoadingUpdateCard ?
                    <CircularProgress size={24} /> :
                    <SaveAltRoundedIcon />
                  }
                  onClick={async () => {
                    try {
                      setIsLoadingUpdateCard(true);

                      // * Deleta o upload da foto de perfil antiga
                      if (
                        props.data.userPhotoProfileMirrorFileId.length > 0 &&
                        props.data.userPhotoProfileMirrorId.length > 0
                      )
                        handleRemoveUploadedFile([props.data.userPhotoProfileMirrorFileId], [props.data.userPhotoProfileMirrorId]);

                      // * Deleta o upload do logotipo antigo
                      if (
                        props.data.userLogotipoMirrorFileId.length > 0 &&
                        props.data.userLogotipoMirrorId.length > 0
                      )
                        handleRemoveUploadedFile([props.data.userLogotipoMirrorFileId], [props.data.userLogotipoMirrorId]);

                      // * Deleta o upload da apresentação comercial antiga
                      if (
                        props.data.attachmentBusinessMirrorFileId.length > 0 &&
                        props.data.attachmentBusinessMirrorId.length > 0
                      )
                        handleRemoveUploadedFile([props.data.attachmentBusinessMirrorFileId], [props.data.attachmentBusinessMirrorId]);

                      const vcard: Input_Vcard = {
                        firstname: firstName,
                        lastname: lastName,
                        organization,
                        birthday: {
                          day: birthDay.getDate(),
                          month: birthDay.getMonth() + 1,
                          year: birthDay.getFullYear()
                        },
                        street: streets.find(_ => _.id === street).value,
                        city: cities.find(_ => _.id === city).value,
                        stateProvince: districts.find(_ => _.id === stateProvince).value,
                        countryRegion,
                        label,
                        postalCode,
                        title: jobtitle,
                        email: mail,
                        logo: {
                          id: userLogotipoMirrorFileId,
                          mirrorId: userLogotipoMirrorId,
                          name: userLogotipoMirrorFileName,
                          type: userLogotipoMirrorFileType,
                        },
                        photo: {
                          id: userPhotoProfileMirrorFileId,
                          mirrorId: userPhotoProfileMirrorId,
                          name: userPhotoProfileMirrorFileName,
                          type: userPhotoProfileMirrorFileType,
                        },
                        url: website,
                        workUrl: website,
                        workPhone: [
                          workPhone,
                          cellPhone
                        ],
                        socialUrls: Object.keys(socialUrls)
                          .filter(media => socialUrls[media].length > 0)
                          .map(media => {
                            return {
                              media,
                              url: socialUrls[media]
                            }
                          })
                      }

                      // * Remove o arquivo antigo do Cartão de Contato (VCARD)
                      await props.removeVCard({
                        metadata: {
                          ...props.data.vcardMetadata
                        }
                      }, {
                        authorization: props.removeVCardsAuthorization,
                        encodeuri: "false"
                      })

                      // * Cria o arquivo do Cartão de Contato (VCARD)
                      const metadata = await props.createVCard({
                        data: vcard
                      }, {
                        authorization: props.createVCardsAuthorization,
                        encodeuri: "false"
                      });

                      const cardId = await props.updateCard({
                        id: props.data.cid,
                        data: {
                          author: props.auth,
                          name: username,
                          jobtitle,
                          whatsapp: {
                            message: whatsappMessage,
                            text: whatsappText,
                            phone: whatsappPhone
                          },
                          phones: [
                            workPhone,
                            cellPhone
                          ],
                          photo: {
                            id: userPhotoProfileMirrorFileId,
                            mirrorId: userPhotoProfileMirrorId,
                            name: userPhotoProfileMirrorFileName,
                            type: userPhotoProfileMirrorFileType,
                          },
                          vcard: {
                            ...vcard,
                            metadata
                          },
                          id: cid,
                          version,
                          footer: {
                            attachment: {
                              id: attachmentBusinessMirrorFileId,
                              mirrorId: attachmentBusinessMirrorId,
                              name: attachmentBusinessMirrorFileName,
                              type: attachmentBusinessMirrorFileType,
                            },
                            email: mail,
                            location: googleMapsLink,
                            socialmedia: Object.keys(socialUrls)
                              .filter(media => socialUrls[media].length > 0)
                              .map(media => {
                                return {
                                  name: media,
                                  enabled: true,
                                  value: socialUrls[media]
                                }
                              }),
                            website
                          }
                        }
                      }, {
                        authorization: props.updateCardsAuthorization,
                        encodeuri: "false"
                      });

                      // ! Atualiza o status da foto de perfil para upload permanente
                      await handleUpdateUploads(userPhotoProfileMirrorId, userPhotoProfileMirrorFileId, {
                        ...uploads.find(upload => upload.id === userPhotoProfileMirrorId),
                        temporary: false,
                      });

                      // ! Atualiza o status da logotipo para upload permanente
                      await handleUpdateUploads(userLogotipoMirrorId, userLogotipoMirrorFileId, {
                        ...uploads.find(upload => upload.id === userLogotipoMirrorId),
                        temporary: false,
                      });

                      // ! Atualiza o status da apresentação comercial para upload permanente
                      await handleUpdateUploads(attachmentBusinessMirrorId, attachmentBusinessMirrorFileId, {
                        ...uploads.find(upload => upload.id === attachmentBusinessMirrorId),
                        temporary: false,
                      });

                      handleChangeAttachmentVCardMetadata({
                        path: metadata.file.path,
                        name: metadata.file.name,
                        type: metadata.file.type,
                      });

                      Alerting.create('success', `Cartão Digital (${cardId}) criado com sucesso!`);
                    } catch (error) {
                      // ! Remove o upload da foto de perfil
                      handleRemoveUploadedFile([userPhotoProfileMirrorFileId], [userPhotoProfileMirrorId]);

                      // ! Remove o upload do logotipo
                      handleRemoveUploadedFile([userLogotipoMirrorFileId], [userLogotipoMirrorId]);

                      // ! Remove o upload da apresentação comercial
                      handleRemoveUploadedFile([attachmentBusinessMirrorFileId], [attachmentBusinessMirrorId]);

                      console.error(error);
                      Alerting.create('error', 'Não foi possível criar o seu cartão digital. Contacte o administrador.')
                    } finally {
                      setIsLoadingUpdateCard(false);
                      props.handleClose();
                    }
                  }}
                >
                  Confirmar
                </Button>
              </ListItem>
            </BounceInDiv>
          </div>
          <div className="col-12 col-md p-2">
            <ListItem className="d-flex flex-column p-2">
              <div className="d-flex d-md-none rounded shadow mx-auto">
                <DigitalCardPage
                  cid={cid}
                  version={version}
                  username={username}
                  photoProfile={
                    userPhotoProfileMirrorFileId.length <= 0 ?
                      { id: props.data.userPhotoProfileMirrorFileId, raw: props.data.userPhotoProfileMirrorFileRaw }
                      : { id: userPhotoProfileMirrorFileId, raw: userPhotoProfileMirrorFileRaw }
                  }
                  jobtitle={jobtitle}
                  whatsapp={{
                    phone: whatsappPhone,
                    text: whatsappText,
                    message: whatsappMessage,
                  }}
                  workPhone={workPhone}
                  cellPhone={cellPhone}
                  mail={mail}
                  googleMapsLink={googleMapsLink}
                  website={website}
                  attachmentBusiness={
                    attachmentBusinessMirrorFileId.length <= 0 ? {
                      raw: props.data.attachmentBusinessMirrorFileRaw
                    } :
                      { raw: attachmentBusinessMirrorFileRaw }
                  }
                  attachmentVCard={attachmentVCardMetadata}
                  socialmedia={{
                    facebook: socialUrls.facebook,
                    youtube: socialUrls.youtube,
                    linkedin: socialUrls.linkedin,
                    instagram: socialUrls.instagram,
                    twitter: socialUrls.twitter,
                    tiktok: socialUrls.tiktok,
                    flickr: socialUrls.flickr,
                  }}
                />
              </div>
              <div className="d-none d-md-flex rounded shadow mx-auto position-fixed" style={{ marginTop: -50, width: 430, transform: 'scale(.90)' }}>
                <DigitalCardPage
                  cid={cid}
                  version={version}
                  username={username}
                  photoProfile={
                    userPhotoProfileMirrorFileId.length <= 0 ?
                      { id: props.data.userPhotoProfileMirrorFileId, raw: props.data.userPhotoProfileMirrorFileRaw }
                      : { id: userPhotoProfileMirrorFileId, raw: userPhotoProfileMirrorFileRaw }
                  }
                  jobtitle={jobtitle}
                  whatsapp={{
                    phone: whatsappPhone,
                    text: whatsappText,
                    message: whatsappMessage,
                  }}
                  workPhone={workPhone}
                  cellPhone={cellPhone}
                  mail={mail}
                  googleMapsLink={googleMapsLink}
                  website={website}
                  attachmentBusiness={
                    attachmentBusinessMirrorFileId.length <= 0 ? {
                      raw: props.data.attachmentBusinessMirrorFileRaw
                    } :
                      { raw: attachmentBusinessMirrorFileRaw }
                  }
                  attachmentVCard={attachmentVCardMetadata}
                  socialmedia={{
                    facebook: socialUrls.facebook,
                    youtube: socialUrls.youtube,
                    linkedin: socialUrls.linkedin,
                    instagram: socialUrls.instagram,
                    twitter: socialUrls.twitter,
                    tiktok: socialUrls.tiktok,
                    flickr: socialUrls.flickr,
                  }}
                />
              </div>
            </ListItem>
          </div>
        </div>
      </List>
    </Dialog>
  );
}

/**
 * @description Adiciona os ouvintes dos eventos do socket.io
 */
function onSocketEvents(
  handleAppendUploads: (data: DataUpload, type: 'photoProfile' | 'logotipo' | 'attachmentBusiness') => Promise<string | undefined>,
  handleChangeUserPhotoProfileMirrorId: (id: string) => void,
  handleChangeUserPhotoProfileMirrorFileId: (fileId: string) => void,
  handleChangeUserPhotoProfileMirrorFileName: (fileName: string) => void,
  handleChangeUserPhotoProfileMirrorFileType: (fileType: string) => void,
  handleChangeUserPhotoProfileMirrorFileRaw: (raw: string) => void,
  handleChangeUserLogotipoMirrorId: (id: string) => void,
  handleChangeUserLogotipoMirrorFileId: (fileId: string) => void,
  handleChangeUserLogotipoMirrorFileName: (fileName: string) => void,
  handleChangeUserLogotipoMirrorFileType: (fileType: string) => void,
  handleChangeUserLogotipoMirrorFileRaw: (raw: string) => void,
  handleChangeAttachmentBusinessMirrorId: (id: string) => void,
  handleChangeAttachmentBusinessMirrorFileId: (fileId: string) => void,
  handleChangeAttachmentBusinessMirrorFileName: (fileName: string) => void,
  handleChangeAttachmentBusinessMirrorFileType: (fileType: string) => void,
  handleChangeAttachmentBusinessMirrorFileRaw: (raw: string) => void,
) {
  const socket = window.socket;

  if (socket) {
    const
      events = [
        `${DigitalCardsSocketEvents.DIGITAL_CARDS_UPLOAD_USER_PHOTO}-SUCCESS`,
        `${DigitalCardsSocketEvents.DIGITAL_CARDS_UPLOAD_USER_PHOTO}-FAILURE`,
        `${DigitalCardsSocketEvents.DIGITAL_CARDS_UPLOAD_USER_LOGOTIPO}-SUCCESS`,
        `${DigitalCardsSocketEvents.DIGITAL_CARDS_UPLOAD_USER_LOGOTIPO}-FAILURE`,
        `${DigitalCardsSocketEvents.DIGITAL_CARDS_UPLOAD_ATTACHMENT_BUSINESS}-SUCCESS`,
        `${DigitalCardsSocketEvents.DIGITAL_CARDS_UPLOAD_ATTACHMENT_BUSINESS}-FAILURE`,
      ]

    events
      .forEach(event => {
        if (socket.hasListeners(event))
          socket.off(event);
      })

    socket
      .on(
        events[0], // * DIGITAL-CARDS-UPLOAD-USER-PHOTO-SUCCESS
        async (
          data: string
        ) => {
          const {
            authorId,
            fileId,
            filename,
            filetype,
            description,
            size,
            compressedSize,
            temporary,
            version,
            expiredAt,
          } = window.socket.decompress<TYPEOF_LISTENER_FILE_UPLOAD_ATTACHMENT>(data);

          const id = await handleAppendUploads({
            authorId,
            fileId,
            filename,
            filetype,
            description,
            size,
            compressedSize,
            temporary,
            version,
            expiredAt,
          }, 'photoProfile');

          if (!id)
            return Alerting.create('error', 'Erro ao salvar o arquivo.');

          const raw = await uploadRaw(filename, filetype, fileId);

          handleChangeUserPhotoProfileMirrorId(id);
          handleChangeUserPhotoProfileMirrorFileId(fileId);
          handleChangeUserPhotoProfileMirrorFileName(filename);
          handleChangeUserPhotoProfileMirrorFileType(filetype);
          handleChangeUserPhotoProfileMirrorFileRaw(raw);

          Alerting.create('success', 'Foto alterada com sucesso!');
        }
      )

    socket
      .on(
        events[1], // * DIGITAL-CARDS-UPLOAD-USER-PHOTO-FAILURE
        (error: string) => console.error(error)
      )

    socket
      .on(
        events[2], // * DIGITAL-CARDS-UPLOAD-USER-LOGOTIPO-FAILURE
        async (
          data: string
        ) => {
          const {
            authorId,
            fileId,
            filename,
            filetype,
            description,
            size,
            compressedSize,
            temporary,
            version,
            expiredAt,
          } = window.socket.decompress<TYPEOF_LISTENER_FILE_UPLOAD_ATTACHMENT>(data);

          const id = await handleAppendUploads({
            authorId,
            fileId,
            filename,
            filetype,
            description,
            size,
            compressedSize,
            temporary,
            version,
            expiredAt,
          }, 'logotipo');

          if (!id)
            return Alerting.create('error', 'Erro ao salvar o arquivo.');

          const raw = await uploadRaw(filename, filetype, fileId);

          handleChangeUserLogotipoMirrorId(id);
          handleChangeUserLogotipoMirrorFileId(fileId);
          handleChangeUserLogotipoMirrorFileName(filename);
          handleChangeUserLogotipoMirrorFileType(filetype);
          handleChangeUserLogotipoMirrorFileRaw(raw);

          Alerting.create('success', 'Logotipo alterado com sucesso!');
        }
      )

    socket
      .on(
        events[3], // * DIGITAL-CARDS-UPLOAD-USER-LOGOTIPO-FAILURE
        (error: string) => console.error(error)
      )

    socket
      .on(
        events[4], // * DIGITAL-CARDS-UPLOAD-ATTACHMENT-BUSINESS-SUCCESS
        async (
          data: string
        ) => {
          const {
            authorId,
            fileId,
            filename,
            filetype,
            description,
            size,
            compressedSize,
            temporary,
            version,
            expiredAt,
          } = window.socket.decompress<TYPEOF_LISTENER_FILE_UPLOAD_ATTACHMENT>(data);

          const id = await handleAppendUploads({
            authorId,
            fileId,
            filename,
            filetype,
            description,
            size,
            compressedSize,
            temporary,
            version,
            expiredAt,
          }, 'attachmentBusiness');

          if (!id)
            return Alerting.create('error', 'Erro ao salvar o arquivo.');

          const raw = await uploadRaw(filename, filetype, fileId, { type: 'application/pdf' });

          handleChangeAttachmentBusinessMirrorId(id);
          handleChangeAttachmentBusinessMirrorFileId(fileId);
          handleChangeAttachmentBusinessMirrorFileName(filename);
          handleChangeAttachmentBusinessMirrorFileType(filetype);
          handleChangeAttachmentBusinessMirrorFileRaw(raw);

          Alerting.create('success', 'Apresentação comercial alterada com sucesso!');
        }
      )

    socket
      .on(
        events[5], // * DIGITAL-CARDS-UPLOAD-ATTACHMENT-BUSINESS-FAILURE
        (error: string) => console.error(error)
      )
  }
}