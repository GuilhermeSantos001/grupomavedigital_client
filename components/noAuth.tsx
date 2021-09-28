/**
 * @description Componentes do cabeçalho
 * @author @GuilhermeSantos001
 * @update 22/09/2021
 * @version 1.0.0
 */

import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as icons from '@fortawesome/free-solid-svg-icons'

type handleClickFunction = (
  event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  path: string
) => void

type MyProps = {
  handleClick: handleClickFunction
}

type MyState = {}

export default class NoAuth extends React.Component<MyProps, MyState> {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="d-flex flex-column p-2">
        <div className="col-12 p-2" style={{ fontFamily: 'Fira Code' }}>
          <p className="text-center my-2">
            <FontAwesomeIcon
              icon={icons[`faPowerOff`]}
              className="fs-1 flex-shrink-1 text-primary my-auto"
            />
            <br />
            <br />
            Sua sessão expirou. Por gentileza, faça login novamente!
          </p>
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
