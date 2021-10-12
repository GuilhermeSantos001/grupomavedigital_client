/**
 * @description Componentes exibido quando o usuario não tem privilegio
 * @author @GuilhermeSantos001
 * @update 06/10/2021
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
  constructor(props) {
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
