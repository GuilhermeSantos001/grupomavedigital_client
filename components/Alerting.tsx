/**
 * @description Componentes dos alertas
 * @author @GuilhermeSantos001
 * @update 22/09/2021
 * @version 1.0.0
 */

import React from 'react'

import $ from 'jquery'

import myAlert from '@/src/utils/alerting'

type MyProps = {
  message?: string
  delay?: number
}

type MyState = { boxAlerting: boolean }

export default class Alerting extends React.Component<MyProps, MyState> {
  constructor(props) {
    super(props)

    this.state = { boxAlerting: false }
  }

  componentDidMount() {
    const message = this.props.message,
      delay = this.props.delay

    const renderAlerting = () => {
        $('body').append(`\
        <div style="z-index: 9999; font-size: 18px; opacity: 0;" class="alertDiv alert bg-primary text-secondary border border-secondary alert-dismissible fade show shadow fixed-top m-2 text-truncate" role="alert">\
            <strong>${message || myAlert.getMessage()}</strong>\
        </div>\
        `)

        $('.alertDiv').animate({ opacity: 1 }, 'fast')

        this.setState({ boxAlerting: true })
      },
      stopAlerting = () => {
        if (this.state.boxAlerting) {
          $('.alertDiv').fadeOut('slow', () => {
            $('.alertDiv').remove()

            myAlert.setMessage('')
            myAlert.setMessageDelay(0)

            this.setState({ boxAlerting: false })
          })
        }
      }

    if (message && delay) renderAlerting()

    setInterval(() => {
      if (
        myAlert.getMessage().length > 0 &&
        myAlert.getMessageDelay() > 0 &&
        !this.state.boxAlerting
      ) {
        setTimeout(() => stopAlerting(), delay || myAlert.getMessageDelay())

        renderAlerting()
      }
    })
  }

  componentWillUnmount() {
    if (this.state.boxAlerting) {
      $('.alertDiv').fadeOut('slow', () => {
        $('.alertDiv').remove()

        myAlert.setMessage('')
        myAlert.setMessageDelay(0)

        this.setState({ boxAlerting: false })
      })
    }
  }

  render() {
    return <></>
  }
}
