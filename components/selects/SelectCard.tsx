import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

import { OutlinedInputLoading } from '@/components/utils/OutlinedInputLoading';
import { OutlinedInputEmpty } from '@/components/utils/OutlinedInputEmpty';
import { BoxError } from '@/components/utils/BoxError';

import type { CardType } from '@/types/CardType';

export type Props = {
  selectCards?: string[]
  isLoadingCards: boolean
  cards: CardType[]
  handleChangeCard: (cards: string[]) => void
}

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

export function SelectCard(props: Props) {
  const [syncData, setSyncData] = useState<boolean>(false);
  const [selectCards, setSelectCards] = useState<string[]>(props.selectCards || []);

  const { isLoadingCards, cards } = props;

  if (isLoadingCards && !syncData)
    return <OutlinedInputLoading label='Cartões Benefício (Alelo)' message='Carregando...' />

  if (!syncData && cards) {
    setSyncData(true);
  } else if (!syncData && !cards) {
    return <BoxError />
  }

  if (cards.length <= 0)
    return <OutlinedInputEmpty label='Cartões Benefício (Alelo)' message='Nenhum cartão cadastrado' />

  const
    handleChangeCard = (value: string | string[]) => {
      if (typeof value === 'string') {
        const newValue = [...selectCards, value];

        props.handleChangeCard(newValue.map(value => cardParseNameGetId(value)));
        setSelectCards(newValue);
      } else {
        props.handleChangeCard(value.map(value => cardParseNameGetId(value)));
        setSelectCards(value);
      }
    },
    cardParseNameGetId = (name: string) => {
      const
        id = name.slice(name.indexOf('-') + 1, name.indexOf('(')).trim(),
        lastCardNumber = name.slice(name.indexOf(':') + 1, name.indexOf(')')).trim();

      return `${id} - ${lastCardNumber}`;
    };

  const availableCards: string[] = [];

  if (
    cards.length > 0 && cards.filter(card => props.selectCards && props.selectCards.map(name => cardParseNameGetId(name)).includes(`${card.serialNumber} - ${card.lastCardNumber}`)).length > 0
    || cards.length > 0 && cards.filter(card => !card.person).length > 0
  )
    return (
      <FormControl fullWidth>
        <InputLabel id="select-multiple-checkbox-label">
          Cartões Benefício (Alelo)
        </InputLabel>
        <Select
          labelId="select-multiple-checkbox-label"
          id="select-multiple-checkbox"
          multiple
          value={selectCards}
          onChange={(e) => handleChangeCard(e.target.value)}
          input={<OutlinedInput label="Cartões Benefício (Alelo)" />}
          renderValue={(selected) => selected.length > 1 ? `${selected.slice(0, 1).join(', ')}, +${selected.length - 1}` : selected.join(', ')}
          MenuProps={MenuProps}
        >
          {cards
            .filter(card => {
              if (
                props.selectCards && props.selectCards.map(name => cardParseNameGetId(name)).includes(`${card.serialNumber} - ${card.lastCardNumber}`)
                || !card.person
              ) {
                const filtered = card.costCenter.value;

                if (!availableCards.includes(filtered)) {
                  availableCards.push(filtered)
                  return true;
                }
              }

              return false;
            }).map(card => {
              const
                key = `${card.id}_${card.serialNumber}(${card.lastCardNumber})`,
                value = `${card.costCenter.value || "???"} - N° de Série: ${card.serialNumber} (4 Últimos Dígitos: ${card.lastCardNumber})`,
                id = `${card.costCenter.value || "???"} - ${card.serialNumber} (4 Últimos Dígitos: ${card.lastCardNumber})`

              return (
                <MenuItem key={key} value={id}>
                  <Checkbox checked={selectCards.includes(id)} />
                  <ListItemText primary={value} />
                </MenuItem>
              )
            })}
        </Select>
      </FormControl>
    )
  else
    return (
      <TextField
        className='col-12'
        label="Cartões Benefício (Alelo)"
        variant="outlined"
        defaultValue={`Não existem cartões disponíveis.`}
        disabled={true}
      />
    )
}