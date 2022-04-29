import { Columns, RowData } from '@/components/lists/ListWithCheckbox';

import StringEx from '@/src/utils/stringEx';

import { WorkplaceType } from '@/types/WorkplaceType';

export default function getWorkPlaceForTable(
  workplaces: WorkplaceType[]
) {
  const
    columns: Columns = [
      {
        field: 'id',
        align: 'center',
        hidden: true
      },
      {
        field: 'item',
        title: 'Item',
        align: 'center'
      },
      {
        field: 'name',
        title: 'Nome',
        align: 'center'
      },
      {
        field: 'scale',
        title: 'Escala',
        align: 'center'
      },
      {
        field: 'entryTime',
        title: 'horário de Entrada',
        align: 'center'
      },
      {
        field: 'exitTime',
        title: 'horário de Saída',
        align: 'center'
      },
      {
        field: 'services',
        title: 'Serviços',
        align: 'center'
      },
      {
        field: 'address',
        title: 'Endereço',
        align: 'center'
      }
    ],
    rows: RowData[] = workplaces.map((place, index) => {
      return {
        id: place.id,
        item: index + 1,
        name: place.name,
        scale: place.scale.value,
        entryTime: new Date(place.entryTime).toLocaleTimeString().slice(0, 5),
        exitTime: new Date(place.exitTime).toLocaleTimeString().slice(0, 5),
        services: place.workplaceService.map(_ => _.service.value).join(', '),
        address: `${place.address.street.value}, ${place.address.number} - ${place.address.neighborhood.value}, ${place.address.city.value} - ${place.address.district.value}, ${StringEx.maskZipcode(place.address.zipCode)}`
      }
    })

  return { columns, rows };
}