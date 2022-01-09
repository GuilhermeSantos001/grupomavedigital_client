/**
 * @description Input -> Seleciona um centro de custo
 * @author GuilhermeSantos001
 * @update 07/01/2022
 */

import { useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Icon from '@/src/utils/fontAwesomeIcons'

import ModalRegisterCostCenter from '@/components/modals/registerCostCenter'
import ModalEditCostCenter from '@/components/modals/editCostCenter'

import { useAppSelector } from '@/app/hooks'

export type Props = {
  costCenter: string
  handleDefineCostCenter: (title: string) => void
  handleResetCostCenter: () => void
}

export default function SelectCostCenter(props: Props) {
  const [showModalRegister, setShowModalRegister] = useState(false)
  const [showModalEdit, setShowModalEdit] = useState(false)

  const
    handleOpenModalRegister = () => setShowModalRegister(true),
    handleCloseModalRegister = () => setShowModalRegister(false),
    handleOpenModalEdit = () => setShowModalEdit(true),
    handleCloseModalEdit = () => setShowModalEdit(false)

  const costCenters = useAppSelector(state => state.system.costCenters);

  return (
    <div className="input-group my-2 m-md-2">
      <ModalRegisterCostCenter
        show={showModalRegister}
        handleClose={handleCloseModalRegister}
      />
      <ModalEditCostCenter
        show={showModalEdit}
        id={props.costCenter}
        handleResetCostCenter={props.handleResetCostCenter}
        handleClose={handleCloseModalEdit}
      />
      <span className="input-group-text" id="costCenter-addon">
        <FontAwesomeIcon
          icon={Icon.render('fas', 'donate')}
          className="m-auto fs-3 flex-shrink-1 text-primary"
        />
      </span>
      <select
        className="form-select"
        aria-label="Centro de Custo"
        onChange={(e) => props.handleDefineCostCenter(e.target.value)}
        value={props.costCenter}
      >
        <option>Centro de Custo</option>
        {costCenters.map(item => <option key={`${item.title}-${item.id}`} value={item.id}>{item.title}</option>)}
      </select>
      <span className="input-group-text" id="costCenter-addon">
        {
          props.costCenter.length > 0 ?
            <FontAwesomeIcon
              icon={Icon.render('fas', 'pen')}
              className="m-auto fs-3 flex-shrink-1 hover-color"
              onClick={handleOpenModalEdit}
            /> :
            <FontAwesomeIcon
              icon={Icon.render('fas', 'plus-square')}
              className="m-auto fs-3 flex-shrink-1 hover-color"
              onClick={handleOpenModalRegister}
            />
        }
      </span>
    </div>
  )
}