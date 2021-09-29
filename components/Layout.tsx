import React from 'react'

import Alerting from '@/components/Alerting'
import Navbar from '@/components/Navbar'
import GridContent from '@/components/GridContent'

import { Menu } from '@/pages/_app'

type MyProps = {
  menu: Menu[]
  fullwidth: boolean
}

type myStates = {
  menuShow: boolean
}

class Layout extends React.Component<MyProps, myStates> {
  constructor(props) {
    super(props)

    this.state = { menuShow: false }

    this.handleMenuShowClick = this.handleMenuShowClick.bind(this)
  }

  handleMenuShowClick() {
    this.setState({ menuShow: this.state.menuShow ? false : true })
  }

  render() {
    const children = this.props.children

    return (
      <>
        <Alerting />
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
          {children}
        </GridContent>
      </>
    )
  }
}

export default Layout
