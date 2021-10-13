/**
 * @description Componentes exibido quando a pagina apresentou um erro
 * @author @GuilhermeSantos001
 * @update 06/10/2021
 */

import React from 'react'

import Image from 'next/image'

type MyProps = Record<string, never>

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
        <div className="col-5 d-none d-md-flex flex-column align-self-center justify-content-center">
          <Image
            src="/images/loading.gif"
            alt="Picture of the author"
            width={100}
            height={300}
          />
        </div>
        <div className="col-12 d-flex flex-column justify-content-center">
          <p className="text-center fw-bold">
            Não foi possível carregar sua página. Tente novamente, mais tarde!
          </p>
        </div>
      </div>
    )
  }
}
