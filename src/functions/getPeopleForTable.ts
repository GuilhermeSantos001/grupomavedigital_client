/**
 * @description Função usada para retornar a lista das pessoas
 * @author GuilhermeSantos001
 * @update 07/01/2022
 */

import { GridColDef } from '@mui/x-data-grid';

import StringEx from '@/src/utils/stringEx';

import type {
  Person,
  Scale,
  Service,
  Street,
  Neighborhood,
  City,
  District
} from '@/app/features/system/system.slice';

export default function getPeopleForTable(
  people: Person[],
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
        field: 'matricule',
        headerName: 'Matrícula',
        width: 100,
        headerAlign: 'center',
        align: 'center'
      },
      {
        field: 'cpf',
        headerName: 'CPF',
        width: 100,
        headerAlign: 'center',
        align: 'center'
      },
      {
        field: 'rg',
        headerName: 'RG',
        width: 100,
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
    rows = people.map((person, index) => {
      return {
        id: person.id,
        item: index + 1,
        name: person.name,
        matricule: StringEx.maskMatricule(String(person.matricule).padStart(5, '0')),
        cpf: StringEx.maskCPF(person.cpf),
        rg: StringEx.maskRG(person.rg),
        scale: scales.find(scale => scale.id === person.scale).value,
        services: services.filter(service => person.services.includes(service.id)).map(service => service.value).join(', '),
        address: person.address,
      }
    })

  return { columns, rows };
}