import { useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Icon, { iconsName } from '@/src/utils/fontAwesomeIcons'

import { compressToEncodedURIComponent } from 'lz-string'
import Sugar from 'sugar'

import Fetch from '@/src/utils/fetch'
import Alerting from '@/src/utils/alerting'

type Props = {
  api: string
  authLoginAuthorization: string
  twofactorretrieveAuthorization: string
}

export default function InputLogin(props: Props) {
  const [eyeIcon, setEyeIcon] = useState<iconsName>('low-vision');
  const [passView, setPassView] = useState<string>('password');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [twofactorRequest, setTwofactorRequest] = useState<boolean>(false);
  const [twofactorValue, setTwofactorValue] = useState<string>('');

  const fetch = new Fetch(props.api);

  const
    handlePasswordEyeClick = () => {
      if (passView === 'password') {
        setPassView('text');
        setEyeIcon('eye');
      } else if (passView === 'text') {
        setPassView('password');
        setEyeIcon('low-vision');
      }
    },
    handleUsernameChange = (value: string) => setUsername(Sugar.String.removeAll(value, ' ')),
    handlePasswordChange = (value: string) => setPassword(Sugar.String.removeAll(value, ' ')),
    handleClickAccess = () => {
      fetch
        .exec<{
          data: {
            user: {
              authorization: string
              token: string
              signature: string
              refreshToken: {
                signature: string
                value: string
              }
            }
          }
          errors: Error[]
        }>(
          {
            query: `
            query ConnectUserToSystem($auth: String!, $pwd: String!, $twofactortoken: String) {
              user: authLogin(auth: $auth, pwd: $pwd, twofactortoken: $twofactortoken) {
                authorization token signature
                refreshToken {
                  signature
                  value
                }
              }
            }
          `,
            variables: {
              auth: compressToEncodedURIComponent(username),
              pwd: compressToEncodedURIComponent(password),
              twofactortoken: compressToEncodedURIComponent(twofactorValue),
            },
          },
          {
            authorization: props.authLoginAuthorization,
            encodeuri: 'true',
          }
        )
        .then(async ({ data, errors }) => {
          if (errors)
            return errors.forEach((error) => Alerting.create('error', error.message))

          const { user } = data || {}

          if (user.token === 'twofactorVerify')
            return setTwofactorRequest(true);
          else if (user.token === 'twofactorDenied')
            return Alerting.create(
              'error',
              'O código informado está inválido. Tente Novamente!'
            )

          return (document.location = `${location.origin}/system`);
        })
        .catch((error) => {
          Alerting.create(
            'error',
            'Ocorreu um erro com o servidor. Tente novamente mais tarde!'
          )

          console.error(error);
        })
    },
    handleTwofactorBack = () => {
      setTwofactorRequest(false);
      setTwofactorValue('');
    },
    handleTwofactorTokenChange = (value: string) => setTwofactorValue(Sugar.String.removeAll(value, ' ')),
    handleTwofactorValidate = () => {
      handleTwofactorBack()
      handleClickAccess()
    },
    handleTwofactorRetrieve = () => {
      fetch
        .exec<{
          data: {
            authRetrieveTwofactor: boolean
          }
          errors: Error[]
        }>(
          {
            query: `
            mutation RemoveTwofactorForUser($auth: String!) {
              authRetrieveTwofactor(auth: $auth)
            }
          `,
            variables: {
              auth: compressToEncodedURIComponent(username),
            },
          },
          {
            authorization: props.twofactorretrieveAuthorization,
            encodeuri: 'true',
          }
        )
        .then(({ data, errors }) => {
          if (errors)
            return errors.forEach((error) => Alerting.create('error', error.message))

          if (data.authRetrieveTwofactor) {
            handleTwofactorBack();

            return Alerting.create('warning', `Email de recuperação da conta enviado!`)
          } else {
            return Alerting.create(
              'warning',
              `Email de recuperação da conta não pode ser enviado!`
            )
          }
        })
        .catch((error) => {
          Alerting.create(
            'error',
            'Ocorreu um erro com o servidor. Tente novamente mais tarde!'
          )
          console.error(error);
        })
    };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        if (username.length > 0 && password.length > 0)
          handleClickAccess();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    }
  }, [username, password]);

  return (
    <div
      data-testid="container-input-login"
      className="col-12 p-2"
    >
      <div
        data-testid="input-container-username"
        className="input-group mb-3"
      >
        <span
          data-testid="span-username"
          className="input-group-text"
          id="username-addon"
        >
          <FontAwesomeIcon
            icon={Icon.render('fas', 'user')}
            className="fs-6 flex-shrink-1 text-primary my-auto"
          />
        </span>
        <input
          data-testid="input-username"
          name="username"
          type="text"
          className="form-control"
          placeholder="Nome de usuário"
          aria-label="Username"
          aria-describedby="username-addon"
          value={username}
          onChange={(e) => handleUsernameChange(e.target.value)}
        />
      </div>
      <div data-testid="container-input-password" className="input-group">
        <span
          data-testid="span-password"
          className="input-group-text"
          id="password-addon"
        >
          <FontAwesomeIcon
            icon={Icon.render('fas', 'key')}
            className="fs-6 flex-shrink-1 text-primary my-auto"
          />
        </span>
        <input
          data-testid="input-password"
          name="password"
          type={passView}
          className="form-control"
          placeholder="Senha de usuário"
          aria-label="Password"
          aria-describedby="password-addon"
          value={password}
          onChange={(e) => handlePasswordChange(e.target.value)}
        />
        <span
          data-testid="span-password-eye"
          id="password-addon-eye"
          className="input-group-text animation-delay hover-color"
          onClick={handlePasswordEyeClick}
        >
          <FontAwesomeIcon
            icon={Icon.render('fas', eyeIcon)}
            className="fs-6 flex-shrink-1 my-auto"
          />
        </span>
      </div>
      <div className="col-12">
        <div className="form-text text-start text-md-end">
          <a href="/auth/password/forgot" target="_blank" rel="noreferrer">
            Esqueceu sua senha?
          </a>
        </div>
      </div>
      <div className="col-12 bd-callout bd-callout-primary my-2">
        <p>
          <small data-testid="help-password">
            Nunca mostre sua senha a ninguém e nem passe por e-mail.
          </small>
        </p>
      </div>
      <div data-testid="container-button-login" className="d-grid gap-2">
        <button
          data-testid="button-login"
          className="btn btn-primary"
          type="button"
          disabled={!username || !password}
          onClick={handleClickAccess}
        >
          Entrar
        </button>
      </div>
      <div
        className={`twofactor-bg ${twofactorRequest ? 'active' : 'deactivate'
          } fixed-top d-flex flex-column`}
      >
        <div
          className={`twofactor ${twofactorRequest ? 'active' : 'deactivate'
            } col-12 overflow-auto`}
        >
          <h1 className="text-white text-center fs-1 fw-bold m-5">
            Autenticação de dois fatores está ativada. Por gentileza, insira
            seu código de segurança.
          </h1>
          <br />
          <div className="col-10 mx-auto mb-5">
            <label htmlFor="twofactor-usertoken">
              Insira o código de proteção, exibido em seu gerenciador de
              códigos para autenticação em duas etapas.
            </label>
            <input
              type="tel"
              className="form-control mb-2"
              value={twofactorValue}
              onChange={(e) => handleTwofactorTokenChange(e.target.value)}
            />
            <button
              type="button"
              className="btn btn-primary col-12 my-1"
              disabled={twofactorValue.length < 6 ? true : false}
              onClick={handleTwofactorValidate}
            >
              Validar
            </button>
            <button
              type="button"
              className="btn btn-primary col-12 mb-1"
              onClick={handleTwofactorBack}
            >
              Voltar
            </button>
            <button
              type="button"
              className="btn btn-danger col-12 mb-2"
              onClick={handleTwofactorRetrieve}
            >
              Recuperar a conta
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}