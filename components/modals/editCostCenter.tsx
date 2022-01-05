/**
 * @description Modal -> Edita um Centro de Custo
 * @author @GuilhermeSantos001
 * @update 05/01/2022
 */

import { useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Icon from '@/src/utils/fontAwesomeIcons'

import { Modal, Button } from 'react-bootstrap'

import Alerting from '@/src/utils/alerting'

import { useAppSelector, useAppDispatch } from '@/app/hooks'

import {
  editCostCenter,
  removeCostCenter
} from '@/app/features/system/system.slice'

import type {
  CostCenter
} from '@/app/features/system/system.slice'

export type Props = {
  show: boolean
  id: string
  handleResetCostCenter: () => void
  handleClose: () => void
}

const RegisterCostCenter = (props: Props): JSX.Element => {
  const
    itemDefault: CostCenter = {
      id: '',
      title: ''
    };

  const [costCenterItem, setCostCenterItem] = useState<CostCenter>(itemDefault)
  const [textUpdateTitle, setTextUpdateTitle] = useState<string>('')

  const
    dispatch = useAppDispatch(),
    costCenters = useAppSelector((state) => state.system.costCenters || []),
    lotItems = useAppSelector((state) => state.payback.lotItems || []),
    postings = useAppSelector((state) => state.payback.postings || []);

  const
    handleCloseEx = (): void => {
      setCostCenterItem(itemDefault);
      setTextUpdateTitle('');
      props.handleClose();
    },
    canDeleteCostCenter = (itemId: string) => {
      const
        lotItem = lotItems.find((item) => item.costCenter === itemId),
        posting = postings.find((item) => item.costCenter === itemId);

      return lotItem === undefined && posting === undefined;
    },
    updateCostCenter = (item: CostCenter) => dispatch(editCostCenter(item)),
    deleteCostCenter = (itemId: string) => dispatch(removeCostCenter(itemId));

  const item = costCenters.find(item => item.id === props.id);

  if (item && costCenterItem.id !== item.id) {
    setCostCenterItem(item);

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
        <Button variant="danger" disabled={!canDeleteCostCenter(costCenterItem.id)} onClick={() => {
          deleteCostCenter(costCenterItem.id);
          props.handleResetCostCenter();
          handleCloseEx();
        }}>
          Remover
        </Button>
        <Button
          variant="primary"
          disabled={textUpdateTitle.length <= 0}
          onClick={() => {
            if (textUpdateTitle.length > 0) {
              updateCostCenter({
                ...costCenterItem,
                title: textUpdateTitle
              });
              handleCloseEx();
            } else {
              Alerting.create('Você não preencheu todos os campos');
            }
          }}
        >
          Salvar
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default RegisterCostCenter
