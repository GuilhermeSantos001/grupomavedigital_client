/**
 * @description Função usada para retornar a lista dos locais de trabalho
 * @author GuilhermeSantos001
 * @update 05/01/2022
 */

import { GridColDef } from '@mui/x-data-grid';

import StringEx from '@/src/utils/stringEx';

import type {
  Workplace,
  Scale,
  Service,
  Street,
  Neighborhood,
  City,
  District
} from '@/app/features/system/system.slice';

export default function getWorkPlaceForTable(
  workplaces: Workplace[],
  scales: Scale[],
  services: Service[],
  streets: Street[],
  neighborhoods: Neighborhood[],
  cities: City[],
  districts: District[]
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
          return `${streets.find(street => street.id === params.row.address.street).name}, ${params.row.address.number} - ${neighborhoods.find(neighborhood => neighborhood.id === params.row.address.neighborhood).name}, ${cities.find(city => city.id === params.row.address.city).name} - ${districts.find(district => district.id === params.row.address.district).name}, ${StringEx.maskZipcode(String(params.row.address.zipCode).padStart(8, '0'))}`;
        }
      }
    ],
    rows = workplaces.map((place, index) => {
      return {
        id: place.id,
        item: index + 1,
        name: place.name,
        scale: scales.find(scale => scale.id === place.scale).value,
        entryTime: new Date(place.entryTime).toLocaleTimeString().slice(0, 5),
        exitTime: new Date(place.exitTime).toLocaleTimeString().slice(0, 5),
        services: services.filter(service => place.services.includes(service.id)).map(service => service.value).join(', '),
        address: place.address,
      }
    })

  return { columns, rows };
}