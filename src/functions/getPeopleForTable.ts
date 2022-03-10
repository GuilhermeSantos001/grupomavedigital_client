/**
 * @description Função usada para retornar a lista das pessoas
 * @author GuilhermeSantos001
 * @update 14/02/2022
 */

import { GridColDef, GridRowsProp } from '@mui/x-data-grid';

import StringEx from '@/src/utils/stringEx';

import { PersonType } from '@/types/PersonType';

export default function getPeopleForTable(
  people: PersonType[]
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
          return `${params.row.address.street.value}, ${params.row.address.number} - ${params.row.address.neighborhood.value}, ${params.row.address.city.value} - ${params.row.address.district.value}, ${StringEx.maskZipcode(params.row.address.zipCode)}`;
        }
      }
    ],
    rows: GridRowsProp = people.map((person, index) => {
      return {
        id: person.id,
        item: index + 1,
        name: person.name,
        matricule: StringEx.maskMatricule(parseInt(person.matricule)),
        cpf: StringEx.maskCPF(parseInt(person.cpf)),
        rg: StringEx.maskRG(parseInt(person.rg)),
        scale: person.scale.value,
        services: person.personService.map(_ => _.service.value).join(', '),
        address: person.address,
      }
    })

  return { columns, rows };
}