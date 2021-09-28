/**
 * @description Componentes do menu mobile
 * @author @GuilhermeSantos001
 * @update 22/09/2021
 * @version 1.0.0
 */

import React from 'react'

export default class MobileMenu extends React.Component {
  constructor(props) {
    super(props)

    this.handleImageClick = this.handleImageClick.bind(this)
  }

  handleImageClick() {
    const win: any = window

    win.loading = true
    win.location = ''
  }

  render() {
    return (
      <div className="col-12 d-flex d-md-none">
        <nav className="navbar navbar-expand-lg navbar-light col-12 mx-auto">
          <div className="container-fluid">
            <div className="d-grid gap-2 col-12 mx-auto">
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarTogglerDemo01"
                aria-controls="navbarTogglerDemo01"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
            </div>
            <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <a
                    className="nav-link text-secondary fs-1 active"
                    aria-current="page"
                    href="#"
                  >
                    Home
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link fs-1" href="#">
                    Link
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link fs-1 disabled"
                    href="#"
                    tabIndex={-1}
                    aria-disabled="true"
                  >
                    Disabled
                  </a>
                </li>
              </ul>
              <form className="d-flex">
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                />
                <button className="btn btn-outline-success" type="submit">
                  Search
                </button>
              </form>
            </div>
          </div>
        </nav>
      </div>
    )
  }
}
