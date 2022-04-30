import React from 'react'

import { CacheProvider, EmotionCache } from '@emotion/react';
import { ThemeProvider, CssBaseline } from '@mui/material';

import { Theme } from '@/styles/theme-material-ui';

import { SnackbarProvider } from 'notistack';

import { Dropdown } from 'react-bootstrap';

import Link from 'next/link'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Icon from '@/src/utils/fontAwesomeIcons'

import { motion } from "framer-motion"

import type {
  Menu,
  MenuResponse,
} from '@/pages/_app'

type MyProps = {
  menu: MenuResponse
  emotionCache: EmotionCache
  menuShow: boolean
  fullwidth: boolean
  cleanLayout: boolean
  children: React.ReactNode
}

type MyState = Record<string, never>

export default class GridContent extends React.Component<MyProps, MyState> {
  composeItemsMenu(items: Menu[]) {
    return items.map((item: any) => {
      if (item.type === 'dropdown') {
        const itemNormal = (
          <div
            key={item.id}
            title={item.name}
            className="d-flex flex-row mb-2 bg-primary rounded"
          >
            <Dropdown className='col-10'>
              <Dropdown.Toggle
                className={`menuItem col-12 text-start animation-delay hover-color text-truncate`}
                id={item.dropdownId}
              >
                {item.name}
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-menu w-100">
                {this.composeSubItemsMenu(item.content)}
              </Dropdown.Menu>
            </Dropdown>
            <div className='col-2 d-flex flex-row justify-content-center align-items-center'>
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
              title={item.name}
              className="d-flex flex-row p-2 mb-2 bg-primary border-bottom rounded dropdown"
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
                className={`ms-2 flex-shrink-1 ${!item.disabled ? 'text-secondary' : 'text-white opacity-50'} my-auto`}
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
            title={item.name}
            className={`d-flex flex-row p-2 mb-2 bg-primary border-bottom rounded`}
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
              className="ms-2 flex-shrink-1 text-secondary my-auto"
            />
          </div>
        ),
          itemDisabled = (
            <li
              key={item.id}
              title={item.name}
              className={`d-flex flex-row p-2 mb-2 bg-primary border-bottom rounded`}
            >
              <a
                className='menuItem disabled w-100 text-truncate'
              >
                {item.name}
              </a>
              <FontAwesomeIcon
                icon={Icon.render(item.icon.family, item.icon.name)}
                className={`ms-2 flex-shrink-1 ${!item.disabled ? 'text-secondary' : 'text-white opacity-50'} my-auto`}
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
          <li key={item.id} title={item.name} className="d-flex flex-row dropdown-item col-11">
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
                  title={item.name}
                >
                  {item.name}
                </a>
              </Link>
            )}
            <FontAwesomeIcon
              icon={Icon.render(item.icon.family, item.icon.name)}
              className="ms-2 flex-shrink-1 text-secondary my-auto"
            />
          </li>
        ),
          itemDisabled = (
            <li key={item.id} title={item.name} className="d-flex flex-row dropdown-item col-11">
              <a
                className='menuItem disabled w-100 text-truncate'
              >
                {item.name}
              </a>
              <FontAwesomeIcon
                icon={Icon.render(item.icon.family, item.icon.name)}
                className={`ms-2 flex-shrink-1 ${!item.disabled ? 'text-secondary' : 'text-white opacity-50'} my-auto`}
              />
            </li>
          )

        return item.disabled ? itemDisabled : itemNormal;
      }
    })
  }

  render() {
    const children = this.props.children,
      menu = this.composeItemsMenu(this.props.menu.options);

    return (
      <div className={`${!this.props.cleanLayout ? 'p-2' : ''}`}>
        {
          !this.props.cleanLayout ?
            <motion.div
              layout
              id="sidebar"
              className={`d-flex flex-column py-2 my-2 overflow-auto ${this.props.fullwidth ? 'fullwidth' : ''
                } ${this.props.menuShow ? 'fullwidth' : ''}`}
              style={{ height: '80vh' }}
              transition={{ duration: 0.2 }}
            >
              <ul className={`list-style-none px-2`}>
                {menu}
                <div
                  key='build-jully'
                  title={'Acesse a documentação da build atual'}
                  className={`d-flex flex-row p-2 mb-2 bg-primary border-bottom rounded`}
                >
                  <a
                    className={`menuItem w-100 text-truncate animation-delay hover-color`}
                    href={'https://grupomavedigital-docs.vercel.app/docs/api/system/jully'}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {'Versão - Jully'}
                  </a>
                  <FontAwesomeIcon
                    icon={Icon.render('fas', 'code-branch')}
                    className="ms-2 flex-shrink-1 text-secondary my-auto"
                  />
                </div>
              </ul>
            </motion.div> : <></>
        }
        <div
          id="content"
          className={`fade-effect active ${!this.props.cleanLayout ? 'p-2 mb-5' : ''} border-start animation-delay ${this.props.fullwidth ? 'fullwidth' : ''
            }${this.props.menuShow ? 'fullwidth' : ''}`}
        >
          <CacheProvider value={this.props.emotionCache}>
            <ThemeProvider theme={Theme}>
              <CssBaseline />
              <SnackbarProvider maxSnack={3}>
                {children}
              </SnackbarProvider>
            </ThemeProvider>
          </CacheProvider>
        </div>
        {
          this.props.cleanLayout ??
          <div
            className='fixed-bottom d-flex flex-row justify-content-center align-items-center bg-light-gray border-top p-2 shadow'
          >
            <p className='text-muted my-auto'>
              Grupo Mave 2020-2022 © Todos direitos reservados.
            </p>
          </div>
        }
      </div>
    )
  }
}
