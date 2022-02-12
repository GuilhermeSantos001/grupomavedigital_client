/**
 * @description Modal -> Modal de Cadastro da Chave de API
 * @author GuilhermeSantos001
 * @update 11/02/2022
 */

import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Refresh from '@mui/icons-material/Refresh';
import CopyAll from '@mui/icons-material/CopyAll';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import Fetch from '@/src/utils/fetch'
import GetUserInfo from '@/src/functions/getUserInfo'
import Alerting from '@/src/utils/alerting'

import { copyTextToClipboard } from '@/src/functions/copyTextToClipboard';

import { generateAPIKey } from '@/src/functions/generateAPIKey'

import {
  useAPIKeyService
} from '@/services/useAPIKeyService'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Icon from '@/src/utils/fontAwesomeIcons'

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  height: '80%'
};

export interface Props {
  show: boolean
  handleClose: () => void,
  fetch: Fetch
}

export function RegisterAPIKey(props: Props) {
  const [username, setUsername] = React.useState('');
  const [userMail, setUserMail] = React.useState('');
  const [apiKeyValue, setApiKeyValue] = React.useState(generateAPIKey());
  const [apiKeyTitle, setApiKeyTitle] = React.useState('');
  const [apiKeyPassphrase, setApiKeyPassphrase] = React.useState('');
  const [apiKeyPassphraseVisible, setApiKeyPassphraseVisible] = React.useState(false);

  const handleChangeUsername = (value: string) => setUsername(value);
  const handleChangeUserMail = (value: string) => setUserMail(value);

  const { isLoading: isLoadingAPIKey, create: handleCreateAPIKey, } = useAPIKeyService();

  React.useEffect(() => {
    const timeout = setTimeout(async () => {
      const { username, email } = await GetUserInfo(props.fetch);

      handleChangeUsername(username);
      handleChangeUserMail(email);
    });

    return () => clearTimeout(timeout);
  }, []);

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={props.show}
      onClose={props.handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={props.show}>
        <Box className='bg-light-gray shadow rounded' sx={style}>
          <div
            className='d-flex flex-row align-items-center col-12 p-2 rounded bg-primary bg-gradient text-secondary fw-bold'
            style={{ height: '100px' }}
          >
            <p className='col-10 fs-1 my-2 text-truncate'>
              Criar nova chave de API
            </p>
            <Typography className='col text-end p-3'>
              <FontAwesomeIcon
                icon={Icon.render('fas', 'edit')}
                className="col flex-shrink-1 my-auto"
                style={{ fontSize: '2rem' }}
              />
            </Typography>
          </div>
          <div className='col-12 p-2 my-2'>
            <FormControl variant="outlined" className='col-12 mb-3'>
              <InputLabel htmlFor="outlined-adornment-key">KEY</InputLabel>
              <OutlinedInput
                id="outlined-adornment-key"
                type='text'
                value={apiKeyValue}
                onChange={(e) => setApiKeyValue(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle refresh key"
                      onClick={() => {
                        Alerting.create('success', 'Nova chave gerada com sucesso!');
                        setApiKeyValue(generateAPIKey());
                      }}
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                    >
                      <Refresh />
                    </IconButton>
                    <IconButton
                      aria-label="toggle copy key"
                      onClick={() => {
                        Alerting.create('success', 'Chave copiada com sucesso!');
                        copyTextToClipboard(apiKeyValue);
                      }}
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                    >
                      <CopyAll />
                    </IconButton>
                  </InputAdornment>
                }
                label="KEY"
                disabled={true}
              />
            </FormControl>
            <FormControl variant="outlined" className='col-12 mb-3'>
              <InputLabel htmlFor="outlined-adornment-title">Título</InputLabel>
              <OutlinedInput
                id="outlined-adornment-title"
                type='text'
                value={apiKeyTitle}
                onChange={(e) => setApiKeyTitle(e.target.value)}
                aria-describedby="outlined-title-helper-text"
                label="Título"
              />
              <FormHelperText id="outlined-title-helper-text" className='text-muted fst-italic'>
                O título deve conter no mínimo 8 caracteres. Atualmente: {apiKeyTitle.length}/8 <br />
              </FormHelperText>
            </FormControl>
            <FormControl variant="outlined" className='col-12 mb-3'>
              <InputLabel htmlFor="outlined-adornment-passphrase">Passphrase</InputLabel>
              <OutlinedInput
                id="outlined-adornment-passphrase"
                type={apiKeyPassphraseVisible ? 'text' : 'password'}
                value={apiKeyPassphrase}
                onChange={(e) => setApiKeyPassphrase(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle passphrase visibility"
                      onClick={() => { setApiKeyPassphraseVisible(!apiKeyPassphraseVisible) }}
                      onMouseDown={(e) => e.preventDefault()}
                      aria-describedby="outlined-passphrase-helper-text"
                      edge="end"
                    >
                      {apiKeyPassphraseVisible ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Passphrase"
              />
              <FormHelperText id="outlined-passphrase-helper-text" className='text-muted fst-italic'>
                Não compartilhe sua palavra-passe com ninguém. <br />
                As palavras-passe são únicas, não é possível usar a mesma em outras chaves de API. <br />
                A palavra-passa deve conter no mínimo 8 caracteres. Atualmente: {apiKeyPassphrase.length}/8 <br />
              </FormHelperText>
            </FormControl>
          </div>
          <div className='fixed-bottom d-flex flex-row justify-content-end col-12 p-2'>
            <Button
              className='bg-primary bg-gradient fw-bold col-2 m-2'
              variant="contained"
              onClick={props.handleClose}
            >
              Voltar
            </Button>
            <Button
              className='col-2 m-2'
              variant="contained"
              color="success"
              disabled={isLoadingAPIKey || !apiKeyValue || !apiKeyTitle || apiKeyTitle.length < 8 || !apiKeyPassphrase || apiKeyPassphrase.length < 8}
              onClick={async () => {
                try {
                  const key = await handleCreateAPIKey({
                    username,
                    userMail,
                    title: apiKeyTitle,
                    key: apiKeyValue,
                    passphrase: apiKeyPassphrase
                  });

                  if (key) {
                    Alerting.create('error', 'Chave de API adicionada com sucesso!');
                    setApiKeyValue(generateAPIKey());
                    setApiKeyPassphrase('');
                    props.handleClose();
                  }
                } catch {
                  Alerting.create('error', 'Erro ao criar chave de API. Tente com outra chave e palavra-passe.');
                }
              }}
            >
              Adicionar
            </Button>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
}
