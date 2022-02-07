/**
 * @description Componentes da grade do layout da pagina
 * @author GuilhermeSantos001
 * @update 24/01/2022
 */

import React from 'react'

import { Dropdown } from 'react-bootstrap'

import Link from 'next/link'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Icon from '@/src/utils/fontAwesomeIcons'

import type {
  Menu,
} from '@/pages/_app'

type MyProps = {
  menu: Menu[]
  menuShow: boolean
  fullwidth: boolean
}

type MyState = Record<string, never>

export default class GridContent extends React.Component<MyProps, MyState> {
  composeItemsMenu(items: Menu[]) {
    return items.map((item: any) => {
      if (item.type === 'dropdown') {
        const itemNormal = (
          <div
            key={item.id}
            className="d-flex flex-row ps-2 py-2 mb-2 bg-primary border-bottom rounded"
          >
            <Dropdown className='col-10'>
              <Dropdown.Toggle
                className={`menuItem ps-0 col-12 animation-delay hover-color text-truncate`}
                id={item.dropdownId}
              >
                {item.name}
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-menu w-100">
                {this.composeSubItemsMenu(item.content)}
              </Dropdown.Menu>
            </Dropdown>
            <div className='col-2 pe-2 d-flex flex-row justify-content-center align-items-center'>
              <FontAwesomeIcon
                icon={Icon.render(item.icon.family, item.icon.name)}
                className="fs-6 flex-shrink-1 text-secondary my-auto"
              />
            </div>
          </div>
        ),
          itemDisabled = (
            <li
              key={item.id}
              className="d-flex flex-row ps-2 py-2 mb-2 bg-primary border-bottom rounded dropdown"
            >
              <div className="btn-group w-100">
                <a
                  className={`menuItem disabled dropdown-toggle`}
                  id={item.dropdownId}
                >
                  {item.name}
                </a>
              </div>
              <FontAwesomeIcon
                icon={Icon.render(item.icon.family, item.icon.name)}
                className={`fs-6 flex-shrink-1 ${!item.disabled ? 'text-secondary' : 'text-white opacity-50'} me-2 my-auto`}
              />
            </li>
          );

        return item.disabled ? itemDisabled : itemNormal;
      } else {
        if (item.type === 'separator')
          return (
            <li key={item.id}>
              <hr className="dropdown-divider" />
            </li>
          )

        const itemNormal = (
          <div
            key={item.id}
            className={`d-flex flex-row ps-2 py-2 mb-2 bg-primary border-bottom rounded`}
          >
            {
              item.link.indexOf('http') !== -1 ? <Dropdown.Item
                className={`menuItem w-100 text-truncate animation-delay hover-color ${item.active ? 'active' : ''}`}
                href={item.link}
                rel="noreferrer"
              >
                {item.name}
              </Dropdown.Item> : <Link href={item.link}>
                <a
                  className={`menuItem w-100 text-truncate animation-delay hover-color ${item.active ? 'active' : ''
                    }`}
                  href={item.link}
                >
                  {item.name}
                </a>
              </Link>
            }
            <FontAwesomeIcon
              icon={Icon.render(item.icon.family, item.icon.name)}
              className="fs-6 flex-shrink-1 text-secondary me-2 my-auto"
            />
          </div>
        ),
          itemDisabled = (
            <li
              key={item.id}
              className={`d-flex flex-row ps-2 py-2 mb-2 bg-primary border-bottom rounded`}
            >
              <a
                className='menuItem disabled w-100 text-truncate'
              >
                {item.name}
              </a>
              <FontAwesomeIcon
                icon={Icon.render(item.icon.family, item.icon.name)}
                className={`fs-6 flex-shrink-1 ${!item.disabled ? 'text-secondary' : 'text-white opacity-50'} me-2 my-auto`}
              />
            </li>
          )

        return item.disabled ? itemDisabled : itemNormal;
      }
    })
  }

  composeSubItemsMenu(items: Menu[]) {
    return items.map((item: any) => {
      if (item.type === 'separator') {
        return (
          <li key={item.id}>
            <hr className="dropdown-divider" />
          </li>
        )
      } else {
        const itemNormal = (
          <li key={item.id} className="d-flex flex-row dropdown-item col-11">
            {item.link.indexOf('http') !== -1 ? (
              <a
                className={`menuItem w-100 text-truncate animation-delay hover-color ${item.active ? 'active' : ''
                  }`}
                href={item.link}
                target="_blank"
                rel="noreferrer"
              >
                {item.name}
              </a>
            ) : (
              <Link href={item.link}>
                <a
                  className={`menuItem w-100 text-truncate animation-delay hover-color ${item.active ? 'active' : ''
                    }`}
                  href={item.link}
                >
                  {item.name}
                </a>
              </Link>
            )}
            <FontAwesomeIcon
              icon={Icon.render(item.icon.family, item.icon.name)}
              className="fs-6 flex-shrink-1 text-secondary me-2 my-auto"
            />
          </li>
        ),
          itemDisabled = (
            <li key={item.id} className="d-flex flex-row dropdown-item col-11">
              <a
                className='menuItem disabled w-100 text-truncate'
              >
                {item.name}
              </a>
              <FontAwesomeIcon
                icon={Icon.render(item.icon.family, item.icon.name)}
                className={`fs-6 flex-shrink-1 ${!item.disabled ? 'text-secondary' : 'text-white opacity-50'} me-2 my-auto`}
              />
            </li>
          )

        return item.disabled ? itemDisabled : itemNormal;
      }
    })
  }

  render() {
    const children = this.props.children,
      menu = this.composeItemsMenu(this.props.menu);

    return (
      <div className='p-2'>
        <div
          id="sidebar"
          className={`p-2 animation-delay ${this.props.fullwidth ? 'fullwidth' : ''
            } ${this.props.menuShow ? 'fullwidth' : ''}`}
        >
          <ul className={`list-style-none pe-2 border-end`}>{menu}</ul>
          <div
            className='d-flex flex-row justify-content-center align-items-center bg-light-gray border-top p-2 bg-light-gray'
          >
            <p className='text-muted my-auto'>
              Grupo Mave 2020-2022 © Todos direitos reservados.
            </p>
          </div>
          <div
            className='d-flex flex-row justify-content-center align-items-center bg-light-gray border-top p-2 bg-light-gray'
          >
            <p className='text-muted my-auto'>
              Versão: Jully
            </p>
          </div>
        </div>
        <div
          id="content"
          className={`fade-effect active p-2 border-start animation-delay ${this.props.fullwidth ? 'fullwidth' : ''
            }${this.props.menuShow ? 'fullwidth' : ''}`}
        >
          {children}
        </div>
      </div>
    )
  }
}
