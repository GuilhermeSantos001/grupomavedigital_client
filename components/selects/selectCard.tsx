/**
 * @description Input -> Seleciona um cartão (Alelo)
 * @author GuilhermeSantos001
 * @update 08/01/2022
 */

import { useState } from 'react';
import TextField from '@mui/material/TextField';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

import { useAppSelector } from '@/app/hooks';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    }
  }
}

export type Props = {
  handleChangeCard: (cards: string[]) => void
}

export default function SelectCard(props: Props) {
  const
    costCenters = useAppSelector(state => state.system.costCenters),
    lotItems = useAppSelector(state => state.payback.lotItems)

  const [cards, setCards] = useState<string[]>([]);

  const
    handleChangeCard = (event: SelectChangeEvent<typeof cards>) => {
      const {
        target: { value },
      } = event;

      if (typeof value === 'string') {
        const newValue = [...cards, value];

        props.handleChangeCard(newValue.map(value => cardParseNameGetId(value)))
        setCards(newValue)
      } else {
        props.handleChangeCard(value.map(value => cardParseNameGetId(value)))
        setCards(value)
      }
    },
    cardParseNameGetId = (name: string) => {
      const
        id = name.slice(name.indexOf('-') + 1, name.indexOf('(')).trim(),
        lastCardNumber = name.slice(name.indexOf(':') + 1, name.indexOf(')')).trim();

      return `${id} - ${lastCardNumber}`;
    };

  const availableCards = [];

  if (lotItems.length > 0 && lotItems.filter(item => !item.person).length > 0)
    return <FormControl className='col-12'>
      <InputLabel id="select-multiple-checkbox-label">
        Cartões Benefício (Alelo)
      </InputLabel>
      <Select
        labelId="select-multiple-checkbox-label"
        id="select-multiple-checkbox"
        multiple
        value={cards}
        onChange={handleChangeCard}
        input={<OutlinedInput label="Cartões Benefício (Alelo)" />}
        renderValue={(selected) => selected.length > 1 ? `${selected.slice(0, 1).join(', ')}, +${selected.length - 1}` : selected.join(', ')}
        MenuProps={MenuProps}
      >
        {lotItems.filter(item => {
          if (!item.person) {
            const card = item.costCenter;

            if (!availableCards.includes(card)) {
              availableCards.push(card)
              return true;
            }
          }

          return false;
        }).map(card => {
          const
            key = `${card.id}_${card.serialNumber}(${card.lastCardNumber})`,
            value = `${costCenters.find(costCenter => costCenter.id === card.costCenter).title} - N° de Série: ${card.serialNumber} (4 Últimos Dígitos: ${card.lastCardNumber})`,
            id = `${costCenters.find(costCenter => costCenter.id === card.costCenter).title} - ${card.id} (4 Últimos Dígitos: ${card.lastCardNumber})`

          return (
            <MenuItem key={key} value={id}>
              <Checkbox checked={cards.includes(id)} />
              <ListItemText primary={value} />
            </MenuItem>
          )
        })}
      </Select>
    </FormControl>
  else
    return <TextField
      className='col-12'
      label="Cartões Benefício (Alelo)"
      variant="outlined"
      defaultValue={`Não existem cartões disponíveis.`}
      disabled={true}
    />
}