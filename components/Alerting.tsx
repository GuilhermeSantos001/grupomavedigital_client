/**
 * @description Componente para exibição dos alertas
 * @author GuilhermeSantos001
 * @update 18/01/2022
 */

import { useState, useEffect } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Icon from '@/src/utils/fontAwesomeIcons'

import { Toast } from 'react-bootstrap'

import alerting from '@/src/utils/alerting'

const Alerting = (): JSX.Element => {
  const [message, setMessage] = useState<string>('')
  const [show, setShow] = useState<boolean>(false)

  const toggleShow = () => {
    setShow(!show);
    alerting.close();
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (alerting.isShowing()) {
        setMessage(alerting.getMessage())
        setShow(true)
      } else {
        setShow(false)
      }
    });

    return () => clearInterval(interval);
  }, [])

  const icon = () => {
    switch (alerting.getType()) {
      case 'success':
        return Icon.render('fas', 'check-circle')
      case 'warning':
        return Icon.render('fas', 'exclamation-triangle')
      case 'error':
        return Icon.render('fas', 'times')
      case 'info':
        return Icon.render('fas', 'info-circle')
      case 'question':
      default:
        return Icon.render('fas', 'question-circle')
    }
  }

  return (
    <Toast show={show} onClose={toggleShow} className='col-12 fixed-bottom m-2' style={{ left: 'auto', right: 0, zIndex: 9999 }}>
      <Toast.Header
        className="bg-primary text-secondary fw-bold"
        closeVariant="white"
      >
        <FontAwesomeIcon
          icon={icon()}
          className="flex-shrink-1 my-auto me-2 text-secondary"
        />
        <strong className="me-auto">Alerta</strong>
      </Toast.Header>
      <Toast.Body className="bg-light">{message}</Toast.Body>
    </Toast>
  )
}

export default Alerting
