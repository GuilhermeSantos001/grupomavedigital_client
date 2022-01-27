/**
 * @description Lista -> Lista de coberturas operacionais lançadas
 * @author GuilhermeSantos001
 * @update 27/01/2022
 */

import { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Icon from '@/src/utils/fontAwesomeIcons'

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Backdrop from '@mui/material/Backdrop';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import ArrowCircleUp from '@mui/icons-material/ArrowCircleUp';
import ArrowCircleDown from '@mui/icons-material/ArrowCircleDown';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import CameraFrontIcon from '@mui/icons-material/CameraFront';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import MobileDatePicker from '@/components/selects/mobileDatePicker'

import hasPrivilege from '@/src/functions/hasPrivilege'
import { uploadDownload } from '@/src/functions/getUploads'

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  height: '80%',
};

import DateEx from '@/src/utils/dateEx';
import StringEx from '@/src/utils/stringEx';
import Alerting from '@/src/utils/alerting';

import { useAppSelector, useAppDispatch } from '@/app/hooks';

import {
  Posting,
  PaybackActions
} from '@/app/features/payback/payback.slice';

import type {
  Person
} from '@/app/features/system/system.slice';

export type Props = {
  postings: Posting[]
  disabledPostingRemove: boolean
  handlePostingRemove: (id: string) => void
}

