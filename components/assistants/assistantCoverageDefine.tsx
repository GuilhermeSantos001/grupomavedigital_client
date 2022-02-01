/**
 * @description Assistente -> Definição de cobertura
 * @author GuilhermeSantos001
 * @update 27/01/2022
 */

import { useState } from 'react'

import { PaybackSocketEvents } from '@/constants/socketEvents';

import {
  TYPEOF_EMITTER_PAYBACK_UPLOAD_MIRROR,
  TYPEOF_LISTENER_PAYBACK_UPLOAD_MIRROR,
  TYPEOF_EMITTER_PAYBACK_CHANGE_TYPE_MIRROR,
  TYPEOF_LISTENER_PAYBACK_CHANGE_TYPE_MIRROR,
} from '@/constants/SocketTypes';

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import StepContent from '@mui/material/StepContent'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { CardActionArea } from '@mui/material';
import Divider from '@mui/material/Divider';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Icon from '@/src/utils/fontAwesomeIcons'

import Fetch from '@/src/utils/fetch'
import { uploadDownload } from '@/src/functions/getUploads'
import { getUserAuth } from '@/pages/storage/index'
import Alerting from '@/src/utils/alerting'
import StringEx from '@/src/utils/stringEx'
import DateEx from '@/src/utils/dateEx'

import MobileDatePicker from '@/components/selects/mobileDatePicker'

import SelectReasonForAbsence from '@/components/selects/selectReasonForAbsence';
import DropZone from '@/components/dropZone';

import { useAppSelector, useAppDispatch } from '@/app/hooks';

import {
  Upload,
  SystemActions,
} from '@/app/features/system/system.slice';

import {
  Posting,
  PaybackActions,
} from '@/app/features/payback/payback.slice';

export type Props = {
  show: boolean;
  availableWorkplaces: string[]
  availablePeopleInWorkplace: string[]
  postingCostCenter: string;
  periodStart: Date
  periodEnd: Date
  handleClose: () => void;
  handleFinish: (postings: Posting[]) => void;
}

