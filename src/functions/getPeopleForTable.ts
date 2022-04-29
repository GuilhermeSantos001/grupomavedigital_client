import { Columns, RowData } from '@/components/lists/ListWithCheckbox';

import StringEx from '@/src/utils/stringEx';

import { PersonType } from '@/types/PersonType';

export default function getPeopleForTable(
  people: PersonType[]
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
        field: 'matricule',
        title: 'Matrícula',
        align: 'center'
      },
      {
        field: 'cpf',
        title: 'CPF',
        align: 'center'
      },
      {
        field: 'rg',
        title: 'RG',
        align: 'center'
      },
      {
        field: 'scale',
        title: 'Escala',
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
    rows: RowData[] = people.map((person, index) => {
      return {
        id: person.id,
        item: index + 1,
        name: person.name,
        matricule: StringEx.maskMatricule(person.matricule),
        cpf: StringEx.maskCPF(person.cpf),
        rg: StringEx.maskRG(person.rg),
        scale: person.scale.value,
        services: person.personService.map(_ => _.service.value).join(', '),
        address: `${person.address.street.value}, ${person.address.number} - ${person.address.neighborhood.value}, ${person.address.city.value} - ${person.address.district.value}, ${StringEx.maskZipcode(person.address.zipCode)}`
      }
    })

  return { columns, rows };
}