export default function ListCoverageDefined(props: Props) {
  const
    workplaces = useAppSelector(state => state.system.workplaces || []),
    people = useAppSelector(state => state.system.people || []),
    reasonForAbsences = useAppSelector(state => state.system.reasonForAbsences || []),
    scales = useAppSelector(state => state.system.scales || []),
    services = useAppSelector(state => state.system.services || []);

  const dispatch = useAppDispatch();

  const [openModal, setOpenModal] = useState<{ [keyof: string]: boolean }>({});

  const
    handleModalOpen = (key: string) => setOpenModal({ ...openModal, [key]: true }),
    handleModalClose = (key: string) => setOpenModal({ ...openModal, [key]: false });

  return (
    <List className='col-12 bg-light-gray border rounded m-2'>
      {
        props.postings.length > 0 ?
          props
            .postings
            .filter(posting => !posting.managerApproval)
            .map(posting => {
              const
                coveringWorkplace = workplaces.find(place => place.id === posting.coveringWorkplace),
                coverageWorkplace = workplaces.find(place => place.id === posting.coverageWorkplace);

              let
                coveringPerson: Person | undefined = undefined,
                coveragePerson: Person | undefined = undefined,
                coveringReasonForAbsence: string | undefined = undefined;

              if (posting.covering)
                coveringPerson = people.find(person => posting.covering && person.id === posting.covering.id);

              if (posting.coverage)
                coveragePerson = people.find(person => person.id === posting.coverage.id);

              if (coveringPerson)
                coveringReasonForAbsence = reasonForAbsences.find(reason => posting.covering && reason.id === posting.covering.reasonForAbsence)?.value || "???";

              if (openModal[posting.id] === undefined)
                openModal[posting.id] = false;

              return <div key={posting.id}>
                {ModalPostingInformation(
                  openModal,
                  handleModalClose,
                  posting,
                  `${coveringWorkplace ?
                    `${coveringWorkplace.name} (${scales.find(scale => scale.id === coveringWorkplace.scale)?.value || "???"} - ${services.filter(service => coveringWorkplace.services.includes(service.id)).map(service => service.value).join(', ')})`
                    :
                    "???"
                  }`,
                  `${coverageWorkplace ?
                    `${coverageWorkplace.name} (${scales.find(scale => scale.id === coverageWorkplace.scale)?.value || "???"} - ${services.filter(service => coverageWorkplace.services.includes(service.id)).map(service => service.value).join(', ')})`
                    :
                    "Freelancer"
                  }`,
                  coveringPerson,
                  coveragePerson,
                  coveringReasonForAbsence ? coveringReasonForAbsence : 'Falta de Efetivo'
                )}
                <div key={posting.id} className='d-flex flex-column flex-md-row justify-content-center align-items-center p-2'>
                  <Chip label={DateEx.format(new Date(posting.originDate), 'dd/MM/yy')} className='bg-primary text-white fw-bold shadow ms-2' style={{ minWidth: 90 }} />
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar className='bg-danger'>
                        <ArrowCircleDown className='text-white fw-bold fs-1' />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={`Posto de Cobertura: ${coveringWorkplace?.name || "???"}`} secondary={coveringPerson ? `[${coveringPerson.matricule}] - ${coveringPerson.name}` : 'Descoberto'} />
                  </ListItem>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar className='bg-success'>
                        <ArrowCircleUp className='text-white fw-bold fs-1' />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={coverageWorkplace ? `Posto de Origem: ${coverageWorkplace.name}` : `Freelancer`} secondary={`[${coveragePerson?.matricule || "???"}] - ${coveragePerson?.name || "???"}`} />
                  </ListItem>
                  <Chip label={`Motivo: ${coveringReasonForAbsence ? coveringReasonForAbsence : 'Falta de Efetivo'}`} className='bg-danger text-white shadow me-2' style={{ minWidth: 200 }} />
                  <Chip label={`Valor: ${StringEx.maskMoney(String(posting.paymentValue))}`} className='bg-success text-white shadow' style={{ minWidth: 150 }} />
                  <div className='d-flex flex-row justify-content-center align-items-center'>
                    <Button
                      variant="outlined"
                      className='mx-2 rounded'
                      color="info"
                      onClick={() => handleModalOpen(posting.id)}
                    >
                      <InfoRoundedIcon className='fw-bold fs-3' />
                    </Button>
                    <Button
                      variant="outlined"
                      className='mx-2 rounded'
                      color="warning"
                      title={`Aprovação do Encarregado`}
                      disabled={posting.foremanApproval}
                      onClick={() => {
                        hasPrivilege('administrador', 'ope_coordenador')
                          .then((isAllowViewPage) => {
                            if (isAllowViewPage) {
                              Alerting.create('success', 'Cobertura Aprovada!');
                              dispatch(PaybackActions.UPDATE_POSTING({
                                ...posting,
                                foremanApproval: true,
                                status: 'available',
                                paymentStatus: 'payable',
                                createdAt: new Date().toISOString()
                              }));
                            } else {
                              Alerting.create('success', 'Você não tem privilegio para executar essa ação!');
                            }
                          })
                          .catch(() => {
                            Alerting.create('error', 'Não foi possível verificar seu privilégio');
                          });
                      }}
                    >
                      <CameraFrontIcon className='fw-bold fs-3' />
                    </Button>
                    <Button
                      variant="outlined"
                      className='mx-2 rounded'
                      color="inherit"
                      title={`Aprovação do Gerente`}
                      disabled={!posting.foremanApproval || posting.managerApproval}
                      onClick={() => {
                        hasPrivilege('administrador', 'ope_gerente')
                          .then((isAllowViewPage) => {
                            if (isAllowViewPage) {
                              Alerting.create('success', 'Cobertura Aprovada. Um titulo foi gerado para pagamento.');
                              dispatch(PaybackActions.UPDATE_POSTING({
                                ...posting,
                                managerApproval: true,
                                status: 'available',
                                paymentStatus: 'payable',
                                createdAt: new Date().toISOString()
                              }));
                            } else {
                              Alerting.create('success', 'Você não tem privilegio para executar essa ação!');
                            }
                          })
                          .catch(() => {
                            Alerting.create('error', 'Não foi possível verificar seu privilégio');
                          });
                      }}
                    >
                      <AdminPanelSettingsIcon className='fw-bold fs-3' />
                    </Button>
                    <Button
                      variant="outlined"
                      className='mx-2 rounded'
                      color="error"
                      disabled={props.disabledPostingRemove}
                      onClick={() => props.handlePostingRemove(posting.id)}
                    >
                      <DeleteForeverIcon className='fw-bold fs-3' />
                    </Button>
                  </div>
                </div>
              </div>
            })
          :
          <ListItem>
            <ListItemText primary='Nenhuma cobertura aplicada.' />
          </ListItem>
      }
    </List>
  );
}

