import { GridColDef, GridRowsProp } from '@mui/x-data-grid';

import StringEx from '@/src/utils/stringEx';

import { WorkplaceType } from '@/types/WorkplaceType';

export default function getWorkPlaceForTable(
  workplaces: WorkplaceType[]
) {
  const
    columns: GridColDef[] = [
      {
        field: 'id',
        headerName: 'ID',
        headerAlign: 'center',
        align: 'center',
        hide: true
      },
      {
        field: 'item',
        headerName: 'Item',
        headerAlign: 'center',
        align: 'center'
      },
      {
        field: 'name',
        headerName: 'Nome',
        width: 200,
        headerAlign: 'center',
        align: 'center'
      },
      {
        field: 'scale',
        headerName: 'Escala',
        headerAlign: 'center',
        align: 'center'
      },
      {
        field: 'entryTime',
        headerName: 'horário de Entrada',
        width: 150,
        headerAlign: 'center',
        align: 'center'
      },
      {
        field: 'exitTime',
        headerName: 'horário de Saída',
        width: 150,
        headerAlign: 'center',
        align: 'center'
      },
      {
        field: 'services',
        headerName: 'Serviços',
        width: 300,
        headerAlign: 'center',
        align: 'center'
      },
      {
        field: 'address',
        headerName: 'Endereço',
        width: 600,
        headerAlign: 'center',
        align: 'center',
        valueGetter: (params) => {
          return `${params.row.address.street.value}, ${params.row.address.number} - ${params.row.address.neighborhood.value}, ${params.row.address.city.value} - ${params.row.address.district.value}, ${StringEx.maskZipcode(params.row.address.zipCode)}`;
        }
      }
    ],
    rows: GridRowsProp = workplaces.map((place, index) => {
      return {
        id: place.id,
        item: index + 1,
        name: place.name,
        scale: place.scale.value,
        entryTime: new Date(place.entryTime).toLocaleTimeString().slice(0, 5),
        exitTime: new Date(place.exitTime).toLocaleTimeString().slice(0, 5),
        services: place.workplaceService.map(_ => _.service.value).join(', '),
        address: place.address,
      }
    })

  return { columns, rows };
}