import { Columns, RowData } from '@/components/lists/ListWithCheckbox';

import Sugar from 'sugar';
import StringEx from '@/src/utils/stringEx';

import { PackageHoursType } from '@/types/PackageHoursType';

export default function getPackageHoursForTable(
  postings: PackageHoursType[]
) {
  const
    columns: Columns= [
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
        field: 'costCenter',
        title: 'Filial',
        align: 'center'
      },
      {
        field: 'matricule',
        title: 'RE',
        align: 'center'
      },
      {
        field: 'name',
        title: 'Nome Completo',
        align: 'center'
      },
      {
        field: 'jobTitle',
        title: 'Função',
        align: 'center'
      },
      {
        field: 'workplace_destination',
        title: 'Cliente',
        align: 'center'
      },
      {
        field: 'contract_startedAt',
        title: 'Inicio do Acordo',
        align: 'center'
      },
      {
        field: 'contract_finishAt',
        title: 'Término do Acordo',
        align: 'center'
      },
      {
        field: 'entryTime',
        title: 'Horário de Entrada',
        align: 'center'
      },
      {
        field: 'exitTime',
        title: 'Horário de Saída',
        align: 'center'
      },
      {
        field: 'value_closed',
        title: 'Valor Fechado',
        align: 'center'
      },
      {
        field: 'law_days',
        title: 'Dias de Direito',
        align: 'center'
      },
      {
        field: 'payment_value',
        title: 'Valor a Pagar',
        align: 'center'
      },
      {
        field: 'payment_date',
        title: 'Data de Pagamento',
        align: 'center'
      },
      {
        field: 'payment_method',
        title: 'Forma de Pagamento',
        align: 'center'
      },
      {
        field: 'payment_status',
        title: 'Já foi Pago?',
        align: 'center'
      }
    ],
    rows: RowData[] = postings.map((posting, index) => {
      return {
        id: posting.id,
        item: index + 1,
        costCenter: posting.costCenter.value,
        matricule: posting.personPH.person.matricule,
        name: Sugar.String.capitalize(posting.personPH.person.name),
        jobTitle: posting.jobTitle,
        workplace_destination: posting.workplaceDestination.name,
        contract_startedAt: new Date(posting.contractStartedAt).toLocaleDateString(),
        contract_finishAt: new Date(posting.contractFinishAt).toLocaleDateString(),
        entryTime: new Date(posting.entryTime).toLocaleTimeString().substring(0, 5),
        exitTime: new Date(posting.exitTime).toLocaleTimeString().substring(0, 5),
        value_closed: StringEx.maskMoney(posting.valueClosed),
        law_days: posting.lawdays,
        payment_value: StringEx.maskMoney(posting.paymentValue),
        payment_date: new Date(posting.paymentDatePayable).toLocaleDateString(),
        payment_method: posting.paymentMethod === 'money' ? 'Dinheiro' : 'Cartão Alelo',
        payment_status: posting.paymentStatus === 'paid' ? 'Sim' : 'Não'
      }
    })

  return { columns, rows };
}