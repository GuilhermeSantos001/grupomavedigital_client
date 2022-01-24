/**
 * @description Componentes exibido quando o usuario não está logado
 * @author GuilhermeSantos001
 * @update 16/12/2021
 */

import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Icon from '@/src/utils/fontAwesomeIcons'

type handleClickFunction = (
  event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  path: string
) => void

type MyProps = {
  handleClick: handleClickFunction
}

type MyState = Record<string, never>

export default class NoAuth extends React.Component<MyProps, MyState> {
  constructor(props: MyProps) {
    super(props)
  }

  render() {
    return (
      <div className="d-flex flex-column p-2">
        <div className="col-12 p-2" style={{ fontFamily: 'Fira Code' }}>
          <p className="text-center">
            <FontAwesomeIcon
              icon={Icon.render('fas', 'power-off')}
              className="fs-1 flex-shrink-1 text-primary my-auto"
            />
            <br />
            <br />
            Ocorreu um problema com sua sessão!
          </p>
          <div className="bg-primary bg-gradient p-3 my-3 rounded shadow">
            <div className="d-flex w-100 justify-content-between">
              <h5 className="mb-1 text-secondary fw-bold">
                1. Você pode está usando um conexão expirada.
              </h5>
              <small>
                <FontAwesomeIcon
                  icon={Icon.render('fab', 'expeditedssl')}
                  className="ms-2 fs-3 flex-shrink-1 text-secondary my-auto"
                />
              </small>
            </div>
            <p className="mb-1 text-secondary">
              Você está logado há mais de 7 dias, sem realizar um novo login? Se sim, então sua conexão expirou.
            </p>
            <small className='text-secondary'>- Nesse caso você precisa reconectar no sistema.</small>
          </div>
          <div className="bg-primary bg-gradient p-3 my-3 rounded shadow">
            <div className="d-flex w-100 justify-content-between">
              <h5 className="mb-1 text-secondary fw-bold">
                2. Seu endereço de internet, mudou?
              </h5>
              <small>
                <FontAwesomeIcon
                  icon={Icon.render('fab', 'expeditedssl')}
                  className="ms-2 fs-3 flex-shrink-1 text-secondary my-auto"
                />
              </small>
            </div>
            <p className="mb-1 text-secondary">
              Sua sessão é fixada ao endereço de internet que você está usando no momento do login.
              Caso seu endereço de internet tenha mudado, então você precisará fazer o login novamente.
            </p>
            <small className='text-secondary'>
              - Esse recurso protege sua sessão de ser usada em um endereço de internet diferente.
            </small>
          </div>
          <p className="text-center">
            <a
              className="btn btn-outline-primary col-6"
              role="button"
              onClick={(e) => this.props.handleClick(e, '/auth/login')}
            >
              Reconectar
            </a>
          </p>
        </div>
        <hr className="text-muted" />
      </div>
    )
  }
}
