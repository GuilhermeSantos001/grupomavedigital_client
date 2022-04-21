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

import { BoxLoadingMagicSpinner } from '@/components/utils/BoxLoadingMagicSpinner';
import { BoxError } from '@/components/utils/BoxError';

import { DatePicker } from '@/components/selects/DatePicker';

import { uploadDownload } from '@/src/functions/getUploads';

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

import { PostingType } from '@/types/PostingType';
import { PersonType } from '@/types/PersonType';
import { PrivilegesSystem } from '@/types/UserType'

import { usePostingsService } from '@/services/usePostingsService';

export type Props = {
  postings: PostingType[]
  privileges: PrivilegesSystem[]
  disabledPostingRemove: boolean
  handlePostingRemove: (id: string) => void
}

export function ListCoverageDefined(props: Props) {
  const [syncData, setSyncData] = useState<boolean>(false);

  const [openModal, setOpenModal] = useState<{ [keyof: string]: boolean }>({});

  const { data: postings, isLoading: isLoadingPostings, update: UpdatePostings } = usePostingsService();

  const
    handleModalOpen = (key: string) => setOpenModal({ ...openModal, [key]: true }),
    handleModalClose = (key: string) => setOpenModal({ ...openModal, [key]: false });

  if (
    isLoadingPostings && !syncData
  )
    return <BoxLoadingMagicSpinner />

  if (!syncData && postings) {
    setSyncData(true);
  } else if (
    !syncData && !postings
    || !syncData && !UpdatePostings
  ) {
    return <BoxError />
  }

  const postingsFiltered: PostingType[] = postings.filter(posting => props.postings.find(posting2 => posting2.id === posting.id));

  return (
    <List className='col-12 bg-light-gray border rounded m-2'>
      {
        postingsFiltered.length > 0 ?
          postingsFiltered
            .filter(posting => !posting.managerApproval)
            .map(posting => {
              const
                coveringWorkplace = posting.coveringWorkplace,
                coverageWorkplace = posting.coverageWorkplace;

              let
                coveringPerson = posting.covering ? posting.covering?.person : undefined,
                coveragePerson = posting.coverage.person,
                coveringReasonForAbsence = posting.covering ? posting.covering.reasonForAbsence.value : undefined;

              if (openModal[posting.id] === undefined)
                openModal[posting.id] = false;

              return <div key={posting.id}>
                {ModalPostingInformation(
                  openModal,
                  handleModalClose,
                  posting,
                  `${coveringWorkplace ?
                    `${coveringWorkplace.name} (${coveringWorkplace.scale.value} - ${coveringWorkplace.workplaceService.map(_ => _.service.value).join(', ')})`
                    :
                    "???"
                  }`,
                  `${coverageWorkplace ?
                    `${coverageWorkplace.name} (${coverageWorkplace.scale.value} - ${coverageWorkplace.workplaceService.map(_ => _.service.value).join(', ')})`
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
                  <Chip label={`Valor: ${StringEx.maskMoney(posting.paymentValue)}`} className='bg-success text-white shadow' style={{ minWidth: 150 }} />
                </div>
                <div className='d-flex flex-row justify-content-start align-items-center'>
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
                    onClick={async () => {
                      const privileges = props.privileges.filter(
                        privilege =>
                          privilege === 'administrador' ||
                          privilege === 'ope_coordenador'
                      );

                      if (
                        props.privileges
                          .filter(privilege => privileges.indexOf(privilege) !== -1)
                          .length > 0
                      ) {
                        if (!UpdatePostings)
                          return Alerting.create('error', 'Não foi possível executar a operação. Tente novamente, mais tarde!');

                        const updated = await UpdatePostings(posting.id, {
                          ...posting,
                          foremanApproval: true,
                        });

                        if (!updated)
                          return Alerting.create('error', 'Não foi possível atualizar o registro. Tente novamente, mais tarde!');

                        Alerting.create('success', 'Cobertura Aprovada com sucesso!');
                      } else {
                        Alerting.create('error', 'Você não tem privilégios para executar esta ação!');
                      }
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
                    onClick={async () => {
                      const privileges = props.privileges.filter(
                        privilege =>
                          privilege === 'administrador' ||
                          privilege === 'ope_gerente'
                      );

                      if (
                        props.privileges
                          .filter(privilege => privileges.indexOf(privilege) !== -1)
                          .length > 0
                      ) {
                        if (!UpdatePostings)
                          return Alerting.create('error', 'Não foi possível executar a operação. Tente novamente, mais tarde!');

                        const updated = await UpdatePostings(posting.id, {
                          ...posting,
                          managerApproval: true,
                        });

                        if (!updated)
                          return Alerting.create('error', 'Não foi possível atualizar o registro. Tente novamente, mais tarde!');

                        Alerting.create('success', `Cobertura Aprovada com sucesso. Um título no valor de R$ ${StringEx.maskMoney(posting.paymentValue)} foi gerado.`);
                      } else {
                        Alerting.create('error', 'Você não tem privilégios para executar esta ação!');
                      }
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
  posting: PostingType,
  coveringWorkplace: string,
  coverageWorkplace: string,
  coveringPerson: Pick<PersonType, 'matricule' | 'name' | 'mail' | 'cards'> | undefined,
  coveragePerson: Pick<PersonType, 'matricule' | 'name' | 'mail' | 'cards'> | undefined,
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
          <DatePicker
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
                if (posting.coverage && posting.coverage.mirror) {
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
            defaultValue={StringEx.maskMoney(posting.paymentValue)}
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
          <DatePicker
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
            defaultValue={posting.description && posting.description.length > 0 ? posting.description : 'Nenhuma descrição informada.'}
          />
        </div>
      </Box>
    </Fade>
  </Modal>
}