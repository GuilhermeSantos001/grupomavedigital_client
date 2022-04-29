import { Columns, RowData } from '@/components/lists/ListWithCheckbox';

import { CardType } from '@/types/CardType';

export default function getCardsForTable(
  cards: CardType[]
) {
  const
    columns: Columns = [
      {
        field: 'id',
        align: 'center',
        hidden: true,
      },
      {
        field: 'item',
        title: 'Item',
        align: 'center'
      },
      {
        field: 'costCenter',
        title: 'Filial',
        align: 'center'
      },
      {
        field: 'lotNum',
        title: 'Número do lote',
        align: 'center'
      },
      {
        field: 'serialNumber',
        title: 'Número de Serie',
        align: 'center'
      },
      {
        field: 'lastCardNumber',
        title: '4 Últimos dígitos',
        align: 'center'
      }
    ],
    rows: RowData[] = cards.map((card, index) => {
      return {
        id: card.id,
        item: index + 1,
        costCenter: card.costCenter.value,
        lotNum: card.lotNum,
        serialNumber: card.serialNumber,
        lastCardNumber: card.lastCardNumber
      }
    })

  return { columns, rows };
}