export default function AssistantCoverageDefine(props: Props) {
  const [activeStep, setActiveStep] = useState(0);

  const [originDate, setOriginDate] = useState(props.periodStart);
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [paymentValue, setPaymentValue] = useState<number>(0);
  const [paymentDatePayable, setPaymentDatePayable] = useState<Date>(props.periodEnd);

  const [coveringWorkplace, setCoveringWorkplace] = useState<string>('');
  const [coveringPersonId, setCoveringPersonId] = useState<string>('');
  const [coveringReasonForAbsence, setCoveringReasonForAbsence] = useState<string>('');
  const [coveringMirrorFileId, setCoveringMirrorFileId] = useState<string>('');
  const [coveringMirrorFileName, setCoveringMirrorFileName] = useState<string>('');
  const [coveringMirrorFileType, setCoveringMirrorFileType] = useState<string>('');
  const [coveringModality, setCoveringModality] = useState<string>('');

  const [coverageWorkplace, setCoverageWorkplace] = useState<string>('');
  const [coveragePersonId, setCoveragePersonId] = useState<string>('');
  const [coverageMirrorFileId, setCoverageMirrorFileId] = useState<string>('');
  const [coverageMirrorFileName, setCoverageMirrorFileName] = useState<string>('');
  const [coverageMirrorFileType, setCoverageMirrorFileType] = useState<string>('');

  const [postings, setPostings] = useState<Posting[]>([]);
  const [postingType, setPostingType] = useState<string>('');
  const [postingDescription, setPostingDescription] = useState<string>('');

  const
    workplaces = useAppSelector(state => state.system.workplaces || []),
    people = useAppSelector(state => state.system.people || []),
    reasonForAbsences = useAppSelector(state => state.system.reasonForAbsences || []),
    scales = useAppSelector(state => state.system.scales || []),
    services = useAppSelector(state => state.system.services || []),
    lotItems = useAppSelector(state => state.payback.lotItems || []),
    costCenters = useAppSelector(state => state.system.costCenters || []),
    uploads = useAppSelector(state => state.system.uploads || []);

  const
    dispatch = useAppDispatch(),
    uploadMakeTemporary = (fileId: string) => {
      try {
        const upload = uploads.find(upload => upload.fileId === fileId);

        if (upload)
          dispatch(SystemActions.UPDATE_UPLOAD({
            ...upload,
            temporary: true
          }))
        else
          throw new Error('Upload não encontrado');
      } catch (error) {
        Alerting.create('error', error instanceof Error ? error.message : JSON.stringify(error));
      }
    },
    uploadMakePermanent = (fileId: string) => {
      try {
        const upload = uploads.find(upload => upload.fileId === fileId);

        if (upload)
          dispatch(SystemActions.UPDATE_UPLOAD({
            ...upload,
            temporary: false
          }))
        else
          throw new Error('Upload não encontrado');
      } catch (error) {
        Alerting.create('error', error instanceof Error ? error.message : JSON.stringify(error));
      }
    },
    clearInputs = () => {
      setActiveStep(0);

      setOriginDate(props.periodStart);
      setPaymentMethod('');
      setPaymentValue(0);
      setPaymentDatePayable(props.periodEnd);

      setCoveringWorkplace('');
      setCoveringPersonId('');
      setCoveringReasonForAbsence('');
      setCoveringMirrorFileId('');
      setCoveringMirrorFileName('');
      setCoveringMirrorFileType('');
      setCoveringModality('');

      setCoverageWorkplace('');
      setCoveragePersonId('');
      setCoverageMirrorFileId('');
      setCoverageMirrorFileName('');
      setCoverageMirrorFileType('');

      setPostings([]);
      setPostingType('');
      setPostingDescription('');
    },
    hasChangeStep = (step: number) => {
      // ? Passo 1° -> Data de Origem
      if (step === 0) {
        if (originDate === null) {
          Alerting.create('warning', 'Data de origem não definida.');
          return false;
        }
      }
      // ? Passo 2° -> Tipo de Movimentação
      else if (step === 1) {
        if (postingType === '') {
          Alerting.create('warning', 'Tipo de Movimentação não definida.');
          return false;
        }
      }
      // ? Passo 3° -> Local de Trabalho
      else if (step === 2) {
        if (coveringWorkplace === '') {
          Alerting.create('warning', 'Local de trabalho não definido.');
          return false;
        }
      }
      // ? Passo 4° -> Funcionário(a)
      else if (step === 3) {
        // ! Falta do Efetivo
        if (postingType === 'absence_person')
          if (coveringPersonId === '') {
            Alerting.create('warning', 'Funcionário(a) não definido.');
            return false;
          }
      }
      // ? Passo 5° -> Motivo da Ausência
      else if (step === 4) {
        // ! Falta do Efetivo
        if (postingType === 'absence_person')
          if (coveringReasonForAbsence === '') {
            Alerting.create('warning', 'Motivo da ausência não definido.');
            return false;
          }
      }
      // ? Passo 6° -> Espelho de Ponto
      else if (step === 5) {
        // ! Falta do Efetivo
        if (postingType === 'absence_person')
          if (coveringMirrorFileId === '') {
            Alerting.create('warning', 'Espelho de ponto não definido.');
            return false;
          }
      }
      // ? Passo 7° -> Modalidade de Cobertura
      else if (step === 6) {
        if (coveringModality === '') {
          Alerting.create('warning', 'Modalidade de cobertura não definida.');
          return false;
        }
      }
      // ? Passo 8° -> Modalidade -> Folga Trabalhada
      else if (
        step === 7 &&
        coveringModality === 'ft'
      ) {
        if (coverageWorkplace === '') {
          Alerting.create('warning', 'Local de trabalho não definido.');
          return false;
        }

        if (coveragePersonId === '') {
          Alerting.create('warning', 'Funcionário(a) não definido.');
          return false;
        }

        if (coverageMirrorFileId === '') {
          Alerting.create('warning', 'Espelho de ponto não definido.');
          return false;
        }
      }
      // ? Passo 8° -> Modalidade -> Freelancer
      else if (
        step === 7 &&
        coveringModality === 'free'
      ) {
        if (coveragePersonId === '') {
          Alerting.create('warning', 'Funcionário(a) não definido.');
          return false;
        }
      }
      // ? Passo 9° -> Forma de Pagamento
      else if (step === 8) {
        if (paymentMethod === '') {
          Alerting.create('warning', 'Forma de pagamento não definida.');
          return false;
        }
      }
      // ? Passo 10° -> Valor do Pagamento
      else if (step === 9) {
        if (paymentValue === 0) {
          Alerting.create('warning', 'Valor do pagamento não definido.');
          return false;
        }
      }
      // ? Passo 11° -> Data há Pagar
      else if (step === 10) {
        if (paymentDatePayable === null) {
          Alerting.create('warning', 'Data de pagamento não definida.');
          return false;
        }
      }

      return true;
    },
    handleNext = () => {
      if (hasChangeStep(activeStep)) {
        if (
          // ! Falta do Efetivo
          postingType === 'absence_person' ||
          postingType === ''
        ) {
          setActiveStep((prevActiveStep) => prevActiveStep + 1);
        } else if (
          // ! Falta de Efetivo
          postingType === 'lack_people'
        ) {
          setActiveStep((prevActiveStep) => prevActiveStep === 2 ? 6 : prevActiveStep + 1);
        }
      }
    },
    handleBack = () => {
      if (
        // ! Falta do Efetivo
        postingType === 'absence_person' ||
        postingType === ''
      ) {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
      } else if (
        // ! Falta de Efetivo
        postingType === 'lack_people'
      ) {
        setActiveStep((prevActiveStep) => prevActiveStep === 6 ? 2 : prevActiveStep - 1);
      }
    },
    handleFinish = () => {
      if (paymentDatePayable === null)
        return Alerting.create('warning', 'Data de pagamento não definida.');

      window.loading = 'show';

      // ! Confirma o anexo dos espelhos de ponto
      setTimeout(() => {
        window.socket.emit(
          PaybackSocketEvents.PAYBACK_CHANGE_TYPE_MIRROR,
          window.socket.compress<TYPEOF_EMITTER_PAYBACK_CHANGE_TYPE_MIRROR>({
            filesId: [
              coveringMirrorFileId,
              coverageMirrorFileId,
            ],
            type: 'PERMANENT'
          })
        );
      }, 1000);

      if (window.socket.hasListeners(`${PaybackSocketEvents.PAYBACK_CHANGE_TYPE_MIRROR}-SUCCESS`))
        window.socket.off(`${PaybackSocketEvents.PAYBACK_CHANGE_TYPE_MIRROR}-SUCCESS`);

      if (window.socket.hasListeners(`${PaybackSocketEvents.PAYBACK_CHANGE_TYPE_MIRROR}-FAILURE`))
        window.socket.off(`${PaybackSocketEvents.PAYBACK_CHANGE_TYPE_MIRROR}-FAILURE`);

      window
        .socket.
        on(
          `${PaybackSocketEvents.PAYBACK_CHANGE_TYPE_MIRROR}-SUCCESS`,
          async (data: string) => {
            const {
              filesId,
              type,
            } = window.socket.decompress<TYPEOF_LISTENER_PAYBACK_CHANGE_TYPE_MIRROR>(data);

            if (type === 'TEMPORARY') {
              filesId
                .filter(fileId => fileId.length > 0)
                .forEach(fileId => uploadMakeTemporary(fileId));
            } else if (type === 'PERMANENT') {
              filesId
                .filter(fileId => fileId.length > 0)
                .forEach(fileId => uploadMakePermanent(fileId));
            }

            const posting: Posting = {
              id: StringEx.id(),
              author: await getUserAuth(),
              costCenter: props.postingCostCenter,
              periodStart: props.periodStart.toISOString(),
              periodEnd: props.periodEnd.toISOString(),
              originDate: originDate.toISOString(),
              description: postingDescription,
              coverage: {
                id: coveragePersonId,
                mirror: {
                  fileId: coverageMirrorFileId,
                  filename: coverageMirrorFileName,
                  filetype: coverageMirrorFileType
                },
                modalityOfCoverage: coveringModality
              },
              covering: coveringPersonId.length > 0 ? {
                id: coveringPersonId,
                mirror: {
                  fileId: coveringMirrorFileId,
                  filename: coveringMirrorFileName,
                  filetype: coveringMirrorFileType
                },
                reasonForAbsence: coveringReasonForAbsence,
              } : undefined,
              coverageWorkplace: coverageWorkplace.length > 0 ? coverageWorkplace : undefined,
              coveringWorkplace: coveringWorkplace,
              paymentMethod: paymentMethod,
              paymentValue: paymentValue,
              paymentDatePayable: paymentDatePayable.toISOString(),
              paymentStatus: 'payable',
              status: 'available',
              createdAt: new Date().toISOString(),
            };

            try {
              dispatch(PaybackActions.CREATE_POSTING(posting));
              clearInputs();
              setPostings([...postings, posting]);

              window.loading = 'hide';
              Alerting.create('success', 'Lançamento registrado com sucesso.');
            } catch (error) {
              window.loading = 'hide';
              Alerting.create('error', error instanceof Error ? error.message : JSON.stringify(error));

              // ! Limpa os anexos dos espelhos de ponto
              setCoveringMirrorFileId('');
              setCoveringMirrorFileName('');
              setCoveringMirrorFileType('');
              setCoverageMirrorFileId('');
              setCoverageMirrorFileName('');
              setCoverageMirrorFileType('');

              // ! Falta do efetivo
              if (
                postingType === 'absence_person'
              )
                setActiveStep(3);
              // ! Falta de Efetivo
              else if (postingType === 'lack_people')
                setActiveStep(7);
            }
          })

      window
        .socket.
        on(`${PaybackSocketEvents.PAYBACK_CHANGE_TYPE_MIRROR}-FAILURE`, (error) => {
          Alerting.create('error', 'Não foi possível confirmar o anexo do espelho de ponto. Tente novamente, mais tarde!');
          window.loading = 'hide';
          console.error(error);
        })
    },
    handleChangeCoveringWorkplace = (event: SelectChangeEvent) => setCoveringWorkplace(event.target.value),
    handleChangeCoveringPersonId = (event: SelectChangeEvent) => setCoveringPersonId(event.target.value),
    handleChangeCoveringReasonForAbsence = (id: string) => setCoveringReasonForAbsence(id),
    handleAppendUploads = (file: Upload) => {
      try {
        dispatch(SystemActions.CREATE_UPLOAD(file));
      } catch (error) {
        Alerting.create('error', error instanceof Error ? error.message : JSON.stringify(error));
      }
    },
    handleChangeCoveringMirrorFileId = (fileId: string) => setCoveringMirrorFileId(fileId),
    handleChangeCoveringMirrorFileName = (fileName: string) => setCoveringMirrorFileName(fileName),
    handleChangeCoveringMirrorFileType = (fileType: string) => setCoveringMirrorFileType(fileType),
    handleChangeCoveringModality = (modality: string) => setCoveringModality(modality),
    handleChangeCoverageWorkplace = (event: SelectChangeEvent) => setCoverageWorkplace(event.target.value),
    handleChangeCoveragePersonId = (event: SelectChangeEvent) => setCoveragePersonId(event.target.value),
    handleChangeCoverageMirrorFileId = (fileId: string) => setCoverageMirrorFileId(fileId),
    handleChangeCoverageMirrorFileName = (fileName: string) => setCoverageMirrorFileName(fileName),
    handleChangeCoverageMirrorFileType = (fileType: string) => setCoverageMirrorFileType(fileType),
    handleChangePaymentMethod = (event: SelectChangeEvent) => {
      if (event.target.value === 'card') {
        const cards = people.find(person => person.id === coveragePersonId)?.cards;

        if (
          cards &&
          cards
            .filter(card => {
              const
                lotItem = lotItems.find(lotItem => {
                  return `${lotItem.id} - ${lotItem.lastCardNumber}` === card;
                })

              if (!lotItem)
                return false

              const costCenter = costCenters.find(costCenter => costCenter.id === lotItem.costCenter);

              if (!costCenter)
                return false

              return costCenter.id === props.postingCostCenter;
            }).length > 0
        )
          return setPaymentMethod(event.target.value);
        else {
          Alerting.create('warning', `${people.find(person => person.id === coveragePersonId)?.name} não possui um cartão benefício (Alelo) da ${costCenters.find(costCenter => costCenter.id === props.postingCostCenter)?.title}`, 3600);
          Alerting.create('info', `Adicione um cartão benefício (Alelo) da ${costCenters.find(costCenter => costCenter.id === props.postingCostCenter)?.title} para ${people.find(person => person.id === coveragePersonId)?.name}`, 3600);
          setPaymentMethod("");
        }
      } else {
        return setPaymentMethod(event.target.value);
      }
    },
    handleChangePaymentValue = (value: number) => setPaymentValue(value),
    handleChangePostingType = (type: string) => {
      const _backup_originDate = originDate;
      clearInputs();
      setPostingType(type);
      setOriginDate(_backup_originDate);
      setActiveStep(1);
    },
    handleChangeDescription = (text: string) => setPostingDescription(text);

  const _fetch = new Fetch(process.env.NEXT_PUBLIC_GRAPHQL_HOST)

  const steps = [
    {
      label: 'Data de Origem',
      description: 'Informe a data na qual a movimentação foi realizada.',
      content: (
        <MobileDatePicker
          className="col px-2"
          label="Data da Movimentação"
          value={originDate}
          maxDate={props.periodEnd}
          minDate={props.periodStart}
          handleChangeValue={(value) => {
            if (
              DateEx.isEqual(value, props.periodStart) ||
              DateEx.isEqual(value, props.periodEnd) ||
              DateEx.isWithinInterval(value, {
                start: props.periodStart,
                end: props.periodEnd,
              })
            ) {
              setOriginDate(value);
            } else {
              Alerting.create(
                'warning',
                `A data da movimentação deve estar dentro do período de ${DateEx.format(props.periodStart, 'dd/MM/yyyy')} à ${DateEx.format(props.periodEnd, 'dd/MM/yyyy')}`,
                3600
              );
            }
          }}
        />
      )
    },
    {
      label: 'Tipo de Movimentação',
      description: 'Informe se é uma Falta do Efetivo ou Falta de Efetivo.',
      content: (
        <FormControl variant="standard" className='col-12'>
          <InputLabel id="select-posting-type-label">
            Tipos Disponíveis
          </InputLabel>
          <Select
            labelId="select-posting-type-label"
            id="select-posting-type"
            value={postingType}
            onChange={(e) => handleChangePostingType(e.target.value)}
            label="Tipos Disponíveis"
          >
            <MenuItem value="">
              <em>Selecionar</em>
            </MenuItem>
            <MenuItem value={'absence_person'}>Falta do Efetivo</MenuItem>
            <MenuItem value={'lack_people'}>Falta de Efetivo</MenuItem>
          </Select>
        </FormControl>
      )
    },
    {
      label: 'Local de Trabalho',
      description: `Informe o local de trabalho da pessoa que está sendo substituída.`,
      content: (
        <FormControl variant="standard" className='col-12'>
          <InputLabel id="select-covering-workplace-label">
            Locais de Trabalho
          </InputLabel>
          <Select
            labelId="select-covering-workplace-label"
            id="select-covering-workplace"
            value={coveringWorkplace}
            onChange={handleChangeCoveringWorkplace}
            label="Local de Trabalho"
          >
            <MenuItem value="">
              <em>Selecionar</em>
            </MenuItem>
            {
              workplaces
                .filter(place => props.availableWorkplaces.includes(place.id))
                .filter(place => place.id !== coverageWorkplace)
                .map(place => (
                  <MenuItem
                    key={place.id}
                    value={place.id}>
                    {place.name} ({scales.find(scale => scale.id === place.scale)?.value || "???"} - {services.filter(service => place.services.includes(service.id)).map(service => service.value).join(', ')})
                  </MenuItem>
                ))
            }
          </Select>
        </FormControl>
      )
    },
    {
      label: 'Funcionário(a)',
      description: 'Informe a pessoa que está sendo substituída.',
      content: (
        <FormControl variant="standard" className='col-12'>
          <InputLabel id="select-covering-personId-label">
            Funcionários
          </InputLabel>
          <Select
            labelId="select-covering-personId-label"
            id="select-covering-personId"
            value={coveringPersonId}
            onChange={handleChangeCoveringPersonId}
            label="Funcionários"
          >
            <MenuItem value="">
              <em>Selecionar</em>
            </MenuItem>
            {
              people
                .filter(person => props.availablePeopleInWorkplace.includes(person.id))
                .filter(person => person.id !== coveragePersonId)
                .map(person => (
                  <MenuItem
                    key={person.id}
                    value={person.id}>
                    [{person.matricule}]: {person.name} ({scales.find(scale => scale.id === person.scale)?.value || "???"} - {services.filter(service => person.services.includes(service.id)).map(service => service.value).join(', ')})
                  </MenuItem>
                ))
            }
          </Select>
        </FormControl>
      )
    },
    {
      label: 'Motivo da Ausência',
      description: `Informe o motivo da ausência da pessoa que está sendo substituída.`,
      content: (
        <div className='col-12 col-md-11'>
          <SelectReasonForAbsence
            reasonForAbsence={reasonForAbsences.find(reason => reason.id === coveringReasonForAbsence)}
            handleChangeReasonForAbsence={handleChangeCoveringReasonForAbsence}
          />
        </div>
      )
    },
    {
      label: 'Espelho de Ponto',
      description: `Anexe o espelho de ponto da pessoa que está sendo substituída.`,
      content: (
        <>
          <DropZone
            fetch={_fetch}
            ext={['.pdf']}
            maxSize={20000000}
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
                  PaybackSocketEvents.PAYBACK_UPLOAD_MIRROR,
                  window.socket.compress<TYPEOF_EMITTER_PAYBACK_UPLOAD_MIRROR>({
                    authorId,
                    name,
                    description,
                    size,
                    compressedSize,
                    fileId,
                    version,
                    type: 'COVERING'
                  }));

              if (files instanceof Array) {
                for (let i = 0; i < files.length; i++) {
                  const
                    { authorId, name, size, compressedSize, fileId, version } = files[i],
                    description = `Arquivo enviado na "Definição de Cobertura". Espelho de ponto da pessoa que está sendo substituída.`;

                  emitCreateFile(authorId, name, description, size, compressedSize, fileId, version);
                }
              } else {
                const
                  { authorId, name, size, compressedSize, fileId, version } = files,
                  description = `Arquivo enviado na "Definição de Cobertura". Espelho de ponto da pessoa que está sendo substituída.`;

                emitCreateFile(authorId, name, description, size, compressedSize, fileId, version);
              }
            }}
          />
          {
            coveringMirrorFileId.length > 0 ?
              <Button
                variant="outlined"
                onClick={() => {
                  uploadDownload(coveringMirrorFileName, coveringMirrorFileType, coveringMirrorFileId)
                    .catch(error => {
                      Alerting.create('error', `Não foi possível baixar o arquivo.`);
                      console.error(error);
                    })
                }}
                className='col-12'
              >
                <FontAwesomeIcon
                  icon={Icon.render('fas', 'download')}
                  className="me-2 flex-shrink-1 my-auto"
                />
                Baixar
              </Button> : <></>
          }
        </>
      )
    },
    {
      label: 'Modalidade de Cobertura',
      description: `Escolha entre Folga Trabalhada ou Freelancer.`,
      content: (
        <FormControl variant="standard" className='col-12'>
          <InputLabel id="select-modality-of-covering-label">
            Modalidades Disponíveis
          </InputLabel>
          <Select
            labelId="select-modality-of-covering-label"
            id="select-modality-of-covering"
            value={coveringModality}
            onChange={(e) => handleChangeCoveringModality(e.target.value)}
            label="Modalidades Disponíveis"
          >
            <MenuItem value="">
              <em>Selecionar</em>
            </MenuItem>
            <MenuItem value={'ft'}>Folga Trabalhada</MenuItem>
            <MenuItem value={'free'}>Freelancer</MenuItem>
          </Select>
        </FormControl>
      )
    },
    {
      label: 'Dados da Cobertura',
      description: `Informe os dados da cobertura.`,
      content: (
        <>
          {
            coveringModality === 'ft' ?
              <>
                <FormControl variant="standard" className='col-12 mb-2'>
                  <InputLabel id="select-coverage-workplace-label">
                    Locais de Trabalho
                  </InputLabel>
                  <Select
                    labelId="select-coverage-workplace-label"
                    id="select-coverage-workplace"
                    value={coverageWorkplace}
                    onChange={handleChangeCoverageWorkplace}
                    label="Local de Trabalho"
                  >
                    <MenuItem value="">
                      <em>Selecionar</em>
                    </MenuItem>
                    {
                      workplaces
                        .filter(place => props.availableWorkplaces.includes(place.id))
                        .filter(place => place.id !== coveringWorkplace)
                        .map(place => (
                          <MenuItem
                            key={place.id}
                            value={place.id}>
                            {place.name} ({scales.find(scale => scale.id === place.scale)?.value || "???"} - {services.filter(service => place.services.includes(service.id)).map(service => service.value).join(', ')})
                          </MenuItem>
                        ))
                    }
                  </Select>
                </FormControl>
                <FormControl variant="standard" className='col-12 mb-2'>
                  <InputLabel id="select-coverage-personId-label">
                    Funcionário
                  </InputLabel>
                  <Select
                    labelId="select-coverage-personId-label"
                    id="select-coverage-personId"
                    value={coveragePersonId}
                    onChange={handleChangeCoveragePersonId}
                    label="Funcionário"
                  >
                    <MenuItem value="">
                      <em>Selecionar</em>
                    </MenuItem>
                    {
                      people
                        .filter(person => props.availablePeopleInWorkplace.includes(person.id))
                        .filter(person => person.id !== coveringPersonId)
                        .map(person => (
                          <MenuItem
                            key={person.id}
                            value={person.id}>
                            [{person.matricule}]: {person.name} ({scales.find(scale => scale.id === person.scale)?.value || ""} - {services.filter(service => person.services.includes(service.id)).map(service => service.value).join(', ')})
                          </MenuItem>
                        ))
                    }
                  </Select>
                </FormControl>
                <DropZone
                  fetch={_fetch}
                  ext={['.pdf']}
                  maxSize={20000000}
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
                        PaybackSocketEvents.PAYBACK_UPLOAD_MIRROR,
                        window.socket.compress<TYPEOF_EMITTER_PAYBACK_UPLOAD_MIRROR>({
                          authorId,
                          name,
                          description,
                          size,
                          compressedSize,
                          fileId,
                          version,
                          type: 'COVERAGE'
                        }));

                    if (files instanceof Array) {
                      for (let i = 0; i < files.length; i++) {
                        const
                          { authorId, name, size, compressedSize, fileId, version } = files[i],
                          description = `Arquivo enviado na "Definição de Cobertura". Espelho de ponto da pessoa que está cobrindo.`;

                        emitCreateFile(authorId, name, description, size, compressedSize, fileId, version);
                      }
                    } else {
                      const
                        { authorId, name, size, compressedSize, fileId, version } = files,
                        description = `Arquivo enviado na "Definição de Cobertura". Espelho de ponto da pessoa que está cobrindo.`;

                      emitCreateFile(authorId, name, description, size, compressedSize, fileId, version);
                    }
                  }}
                />
                {
                  coverageMirrorFileId.length > 0 ?
                    <Button
                      variant="outlined"
                      onClick={() => {
                        uploadDownload(coverageMirrorFileName, coverageMirrorFileType, coverageMirrorFileId)
                          .catch(error => {
                            Alerting.create('error', `Não foi possível baixar o arquivo.`);
                            console.error(error);
                          })
                      }}
                      className='col-12'
                    >
                      <FontAwesomeIcon
                        icon={Icon.render('fas', 'download')}
                        className="me-2 flex-shrink-1 my-auto"
                      />
                      Baixar
                    </Button> : <></>
                }
              </> : <>
                <FormControl variant="standard" className='col-12 mb-2'>
                  <InputLabel id="select-coverage-personId-label">
                    Funcionário
                  </InputLabel>
                  <Select
                    labelId="select-coverage-personId-label"
                    id="select-coverage-personId"
                    value={coveragePersonId}
                    onChange={handleChangeCoveragePersonId}
                    label="Funcionário"
                  >
                    <MenuItem value="">
                      <em>Selecionar</em>
                    </MenuItem>
                    {
                      people
                        .filter(person => props.availablePeopleInWorkplace.includes(person.id))
                        .filter(person => person.id !== coveringPersonId)
                        .map(person => (
                          <MenuItem
                            key={person.id}
                            value={person.id}>
                            [{person.matricule}]: {person.name} ({scales.find(scale => scale.id === person.scale)?.value || "???"} - {services.filter(service => person.services.includes(service.id)).map(service => service.value).join(', ')})
                          </MenuItem>
                        ))
                    }
                  </Select>
                </FormControl>
              </>
          }
        </>
      )
    },
    {
      label: 'Forma de Pagamento',
      description: 'Defina a forma como o beneficiário será pago.',
      content: (
        <FormControl variant="standard" className='col-12'>
          <InputLabel id="select-paymentMethod-label">
            Formas de Pagamento Disponíveis
          </InputLabel>
          <Select
            labelId="select-paymentMethod-label"
            id="select-paymentMethod"
            value={paymentMethod}
            onChange={handleChangePaymentMethod}
            label="Formas de Pagamento Disponíveis"
          >
            <MenuItem value="">
              <em>Selecionar</em>
            </MenuItem>
            <MenuItem value={'card'}>Cartão Benefício (Alelo)</MenuItem>
            <MenuItem value={'money'}>Dinheiro</MenuItem>
          </Select>
        </FormControl>
      )
    },
    {
      label: 'Valor do Pagamento',
      description: 'Defina o valor que o beneficiário irá receber.',
      content: (
        <FormControl variant="standard" className='col-12'>
          <TextField
            id="input-paymentMethod"
            label="Valor"
            variant="standard"
            value={StringEx.maskMoney(String(paymentValue))}
            onChange={(e) => handleChangePaymentValue(parseInt(StringEx.removeMaskNum(e.target.value)))}
          />
        </FormControl>
      )
    },
    {
      label: 'Data há Pagar',
      description: 'Defina a data que o beneficiário irá receber.',
      content: (
        <MobileDatePicker
          className="col px-2"
          label="Data da Movimentação"
          value={paymentDatePayable}
          maxDate={DateEx.addDays(props.periodEnd, 5)}
          minDate={props.periodEnd}
          handleChangeValue={(value) => {
            if (
              DateEx.isEqual(value, props.periodEnd) ||
              DateEx.isWithinInterval(value, {
                start: props.periodEnd,
                end: DateEx.addDays(props.periodEnd, 5)
              })
            ) {
              setPaymentDatePayable(value);
            } else {
              Alerting.create('warning', `A data de pagamento não pode ser fora do período de cobrança de 5 dias.`);
            }
          }}
        />
      )
    }
  ];

  onSocketEvents(
    handleAppendUploads,
    handleChangeCoveringMirrorFileId,
    handleChangeCoveringMirrorFileName,
    handleChangeCoveringMirrorFileType,
    handleChangeCoverageMirrorFileId,
    handleChangeCoverageMirrorFileName,
    handleChangeCoverageMirrorFileType,
  )

  const boxSxProps = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24
  }

  return (
    <>
      <Modal
        open={props.show}
        onClose={() => {
          clearInputs();
          props.handleFinish(postings);
          props.handleClose();
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className='col-10 rounded' sx={boxSxProps}>
          <div className='d-flex flex-column flex-md-row p-3'>
            <Stepper activeStep={activeStep} orientation="vertical" className='col-12 col-md-8 overflow-auto' style={{ height: '85vh' }}>
              {steps.map((step, index) => (
                <Step key={`${step.label}`}>
                  <StepLabel
                    optional={
                      index === steps.length - 1 ? (
                        <Typography variant="caption">Última Etapa</Typography>
                      ) : null
                    }
                  >
                    {step.label}
                  </StepLabel>
                  <StepContent>
                    {step.content}
                    <Typography className='mt-2'>{step.description}</Typography>
                    <Box sx={{ mb: 2 }}>
                      <div>
                        <Button
                          variant="contained"
                          onClick={() => {
                            if (index === steps.length - 1)
                              return handleFinish();

                            handleNext();
                          }}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          {index === steps.length - 1 ? 'Finalizar' : 'Próximo'}
                        </Button>
                        <Button
                          disabled={index === 0}
                          onClick={handleBack}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          Voltar
                        </Button>
                      </div>
                    </Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
            <div className='col d-none d-md-flex flex-column overflow-auto' style={{ height: '85vh' }}>
              <Card className='m-3'>
                <CardActionArea className='p-2'>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      Movimentação Operacional
                    </Typography>
                    <Typography variant="body2" color="text.secondary" className='mb-2'>
                      Data de Origem: {originDate.toLocaleDateString()}
                    </Typography>
                    <Divider className='mb-2' />
                    {
                      // ! Falta do Efetivo
                      postingType === 'absence_person' &&
                      <Typography variant="caption" color="text.secondary">
                        A cobertura está sendo realizada no {workplaces.find(place => place.id === coveringWorkplace)?.name},
                        devido à {reasonForAbsences.find(reason => reason.id === coveringReasonForAbsence)?.value} do(a) {people.find(person => person.id === coveringPersonId)?.name}.
                      </Typography>
                    }
                    {
                      // ! Falta de Efetivo
                      postingType === 'lack_people' &&
                      <Typography variant="caption" color="text.secondary">
                        O posto {workplaces.find(place => place.id === coveringWorkplace)?.name}, está sendo coberto
                        devido a falta de efetivo.
                      </Typography>
                    }
                    <br />
                    {
                      coveringModality === 'ft' &&
                      <Typography variant="caption" color="text.secondary">
                        {people.find(person => person.id === coveragePersonId)?.name} está realizando a cobertura,
                        ele(a) está realizando uma Folga Trabalhada (FT), o posto de origem é {workplaces.find(place => place.id === coverageWorkplace)?.name}.
                      </Typography>
                    }
                    {
                      coveringModality === 'free' &&
                      <Typography variant="caption" color="text.secondary">
                        {people.find(person => person.id === coveragePersonId)?.name} está realizando a cobertura,
                        ele(a) é Freelancer.
                      </Typography>
                    }
                    {
                      coveringModality === '' &&
                      <Typography variant="caption" color="text.secondary">
                        {people.find(person => person.id === coveragePersonId)?.name} está realizando a cobertura...
                      </Typography>
                    }
                    <br />
                    <Typography variant="caption" color="text.secondary">
                      Será Pago: {StringEx.maskMoney(String(paymentValue))} {
                        paymentMethod === 'card' && 'no Cartão Benefício (Alelo)' ||
                        paymentMethod === 'money' && 'em Dinheiro' ||
                        paymentMethod === '' && '...'
                      }.
                    </Typography>
                    <br />
                    <Typography variant="caption" color="text.secondary">
                      Previsão de pagamento: {new Date(paymentDatePayable).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
              <TextField
                label="Descrição"
                className='mx-3'
                multiline
                rows={4}
                value={postingDescription}
                onChange={(e) => handleChangeDescription(e.target.value)}
              />
            </div>
          </div>
        </Box>
      </Modal>
    </>
  )
}

/**
 * @description Adiciona os ouvintes dos eventos do socket.io
 */
function onSocketEvents(
  handleAppendUploads: (file: Upload) => void,
  handleChangeCoveringMirrorFileId: (fileId: string) => void,
  handleChangeCoveringMirrorFileName: (fileName: string) => void,
  handleChangeCoveringMirrorFileType: (fileType: string) => void,
  handleChangeCoverageMirrorFileId: (fileId: string) => void,
  handleChangeCoverageMirrorFileName: (fileName: string) => void,
  handleChangeCoverageMirrorFileType: (fileType: string) => void
) {
  const socket = window.socket;

  if (socket) {
    const
      events = [
        `${PaybackSocketEvents.PAYBACK_UPLOAD_COVERING_MIRROR}-SUCCESS`,
        `${PaybackSocketEvents.PAYBACK_UPLOAD_COVERING_MIRROR}-FAILURE`,
        `${PaybackSocketEvents.PAYBACK_UPLOAD_COVERAGE_MIRROR}-SUCCESS`,
        `${PaybackSocketEvents.PAYBACK_UPLOAD_COVERAGE_MIRROR}-FAILURE`
      ]

    events
      .forEach(event => {
        if (socket.hasListeners(event))
          socket.off(event);
      })

    socket
      .on(
        events[0], // * PAYBACK-UPLOAD-COVERING-MIRROR-SUCCESS
        (
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
            createdAt,
            expiredAt,
          } = window.socket.decompress<TYPEOF_LISTENER_PAYBACK_UPLOAD_MIRROR>(data);

          handleAppendUploads({
            authorId,
            fileId,
            filename,
            filetype,
            description,
            size,
            compressedSize,
            temporary,
            version,
            createdAt,
            expiredAt,
          });

          handleChangeCoveringMirrorFileId(fileId);
          handleChangeCoveringMirrorFileName(filename);
          handleChangeCoveringMirrorFileType(filetype);
        }
      )

    socket
      .on(
        events[1], // * PAYBACK-UPLOAD-COVERING-MIRROR-FAILURE
        (error: string) => console.error(error)
      )

    socket
      .on(
        events[2], // * PAYBACK-UPLOAD-COVERAGE-MIRROR-SUCCESS
        (
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
            createdAt,
            expiredAt,
          } = window.socket.decompress<TYPEOF_LISTENER_PAYBACK_UPLOAD_MIRROR>(data);

          handleAppendUploads({
            authorId,
            fileId,
            filename,
            filetype,
            description,
            size,
            compressedSize,
            temporary,
            version,
            createdAt,
            expiredAt,
          });

          handleChangeCoverageMirrorFileId(fileId);
          handleChangeCoverageMirrorFileName(filename);
          handleChangeCoverageMirrorFileType(filetype);
        }
      )

    socket
      .on(
        events[3], // * PAYBACK-UPLOAD-COVERAGE-MIRROR-FAILURE
        (error: string) => console.error(error)
      )
  }
}