function ModalPostingInformation(
  openModal: { [keyof: string]: boolean; },
  handleModalClose: (key: string) => void,
  posting: Posting,
  coveringWorkplace: string,
  coverageWorkplace: string,
  coveringPerson: Person | undefined,
  coveragePerson: Person | undefined,
  coveringReasonForAbsence: string
) {
  return <Modal
    aria-labelledby="transition-modal-title"
    aria-describedby="transition-modal-description"
    open={openModal[posting.id]}
    onClose={() => handleModalClose(posting.id)}
    closeAfterTransition
    BackdropComponent={Backdrop}
    BackdropProps={{
      timeout: 500,
    }}
  >
    <Fade in={openModal[posting.id]}>
      <Box sx={style} className='bg-light-gray rounded shadow overflow-auto'>
        <h3 className='d-flex justify-content-center align-items-center bg-primary bg-gradient text-secondary fw-bold' style={{ height: 80 }} >
          Detalhes da Cobertura
        </h3>
        <div className='d-flex flex-column flex-md-row justify-content-center align-items-center p-2'>
          <MobileDatePicker
            className="col px-2 my-2"
            label="Data da Movimentação"
            value={new Date(posting.originDate)}
            maxDate={new Date(posting.originDate)}
            minDate={new Date(posting.originDate)}
            disabled={true}
            handleChangeValue={() => { }}
          />
        </div>
        <div className='d-flex flex-column flex-md-row justify-content-center align-items-center p-2'>
          <TextField
            label="Posto de Cobertura"
            variant="outlined"
            className='col px-2 my-2'
            disabled={true}
            defaultValue={coveringWorkplace}
          />
          <TextField
            label="Posto de Origem"
            variant="outlined"
            className='col px-2 my-2'
            disabled={true}
            defaultValue={coverageWorkplace}
          />
        </div>
        <div className='d-flex flex-column flex-md-row justify-content-center align-items-center p-2'>
          <TextField
            label="Pessoa Substituída"
            variant="outlined"
            className='col px-2 my-2'
            disabled={true}
            defaultValue={coveringPerson ? `[${coveringPerson.matricule}] - ${coveringPerson.name}` : 'Descoberto'}
          />
          <TextField
            label="Pessoa Realizando a Cobertura"
            variant="outlined"
            className='col px-2 my-2'
            disabled={true}
            defaultValue={coveragePerson ? `[${coveragePerson.matricule}] - ${coveragePerson.name}` : '???'}
          />
        </div>
        <div className='d-flex flex-column flex-md-row justify-content-center align-items-center p-2'>
          {
            posting.covering && posting.covering.mirror &&
            posting.covering.mirror.fileId.length > 0 &&
            <Button
              variant="outlined"
              onClick={() => {
                if (posting.covering) {
                  uploadDownload(posting.covering.mirror.filename, posting.covering.mirror.filetype, posting.covering.mirror.fileId)
                    .catch(error => {
                      Alerting.create('error', `Não foi possível baixar o arquivo.`);
                      console.error(error);
                    })
                }
              }}
              className='col m-2'
            >
              <FontAwesomeIcon
                icon={Icon.render('fas', 'download')}
                className="me-2 flex-shrink-1 my-auto"
              />
              Espelho de Ponto da Pessoa Substituída
            </Button>
          }
          {
            posting.coverage && posting.coverage.mirror &&
            posting.coverage.mirror.fileId.length > 0 &&
            <Button
              variant="outlined"
              onClick={() => {
                if (posting.coverage) {
                  uploadDownload(posting.coverage.mirror.filename, posting.coverage.mirror.filetype, posting.coverage.mirror.fileId)
                    .catch(error => {
                      Alerting.create('error', `Não foi possível baixar o arquivo.`);
                      console.error(error);
                    })
                }
              }}
              className='col m-2'
            >
              <FontAwesomeIcon
                icon={Icon.render('fas', 'download')}
                className="me-2 flex-shrink-1 my-auto"
              />
              Espelho de Ponto da Pessoa Realizando a Cobertura
            </Button>
          }
        </div>
        <div className='d-flex flex-column flex-md-row justify-content-center align-items-center p-2'>
          <TextField
            label="Motivo"
            variant="outlined"
            className='col px-2 my-2'
            disabled={true}
            defaultValue={coveringReasonForAbsence}
          />
          <TextField
            label="Valor"
            variant="outlined"
            className='col px-2 my-2'
            disabled={true}
            defaultValue={StringEx.maskMoney(String(posting.paymentValue))}
          />
          <TextField
            label="Forma de Pagamento"
            variant="outlined"
            className='col px-2 my-2'
            disabled={true}
            defaultValue={posting.paymentMethod === 'money' ? 'Dinheiro' : 'Cartão Benefício (Alelo)'}
          />
        </div>
        <div className='d-flex flex-column flex-md-row justify-content-center align-items-center p-2'>
          <MobileDatePicker
            className="col px-2 my-2"
            label="Previsão de Pagamento"
            value={new Date(posting.paymentDatePayable)}
            maxDate={new Date(posting.paymentDatePayable)}
            minDate={new Date(posting.paymentDatePayable)}
            disabled={true}
            handleChangeValue={() => { }}
          />
        </div>
        <div className='d-flex flex-column flex-md-row justify-content-center align-items-center p-2'>
          <TextField
            label="Descrição"
            variant="outlined"
            className='col px-2 my-2'
            disabled={true}
            multiline
            rows={4}
            defaultValue={posting.description.length > 0 ? posting.description : 'Nenhuma descrição informada.'}
          />
        </div>
      </Box>
    </Fade>
  </Modal>
}