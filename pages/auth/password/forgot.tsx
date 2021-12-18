/**
 * @description Pagina usada quando o usuario esquece a senha
 * @author @GuilhermeSantos001
 * @update 21/11/2021
 */

import React, { useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Icon from '@/src/utils/fontAwesomeIcons'

import { PageProps } from '@/pages/_app'

import Fetch from '@/src/utils/fetch'

import Alerting from '@/src/utils/alerting'

import authForgotPassword from '@/src/functions/authForgotPassword'

const staticProps: PageProps = {
  title: 'Esqueci minha senha',
  description:
    'Esqueceu sua senha? Iremos lhe enviar um e-mail, para que você possa alterar sua senha',
  themeColor: '#004a6e',
  menu: [
    {
      id: 'mn-helping',
      active: false,
      icon: {
        family: 'fas',
        name: 'question-circle',
      },
      type: 'dropdown',
      name: 'Precisa de Ajuda?',
      dropdownId: 'navbarDropdown',
      content: [
        {
          id: 'md-helpdesk',
          icon: {
            family: 'fas',
            name: 'headset',
          },
          name: 'HelpDesk',
          link: '/help/helpdesk',
        },
        {
          id: 'md-sp1',
          type: 'separator',
        },
        {
          id: 'md-docs',
          icon: {
            family: 'fas',
            name: 'book-reader',
          },
          name: 'DOC',
          link: '/help/docs',
        },
      ],
    },
  ]
}

export const getStaticProps = () => ({
  props: staticProps,
})

function compose_ready(
  username: string,
  handleChangeUsername,
  handleClickChangePassword
) {
  return (
    <div className="col-12">
      <div className="d-flex flex-column">
        <div className="input-group">
          <span className="input-group-text" id="username-addon">
            <FontAwesomeIcon
              icon={Icon.render('fas', 'user-alt')}
              className="ms-2 fs-3 flex-shrink-1 text-primary mx-2 my-auto"
            />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Nome de usuário"
            aria-label="Username"
            aria-describedby="username-addon"
            value={username}
            onChange={handleChangeUsername}
          />
        </div>
      </div>
      <button
        type="button"
        className="btn btn-outline-primary my-2 col-12"
        disabled={username.length <= 0 ? true : false}
        onClick={handleClickChangePassword}
      >
        Enviar solicitação
      </button>
      <div className="form-text">
        A solicitação para alterar sua senha tem validade de 1 hora.
      </div>
      <div className="form-text">
        Você precisa confirmar sua identidade através do seu e-mail para alterar
        sua senha.
      </div>
    </div>
  )
}

const Forgot = (): JSX.Element => {
  const [username, setUsername] = useState<string>('')

  const _fetch = new Fetch(process.env.NEXT_PUBLIC_GRAPHQL_HOST)

  const handleChangeUsername = (e) => {
    setUsername(e.target.value)
  },
    handleClickChangePassword = async () => {
      if (await authForgotPassword(_fetch, username)) {
        Alerting.create('Um e-mail será enviado para você em breve.')
        setUsername('')
      } else {
        Alerting.create(
          'Não foi possível salvar sua solicitação. Tente novamente, mais tarde!'
        )
      }
    }

  return (
    <div data-testid="div-container" className="p-2">
      <h1 data-testid="text-start" className="fw-bold">
        Altere sua senha
      </h1>
      <hr data-testid="separator" className="text-muted" />
      {compose_ready(username, handleChangeUsername, handleClickChangePassword)}
    </div>
  )
}

export default Forgot
