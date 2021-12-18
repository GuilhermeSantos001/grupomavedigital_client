/**
 * @description Componentes exibido quando a pagina apresentou um erro
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

export default class RenderPageError extends React.Component<MyProps, MyState> {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div
        className="d-flex flex-column p-2"
        style={{ fontFamily: 'Fira Code' }}
      >
        <div className="col-12 d-flex flex-column justify-content-center">
          <p className="text-center my-2">
            <FontAwesomeIcon
              icon={Icon.render('fas', 'hard-hat')}
              className="fs-1 flex-shrink-1 text-primary my-auto"
            />
            <br />
            <br />
            Não foi possível carregar sua página. Tente novamente, mais tarde!
          </p>
          <div className="bg-primary bg-gradient p-3 my-3 rounded shadow">
            <div className="d-flex w-100 justify-content-between">
              <h5 className="mb-1 text-secondary fw-bold">
                Desculpe pelo transtorno!
              </h5>
              <small>
                <FontAwesomeIcon
                  icon={Icon.render('fas', 'grimace')}
                  className="ms-2 fs-3 flex-shrink-1 text-secondary my-auto"
                />
              </small>
            </div>
            <p className="mb-1 text-secondary">
              - Se o problema persistir, sua sessão pode ter expirado, nesse caso você precisa desconectar e conectar novamente. <br />
              - Talvez seu endereço de IP tenha mudado, nesse caso você precisa desconectar e conectar novamente.
            </p>
            <small className='text-secondary'>
              - Suporte, Grupo Mave Digital. E-mail: suporte@grupomave.com.br.
            </small>
          </div>
          <div className="bg-primary bg-gradient p-3 my-3 rounded shadow">
            <div className="d-flex w-100 justify-content-between">
              <h5 className="mb-1 text-secondary fw-bold">
                Verifique nosso blog
              </h5>
              <small>
                <FontAwesomeIcon
                  icon={Icon.render('fas', 'blog')}
                  className="ms-2 fs-3 flex-shrink-1 text-secondary my-auto"
                />
              </small>
            </div>
            <p className="mb-1 text-secondary">
              Certifique em nosso blog, se essa pagina não está em manutenção.
            </p>
            <small className='text-secondary'>
              - Blog, Grupo Mave Digital. URL: <a href="https://grupomavedigital-docs.vercel.app/blog" target={'_blank'} rel="noreferrer" className="text-white">Acessar Agora!</a>.
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
