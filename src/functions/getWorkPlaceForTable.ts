/**
 * @description Função usada para retornar a lista dos locais de trabalho
 * @author GuilhermeSantos001
 * @update 30/12/2021
 */

import { GridColDef } from '@mui/x-data-grid';

import type {
  Workplace
} from '@/app/features/system/system.slice';

export default function getWorkPlaceForTable(workplaces: Workplace[]) {
  const columns: GridColDef[] = [
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
        return `${params.row.address.street.name}, ${params.row.address.number}, ${params.row.address.neighborhood.name}, ${params.row.address.city.name} - ${params.row.address.district.name}`;
      }
    }
  ];

  const rows = workplaces.map((place, index) => {
    return {
      id: place.id,
      item: index + 1,
      name: place.name,
      scale: place.scale.value,
      entryTime: new Date(place.entryTime).toLocaleTimeString().slice(0, 5),
      exitTime: new Date(place.exitTime).toLocaleTimeString().slice(0, 5),
      services: place.services.map(service => service.value).join(', '),
      address: place.address,
    }
  })

  return { columns, rows };
}