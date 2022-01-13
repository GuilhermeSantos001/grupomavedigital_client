/**
 * @description Assistente -> Definição de cobertura
 * @author GuilhermeSantos001
 * @update 11/01/2022
 */

import { useState, useEffect } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import StepContent from '@mui/material/StepContent'
import Paper from '@mui/material/Paper'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Icon from '@/src/utils/fontAwesomeIcons'

import Fetch from '@/src/utils/fetch'
import { uploadDownload } from '@/src/functions/getUploads'
import { getGroupId, getUserAuth } from '@/pages/storage/index'
import Alerting from '@/src/utils/alerting'
import StringEx from '@/src/utils/stringEx'

import * as SocketIOClient from 'socket.io-client'
import SocketIO from '@/components/socket-io'

import SelectReasonForAbsence from '@/components/inputs/selectReasonForAbsence';
import DropZone from '@/components/dropZone';

import { useAppSelector, useAppDispatch } from '@/app/hooks';

import {
  Upload,
  appendUploads
} from '@/app/features/system/system.slice';

export type Props = {
  show: boolean;
  availableWorkplaces: string[]
  handleClose: () => void;
}

export default function AssistantCoverageDefine(props: Props) {
  const [activeStep, setActiveStep] = useState(0);

  const [coveringWorkplace, setCoveringWorkplace] = useState<string>('');
  const [coveringReasonForAbsence, setCoveringReasonForAbsence] = useState<string>('');
  const [coveringMirrorFileId, setCoveringMirrorFileId] = useState<string>('');
  const [coveringMirrorFileName, setCoveringMirrorFileName] = useState<string>('');
  const [coveringMirrorFileType, setCoveringMirrorFileType] = useState<string>('');

  const
    dispatch = useAppDispatch(),
    handleNext = () => setActiveStep((prevActiveStep) => prevActiveStep + 1),
    handleBack = () => setActiveStep((prevActiveStep) => prevActiveStep - 1),
    handleReset = () => setActiveStep(0),
    handleChangeCoveringWorkplace = (event: SelectChangeEvent) => setCoveringWorkplace(event.target.value),
    handleChangeCoveringReasonForAbsence = (id: string) => setCoveringReasonForAbsence(id),
    handleAppendUploads = (file: Upload) => dispatch(appendUploads(file)),
    handleChangeCoveringMirrorFileId = (fileId: string) => setCoveringMirrorFileId(fileId),
    handleChangeCoveringMirrorFileName = (fileName: string) => setCoveringMirrorFileName(fileName),
    handleChangeCoveringMirrorFileType = (fileType: string) => setCoveringMirrorFileType(fileType);

  const
    workplaces = useAppSelector(state => state.system.workplaces || []),
    reasonForAbsences = useAppSelector(state => state.system.reasonForAbsences || []),
    scales = useAppSelector(state => state.system.scales || []),
    services = useAppSelector(state => state.system.services || []);

  const _fetch = new Fetch(process.env.NEXT_PUBLIC_GRAPHQL_HOST)

  const steps = [
    {
      label: 'Local de Trabalho (B1)',
      description: `Informe o local de trabalho da pessoa que está sendo substituída.`,
      content: (
        <FormControl variant="standard" className='col-12'>
          <InputLabel id="select-covering-workplace-label">
            Local de Trabalho
          </InputLabel>
          <Select
            labelId="select-covering-workplace-label"
            id="select-covering-workplace"
            value={coveringWorkplace}
            onChange={handleChangeCoveringWorkplace}
            label="Local de Trabalho"
          >
            {
              workplaces
                .filter(place => props.availableWorkplaces.includes(place.id))
                .map(place => (
                  <MenuItem
                    key={place.id}
                    value={place.id}>
                    {place.name} ({scales.find(scale => scale.id === place.scale).value} - {services.filter(service => place.services.includes(service.id)).map(service => service.value).join(', ')})
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
        <SelectReasonForAbsence
          reasonForAbsence={reasonForAbsences.find(reason => reason.id === coveringReasonForAbsence)}
          handleChangeReasonForAbsence={handleChangeCoveringReasonForAbsence}
        />
      )
    },
    {
      label: 'Espelho de Ponto (B1)',
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
              const emitCreateFile = async (
                authorId: string,
                name: string,
                description: string,
                size: number,
                compressedSize: number,
                fileId: string,
                version: number
              ) => window.socket.emit('CREATE-FILE',
                authorId,
                name,
                description,
                size,
                compressedSize,
                fileId,
                version
              );

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
                      Alerting.create(`Não foi possível baixar o arquivo.`);
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
  ];

  if (window.socket) {
    onSocketCoveringEvents(
      window.socket,
      handleAppendUploads,
      handleChangeCoveringMirrorFileId,
      handleChangeCoveringMirrorFileName,
      handleChangeCoveringMirrorFileType,
    );
  }

  return (
    <>
      <SocketIO />
      <Modal
        open={props.show}
        onClose={props.handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className='col-10 rounded' sx={{
          position: 'absolute' as 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24
        }}>
          <h1 className='bg-primary text-center text-secondary fw-bold p-4'>
            Definição de Cobertura
          </h1>
          <Stepper activeStep={activeStep} orientation="vertical" className='p-3'>
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel
                  optional={
                    index === 2 ? (
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
                        onClick={handleNext}
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
          {activeStep === steps.length && (
            <Paper square elevation={0} sx={{ p: 3 }}>
              <Typography>All steps completed - you&apos;re finished</Typography>
              <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                Reset
              </Button>
            </Paper>
          )}
        </Box>
      </Modal>
    </>
  )
}

/**
 * @description Adiciona os ouvintes dos eventos do socket.io
 */
function onSocketCoveringEvents(
  socket: SocketIOClient.Socket,
  handleAppendUploads: (file: Upload) => void,
  handleChangeCoveringMirrorFileId: (fileId: string) => void,
  handleChangeCoveringMirrorFileName: (fileName: string) => void,
  handleChangeCoveringMirrorFileType: (fileType: string) => void
) {
  if (socket) {
    const
      events = [
        'COVERING-UPLOAD-MIRROR-SUCCESS',
        'COVERING-UPLOAD-MIRROR-FAILURE'
      ]

    events
      .forEach(event => {
        if (socket.hasListeners(event))
          socket.off(event);
      })

    socket
      .on(
        events[0], // * COVERING-UPLOAD-MIRROR-SUCCESS
        (
          fileId: string,
          authorId: string,
          filename: string,
          filetype: string,
          description: string,
          size: number,
          compressedSize: number,
          version: number,
          temporary: boolean,
          expiredAt: string,
          createdAt: string,
        ) => {
          const file: Upload = {
            fileId,
            authorId,
            filename,
            filetype,
            description,
            size,
            compressedSize,
            version,
            temporary,
            expiredAt,
            createdAt
          };

          handleAppendUploads(file);
          handleChangeCoveringMirrorFileId(fileId);
          handleChangeCoveringMirrorFileName(filename);
          handleChangeCoveringMirrorFileType(filetype);
        }
      )
      .on(
        events[1], // * COVERING-UPLOAD-MIRROR-FAILURE
        (error: string) => console.error(error)
      )
  }
}