/**
 * @description Componentes da grade do layout da pagina
 * @author @GuilhermeSantos001
 * @update 22/09/2021
 * @version 1.0.0
 */

import React from 'react'

import Link from 'next/link'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as icons from '@fortawesome/free-solid-svg-icons'

import Sugar from 'sugar'

type MyProps = {
  menu: any
  menuShow: boolean
}

type MyState = {}

export default class GridContent extends React.Component<MyProps, MyState> {
  composeItemsMenu(items) {
    return items.map((item) => {
      if (item.type === 'dropdown') {
        return (
          <li
            key={item.id}
            className="d-flex flex-row ps-2 py-2 mb-2 border-bottom dropdown"
          >
            <div className="btn-group w-100">
              <a
                className={`menuItem dropdown-toggle animation-delay hover-color`}
                id={item.dropdownId}
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {item.name}
              </a>
              <ul
                className="dropdown-menu w-100"
                aria-labelledby={item.dropdownId}
              >
                {this.composeSubItemsMenu(item.content)}
              </ul>
            </div>
            <FontAwesomeIcon
              icon={icons[`fa${Sugar.String.camelize(item.icon)}`]}
              className="fs-6 flex-shrink-1 text-muted opacity-50 my-auto"
            />
          </li>
        )
      } else {
        if (item.type === 'separator')
          return (
            <li key={item.id}>
              <hr className="dropdown-divider" />
            </li>
          )

        return (
          <li
            key={item.id}
            className="d-flex flex-row ps-2 py-2 mb-2 border-bottom"
          >
            <Link href={item.link}>
              <a
                className={`w-100 menuItem text-truncate animation-delay hover-color ${
                  item.active ? 'active' : ''
                }`}
              >
                {item.name}
              </a>
            </Link>
            <FontAwesomeIcon
              icon={icons[`fa${Sugar.String.camelize(item.icon)}`]}
              className="fs-6 flex-shrink-1 text-muted opacity-50 my-auto"
            />
          </li>
        )
      }
    })
  }

  composeSubItemsMenu(items) {
    return items.map((item) => {
      if (item.type === 'separator') {
        return (
          <li key={item.id}>
            <hr className="dropdown-divider" />
          </li>
        )
      } else {
        return (
          <li key={item.id} className="d-flex flex-row dropdown-item col-11">
            <Link href={item.link}>
              <a
                className="menuItem w-100 text-truncate animation-delay hover-color"
                href="#"
              >
                {item.name}
              </a>
            </Link>
            <FontAwesomeIcon
              icon={icons[`fa${Sugar.String.camelize(item.icon)}`]}
              className="fs-6 flex-shrink-1 text-muted opacity-50 my-auto"
            />
          </li>
        )
      }
    })
  }

  render() {
    const children = this.props.children,
      menu = this.composeItemsMenu(this.props.menu)

    return (
      <>
        <div
          id="sidebar"
          className={`p-2 border-3 border-end animation-delay ${
            this.props.menuShow ? 'fullwidth' : ''
          }`}
        >
          <ul className={`list-style-none`}>{menu}</ul>
        </div>
        <div
          id="content"
          className={`p-2 animation-delay ${
            this.props.menuShow ? 'fullwidth' : ''
          }`}
        >
          <a id="buttonToTop">
            <span className="material-icons" style={{ fontSize: '2rem' }}>
              keyboard_arrow_up
            </span>
          </a>
          {children}
        </div>
      </>
    )
  }
}
