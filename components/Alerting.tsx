/**
 * @description Componente para exibição dos alertas
 * @author GuilhermeSantos001
 * @update 22/10/2021
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
    setInterval(() => {
      if (alerting.isShowing()) {
        setMessage(alerting.getMessage())
        setShow(true)
      }

      if (!alerting.isShowing()) {
        setShow(false)
      }
    })
  }, [])

  return (
    <Toast show={show} onClose={toggleShow} className='col-12 fixed-bottom m-2' style={{ left: 'auto', right: 0, zIndex: 9999 }}>
      <Toast.Header
        className="bg-primary text-secondary fw-bold"
        closeVariant="white"
      >
        <FontAwesomeIcon
          icon={Icon.render('fas', 'exclamation-circle')}
          className="flex-shrink-1 my-auto me-2 text-secondary"
        />
        <strong className="me-auto">Alerta</strong>
      </Toast.Header>
      <Toast.Body className="bg-light">{message}</Toast.Body>
    </Toast>
  )
}

export default Alerting
