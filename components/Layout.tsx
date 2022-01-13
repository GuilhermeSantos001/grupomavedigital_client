/**
 * @description Componentes de layout
 * @author GuilhermeSantos001
 * @update 13/01/2022
 */

import React from 'react'

import { SnackbarProvider } from 'notistack';

import Alerting from '@/components/Alerting'
import WindowSuperAdmin from '@/components/WindowSuperAdmin'
import Navbar from '@/components/Navbar'
import GridContent from '@/components/GridContent'

import { Menu } from '@/pages/_app'

type MyProps = {
  menu: Menu[]
  fullwidth: boolean
}

type myStates = {
  menuShow: boolean
  fetchAPI: NodeJS.Timeout | null
}

class Layout extends React.Component<MyProps, myStates> {
  constructor(props) {
    super(props)

    this.state = { menuShow: false, fetchAPI: null }

    this.handleMenuShowClick = this.handleMenuShowClick.bind(this)
  }

  handleMenuShowClick() {
    this.setState({ menuShow: this.state.menuShow ? false : true })
  }

  render() {
    return (
      <SnackbarProvider maxSnack={3}>
        <Alerting />
        <WindowSuperAdmin />
        <Navbar
          menuShow={this.state.menuShow}
          setMenuShow={this.handleMenuShowClick}
          fullwidth={this.props.fullwidth}
        />
        <GridContent
          menuShow={this.state.menuShow}
          menu={this.props.menu}
          fullwidth={this.props.fullwidth}
        >
          {this.props.children}
        </GridContent>
      </SnackbarProvider>
    )
  }
}

export default Layout
