/**
 * @description Componentes exibido quando o usuário não tem privilegio
 * @author GuilhermeSantos001
 * @update 21/01/2022
 */

import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Icon from '@/src/utils/fontAwesomeIcons'

export type handleClickFunction = (
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
          <p className="text-center my-2">
            <FontAwesomeIcon
              icon={Icon.render('fas', 'ban')}
              className="fs-1 flex-shrink-1 text-primary my-auto"
            />
            <br />
            <br />
            Você não tem privilégios para acessar essa pagina.
          </p>
          <div className="bg-primary bg-gradient p-3 my-3 rounded shadow">
            <div className="d-flex w-100 justify-content-between">
              <h5 className="mb-1 text-secondary fw-bold">
                1. Precisa de permissão?
              </h5>
              <small>
                <FontAwesomeIcon
                  icon={Icon.render('fas', 'hands-helping')}
                  className="ms-2 fs-3 flex-shrink-1 text-secondary my-auto"
                />
              </small>
            </div>
            <p className="mb-1 text-secondary">
              Entre em contato com nosso suporte para solicitar acesso. Nossa equipe precisará de algumas informações para liberar seu acesso.
            </p>
            <small className='text-secondary'>
              - Suporte, Grupo Mave Digital. E-mail: suporte@grupomave.com.br.
            </small>
          </div>
          <p className="text-center">
            <a
              className="btn btn-outline-primary col-6"
              role="button"
              onClick={(e) => this.props.handleClick(e, '/system')}
            >
              Retornar ao sistema
            </a>
          </p>
        </div>
        <hr className="text-muted" />
      </div>
    )
  }
}
