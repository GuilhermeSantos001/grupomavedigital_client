/**
 * @description Modal -> Registra um centro de custo
 * @author @GuilhermeSantos001
 * @update 29/12/2021
 */

import { useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Icon from '@/src/utils/fontAwesomeIcons'

import { Modal, Button } from 'react-bootstrap'

import Alerting from '@/src/utils/alerting'
import StringEx from '@/src/utils/stringEx'

import { useAppDispatch } from '@/app/hooks'

import {
  appendCostCenter
} from '@/app/features/system/system.slice'

import type {
  CostCenter
} from '@/app/features/system/system.slice'

export type Props = {
  show: boolean
  handleClose: () => void
}

const RegisterCostCenter = (props: Props): JSX.Element => {
  const
    itemDefault: CostCenter = {
      id: StringEx.id(),
      title: '',
      status: 'available',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

  const [costCenterItem, setCostCenterItem] = useState<CostCenter>(itemDefault)

  const
    dispatch = useAppDispatch();

  const
    handleCloseEx = (): void => {
      setCostCenterItem(itemDefault);
      props.handleClose();
    },
    addCostCenter = (item: CostCenter) => dispatch(appendCostCenter(item));

  return (
    <Modal show={props.show} onHide={handleCloseEx} centered>
      <Modal.Header className='bg-primary bg-gradient text-secondary fw-bold' closeButton closeVariant='white'>
        <Modal.Title>
          Registrar Centro de Custo
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="input-group my-2 m-md-2">
          <span className="input-group-text" id="createdAt-addon">
            <FontAwesomeIcon
              icon={Icon.render('fas', 'calendar-day')}
              className="m-auto fs-3 flex-shrink-1 text-primary"
            />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Data de Registro"
            aria-label="Data de Registro"
            aria-describedby="createdAt-addon"
            value={StringEx.createdAt(costCenterItem.createdAt)}
            disabled={true}
          />
        </div>
        <div className="input-group my-2 m-md-2">
          <span className="input-group-text" id="updatedAt-addon">
            <FontAwesomeIcon
              icon={Icon.render('fas', 'calendar-week')}
              className="m-auto fs-3 flex-shrink-1 text-primary"
            />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Data de Atualização"
            aria-label="Data de Atualização"
            aria-describedby="updatedAt-addon"
            value={StringEx.updatedAt(costCenterItem.updatedAt)}
            disabled={true}
          />
        </div>
        <div className="input-group my-2 m-md-2">
          <span className="input-group-text" id="code-addon">
            <FontAwesomeIcon
              icon={Icon.render('fas', 'key')}
              className="m-auto fs-3 flex-shrink-1 text-primary"
            />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Código"
            aria-label="Código"
            aria-describedby="code-addon"
            value={costCenterItem.id}
            disabled={true}
          />
        </div>
        <div className="input-group my-2 m-md-2">
          <span className="input-group-text" id="title-addon">
            <FontAwesomeIcon
              icon={Icon.render('fas', 'heading')}
              className="m-auto fs-3 flex-shrink-1 text-primary"
            />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Título"
            aria-label="Título"
            aria-describedby="title-addon"
            value={costCenterItem.title}
            onChange={(e) => setCostCenterItem({ ...costCenterItem, title: e.target.value })}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseEx}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={() => {
          if (costCenterItem.title.length > 0) {
            addCostCenter(costCenterItem);
            handleCloseEx();
          } else {
            Alerting.create('Você não preencheu todos os campos');
          }
        }}>
          Salvar
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default RegisterCostCenter
