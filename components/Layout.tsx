import React from 'react'

import Alerting from '@/components/Alerting'
import Navbar from '@/components/Navbar'
import GridContent from '@/components/GridContent'

type MyProps = {
  menu: any
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
        />
        <GridContent menuShow={this.state.menuShow} menu={this.props.menu}>
          {children}
        </GridContent>
      </>
    )
  }
}

export default Layout
