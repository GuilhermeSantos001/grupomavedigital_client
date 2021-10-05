/**
 * @description Componente do input para login
 * @author @GuilhermeSantos001
 * @update 05/10/2021
 */

import React from 'react'

import LoadingBar from 'react-top-loading-bar'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Icon, { iconsName } from '@/src/utils/fontAwesomeIcons'

import { compressToEncodedURIComponent } from 'lz-string'
import Sugar from 'sugar'

import Fetch from '@/src/utils/fetch'
import Alert from '@/src/utils/alerting'
import Variables from '@/src/db/variables'

type MyProps = {
  api: string
}

type MyState = {
  eyeIcon: iconsName
  passView: string
  username: string
  password: string
  twofactorRequest: boolean
  twofactorValue: string
  twofactorValidation: boolean
  progress: number
}

export default class InputLogin extends React.Component<MyProps, MyState> {
  variables: Variables
  fetch: Fetch

  constructor(props) {
    super(props)

    this.fetch = new Fetch(this.props.api)

    this.state = {
      eyeIcon: 'low-vision',
      passView: 'password',
      username: '',
      password: '',
      twofactorRequest: false,
      twofactorValue: '',
      twofactorValidation: false,
      progress: 0,
    }

    this.handlePasswordEyeClick = this.handlePasswordEyeClick.bind(this)
    this.handleUsernameChange = this.handleUsernameChange.bind(this)
    this.handlePasswordChange = this.handlePasswordChange.bind(this)
    this.handleClickAccess = this.handleClickAccess.bind(this)
    this.handleTwofactorTokenChange = this.handleTwofactorTokenChange.bind(this)
    this.handleTwofactorValidate = this.handleTwofactorValidate.bind(this)
    this.handleTwofactorRetrieve = this.handleTwofactorRetrieve.bind(this)
    this.handleTwofactorBack = this.handleTwofactorBack.bind(this)
  }

  componentDidMount() {
    this.variables = new Variables(1, 'IndexedDB')
  }

  handlePasswordEyeClick() {
    if (this.state.passView === 'password') {
      this.setState({ passView: 'text', eyeIcon: 'eye' })
    } else if (this.state.passView === 'text') {
      this.setState({ passView: 'password', eyeIcon: 'low-vision' })
    }
  }

  handleUsernameChange(event) {
    this.setState({
      username: Sugar.String.removeAll(event.target.value, ' '),
    })
  }

  handlePasswordChange(event) {
    this.setState({
      password: Sugar.String.removeAll(event.target.value, ' '),
    })
  }

  handleClickAccess() {
    this.setState({ progress: this.state.progress + 100 })

    this.fetch
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
            auth: compressToEncodedURIComponent(this.state.username),
            pwd: compressToEncodedURIComponent(this.state.password),
            twofactortoken: compressToEncodedURIComponent(
              this.state.twofactorValue
            ),
          },
        },
        {
          authorization:
            'SweteNlPut4uqlBiwIchiXafe1ld1bRICriBra7iPRazOs0ItRAtiwriyoyuyo-u',
          encodeuri: 'true',
        }
      )
      .then(async ({ data, errors }) => {
        if (errors)
          return errors.forEach((error) => Alert.create(error.message))

        const { user } = data || {}

        if (user.token === 'twofactorVerify')
          return this.setState({ twofactorRequest: true })
        else if (user.token === 'twofactorDenied')
          return Alert.create(
            'O código informado está inválido. Tente Novamente!'
          )

        try {
          await Promise.all([
            await this.variables.clear(),
            await this.variables.define('auth', user.authorization),
            await this.variables.define('token', user.token),
            await this.variables.define('refreshToken', user.refreshToken),
            await this.variables.define('signature', user.signature),
          ])
        } catch (error) {
          console.error(error)

          return Alert.create(
            'Ocorreu um erro na hora de salvar suas informações. Tente Novamente!'
          )
        }

        return (document.location = `${location.origin}/system`)
      })
      .catch((error) => {
        Alert.create(
          'Ocorreu um erro com o servidor. Tente novamente mais tarde!'
        )

        throw new Error(error)
      })
  }

  handleTwofactorTokenChange(event) {
    this.setState({
      twofactorValue: Sugar.String.removeAll(event.target.value, ' '),
    })
  }

  handleTwofactorValidate() {
    this.handleTwofactorBack()
    this.handleClickAccess()
  }

  handleTwofactorRetrieve() {
    this.setState({ progress: this.state.progress + 100 })

    this.fetch
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
            auth: compressToEncodedURIComponent(this.state.username),
          },
        },
        {
          authorization:
            'nlyachaglswisifrufrod0stEpec@UwlvizestAtr1xajanegaswa@remopheWip',
          encodeuri: 'true',
        }
      )
      .then(({ data, errors }) => {
        if (errors)
          return errors.forEach((error) => Alert.create(error.message))

        if (data.authRetrieveTwofactor) {
          this.handleTwofactorBack()

          return Alert.create(`Email de recuperação da conta enviado!`)
        } else {
          return Alert.create(
            `Email de recuperação da conta não pode ser enviado!`
          )
        }
      })
      .catch((error) => {
        Alert.create(
          'Ocorreu um erro com o servidor. Tente novamente mais tarde!'
        )

        throw new Error(error)
      })
  }

  handleTwofactorBack() {
    this.setState({
      twofactorRequest: false,
      twofactorValidation: false,
      twofactorValue: '',
    })
  }

  render() {
    return (
      <div data-testid="container-input-login" className="col-12 p-2">
        <LoadingBar
          color="#f6d816"
          progress={this.state.progress}
          onLoaderFinished={() => this.setState({ progress: 0 })}
        />
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
            value={this.state.username}
            onChange={this.handleUsernameChange}
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
            type={this.state.passView}
            className="form-control"
            placeholder="Senha de usuário"
            aria-label="Password"
            aria-describedby="password-addon"
            value={this.state.password}
            onChange={this.handlePasswordChange}
          />
          <span
            data-testid="span-password-eye"
            id="password-addon-eye"
            className="input-group-text animation-delay hover-color"
            onClick={this.handlePasswordEyeClick}
          >
            <FontAwesomeIcon
              icon={Icon.render('fas', this.state.eyeIcon)}
              className="fs-6 flex-shrink-1 my-auto"
            />
          </span>
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
            disabled={!this.state.username || !this.state.password}
            onClick={this.handleClickAccess}
          >
            Entrar
          </button>
        </div>
        <div
          className={`twofactor-bg ${
            this.state.twofactorRequest ? 'active' : 'deactivate'
          } fixed-top d-flex flex-column`}
        >
          <div
            className={`twofactor ${
              this.state.twofactorRequest ? 'active' : 'deactivate'
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
                value={this.state.twofactorValue}
                onChange={this.handleTwofactorTokenChange}
              />
              <button
                type="button"
                className="btn btn-primary col-12 my-1"
                disabled={this.state.twofactorValue.length < 6 ? true : false}
                onClick={this.handleTwofactorValidate}
              >
                Validar
              </button>
              <button
                type="button"
                className="btn btn-primary col-12 mb-1"
                onClick={this.handleTwofactorBack}
              >
                Voltar
              </button>
              <button
                type="button"
                className="btn btn-danger col-12 mb-2"
                onClick={this.handleTwofactorRetrieve}
              >
                Recuperar a conta
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
