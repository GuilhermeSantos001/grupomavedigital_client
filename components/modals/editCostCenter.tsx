/**
 * @description Modal -> Edita um Centro de Custo
 * @author @GuilhermeSantos001
 * @update 27/12/2021
 */

import { useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Icon from '@/src/utils/fontAwesomeIcons'

import { Modal, Button } from 'react-bootstrap'

import Alerting from '@/src/utils/alerting'
import StringEx from '@/src/utils/stringEx'

import { useAppSelector, useAppDispatch } from '@/app/hooks'

import {
  editCostCenter,
  removeCostCenter
} from '@/app/features/payback/payback.slice'

import type {
  CostCenter
} from '@/app/features/payback/payback.slice'

export type Props = {
  show: boolean
  costCenter: string
  handleClose: () => void
  handleResetCostCenter: () => void
}

const RegisterCostCenter = (props: Props): JSX.Element => {
  const
    itemDefault = {
      id: '',
      title: '',
      createdAt: '',
      updatedAt: '',
    };

  const [costCenterItem, setCostCenterItem] = useState<CostCenter>(itemDefault)
  const [textUpdateTitle, setTextUpdateTitle] = useState<string>('')

  const
    dispatch = useAppDispatch(),
    costCenters = useAppSelector((state) => state.payback.costCenters || []);

  const
    handleCloseEx = (): void => {
      setCostCenterItem(itemDefault);
      setTextUpdateTitle('');
      props.handleClose();
    },
    updateCostCenter = (item: CostCenter) => dispatch(editCostCenter(item)),
    deleteCostCenter = (itemId: string) => dispatch(removeCostCenter(itemId));

  const item = costCenters.find(item => item.id === props.costCenter);

  if (item && costCenterItem.id !== item.id) {
    setCostCenterItem({
      ...item,
      updatedAt: StringEx.updatedAt()
    });

    if (textUpdateTitle !== item.title)
      setTextUpdateTitle(item.title);
  }

  return (
    <Modal show={props.show} onHide={handleCloseEx} centered>
      <Modal.Header className='bg-primary bg-gradient text-secondary fw-bold' closeButton closeVariant='white'>
        <Modal.Title>
          Editar Centro de Custo
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
            value={costCenterItem.createdAt}
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
            value={costCenterItem.updatedAt}
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
            value={textUpdateTitle}
            onChange={(e) => setTextUpdateTitle(e.target.value)}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseEx}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={() => {
          deleteCostCenter(costCenterItem.id);
          props.handleResetCostCenter();
          handleCloseEx();
        }}>
          Remover
        </Button>
        <Button variant="primary" onClick={() => {
          if (textUpdateTitle.length > 0) {
            updateCostCenter({
              ...costCenterItem,
              title: textUpdateTitle
            });
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
