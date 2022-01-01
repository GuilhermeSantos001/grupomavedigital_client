/**
 * @description Input -> Seleciona um centro de custo
 * @author @GuilhermeSantos001
 * @update 29/12/2021
 */

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Icon from '@/src/utils/fontAwesomeIcons'

import type {
  CostCenter
} from '@/app/features/system/system.slice'

export type Props = {
  costCenter: string
  costCenters: CostCenter[]
  handleDefineCostCenter: (title: string) => void
  handleShowModalEditCostCenter: () => void
  handleShowModalRegisterCostCenter: () => void
}

const SelectCostCenter = (props: Props): JSX.Element => {
  return (
    <div className="input-group my-2 m-md-2">
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
        {props.costCenters.map(item => <option key={`${item.title}-${item.id}`} value={item.id}>{item.title}</option>)}
      </select>
      <span className="input-group-text" id="costCenter-addon">
        {
          props.costCenter.length > 0 ?
            <FontAwesomeIcon
              icon={Icon.render('fas', 'pen')}
              className="m-auto fs-3 flex-shrink-1 hover-color"
              onClick={props.handleShowModalEditCostCenter}
            /> :
            <FontAwesomeIcon
              icon={Icon.render('fas', 'plus-square')}
              className="m-auto fs-3 flex-shrink-1 hover-color"
              onClick={props.handleShowModalRegisterCostCenter}
            />
        }
      </span>
    </div>
  )
}

export default SelectCostCenter
