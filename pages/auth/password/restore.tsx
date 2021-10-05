/**
 * @description Pagina para confirmação do e-mail usuario
 * @author @GuilhermeSantos001
 * @update 05/10/2021
 */

import React, { useEffect, useState } from 'react'

import SkeletonLoader from 'tiny-skeleton-loader-react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Icon from '@/src/utils/fontAwesomeIcons'

import { PageProps } from '@/pages/_app'

import Alerting from '@/src/utils/alerting'

import Fetch from '@/src/utils/fetch'
import checkPassword from '@/src/utils/checkPassword'
import processOrderForgotPassword from '@/src/functions/processOrderForgotPassword'

const serverSideProps: PageProps = {
  title: 'Confirmação da conta',
  description: 'Confirme sua conta para acessar o ambiente digital interativo.',
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
          name: 'Documentação',
          link: '/help/docs',
        },
      ],
    },
  ],
}

export async function getServerSideProps(context) {
  const { token } = context.query

  return {
    props: {
      ...serverSideProps,
      token,
    },
  }
}

function compose_loading() {
  return (
    <div className="d-flex flex-column">
      <div className="col-12">
        <SkeletonLoader width={'100%'} height={80} radius={0} circle={false} />
      </div>
      <div className="col-12 my-1">
        <SkeletonLoader
          width={'100%'}
          height={`0.2rem`}
          radius={0}
          circle={false}
        />
      </div>
      <div className="col-12">
        <SkeletonLoader width={'100%'} height={40} radius={0} circle={false} />
      </div>
    </div>
  )
}

const PasswordRestore = ({ token }): JSX.Element => {
  const [signature, setSignature] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [passwordView, setPasswordView] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const _fetch = new Fetch(process.env.NEXT_PUBLIC_GRAPHQL_HOST)

  const handleChangeSignature = (e) => {
      setSignature(e.target.value)
    },
    handleChangePassword = (e) => {
      setPassword(e.target.value)
    },
    handleClickPasswordView = () => {
      setPasswordView(passwordView ? false : true)
    },
    handleClickChangePassword = async (e) => {
      const test = checkPassword(password)

      if (typeof test === 'string') return Alerting.create(test)

      if (test) {
        if (
          await processOrderForgotPassword(_fetch, signature, token, password)
        ) {
          Alerting.create('Senha alterada com sucesso!')
          setSignature('')
          setPassword('')
        } else {
          Alerting.create(
            'Não foi possível alterar sua senha. Tente novamente!'
          )
        }
      }
    }

  useEffect(() => {
    const timer = setTimeout(async () => {
      setIsLoading(false)
    })

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) return compose_loading()

  return (
    <div className="d-flex flex-column">
      <div className="col-12 bg-primary bg-gradient rounded p-2">
        <p className="text-secondary fs-3 fw-bold my-auto">Altere sua senha</p>
      </div>
      <div className="input-group my-2">
        <span className="input-group-text" id="code-addon">
          <FontAwesomeIcon
            icon={Icon.render('fab', 'keycdn')}
            className="fs-3 flex-shrink-1 text-primary mx-2 my-auto"
          />
        </span>
        <input
          type="password"
          className="form-control"
          placeholder="Código do pedido"
          aria-label="Code"
          aria-describedby="code-addon"
          value={signature}
          onChange={handleChangeSignature}
        />
      </div>
      <div className="input-group mb-2">
        <span className="input-group-text" id="password-addon">
          <FontAwesomeIcon
            icon={Icon.render('fas', 'key')}
            className="fs-3 flex-shrink-1 text-primary mx-2 my-auto"
          />
        </span>
        <input
          type={passwordView ? 'text' : 'password'}
          className="form-control"
          placeholder="Nova Senha..."
          aria-label="Password"
          aria-describedby="password-addon"
          value={password}
          onChange={handleChangePassword}
        />
        <span className="input-group-text" id="passwordView-addon">
          <FontAwesomeIcon
            icon={Icon.render('fas', passwordView ? 'low-vision' : 'eye')}
            className="ms-2 fs-3 flex-shrink-1 mx-2 my-auto animation-delay hover-color"
            onClick={handleClickPasswordView}
          />
        </span>
      </div>
      <button
        type="button"
        className="btn btn-outline-primary col-12"
        disabled={password.length > 0 ? false : true}
        onClick={handleClickChangePassword}
      >
        Alterar senha
      </button>
    </div>
  )
}

export default PasswordRestore
