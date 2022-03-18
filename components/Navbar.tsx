/**
 * @description Componentes da navbar
 * @author GuilhermeSantos001
 * @update 24/01/2022
 */

import React from 'react'

import Image from 'next/image'

import MobileMenu from '@/components/MobileMenu'

type MyProps = {
  menuShow: boolean
  setMenuShow: () => void
  fullwidth: boolean
}

type MyState = Record<string, never>

export default class Navbar extends React.Component<MyProps, MyState> {
  constructor(props: MyProps) {
    super(props)

    this.handleImageClick = this.handleImageClick.bind(this)
  }

  handleImageClick() {
    if (window.location.pathname !== '/')
      window.location.replace('/');
  }

  render() {
    return (
      <>
        <header className="navbar navbar-dark bg-primary bg-gradient sticky-top flex-md-nowrap p-2 shadow">
          <a className="navbar-brand d-md-flex flex-row col-12 me-0 px-3 disabled">
            {!this.props.fullwidth ? (
              <div className="col-1 d-none d-lg-flex justify-content-center">
                <p className="my-auto">
                  <span
                    id="buttonMenu"
                    className="material-icons fs-1"
                    onClick={this.props.setMenuShow}
                  >
                    {`${this.props.menuShow ? 'menu' : 'menu_open'}`}
                  </span>
                </p>
              </div>
            ) : (
              <></>
            )}
            <Image
              className="cursor-pointer"
              src="/assets/logo.png"
              alt="Grupo Mave"
              priority={true}
              width={340}
              height={90}
              onClick={this.handleImageClick}
            />
            <div className="my-auto flex-fill">
              <p className="text-center text-secondary fs-3 fw-bold">
                Ambiente Digital Interativo
              </p>
            </div>
          </a>
          <MobileMenu />
        </header>
      </>
    )
  }
}
